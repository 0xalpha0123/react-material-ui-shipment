var mongoose = require('mongoose'),
  crypto = require('crypto'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: 'Username is required!',
    trim: true
  },
  password: {
    type: String,
    validate: [
      function (password) {
        return password && password.length >= 6;
      }, 'Password should be longer at least 6 characters!'
    ]
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: 'user'
  }
});

UserSchema.pre('save', function (next) {
  if (this.password) {
    this.salt = new
      Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});
UserSchema.methods.hashPassword = function (password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000,
    64, 'sha512').toString('base64');
};
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

var User = mongoose.model("Users", UserSchema);
module.exports = User;