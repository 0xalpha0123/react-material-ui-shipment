// Get the packages we need
var express = require('express'),
  router = express.Router(),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  passport = require('passport'),
  path=require('path');

module.exports = function () {
  var app = express();

  //Allow CORS so that backend and frontend could pe put on different servers
  var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", "include");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
  };
  // app.use(allowCrossDomain);
 var isMultipart = /^multipart\//i;
  var urlencodedMiddleware = bodyParser.urlencoded({  limit: '50mb', extended: true, parameterLimit: 50000 });
  var jsonMiddleware = bodyParser.json({ type: '*/*', limit: '50mb' });
  app.use(bodyParser.urlencoded({
    extended: true
  }));

 // app.use(bodyParser.json());

app.use(function (req, res, next) {
    var type = req.get('Content-Type');
    if (isMultipart.test(type)) return next();
    return jsonMiddleware(req, res, next);
});
app.use(function (req, res, next) {
    var type = req.get('Content-Type');
    if (isMultipart.test(type)) return next();
    return urlencodedMiddleware(req, res, next);
});
  // Allow cross-origin resource sharing
  app.use(cors());
  // app.options('*', cors());

  app.use(passport.initialize());
  app.use(passport.session());

  /* SERVE REACT PAGES */

  // Serve static assets
  app.use(express.static(path.resolve(__dirname, '../public')));


  return app;
};