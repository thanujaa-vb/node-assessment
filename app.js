require("dotenv").config();
require("./db/database").connect();
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const app = express();
app.use(express.json());
const User = require("./model/user");
const constant = require("./config");

// const cors = require("cors") //Newly added
// app.use(cors()) // Newly added

// app.use(express.json({ limit: "50mb" }));
// const corsOptions = {
//     origin: 'http://example.com',
//     optionsSuccessStatus: 200 // for some legacy browsers
//   }

// Register
app.post("/register", async (req, res) => {
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
          expiresIn: "5h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      res.status(constant.HTTP_201_CODE).json(user);
    } catch (err) {
      console.log(err);
    }
    });

// Login
app.post("/login",async (req, res) => {
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
          // save user token
      user.token = token;

      // user
      return res.status(constant.HTTP_200_CODE).json(user);
    }
    return res.status(constant.HTTP_400_CODE).send("Invalid Credentials");
}catch (err) {
    console.log(err);
  }
    });

    app.post("/welcome", auth, (req, res) => {
        res.status(constant.HTTP_200_CODE).send("Welcome data.....");
      });
      app.post("/home", auth, (req, res) => {
        res.status(constant.HTTP_200_CODE).send("Home data.....");
      });
module.exports = app;