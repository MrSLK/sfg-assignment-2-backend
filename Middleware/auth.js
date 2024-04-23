const db = require("../Models");
const User = db.Users;
const jwt = require('jsonwebtoken');

//Check if email exist
checkDuplicateEmail = (req, res, next) => {

      // Email
      User.findOne({
        email: req.body.email
      }).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    
        if (user) {
          res.status(400).send({ message: "Failed! Email is already in use!" });
          return;
        }
    
        next();
      });
};

//Check permissions
checkUser = (req, res, next) => {
  
    // User
  User.findOne({_id: req.body.user_id}).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      res.status(400).send({ message: "Failed! User not found!" });
      return;
    }

    next();
  });
};

// Check if user exist when loggin in
validateUsers = (req, res, next) => {
    User.findOne({email: req.body.email}).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
          }
          if (!user) {
            res.status(400).send({ message: "Failed! User doesn't exist!" });
            return;
          } 
          next();
    })
};

// Check if usertype
validateUsertype = (req, res, next) => {
  if (req.body.usertype === 'admin' || req.body.usertype === 'super-admin' ) {
    next();
  } else {
    return res.status(400).send('User not allowed to view this section!')
  }
};

validateSuperAdminUsertype = (req, res, next) => {
  if (req.body.usertype === 'super-admin') {
    next();
  } else {
    return res.status(400).send('User not allowed to view this section!')
  }
};

//Verify token
verifyToken = (req, res, next) => {

  var token = req.body.token ? req.body.token : req.params.token;
  
    jwt.verify(token, 'w', function(err, decoded){
      if(!err){
        
        let myObj = JSON.parse(decoded.id);
        
        req.body.user_id = myObj.user_id;
        req.body.usertype = myObj.usertype;
        
        next();
      } else {
        console.log(err);
        res.status(400).json({msg :'No token found! Please Provide a token.'})
      }
    })
}

const authentication = {

  checkDuplicateEmail,
  checkUser,
  validateUsers,
  verifyToken,
  validateUsertype,
  validateSuperAdminUsertype,
};

module.exports = authentication
