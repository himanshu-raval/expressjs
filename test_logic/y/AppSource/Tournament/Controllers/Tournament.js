var debug = require('debug')('AppSource:Tournament:Controller:Tournament');

module.exports = {
	
	getAll: function(query, cb){
		debug('getAll tournament function called.');
	
		Game.AppSource.Game.Models.Tournament.find(query)
		.exec((err, tournament) => {
			if(err) { console.log(err); return cb(err) }
			return cb(null, tournament);
		})
		
	},
	delete: function(query, cb){
		debug('delete function called.');
		Game.AppSource.Game.Models.Tournament.destroy(query)
		.exec((err, tournament) => {
			if(err) { console.log(err); return cb(err) }
			return cb(null, tournament);
		})
		
	},
	create: function(data){
		var promise = new Promise(function(resolve, reject){
			debug('Save tournament function called.');
			Game.AppSource.Game.Models.Tournament.create(data)
			.then(function (tournament) {
				resolve(tournament);  // Send success response
			})
			.catch(function (err) {
				reject(err); // Send Fails Response
			});

		});
		return promise;
	},
	update: function(query, data){
		var promise = new Promise(function(resolve, reject){
			debug('get function called.');
			Game.AppSource.Game.Models.Tournament.update(query, data)
			.then(function (tournament) {
		 		resolve(tournament);
			})
			.catch(function (err) {
				reject(err);
			});

		});
		return promise;
	}

}
