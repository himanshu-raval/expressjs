var debug = require('debug')('AppSource:Shop:Controller:Avatar');

module.exports = {
	getAll: function (playerId, data) {
		debug('getAll function called.');
		var promise = new Promise(function (resolve, reject) {
			Game.AppSource.Shop.Models.Avatar.find({})
				.then(function (avatar) {
					Game.AppSource.Player.Models.Player.findOne({ id: playerId, select: ['avatar'] })
						.then(function (player) {
							var player_avatar = player.avatar;
							avatar.forEach(function (lan, key) {
								//if (key != 0) {
								var isAvilable = false;
								player_avatar.forEach(function (p_lan, key) {
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
							resolve(avatar);
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

		// Game.AppSource.Shop.Models.Avatar.find(query)
		// .exec((err, avatar) => {
		// 	if(err) { console.log(err); return cb(err) }
		// 	return cb(null, avatar);
		// })

	},
	getAllAvatart: function (query, cb) {
		debug('getAllAvatart function called.');

		Game.AppSource.Shop.Models.Avatar.find(query)
			.exec((err, avatar) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, avatar);
			})

	},
	delete: function (query, cb) {
		debug('Delete function called.');
		Game.AppSource.Shop.Models.Avatar.destroy(query)
			.exec((err, avatar) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, avatar);
			})

	},
	create: function (data) {
		var promise = new Promise(function (resolve, reject) {
			debug('Save avatar function called.');
			Game.AppSource.Shop.Models.Avatar.create(data)
				.then(function (avatar) {
					resolve(avatar);  // Send success response
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
			Game.AppSource.Shop.Models.Avatar.update(query, data)
				.then(function (avatar) {
					resolve(avatar);
				})
				.catch(function (err) {
					reject(err);
				});

		});
		return promise;
	},
	purchaseavatar: function (playerId, data) {


		var promise = new Promise(function (resolve, reject) {
			console.log("purchaseavatar function called.", data.avatar);
			Game.AppSource.Shop.Models.Avatar.findOne({ id: data.avatar })
				.then(function (avatar) {
					var price = avatar.gems;
					Game.AppSource.Player.Models.Player.findOne({ id: playerId, select: ['gems', 'avatar'] })
						.then(function (player) {
							if (player.gems >= price) {
								var avatar = player.avatar;
								avatar.push(data.avatar);
								var gems = parseInt(player.gems) - parseInt(price); 
								Game.AppSource.Player.Models.Player.update({ id: playerId }, { avatar: avatar,gems:gems})
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
	setavatar: function (playerId, data) {
		var promise = new Promise(function (resolve, reject) {
			console.log("setavatar function called.");
			Game.AppSource.Player.Models.Player.findOne({ id: playerId })
				.then(function (player) {
					var isPurched = false;
					Game.AppSource.Player.Models.Player.update({ id: playerId }, { selected_avatar: data.avatar_id })
						.then(function (avatar) {
							resolve(avatar);
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
