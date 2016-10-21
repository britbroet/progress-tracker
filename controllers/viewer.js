var express = require('express');
var router = express.Router();
var db = require("../models");
var passport = require("../config/ppConfig");
var flash = require("connect-flash");
var isLoggedIn = require('../middleware/isLoggedIn');

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});


// GET VIEWER FORM
router.get("/new", function(req,res){
	console.log('new viewer route');
	res.render('viewer/form');
});

// ADD NEW VIEWER
router.post('/new', function(req, res) {
  var email = req.body.email;
  var name = req.body.name;
  var phone = req.body.phone;

	db.viewer.create({
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone
	}).then(function(timeline){ //<-- returning new timeline created
		res.redirect("/");
	});
});







module.exports = router;