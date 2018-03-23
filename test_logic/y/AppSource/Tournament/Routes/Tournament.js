var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	Game.AppSource.Tournament.Controllers.Tournament.getAll({}, function(err, tournament){
		if(err){ return res.status(500).send({
			 status: 'success',result:err,message:'All tournament list.'}); 
	}
		return res.status(200).send({status: 'success',result:tournament,message:'All tournament list.'});
	})
});
/* Save Tournament into Database */
router.post('/', function(req, res, next) {
	Game.AppSource.Tournament.Controllers.Tournament.create({
	    name:req.body.name,
		callYaniv:req.body.callYaniv,
		gameOverPoint:req.body.gameOverPoint,
		jokersCount:req.body.jokersCount,
		maxPlayers:req.body.maxPlayers,
		playersOnTable:req.body.playersOnTable,
		playerCount:req.body.playerCount,
		fees:req.body.fees,
		landmark:req.body.landmark,
	}).then(function(tournament){
		// for Success Response
		return res.status(200).send({status: 'success',result:tournament,message:'All tournament list.'});
	},function(err){
		// for Filer  Response
		return res.status(500).send({status: 'field',message:err});
	})
});	



/* Put to Edit Tournament */
router.put('/:id', function(req, res, next) {
	Game.AppSource.Tournament.Controllers.Tournament.update({id:req.params.id}, req.body)
	.then(function(tournament){
		return res.status(200).send({status: 'success',result:tournament,message:'Tournament Updated.'});
	},function(err){
		return res.status(500).send({status: 'success',	result:err,	message:'Some this is wrong please try again.'
		});
	});
});


 

router.delete('/:id', function(req, res, next) {
	Game.AppSource.Tournament.Controllers.Tournament.delete({id: req.params.id},
		function(err, tournament){
		if(err){ return res.status(500).send({status: 'success',result:err,message:'All tournament list.'}); }
		return res.status(200).send({status: 'success',result:tournament,message:'Selected tournament Deleted.'});
	})
});
module.exports = router;
