module.exports = function (req, res, next) { 
    // 401 Unauthorized
    // 403 Forbidden 
    if (req.user.role !== "user"){
       return res.status(403).send('Access denied Admin');
    }
  
    next();
  }