var express = require('express');
var router = express.Router();

/* GET users listing. */
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
