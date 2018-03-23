var express = require('express');
var router = express.Router();
var multer = require('multer'); // for image Upload
var upload = multer({ dest: Game.Config.Multer.dir })  // For Image Upload

/* GET users listing. */
router.get('/api/', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Avatar.getAllAvatart({}, function(err, avatar){
		if(err){ return res.status(500).send({
			 status: 'success',result:err,message:'All Avatar list.'}); 
	}
		return res.status(200).send({status: 'success',result:avatar,message:'All Avatar list.'});
	})
});
/* Save Avatar into Database */
router.post('/api/', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Avatar.create({
		avatar:req.body.avatar,
		avatar_name:req.body.avatar_name,
		gems:req.body.gems,
		chance : req.body.chance
	}).then(function(avatar){
		// for Success Response
		return res.status(200).send({status: 'success',result:avatar,message:'All Avatar list.'});
	},function(err){
		// for Filer  Response
		return res.status(500).send({status: 'field',message:err});
	})
});	



/* Put to Edit Avatar */
router.put('/api/:id', function(req, res, next) {
	console.log("Avatart Edit Routes");
	console.log("in Body",req.body);
	Game.AppSource.Shop.Controllers.Avatar.update({id:req.params.id}, req.body)
	.then(function(avatar){
		return res.status(200).send({status: 'success',result:avatar,message:'Avatar Updated.'});
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
	Game.AppSource.Shop.Controllers.Avatar.delete({id: req.params.id},
		function(err, avatar){
		if(err){ return res.status(500).send({status: 'success',result:err,message:'All Avatar list.'}); }
		return res.status(200).send({status: 'success',result:avatar,message:'Selected Avatar Deleted.'});
	})
});
module.exports = router;
