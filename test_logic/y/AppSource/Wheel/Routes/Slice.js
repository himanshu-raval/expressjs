var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	Game.AppSource.Wheel.Controllers.Slice.getAll()
	.then(function(slices){
		return res
		.status(200)
		.send({
			status: 'success',
			result:slices,
			message:'All slices list.'
		});
	},function(err){
		return res
		.status(500)
		.send({
			status: 'success',
			result:err,
			message:'Some this is wrong please try again.'
		});
	});
});

/* Post to create new slice */
router.post('/', function(req, res, next) {
	Game.AppSource.Wheel.Controllers.Slice.create(req.body)
	.then(function(slice){
		return res
		.status(200)
		.send({
			status: 'success',
			result:slice,
			message:'New slice creted.'
		});
	},function(err){
		return res
		.status(500)
		.send({
			status: 'success',
			result:err,
			message:'Some this is wrong please try again.'
		});
	});
});

/* Put to update new slice */
router.put('/:id', function(req, res, next) {
	Game.AppSource.Wheel.Controllers.Slice.update({id:req.params.id}, req.body)
	.then(function(slice){

		/* After Update Spin, Need Reset All Remain Value.*/
		// Game.AppSource.Wheel.Controllers.Slice.resetSpinWheel({type:req.body.type})
        // .then(function(spin){

        // 	console.log('Reset Spin');
        // 	console.log(spin);

        //           var percent=spin[0]['percent'];
        //           var index = 0;
        //             for (i = 0; i < spin.length; ++i) {
        //                  if(percent > Number(spin[i]['percent'])){
        //                     percent = spin[i]['percent'];
        //                     index = i;
        //                  }
        //             }
        //             var str = String(percent);
        //             var str_array = str.split('.');
        //             var num = str_array[1].length;
        //             var multi = 1;
        //             for (i = 0; i < num; ++i) {
        //                     multi=multi+'0';
        //             }
        //             var single = multi * Number(percent);

        //             for (i = 0; i < spin.length; ++i) {
        //                 var remain = multi * Number(spin[i]['percent']);
        //                  console.log('remain='+remain);
        //                 Game.AppSource.Wheel.Controllers.Spin.update({id:spin[i]['id']},{remaining:remain});
        //             }

        // },function(err){
        //        return res
		// 		.status(500)
		// 		.send({
		// 			status: 'success',
		// 			result:err,
		// 			message:'Some this is wrong please try again.'
		// 		});      
                
        // });

		/* End */


		return res.status(200).send({
								status: 'success',
								result:slice,
								message:'Slice updated.'
							});
	},function(err){
		return res
		.status(500)
		.send({
			status: 'success',
			result:err,
			message:'Some this is wrong please try again.'
		});
	});
});
module.exports = router;
