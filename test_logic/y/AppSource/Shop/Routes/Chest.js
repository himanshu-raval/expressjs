var express = require('express');
var router = express.Router();
var multer = require('multer'); // for image Upload
var upload = multer({ dest: Game.Config.Multer.dir })  // For Image Upload

/* GET users listing. */
router.get('/api/', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Chest.getAllChest({}, function(err, chest){
		
		if(err){ return res.status(500).send({
			 status: 'success',result:err,message:'All Chest list.'}); 
	}
		return res.status(200).send({status: 'success',result:chest,message:'All Chest list.'});
	})
});
/* Save Chest into Database */
router.post('/api/', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Chest.create({
	    avatar:req.body.avatar,
	    card:req.body.card,
	    landmark:req.body.landmark,
		chest:req.body.chest,
		chest_name:req.body.chest_name,
		chest_details : req.body.chest_details,
		gems:req.body.gems,
	}).then(function(chest){
		// for Success Response
		return res.status(200).send({status: 'success',result:chest,message:'All Chest list.'});
	},function(err){
		// for Filer  Response
		return res.status(500).send({status: 'field',message:err});
	})
});	



/* Put to Chest Avatar */
router.put('/api/:id', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Chest.update({id:req.params.id}, req.body)
	.then(function(chest){
		return res.status(200).send({status: 'success',result:chest,message:'Chest Updated.'});
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




router.delete('/api/:id', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Chest.delete({id: req.params.id},
		function(err, chest){
		if(err){ return res.status(500).send({status: 'success',result:err,message:'All Chest list.'}); }
		return res.status(200).send({status: 'success',result:chest,message:'Selected Chest Deleted.'});
	})
});
module.exports = router;
