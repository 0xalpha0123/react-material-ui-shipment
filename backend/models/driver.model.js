var mongoose = require("mongoose"),
    Schema = mongoose.Schema
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PortRegex = ["VANCOUVER", "CALGARY", "EDMONTON","TORONTO","MONTREAL","HALIFAX","OTHER"]
    
var DriverSchema = new Schema({
	Name: String,
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
    Avalability: {
        type: Object,
        default: {
            Monday: {Start:"6:25", Finish:"21:00"},
            Thursday: {Start:"6:25", Finish:"21:00"}
        },
    },
});

DriverSchema.pre('save', function(next) {
    this._id = new mongoose.Types.ObjectId().toHexString();
    next();
});

var Driver = mongoose.model("Driver", DriverSchema);
module.exports = Driver;