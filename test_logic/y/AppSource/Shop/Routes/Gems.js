var express = require('express');
var router = express.Router();
var multer = require('multer'); // for image Upload
var upload = multer({ dest: Game.Config.Multer.dir })  // For Image Upload

/* GET users listing. */
router.get('/api/', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Gems.getAllGemst({}, function(err, gems){
		if(err){ return res.status(500).send({
			 status: 'success',result:err,message:'All Gems list.'}); 
	}
		return res.status(200).send({status: 'success',result:gems,message:'All Gems list.'});
	})
});
/* Save Gems into Database */
router.post('/api/', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Gems.create({
	    google_product_id:req.body.google_product_id,
		gems:req.body.gems,
		gems_name:req.body.gems_name,
		gems_amount:req.body.gems_amount,
		price:req.body.price,
	}).then(function(gems){
		// for Success Response
		return res.status(200).send({status: 'success',result:gems,message:'Gams Saved.'});
	},function(err){
		// for Filer  Response
		return res.status(500).send({status: 'field',message:err});
	})
});	



/* Put to Edit Gems */
router.put('/api/:id', function(req, res, next) {
	console.log("Gemst Edit Routes");
	console.log("in Body",req.body);
	Game.AppSource.Shop.Controllers.Gems.update({id:req.params.id}, req.body)
	.then(function(gems){
		return res.status(200).send({status: 'success',result:gems,message:'Gems Updated.'});
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




// router.get('/api/edit/:id', function(req, res, next) {
// 	Game.AppSource.Shop.Controllers.Coin.getAll({}, function(err, players){
// 		res.render('msplayers/edit', { title: 'Game Zone Edit', player: player });
// 	})
// });

// router.post('/api/edit/:id', function(req, res, next) {
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
	Game.AppSource.Shop.Controllers.Gems.delete({id: req.params.id},
		function(err, gems){
		if(err){ return res.status(500).send({status: 'success',result:err,message:'All Gems list.'}); }
		return res.status(200).send({status: 'success',result:gems,message:'Selected Gems Deleted.'});
	})
});
module.exports = router;
