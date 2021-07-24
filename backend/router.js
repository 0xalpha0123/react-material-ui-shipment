const express = require('express');

const Users = require('./controllers/Users.controller');
const Shipments = require('./controllers/shipments.controller');
var passport = require('passport');
var requireSignin = passport.authenticate('local');
const passportStrategies = require('./config/strategies/jwt-strategies');
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function (app) {

  // Initializing route groups
  const apiRoutes = express.Router()

  apiRoutes.post('/signup', Users.signup);
  apiRoutes.post('/passwordchange', Users.passwordchange);
  apiRoutes.post('/signin', requireSignin, Users.signin);
  apiRoutes.get('/getusers', requireAuth, Users.getUsers);
  apiRoutes.post('/removeuser', requireAuth, Users.removeUser);  
  apiRoutes.post('/initpassword', requireAuth, Users.initPassword);

  apiRoutes.post('/addshipment', requireAuth, Shipments.addShipment);
  apiRoutes.post('/updateshipment', requireAuth, Shipments.updateShipment);
  apiRoutes.post('/removeshipment', requireAuth, Shipments.removeShipment);
  apiRoutes.get('/getshipments', requireAuth, Shipments.getShipments);
  // Set url for API group routes
  app.use('/api', apiRoutes);
};
