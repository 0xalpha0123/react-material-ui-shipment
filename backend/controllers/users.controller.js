let User = require('../models/User.model');
var jwt = require('jwt-simple'),
    fs = require('fs');
var secret = "123456";

function tokenForUser(user) {
const timestamp = new Date().getTime();
return jwt.encode({sub: user.id,iat: timestamp,username: user.username }, secret);
}
var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
      switch (err.code) {
        case 11000:
        case 11001:
          message = 'username already exist!';
          break;
        default:
          message = 'Error!.';
      }
    } else {
      for (var errName in err.errors) {
        if (err.errors[errName].message) message = err.errors[errName].message;
      }
    }
    return message;
  };
exports.signup = function (req, res, next) {
    var data =req.body.user;
   
    console.log(data);
    if (req.body) {
      var user = new User(data);
      user.save(function (err) {
        if (err) {
          var message = getErrorMessage(err);
          
           console.log("ddd");
          return res.send(message);
        }
        return res.send({ token: tokenForUser(user), user});
      });
    } else {
      return res.send('Error occurs.');
    }
  };

  exports.getUsers = function (req, res, next) {
    User.find({}).exec(function (err, users) {
      if (err) {
        var message = getErrorMessage(err);          
        return res.send(message);
      }
      return res.json(users);
    });
  };

  exports.removeUser = function (req, res, next) {
    User.remove({_id: req.body.user._id}).exec(function (err) {
      if (err) {
        var message = getErrorMessage(err);          
        return res.send(message);
      }
      else{
        User.find({}).exec(function (err, users) {
          if (err) {
            var message = getErrorMessage(err);          
            return res.send(message);
          }
          return res.json(users);
        });
      }
    });
  };

  exports.signin = function (req, res, next) {
    res.send({ token: tokenForUser(req.user), user: req.user});
  };

  exports.passwordchange = function(req, res, next) {
    console.log(req.body.user)
    User.find({"username": req.body.user.username}, 'username password').sort('-created').exec(function (err, user) {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage("Username don't exist!")
        });
      } else {
          User.deleteOne({"username":req.body.user.username},function(err){
            if(err){
              return res.status(400).send({
                message: getErrorMessage(err)
              });
            }
            else{
              var data = req.body.user;
              var user = new User(data);
              user.save(function (err) {
                if (err) {
                  var message = getErrorMessage(err);
                  return res.send(message);
                }
                return res.send('Password has been updated successfully!!');
              });
            }
          })
      }
    });
  }

  exports.initPassword = function(req, res, next) {
    User.find({"username":req.body.user.username}, 'username password').sort('-created').exec(function (err, user) {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage("Username don't exist!")
        });
      } else {
          User.deleteOne({"username":req.body.user.username},function(err){
            if(err){
              return res.status(400).send({
                message: getErrorMessage(err)
              });
            }
            else{
              var data = req.body.user;
              data.password = "123456";
              var user = new User(data);
              user.save(function (err) {
                if (err) {
                  var message = getErrorMessage(err);
                  return res.send(message);
                }
                return res.send('Password has been updated to 123456');
              });
            }
          })
      }
    });
  }