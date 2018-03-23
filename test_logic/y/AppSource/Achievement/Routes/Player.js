var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	Game.AppSource.Player.Controllers.Player.getAll({}, function(err, players){
		if(err){ return res.status(500).send({status: 'success',result:err,message:'All players list.'}); }
		return res.status(200).send({status: 'success',result:players,message:'All players list.'});
	})
});
router.get('/create', function(req, res, next) {
	res.render('msplayers/create', { title: 'Game Zone Create' });
});
router.post('/', function(req, res, next) {
	Game.AppSource.Player.Controllers.Player.create({
		name:req.body.name,
		status: 'Active',
	},function(err, player){
		if(err){
			res.redirect('/multiplayer/msplayers/create');
		}
		res.redirect('/multiplayer/msplayers');
	})
});
router.get('/edit/:id', function(req, res, next) {
	Game.AppSource.Player.Controllers.Player.getAll({}, function(err, players){
		res.render('msplayers/edit', { title: 'Game Zone Edit', player: player });
	})
});
router.post('/edit/:id', function(req, res, next) {
	Game.AppSource.Player.Controllers.Player.update({id: req.params.id},{
		name:req.body.name,
		status: 'Active',
	},function(err, player){
		if(err){
			res.redirect('/multiplayer/msplayers/edit');
		}
		res.redirect('/multiplayer/msplayers');
	})
});
router.delete('/:id', function(req, res, next) {
	Game.AppSource.Player.Controllers.Player.delete({id: req.params.id},
		function(err, players){
		if(err){ return res.status(500).send({status: 'success',result:err,message:'All players list.'}); }
		return res.status(200).send({status: 'success',result:players,message:'Selected player deleted.'});
	})
});
module.exports = router;
