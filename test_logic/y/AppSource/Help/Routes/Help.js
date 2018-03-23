var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	Game.AppSource.Help.Controllers.Help.get()
	.then(function(help){
		return res
		.status(200)
		.send({
			status: 'success',
			result:help,
			message:'Help data.'
		});
	},function(err){
		return res
		.status(500)
		.send({
			status: 'success',
			result:err,
			message:'Some this is wrong please try again.'
		});
	});
});

router.put('/', function(req, res, next) {
	Game.AppSource.Help.Controllers.Help.update({
		text:req.body.text,
		video: req.body.video,
	})
	.then(function(err, help){
		return res
		.status(200)
		.send({
			status: 'success',
			result:help,
			message:'Help data.'
		});
	},function(err){
		return res
		.status(500)
		.send({
			status: 'success',
			result:err,
			message:'Some this is wrong please try again.'
		});
	})
});
router.get('/web-view', function(req, res, next) {
	Game.AppSource.Help.Controllers.Help.get()
	.then(function(help){
		return res
		.status(200)
		.render('Help/Views/web-view', {help:help,layout:'Help/Views/web-view-layout'});
	},function(err){
		return res
		.status(500)
		.send({
			status: 'success',
			result:err,
			message:'Some this is wrong please try again.'
		});
	});
});

module.exports = router;
