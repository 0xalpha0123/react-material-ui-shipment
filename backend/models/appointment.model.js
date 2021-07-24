var mongoose = require("mongoose"),
    Schema = mongoose.Schema
const StatusRegex = ["PENDING", "SCHEDULED", "TERMINATED", "CLOSED", "CANCELLED"]
const FreightTypeRegex = ["TL", "LTL"]
const ClampableRegex = ["YES","NO"]
const LoadTypeRegex = ["PALLETIZED","FLOORLOADED"]
var AppointmentSchema = new Schema({
	ISA: String,
	destination_id: {
		type: Schema.Types.ObjectId,
		ref: "Destination",
	},
	DateTime: String,
	Status: {
        type: String, 
        validate: function(statusVal) {
			return new Promise(function(resolve, reject) {
				resolve(StatusRegex.find(statusVal) ? true : false)
            });
        },
    },
	Pallets: Number,
	Volume: Number,
	Weight: Number,
	Carton: Number,
	Piece: Number,
	PRO: String,
	BOL: Array[String],
	FreightType: {
        type: String, 
        validate: function(freightVal) {
			return new Promise(function(resolve, reject) {
				resolve(FreightTypeRegex.find(freightVal) ? true : false)
            });
        },
    },
	Clampable: {
        type: String, 
        validate: function(clampableVal) {
			return new Promise(function(resolve, reject) {
				resolve(ClampableRegex.find(clampableVal) ? true : false)
            });
        },
    },
	LoadType: {
        type: String, 
        validate: function(loadVal) {
			return new Promise(function(resolve, reject) {
				resolve(LoadTypeRegex.find(loadVal) ? true : false)
            });
        },
    },
	TrailerNumber: String,
	RequestedDateTime: String,
	ARN: String,
	VendorName: String,
	Driver:{
		type: Schema.Types.ObjectId,
		ref: "Driver",
	},
	Shipments:[{
		type: Schema.Types.ObjectId,
		ref: "Shipment",
	}],
});

AppointmentSchema.pre('save', function(next) {
    this._id = new mongoose.Types.ObjectId().toHexString();
    next();
});

var Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;