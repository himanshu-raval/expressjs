var debug = require('debug')('AppSource:Shop:Controller:Landmark');

module.exports = {


	getLandmark: function (query, cb) {
		debug('getLandmark function called.');
		Game.AppSource.Shop.Models.Landmark.findOne(query)
			.exec((err, landmark) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, landmark);
			})

	},
	getAll: function (playerId, data) {
		debug('GetAll Landmark function called.');
		var promise = new Promise(function (resolve, reject) {
			Game.AppSource.Shop.Models.Landmark.find({})
				.then(function (landmark) {
					Game.AppSource.Player.Models.Player.findOne({ id: playerId, select: ['landmark'] })
						.then(function (player) {
							var player_landmark = player.landmark;
							landmark.forEach(function (lan, key) {
								//if (key != 0) {
								var isAvilable = false;
								player_landmark.forEach(function (p_lan, key) {
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
							resolve(landmark);
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
	getAllLandmarkwithcoin: function (playerId, data) {
		debug('getAllLandmarkwithcoin function called.',data);
		var promise = new Promise(function (resolve, reject) {
			Game.AppSource.Shop.Models.Landmark.find({})
				.then(function (landmark) {
					Game.AppSource.Player.Models.Player.findOne({ id: playerId, select: ['landmark','coin'] })
						.then(function (player) {
							var player_landmark = player.landmark;
							
							landmark.forEach(function (lan, key) {
								if(data.gameType == 'sit-and-go'){
									var game_over_coin = (parseInt(lan.coin));  // Max Game Loss Coin for Sit N Go Game.
								}else{
									var game_over_coin = (parseInt(data.gameOverPoint) + 50) * parseInt(lan.coin_per_point);  // Max Game Loss Coin for Coin Game
								}
								//console.log("game_over_coin = ",game_over_coin);
								//console.log("player.coin = ",player.coin);
								var isHave = false;
								if(game_over_coin <= parseInt(player.coin)){
									isHave = true;
								}
								lan.ishavecoin = isHave;

								var isAvilable = false;
								player_landmark.forEach(function (p_lan, key) {
									if (lan.id == p_lan) {
										isAvilable = true;
									}
								});
								if (isAvilable) {
									lan.purchased = true;
								} else {
									lan.purchased = false;
								}

								 
							});
							resolve(landmark);
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
	getAllLandmark: function (query, cb) {
		debug('getAll function called.');

		Game.AppSource.Shop.Models.Landmark.find(query)
			.exec((err, landmark) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, landmark);
			})

	},
	delete: function (query, cb) {
		debug('Delete function called.');
		Game.AppSource.Shop.Models.Landmark.destroy(query)
			.exec((err, landmark) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, landmark);
			})

	},
	create: function (data) {
		var promise = new Promise(function (resolve, reject) {


			debug('Save Landmark function called.');
			Game.AppSource.Shop.Models.Landmark.create(data)
				.then(function (landmark) {
					resolve(landmark);  // Send success response
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
			Game.AppSource.Shop.Models.Landmark.update(query, data)
				.then(function (landmark) {
					resolve(landmark);
				})
				.catch(function (err) {
					reject(err);
				});

		});
		return promise;
	},
	purchaselandmark: function (playerId, data) {


		var promise = new Promise(function (resolve, reject) {
			debug('purchaselandmark function called.');
			console.log("purchaselandmark function called.");
			Game.AppSource.Shop.Models.Landmark.findOne({ id: data.landmark })
				.then(function (landmark) {
					var price = parseInt(landmark.gems);
					Game.AppSource.Player.Models.Player.findOne({ id: playerId, select: ['gems', 'landmark'] })
						.then(function (player) {
							if (player.gems >= price) {
								var landmark = player.landmark;
								landmark.push(data.landmark);
								var gems = parseInt(player.gems) - parseInt(price); 
								Game.AppSource.Player.Models.Player.update({ id: playerId }, { landmark: landmark,gems:gems })
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

	}

}
