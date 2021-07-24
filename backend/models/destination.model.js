var mongoose = require("mongoose"),
	Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PortRegex = ["VANCOUVER", "CALGARY", "EDMONTON","TORONTO","MONTREAL","HALIFAX","OTHER"]
var DestinationSchema = new Schema({
	Code: String,
	CompanyName: String,
	ContactName: String,
	Address: String,
	Phone: String,
	email: {
		type: String,
		unique: true,
		match: [emailRegex, "Please enter a valid email address"],
		trim: true
	},
	Port: {
        type: String, 
        required: true,
        validate: function(portVal) {
			return new Promise(function(resolve, reject) {
				resolve(PortRegex.find(portVal) ? true : false)
			});
		},
	},
	AppointmentURL: String,
	UserName: String,
	Password: String,
	SCAC: String
});

DestinationSchema.pre('save', function(next) {
	this._id = new mongoose.Types.ObjectId().toHexString();
	bcrypt.hash(this.Password, 10, function(error, hash) {
		if (error) {
		  return next(error);
		} else {
		  this.Password = hash;
		  next();
		}
	  });
});

var Destination = mongoose.model("Destination", DestinationSchema);
module.exports = Destination;