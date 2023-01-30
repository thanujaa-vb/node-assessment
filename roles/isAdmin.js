module.exports = function (req, res, next) { 
    // 401 Unauthorized
    // 403 Forbidden 
    if (req.user.role !== "admin"){
      return res.status(403).send({message:'Access denied Admin'})
    } ;
  
    next();
  }
  //res.status(403).send('Access denied Admin')