require("dotenv").config();
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const app = express();
app.use(express.json());
const User = require("../model/user");
const constant = require("../config");
const redis_client = require("../redis");

const userRegister = async (req, res) => {
    try {
        const { firstName, lastName, role, email, password } = req.body; // Get user input
    
        // Validate user input
        if (!(email && password && firstName && lastName && role)) {
          res.status(constant.HTTP_400_CODE).send("All input fields are required..");
        }
    
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });
    
        if (oldUser) {
          return res.status(constant.HTTP_409_CODE).send("User Already Exist. Please Login...");
        }
    
        //Encrypt user password
        encryptedUserPassword = await bcrypt.hash(password, 10);
        // Create user in our database
    const user = await User.create({
        first_name: firstName,
        last_name: lastName,
        role: role,
        email: email.toLowerCase(), // sanitize
        password: encryptedUserPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email, role: user.role },
        process.env.TOKEN_KEY,
        {
          expiresIn: process.env.EXPIRESIN,
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      res.status(constant.HTTP_201_CODE).json(user);
    } catch (err) {
      console.log(err);
    }
}
const userLogin = async(req, res) =>{
    try {
        // Get user input
        const { email, password } = req.body;
    
        // Validate user input
        if (!(email && password)) {
          res.status(constant.HTTP_400_CODE).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });
    
        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email, role: user.role },
            process.env.TOKEN_KEY,
            {
              expiresIn: process.env.EXPIRESIN,
            }
          );
          const refresh_token = GenerateRefreshToken(user._id,email, user.role);
        // return res.json({status: true, message: "login success", data: {access_token, refresh_token}});
          // save user token
      user.token = token;

      // user
      return res.status(constant.HTTP_200_CODE).json({user,token: token, refreshToken: refresh_token});
    }
    return res.status(constant.HTTP_400_CODE).send("Invalid Credentials");
}catch (err) {
    console.log(err);
  }
}

async function userLogout (req, res) {
  const user_id = req.body.refToken;
  const token = req.body.token;

  // remove the refresh token
  await redis_client.del(user_id.toString());

  // blacklist current access token
  await redis_client.set('BL_' + user_id.toString(), token);
  
  return res.json({status: true, message: "success."});
}

function GetAccessToken (req, res) {
  const user_id = req.body.token;
  const access_token = jwt.sign({user_id: user_id}, process.env.TOKEN_KEY, { expiresIn: process.env.EXPIRESIN});
  const refresh_token = GenerateRefreshToken(user_id);
  return res.json({status: true, message: "success", data: {access_token, refresh_token}});
}

function GenerateRefreshToken(user_id,email, role) {
  const refresh_token = jwt.sign({ user_id: user_id, email: email, role: role }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_TIME });
  
  redis_client.get(user_id.toString(), (err, data) => {
      if(err) return res.send(err);

      redis_client.set(user_id.toString(), JSON.stringify({token: refresh_token}));
  })

  return refresh_token;
}
module.exports = {
    userRegister,
    userLogin,
    GetAccessToken,
    userLogout
};