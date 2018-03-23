var express = require('express');
var router = express.Router();
var multer = require('multer'); // for image Upload
var upload = multer({ dest: Game.Config.Multer.dir })  // For Image Upload

/* GET users listing. */
router.get('/api/', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Sound.getAllSound({}, function(err, sound){
		if(err){ return res.status(500).send({
			 status: 'success',result:err,message:'All Sound list.'}); 
	}
		return res.status(200).send({status: 'success',result:sound,message:'All Sound list.'});
	})
});
/* Save Sound into Database */
router.post('/api/', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Sound.create({
		sound:req.body.sound,
		sound_name:req.body.sound_name,
		gems:req.body.gems,
		chance : req.body.chance
	}).then(function(sound){
		// for Success Response
		return res.status(200).send({status: 'success',result:sound,message:'All Sound list.'});
	},function(err){
		// for Filer  Response
		return res.status(500).send({status: 'field',message:err});
	})
});	



/* Put to Edit Sound */
router.put('/api/:id', function(req, res, next) {
	Game.AppSource.Shop.Controllers.Sound.update({id:req.params.id}, req.body)
	.then(function(sound){
		return res.status(200).send({status: 'success',result:sound,message:'Sound Updated.'});
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
	Game.AppSource.Shop.Controllers.Sound.delete({id: req.params.id},
		function(err, sound){
		if(err){ return res.status(500).send({status: 'success',result:err,message:'All Sound list.'}); }
		return res.status(200).send({status: 'success',result:sound,message:'Selected Sound Deleted.'});
	})
});
module.exports = router;
