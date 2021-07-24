var mongoose = require("mongoose"),
	Schema = mongoose.Schema;
var ShipmentSchema = new Schema({
	AntekId: {
		type: String,
		require: true,
		unique: true,
	},
	Urgent: Boolean,
	MBL: String,
	HBL: String,
	Container: String,
    Port: Array,
	ETA: String,
	Status: String,
    Type: String,
	Pallets: Number,
	Volume: Number,
	Weight: Number,
	Carton: Number,
	Unit: Number,
	Note: String,
    POList: Array,
});

ShipmentSchema.pre('save', function(next) {
    this._id = new mongoose.Types.ObjectId().toHexString();
    next();
});

var Shipment = mongoose.model("Shipment", ShipmentSchema);
module.exports = Shipment;