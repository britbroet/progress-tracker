var express = require('express');
var router = express.Router();
var db = require("../models");
var passport = require("../config/ppConfig");
//var flash = require("connect-flash");




router.get('/all', function(req, res) {
	db.timeline.findAll({
		include: [db.step, db.user]
	}).then(function(timelines){
		res.render("timeline/index", {timelines: timelines});
	}); 
});

router.get('/new', function(req, res) {
  res.render('timeline/new');
});


// POST NEW TIMELINE (create new timeline)
router.post("/new", function(req, res){
	db.timeline.create({
		userId: req.body.user,
		title: req.body.timelineName,
		description: req.body.timelineDesc
	}).then(function(timeline){ //<-- returning new timeline created
		res.redirect("/timeline/" + timeline.id);
	});
});


// SHOW SINGLE TIMELINE
router.get("/:id", function(req, res){
	console.log('redirected to show single timeline - req.params.id = ' + req.params.id);
	db.timeline.find({
		where: {id: req.params.id},
		include: [db.step, db.user],
		order: '"steps.steppos" ASC'
	}).then(function(timeline){
		res.render("timeline/single", {timeline: timeline}); 
	});
});

// UPDATE TIMELINE STATUS
router.get("/:id/status", function(req, res){
	console.log('redirected to show single timeline - req.params.id = ' + req.params.id);
	db.timeline.find({
		where: {id: req.params.id},
		include: [db.step, db.user],
		order: '"steps.steppos" ASC'
	}).then(function(timeline){
		res.render("timeline/altStatus", {timeline: timeline}); 
	});
});


// ADD TIMELINE STEPS (view)
router.get("/:id/addstep", function(req, res) {
	console.log('made it');
	db.timeline.findOne({
		where: {id: req.params.id}
	}).then(function(timeline){
		res.render("timeline/addstep", {timeline: timeline});
	});
});


// ADD TIMELINE STEP (post)
router.post("/:id/addstep", function(req, res){
	db.step.create({
		timelineId: req.params.id,
		stepname: req.body.stepName,
		stepdesc: req.body.stepDesc,
		steppos: req.body.stepPosition
	})
	.then(function(timeline){ //<-- returning new timeline created
		console.log('success?!');
		res.redirect("/timeline/" + req.params.id);
	});
});

// EDIT TIMELINE STEP (get)
router.get('/:id/edit', function(req, res) {
  db.step.findById(req.params.id).then(function(step) {
    if (step) {
      res.render('timeline/edit', {step: step});
    } else {
      res.status(404).render('error');
    }
  }).catch(function(err) {
    res.status(500).render('error');
  });
});

//EDIT TIMELINE STEP (put route to update individual timeline step name and description)
router.put('/:timelineId/:id/edit', function(req, res) {
  db.step.findById(req.params.id).then(function(step) {
    if (step) {
      step.updateAttributes(req.body).then(function() {
      	res.send({msg: 'success'});
    	});
    } else {
    	res.status(404).send({msg: 'error'});
    } 
	}).catch(function(err){
		res.status(500).send({msg: 'error'});
      });
});

//EDIT TIMELINE STEP POSITION -- HERE!
router.put('/:timelineId/:id/step', function(req, res) {
	console.log("node js req.params.id" + req.params.id);
	db.step.findById(req.params.id).then(function(step) {
		step.updateAttributes(req.body).then(function() {
			res.send({msg: 'success'});
			});
	}).catch(function(err){
		res.status(500).send({msg: 'error'});
	});
});

// //EDIT TIMELINE STEP POSITION -- HERE!
// router.put('/:timelineId/:id/stepup', function(req, res) {
// 	console.log("node js req.params.id" + req.params.id);
// 	db.step.findById(req.params.id).then(function(step) {
// 		step.updateAttributes(req.body).then(function() {
// 			res.send({msg: 'success'});
// 			});
// 	}).catch(function(err){
// 		res.status(500).send({msg: 'error'});
// 	});
// });


//----

	//step.updateAttributes(req.params.id).then(function(step) {
		//step.updateAttributes(req.body).then(function() {
// 			res.send({msg: 'success'});
// 		});
// 	});
// });















module.exports = router;
