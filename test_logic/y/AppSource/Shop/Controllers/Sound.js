var debug = require('debug')('AppSource:Shop:Controller:Sound');

module.exports = {

	getAll: function (playerId, cb) {
		debug('getAll function called.');


		var promise = new Promise(function (resolve, reject) {
			Game.AppSource.Shop.Models.Sound.find({})
				.then(function (sound) {
					Game.AppSource.Player.Models.Player.findOne({ id: playerId, select: ['sound'] })
						.then(function (player) {
							var player_sound = player.sound;
							sound.forEach(function (lan, key) {
								// if (key != 0) {
								var isAvilable = false;
								player_sound.forEach(function (p_lan, key) {
									if (lan.id == p_lan) {
										isAvilable = true;
									}
								});
								if (isAvilable) {
									lan.purchased = true;
								} else {
									lan.purchased = false;
								}

								// } else {
								// 	lan.purchased = true;
								// }
							});
							resolve(sound);
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




		// Game.AppSource.Shop.Models.Sound.find(query)
		// .exec((err, sound) => {
		// 	if(err) { console.log(err); return cb(err) }
		// 	return cb(null, sound);
		// })

	},
	getAllSound: function (query, cb) {
		debug('getAllSound function called.');
		Game.AppSource.Shop.Models.Sound.find(query)
			.exec((err, sound) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, sound);
			})

	},
	delete: function (query, cb) {
		debug('Delete function called.');
		Game.AppSource.Shop.Models.Sound.destroy(query)
			.exec((err, sound) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, sound);
			})

	},
	create: function (data) {
		var promise = new Promise(function (resolve, reject) {


			debug('Save Sound function called.');
			Game.AppSource.Shop.Models.Sound.create(data)
				.then(function (sound) {
					resolve(sound);  // Send success response
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
			Game.AppSource.Shop.Models.Sound.update(query, data)
				.then(function (sound) {
					resolve(sound);
				})
				.catch(function (err) {
					reject(err);
				});

		});
		return promise;
	},

	purchasesound: function (playerId, data) {


		var promise = new Promise(function (resolve, reject) {
			debug('purchasesound function called.');
			console.log("purchasesound function called.");
			Game.AppSource.Shop.Models.Sound.findOne({ id: data.sound })
				.then(function (sound) {
					var price = parseInt(sound.gems);

					Game.AppSource.Player.Models.Player.findOne({ id: playerId, select: ['gems', 'sound'] })
						.then(function (player) {
							if (player.gems >= price) {
								var sound = player.sound;
								sound.push(data.sound);
								var gems = parseInt(player.gems) - parseInt(price); 
								Game.AppSource.Player.Models.Player.update({ id: playerId }, { sound: sound,gems:gems })
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
							} else {
								reject(new Error('gems'));
							}
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

	},

	setsound: function (playerId, data) {
		var promise = new Promise(function (resolve, reject) {
			console.log("setsound function called.");
			Game.AppSource.Player.Models.Player.findOne({ id: playerId })
				.then(function (player) {
					var isPurched = false;
					Game.AppSource.Player.Models.Player.update({ id: playerId }, { selected_sound: data.sound_id })
						.then(function (sound) {
							resolve(sound);
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
