const { User } = require("../modals/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

let auth = (req, res, next) => {
  //let token = req.cookies.w_auth;
  let authHeader = req.headers.authorization;
  //console.log(authHeader)
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    ///console.log("token" , token);
   /* jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
       // console.log("error", err);
        return res.status(403).json("Token is Invalid!");
      }
    });*/

  //  const decodedToken = jwt.decode(token, process.env.JWT_SECRET_KEY);
    //console.log("decodedtoken" , decodedToken)
    User.findById(token, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user)
       {return res.status(401).json("Unauthorized User");}
      req.user = user;
      next();
    });
  } 
  else {
    res.status(400).json("Pass the token");
  }

};

/*jwt.verify(token ,'secret',(err,user) => {
    if(err){
           return res.sendStatus(403);
    }
   req.user = user;
   next();
  });
}*/

module.exports = { auth };

