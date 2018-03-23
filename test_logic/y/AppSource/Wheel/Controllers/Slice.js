var debug = require('debug')('AppSource:Wheel:Controller:Slice');

module.exports = {
	getAll: function(){
		var promise = new Promise(function(resolve, reject){
			debug('get function called.');
			Game.AppSource.Wheel.Models.Slice.find()
			.then(function (slices) {
				resolve(slices);
			})
			.catch(function (err) {
				reject(err);
			});
		});
		return promise;
	},
	create: function(data){
		var promise = new Promise(function(resolve, reject){
			debug('get function called.');
			Game.AppSource.Wheel.Models.Slice.find({type:data.type})
			.then(function (slices) {
				if(slices.length >= 10){
					reject(Throw('Limit exceeds'));
				}else{
					Game.AppSource.Wheel.Models.Slice.create(data)
					.then(function (slice) {
						resolve(slice);
					})
					.catch(function (err) {
						reject(err);
					});
				}
			})
			.catch(function (err) {
				reject(err);
			});

		});
		return promise;
	},
	update: function(query, data){
		var promise = new Promise(function(resolve, reject){
			debug('get function called.');
			Game.AppSource.Wheel.Models.Slice.update(query, data)
			.then(function (slices) {
				if(slices.length > 0){
					resolve(slices[0]);
				}else{
					reject(Throw('Limit exceeds'));
				}
			})
			.catch(function (err) {
				reject(err);
			});

		});
		return promise;
	},
	// resetSpinWheel: function(query){
	// 	console.log(query);
	// 	var promise = new Promise(function(resolve, reject){
	// 		debug('get function called.');
	// 		Game.AppSource.Wheel.Models.Slice.find(query)
	// 		.then(function (spin) {
	// 			resolve(spin);
	// 		})
	// 		.catch(function (err) {
	// 			reject(err);
	// 		});
	// 	});
	// 	return promise;
	// },

}
