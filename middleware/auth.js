const jwt = require("jsonwebtoken");
const constant = require("../config");
const config = process.env;
const redis_client = require("../redis");

const verifyToken = (req, res, next) => {
  try {
    // Bearer tokenstring
    const token = req.body.token || req.query.token || req.headers["access-token"];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.userData = decoded;
    req.token = token;

    // varify blacklisted access token.
    redis_client.get('BL_' + decoded.sub.toString(), (err, data) => {
        if(err) return res.send(err);

        if(data === token) return res.status(401).json({status: false, message: "blacklisted token."});
    })
} catch (error) {
    return res.status(401).json({status: false, message: "Your session is not valid.", data: error});
}
}

const  verifyRefreshToken = async(req, res, next) =>{
  const token = req.body.token || req.query.token || req.headers["access-token"];;
    if(token === null) return res.status(401).json({status: false, message: "Invalid request."});
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        req.user = decoded;
        // console.log(decoded);
        // verify if token is in store or not
        redis_client.get(decoded.user_id.toString(), (err, data) => {
            if(err) return res.send(err);
            if(data === null) return res.status(401).json({status: false, message: "Invalid request. Token is not in store."});
            if(JSON.parse(data).token != token) return res.status(401).json({status: false, message: "Invalid request. Token is not same in store."});
        })
    } catch (error) {
        return res.status(401).json({status: true, message: "Your session is not valid.", data: error.message});
    }
      return next();

}


// const verifyToken = (req, res, next) => {
//   const token =
//     req.body.token || req.query.token || req.headers["access-token"];

//   if (!token) {
//     return res.status(constant.HTTP_403_CODE).send("Access Denied: No Token Provided!");
//   }
//   try {
//     const decoded = jwt.verify(token, config.TOKEN_KEY);
//     req.user=decoded
//   } catch (err) {
//     return res.status(constant.HTTP_401_CODE).send("Invalid Token");
//   }
//   return next();
// };

module.exports = {verifyToken, verifyRefreshToken};

    // req.user = decoded;
    // console.log(req.originalUrl);
    // console.log(role[decoded.role].find(function(url){ return true }));