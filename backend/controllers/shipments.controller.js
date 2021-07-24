let Shipment = require('../models/shipment.model');

exports.addShipment = function (req, res) {
  if (req.body) {     
    var shipment = new Shipment(req.body.shipment);
    shipment.save(function (err, shipment) {
      if (err) {
        var message = err.message;
        return res.send(message);
      }
      return res.json(shipment);
    });
  } else {
    return res.send('Error occurs.');
  }
};
exports.updateShipment = function (req, res) {
  if (req.body) {     
    var shipment = new Shipment(req.body.shipment);
    console.log(shipment);

    Shipment.findByIdAndUpdate( req.body.shipment.id, req.body.shipment, function (err, shipment) {
      if (err) {
        var message = err.message;
        return res.send(message);
      }
      return res.json(shipment);
    });
  } else {
    return res.send('Error occurs.');
  }
}
exports.removeShipment = function (req, res) {
  if (req.body) {     
    Shipment.findByIdAndRemove( req.body.id, function (err, response) {
      if (err) {
        var message = err.message;
        return res.send(message);
      }
      return res.json(response);
    });
  } else {
    return res.send('Error occurs.');
  }
}
exports.getShipments = function (req, res) {
  Shipment.find({}).exec((err, shipments) => {
    if(err)
      return res.status(404).send(err.message);
    else{
      return res.json(shipments);
    }
  })
}