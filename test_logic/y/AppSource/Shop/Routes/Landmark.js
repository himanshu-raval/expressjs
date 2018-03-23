var express = require('express');
var router = express.Router();
var multer = require('multer'); // for image Upload
var upload = multer({ dest: Game.Config.Multer.dir })  // For Image Upload

/* GET users listing. */
router.get('/api/', function(req, res, next) {
 
	Game.AppSource.Shop.Controllers.Landmark.getAllLandmark({}, function(err, landmark){
		if(err){ 
		 
			return res.status(500).send({
			 status: 'success',result:err,message:'All Landmark list.'}); 
		}
		 
		return res.status(200).send({status: 'success',result:landmark,message:'All Landmark list.'});
	})
});
/* Save Landmark into Database */
router.post('/api/', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Landmark.create({
		landmark:req.body.landmark,
		landmark_name:req.body.landmark_name,
		coin_per_point: req.body.coin_per_point,
		gems:req.body.gems,
		coin:req.body.coin,
		chance:req.body.chance,
	}).then(function(landmark){
		// for Success Response
		return res.status(200).send({status: 'success',result:landmark,message:'All Landmark list.'});
	},function(err){
		// for Filer  Response
		return res.status(500).send({status: 'field',message:err});
	})
});	



/* Put to Edit Landmark */
router.put('/api/:id', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Landmark.update({id:req.params.id}, req.body)
	.then(function(landmark){
		return res.status(200).send({status: 'success',result:landmark,message:'Landmark Updated.'});
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
	Game.AppSource.Shop.Controllers.Landmark.delete({id: req.params.id},
		function(err, landmark){
		if(err){ return res.status(500).send({status: 'success',result:err,message:'All Landmark list.'}); }
		return res.status(200).send({status: 'success',result:landmark,message:'Selected Landmark Deleted.'});
	})
});
module.exports = router;
