var debug = require('debug')('AppSource:Shop:Controller:Gems');

module.exports = {
	getAll: function (playerId, data) {
		debug('getAll function called.');
		var promise = new Promise(function (resolve, reject) {
			Game.AppSource.Shop.Models.Gems.find({})
				.then(function (gems) {
					resolve(gems);
				})
				.catch(function (err) {
					reject(err);
				});
		});
		return promise;


		// Game.AppSource.Shop.Models.Gems.find(query)
		// .exec((err, gems) => {
		// 	if(err) { console.log(err); return cb(err) }
		// 	return cb(null, gems);
		// })

	},
	getAllGemst: function (query, cb) {
		debug('getAllGemst function called.');

		Game.AppSource.Shop.Models.Gems.find(query)
			.exec((err, gems) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, gems);
			})

	},
	delete: function (query, cb) {
		debug('Delete function called.');
		Game.AppSource.Shop.Models.Gems.destroy(query)
			.exec((err, gems) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, gems);
			})

	},
	create: function (data) {
		var promise = new Promise(function (resolve, reject) {
			debug('Save gems function called.');
			Game.AppSource.Shop.Models.Gems.create(data)
				.then(function (gems) {
					resolve(gems);  // Send success response
				})
				.catch(function (err) {
					reject(err); // Send Fails Response
				});

		});
		return promise;
	},
	update: function (query, data) {
		var promise = new Promise(function (resolve, reject) {
			debug('get function called.');
			Game.AppSource.Shop.Models.Gems.update(query, data)
				.then(function (gems) {
					resolve(gems);
				})
				.catch(function (err) {
					reject(err);
				});

		});
		return promise;
	},
	purchasegems: function (playerId, data) {
		var promise = new Promise(function (resolve, reject) {
			Game.AppSource.Player.Models.Player.findOne({ id: playerId })
				.then(function (player) {
					Game.AppSource.Shop.Models.Gems.findOne({id : data.gems})
					.exec((err, gemsdata) => {
						if (err) { console.log(err); return cb(err) }
						var gems = parseInt(player.gems);
						gems = parseInt(gems) + parseInt(gemsdata.gems_amount);
						Game.AppSource.Player.Models.Player.update({ id: playerId }, { gems: gems })
						.then(function (player) {
							Game.Io.to(player[0]['socket_id']).emit("gemsupdated", {
								playerid: player[0]['id'],
								gems: parseInt(player[0]['gems'])
							});
							resolve(player);							
						})
						.catch(function (err) {
							reject(err);
						});
					});
				})
				.catch(function (err) {
					reject(err);
				});
		});
		return promise;
	},
	setgems: function (playerId, data) {
		var promise = new Promise(function (resolve, reject) {
			console.log("setgems function called.");
			Game.AppSource.Player.Models.Player.findOne({ id: playerId })
				.then(function (player) {
					var isPurched = false;
					Game.AppSource.Player.Models.Player.update({ id: playerId }, { selected_gems: data.gems_id })
						.then(function (gems) {
							resolve(gems);
						})
						.catch(function (err) {
							reject(err);
						});
				})
				.catch(function (err) {
					reject(err);
				});
		});
		return promise;
	}
}
