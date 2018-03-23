var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/authenticate', function(req, res, next) {
	if (req.xhr || req.headers.accept.indexOf('json') > -1) {
		Game.AppSource.Auth.Controllers.User.login(req.body, function(err, user, message){
			if(err){
				return res.status(400).send({
					status: 'fail',
					message: 'Server error',
					result: null
				})
			}
			if(!user){
				return res.status(400).send({
					status: 'fail',
					message: message,
					result: null
				})
			}
			return res.send({
				status: 'success',
				message: 'New user registered',
				result: user
			})
		})
	} else {
		return res.send();
	}
});
router.post('/register', function(req, res, next) {
	if (req.xhr || req.headers.accept.indexOf('json') > -1) {
		Game.AppSource.Auth.Controllers.User.register(req.body, function(err, user){
			if(err){
				return res.send({
					status: 'fail',
					message: 'Server error',
					result: null
				})
			}
			return res.send({
				status: 'success',
				message: 'New user registered',
				result: null
			})
		})
	} else {
		return res.send();
	}
});
router.get('/', function(req, res, next) {
	game.controllers.mszone.getAll({}, function(err, zones){
		res.render('mszones/index', { title: 'Game Zones', zones: zones });
	})
	
});
router.get('/create', function(req, res, next) {
	res.render('mszones/create', { title: 'Game Zone Create' });
});
router.post('/', function(req, res, next) {
	game.controllers.mszone.create({
		name:req.body.name,
		status: 'Active',
	},function(err, zone){
		if(err){
			res.redirect('/multiplayer/mszones/create');
		}
		res.redirect('/multiplayer/mszones');
	})
});
router.get('/edit/:id', function(req, res, next) {
	game.controllers.mszone.getAll({}, function(err, zones){
		res.render('mszones/edit', { title: 'Game Zone Edit', zone: zone });
	})
});
router.post('/edit/:id', function(req, res, next) {
	game.controllers.mszone.update({id: req.params.id},{
		name:req.body.name,
		status: 'Active',
	},function(err, zone){
		if(err){
			res.redirect('/multiplayer/mszones/edit');
		}
		res.redirect('/multiplayer/mszones');
	})
});
module.exports = router;
