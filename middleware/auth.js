const jwt = require("jsonwebtoken");
const constant = require("../config");
const role=require('../role');
const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["access-token"];

  if (!token) {
    return res.status(constant.HTTP_403_CODE).send("Access Denied: No Token Provided!");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user=decoded

    // if(role[decoded.role].find(function(url){ return url==req.originalUrl}))
    // {
    // req.user=decoded
    // //  next();
    // }
    // else{
    //     return res.status(401).send('Access Denied: You dont have correct privilege to perform this operation');
    // };
  } catch (err) {
    return res.status(constant.HTTP_401_CODE).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;

    // req.user = decoded;
    // console.log(req.originalUrl);
    // console.log(role[decoded.role].find(function(url){ return true }));