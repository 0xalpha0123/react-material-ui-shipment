var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../../models/User.model');
    
module.exports = function () {
    passport.use(new LocalStrategy({
        usernameField: 'username',
    }, function (username, password, done) {
        User.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, {
                    message: 'Unknown user'
                });
            }

            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'Invalid password'
                });
            }
            console.log("user",user);
            return done(null, user);
        });
    }));
};