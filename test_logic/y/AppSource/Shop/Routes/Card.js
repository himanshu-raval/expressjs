var express = require('express');
var router = express.Router();
var multer = require('multer'); // for image Upload
var upload = multer({ dest: Game.Config.Multer.dir })  // For Image Upload

/* GET users listing. */
router.get('/api/', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Card.getAllCard({}, function(err, card){
		if(err){ return res.status(500).send({
			 status: 'success',result:err,message:'All Card list.'}); 
	}
		return res.status(200).send({status: 'success',result:card,message:'All Card list.'});
	})
});
/* Save Avatar into Database */
router.post('/api/', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Card.create({
		card:req.body.card,
		card_name:req.body.card_name,
		gems:req.body.gems,
		chance : req.body.chance
	}).then(function(card){
		// for Success Response
		return res.status(200).send({status: 'success',result:card,message:'All Card list.'});
	},function(err){
		// for Filer  Response
		return res.status(500).send({status: 'field',message:err});
	})
});	



/* Put to Edit Avatar */
router.put('/api/:id', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Card.update({id:req.params.id}, req.body)
	.then(function(card){
		return res.status(200).send({status: 'success',result:card,message:'Card Updated.'});
	},function(err){
		return res.status(500).send({status: 'success',	result:err,	message:'Some this is wrong please try again.'
		});
	});
});



/*
* for image Upload Only
*/

router.post('/api/upload', upload.single('file'), function (req, res) {
  		return res.status(200).send({status: 'success',	result:req.file,	message:'image Uploaded'});
});

// end




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
	Game.AppSource.Shop.Controllers.Card.delete({id: req.params.id},
		function(err, card){
		if(err){ return res.status(500).send({status: 'success',result:err,message:'All Card list.'}); }
		return res.status(200).send({status: 'success',result:card,message:'Selected Card Deleted.'});
	})
});
module.exports = router;
