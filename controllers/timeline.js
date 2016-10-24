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

//var currentUser = 

// ADD THIS TO THINGS:
// app.get('/profile', isLoggedIn, function(req, res) {
//   res.render('profile');
// });


router.get('/all', isLoggedIn, function(req, res) {
	db.timeline.findAll({
		where: {userId: res.locals.currentUser.id},
		include: [db.step, db.user], 
		order: [['createdAt', 'DESC'],
			[ db.step, 'steppos', 'ASC' ]]
	}).then(function(timelines){
		//console.log('current user: ' + res.locals.currentUser);
		res.render("timeline/index", {timelines: timelines});
	}); 
});

router.get('/new', function(req, res) {
  res.render('timeline/new');
});


// POST NEW TIMELINE (create new timeline)
router.post("/new", function(req, res){
	db.timeline.create({
		userId: res.locals.currentUser.id,
		title: req.body.timelineName,
		description: req.body.timelineDesc
	}).then(function(timeline){ //<-- returning new timeline created
		res.redirect("/timeline/" + timeline.id);
	});
});

// DELETE TIMELINE 
router.delete("/:id/delete", function(req, res){
	db.timeline.findById(req.params.id).then(function(timeline) {
		if (timeline) {
			timeline.destroy().then(function() {
				res.send({msg: 'timeline deleted'});
			});
		}
		else {
			res.status(404).send({msg: 'error'});
		}
	}).catch(function(err) {
		res.status(500).send({msg: 'error'});
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
		res.render("timeline/statusUpdate", {timeline: timeline}); 
	});
});


// UPATE TIMELINE STATUS (post)

router.put('/:id/update', function(req, res) {
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
	
	db.step.findAll({
		where: { timelineId: req.params.id }
	}).then(function(step){
		//console.log('step: ' + step);
		//var max = 0;	
		// for (var i = 0; i < step.length; i++) {
		// 	if(step[i].steppos > max) {
		// 		max = (step[i].steppos) + 1;
		// 	} //end of if
		// } // end of for loop
		var max = step.length;
		console.log('max: ' + max);

		db.step.create({
			timelineId: req.params.id,
			stepname: req.body.stepName,
			stepdesc: req.body.stepDesc,
			steppos: max,
			status: 1
		})
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

//EDIT TIMELINE STEP POSITION -- UP
router.put('/:timelineId/:id/stepup', function(req, res) {
	console.log("node js req.params.id" + req.params.id);
	db.step.findById(req.params.id).then(function(step) {
		step.updateAttributes(req.body).then(function() {
			res.send({msg: 'success'});
			});
	}).catch(function(err){
		res.status(500).send({msg: 'error'});
	});
});

// //EDIT TIMELINE STEP POSITION -- DOWN
router.put('/:timelineId/:id/stepdown', function(req, res) {
	console.log("node js req.params.id: " + req.params.id);
	db.step.findById(req.params.id).then(function(step) {
		step.updateAttributes(req.body).then(function() {
			//console.log('req.body is this: ' + req.body);
			res.send({msg: 'success'});
			});
	}).catch(function(err){
		res.status(500).send({msg: 'error'});
	});
});



// DELETE STEP
router.delete('/:timelineId/:id/delete', function(req, res) {
  db.step.findById(req.params.id).then(function(step) {
    if (step) {
      step.destroy().then(function() {
        res.send({msg: 'success'});
      });
    } else {
      res.status(404).send({msg: 'error'});
    }
  }).catch(function(err) {
    res.status(500).send({msg: 'error'});
  });
});

// EDIT TIMELINE INFO (title/description) (get)
router.get('/:id/editinfo', function(req, res) {
	console.log('edit timeline info route works???');
  db.timeline.findById(req.params.id).then(function(timeline) {
  	console.log('edit timeline info route works!');
    if (timeline) {
    	console.log('if timeline apparnetly true');
      res.render('timeline/editInfo', {timeline: timeline});
    } else {
      res.status(404).render('error');
    }
  }).catch(function(err) {
  	console.log('if timeline false');
    res.status(500).render('error');
  });
});



// // EDIT TIMELINE INFO (title/description) (get)
// router.get('/:id/edit', function(req, res) {
// 	//console.log('edit timeline info route works???');
//   db.timeline.findById(req.params.id).then(function(timeline) {
//   	//console.log('edit timeline info route works!');

//       res.render("timeline/editInfo", {timeline: timeline});
    
//   // }).catch(function(err) {
//   // 	console.log('if timeline false');
//   //   res.status(500).render('error');
//   });
// });






//EDIT TIMELINE INFO (put route to update individual timeline title/description)
router.put('/:id/editinfodone', function(req, res) {
  db.timeline.findById(req.params.id).then(function(timeline) {
    if (timeline) {
      timeline.updateAttributes(req.body).then(function() {
      	res.send({msg: 'success'});
    	});
    } else {
    	res.status(404).send({msg: 'error'});
    } 
	}).catch(function(err){
		res.status(500).send({msg: 'error'});
      });
});


// SHARE TIMELINE FORM

router.get("/:id/shareForm", function(req, res){
	console.log('redirected to show timeline form - req.params.id = ' + req.params.id);
	db.timeline.find({
		where: {id: req.params.id},
		include: [db.step, db.user],
		order: '"steps.steppos" ASC'
	}).then(function(timeline){
		res.render("timeline/shareForm", {timeline: timeline});
	});
});

// SHARE ROUTE (send text)






// // TESTING POSITION W/ DELETE BUTTON
// router.get('/:timelineId/pos', function(req, res) {
// 	console.log('test position firing');
// 	db.step.findAll({
// 		where: { timelineId: req.params.timelineId }
// 	}).then(function(step){
// 		var max = 0;
// 		for (var i = 0; i < step.length; i++) {
// 			if(step[i].steppos > max) {
// 				max = step[i].steppos;
// 			}
// 		}
// 		console.log(max);
// 	});
// });











//<a href="/timeline/<%= timeline.id %>/<%= step.id/pos %>" class="btn btn-danger glyphicon glyphicon-trash delete-btn"></a>



//----

	//step.updateAttributes(req.params.id).then(function(step) {
		//step.updateAttributes(req.body).then(function() {
// 			res.send({msg: 'success'});
// 		});
// 	});
// });















module.exports = router;
