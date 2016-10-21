require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var passport = require('./config/ppConfig');
var session = require('express-session');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
//var ConnectRoles = require('connect-roles');
require("dotenv").config();
var app = express();
var db = require("./models");




// Twilio Credentials 
var accountSid = 'ACfe27178453fac5de70e7b6281c181618'; 
var authToken = '206eda15c8d9d06a308e6791ac3affb9'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 

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


// TWILIO TEXT ALERTS

// client.messages.create({ 
//     to: "+15558675309", 
//     from: "+15017250604", 
//     body: "This is the ship that made the Kessel Run in fourteen parsecs?", 
//     mediaUrl: "https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg",  
// }, function(err, message) { 
//     console.log(message.sid); 
// });





app.use('/viewer', require('./controllers/viewer'));
app.use('/auth', require('./controllers/auth'));
app.use('/timeline', require('./controllers/timeline'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
