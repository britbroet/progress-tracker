require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var passport = require('./config/ppConfig');
var session = require('express-session');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
//var ConnectRoles = require('connect-roles');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var User = require('./models/user');
require("dotenv").config();
var app = express();
var db = require("./models");

// Twilio Credentials 
var accountSid = 'ACfe27178453fac5de70e7b6281c181618'; 
var authToken = '206eda15c8d9d06a308e6791ac3affb9'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

// Mount middleware to notify Twilio of errors
//app.use(twilioNotifications.notifyOnError);

var secret = "mysupersecretpassword";

app.use('/api/users', expressJWT({secret: secret}).unless({method: 'POST'}));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({message: 'You need an authorization token to view this information.'})
  }
});

app.set('view engine', 'ejs');
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysupercoolsecret',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});





app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});


// SHARE TIMELINE VIEW
app.get("/:id/share", function(req, res){
	console.log('redirected to show single timeline - req.params.id = ' + req.params.id);
	db.timeline.find({
		where: {id: req.params.id},
		include: [db.step, db.user],
		order: '"steps.steppos" ASC'
	}).then(function(timeline){
		res.render("timeline/share", {layout: false, timeline: timeline});
	});
});

// USER TOKEN

app.post('/api/auth', function(req, res) {
  // some code to check that a user's credentials are right #bcryptmaybe?
  // collect any information we want to include in the token, like that user's info
  db.user.findOne({email: req.body.email}, function(err, user) {
    if (err || !user) return res.send({message: 'User not found'});
    user.authenticated(req.body.password, function(err, result) {
      if (err || !result) return res.send({message: 'User not authenticated'}
      	);
      // make a token & send it as JSON
      var token = jwt.sign(user, secret);
      res.send({user: user, token: token});
    });
  });
});


// TWILIO TEXT ALERTS

// client.messages.create({ 
//     to: "+15558675309", 
//     from: "+15017250604", 
//     body: "This is the ship that made the Kessel Run in fourteen parsecs?", 
//     mediaUrl: "https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg",  
// }, function(err, message) { 
//     console.log(message.sid); 
// });

//-------------


// Send an SMS text message

app.get("/:id/shareTxt", function(req, res) {

  console.log('req.params.id: ' + req.params.id);
  // console.log('click ' + '<a href="http://www.google.com">' + 'THIS' + '</a>' + 'to access');
   client.sendMessage({

      to:'+12067956807', // Any number Twilio can deliver to
      from: '+12062021353', // A number you bought from Twilio and can use for outbound communication
      body: 'click here https://progresstracker.herokuapp.com/<%= req.params.id %>/share' // body of the SMS message
      //mediaUrl: "https://progresstracker.herokuapp.com/1/share"

  }, function(err, responseData) { //this function is executed when a response is received from Twilio

      if (!err) { // "err" is an error received during the request, if any

          // "responseData" is a JavaScript object containing data received from Twilio.
          // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
          // http://www.twilio.com/docs/api/rest/sending-sms#example-1

          console.log(responseData.from); // outputs "+14506667788"
          console.log(responseData.body); // outputs "word to your mother."

      }
  // }).then(function(err, responseData){
  //   res.send(responseData);
  });

});











app.use('/viewer', require('./controllers/viewer'));
app.use('/auth', require('./controllers/auth'));
app.use('/timeline', require('./controllers/timeline'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
