var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/api/', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Coin.getAllCoin({}, function(err, coin){
		if(err){ return res.status(500).send({
			 status: 'success',result:err,message:'All coin list.'}); 
	}
		return res.status(200).send({status: 'success',result:coin,message:'All coin list.'});
	})
});
/* Save Coin into Database */
router.post('/api/', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Coin.create({
	    google_product_id:req.body.google_product_id,
		coin:req.body.coin,
		tag:'himanshu',
		price:req.body.price,
	}).then(function(coin){
		// for Success Response
		return res.status(200).send({status: 'success',result:coin,message:'All coin list.'});
	},function(err){
		// for Filer  Response
		return res.status(500).send({status: 'field',message:err});
	})
});	



/* Put to Edit Coin */
router.put('/api/:id', function(req, res, next) {
	console.log("Edit Coin at Route");
	Game.AppSource.Shop.Controllers.Coin.update({id:req.params.id}, req.body)
	.then(function(coin){
		return res.status(200).send({status: 'success',result:coin,message:'Coin Updated.'});
	},function(err){
		return res.status(500).send({status: 'success',	result:err,	message:'Some this is wrong please try again.'
		});
	});
});




// router.get('/edit/:id', function(req, res, next) {
// 	Game.AppSource.Shop.Controllers.Coin.getAll({}, function(err, players){
// 		res.render('msplayers/edit', { title: 'Game Zone Edit', player: player });
// 	})
// });

// router.post('/edit/:id', function(req, res, next) {
// 	Game.AppSource.Shop.Controllers.Coin.update({id: req.params.id},{
// 		google_product_id:req.body.google_product_id,
// 		coin:req.body.coin,
// 		price:req.body.price,
// 	}).then(function(coin){
// 		// for Success Response
// 		return res.status(200).send({status: 'success',result:coin,message:'Coin Updated'});
// 	},function(err){
// 		// for Filer  Response
// 		return res.status(400).send({status: 'field',message:err});
// 	})
// });

router.delete('/api/:id', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Coin.delete({id: req.params.id},
		function(err, coin){
		if(err){ return res.status(500).send({status: 'success',result:err,message:'All coin list.'}); }
		return res.status(200).send({status: 'success',result:coin,message:'Selected coin Deleted.'});
	})
});
module.exports = router;
