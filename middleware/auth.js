const jwt = require("jsonwebtoken");
const constant = require("../config");
const redis_client = require("../redis");

const  verifyToken = async(req, res, next) =>{
    const token = req.body.token || req.query.token || req.headers["access-token"] ||  req.headers.authorization;
      if(token === null) return res.status(401).json({status: false, message: "Invalid request."});
      try {
          const decoded = jwt.verify(token, process.env.TOKEN_KEY);
          req.user = decoded;
          // console.log(decoded);
          // verify if token is in store or not
        await redis_client.get(decoded.user_id.toString(), (err, data) => {
              if(err) return res.send(err.message);
              if(data === null) return res.status(401).json({status: false, message: "Invalid request. Token is not in store."});
              if(JSON.parse(data).token != token) return res.status(401).json({status: false, message: "Invalid request. Token is not same in store."});
              return next();
          })
      } catch (error) {
          return res.status(401).json({status: true, message: "Your session is not valid.", data: error.message});
      }
        // return next();
  
  }


module.exports = {verifyToken};
