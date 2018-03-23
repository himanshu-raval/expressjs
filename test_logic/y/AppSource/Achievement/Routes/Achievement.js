var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	Game.AppSource.Achievement.Controllers.Achievement.getAll({}, function(err, achievement){
		if(err){ return res.status(500).send({
			 status: 'success',result:err,message:'All achievement list.'}); 
	}
		return res.status(200).send({status: 'success',result:achievement,message:'All achievement list.'});
	})
});
/* Save Achievement into Database */
router.post('/', function(req, res, next) {
	Game.AppSource.Achievement.Controllers.Achievement.create({
	    name:req.body.name,
		details:req.body.details,
		coin_reward:req.body.coin_reward,
		action_on:req.body.action_on,
		action_count:req.body.action_count,
	}).then(function(achievement){
		// for Success Response
		return res.status(200).send({status: 'success',result:achievement,message:'All achievement list.'});
	},function(err){
		// for Filer  Response
		return res.status(500).send({status: 'field',message:err});
	})
});	



/* Put to Edit Achievement */
router.put('/:id', function(req, res, next) {
	Game.AppSource.Achievement.Controllers.Achievement.update({id:req.params.id}, req.body)
	.then(function(achievement){
		return res.status(200).send({status: 'success',result:achievement,message:'Achievement Updated.'});
	},function(err){
		return res.status(500).send({status: 'success',	result:err,	message:'Some this is wrong please try again.'
		});
	});
});


 

router.delete('/:id', function(req, res, next) {
	Game.AppSource.Achievement.Controllers.Achievement.delete({id: req.params.id},
		function(err, achievement){
		if(err){ return res.status(500).send({status: 'success',result:err,message:'All achievement list.'}); }
		return res.status(200).send({status: 'success',result:achievement,message:'Selected achievement Deleted.'});
	})
});
module.exports = router;
