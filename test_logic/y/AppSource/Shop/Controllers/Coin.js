var debug = require('debug')('AppSource:Shop:Controller:Coin');

module.exports = {

	getAll: function (playerId, data) {
		debug('getAll function called.');

		var promise = new Promise(function (resolve, reject) {
			Game.AppSource.Shop.Models.Coin.find({})
				.then(function (coin) {
					resolve(coin);

					// Game.AppSource.Player.Models.Player.findOne({ id: playerId, select: ['coin_buy'] })
					// 	.then(function (player) {
					// 		var player_coin = player.coin_buy;
					// 		coin.forEach(function (lan, key) {
					// 			// if (key != 0) {
					// 			var isAvilable = false;
					// 			player_coin.forEach(function (p_lan, key) {
					// 				if (lan.id == p_lan) {
					// 					isAvilable = true;
					// 				}
					// 			});
					// 			if (isAvilable) {
					// 				lan.purchased = true;
					// 			} else {
					// 				lan.purchased = false;
					// 			}

					// 			// } else {
					// 			// 	lan.purchased = true;
					// 			// }
					// 		});
					// 		resolve(coin);
					// 	})
					// 	.catch(function (err) {
					// 		reject(err);
					// 	});
				})
				.catch(function (err) {
					reject(err);
				});
		});
		return promise;



		// Game.AppSource.Shop.Models.Coin.find(query)
		// .exec((err, coin) => {
		// 	if(err) { console.log(err); return cb(err) }
		// 	return cb(null, coin);
		// })

	},
	getAllCoin: function (query, cb) {
		debug('getAllCoin function called.');
		Game.AppSource.Shop.Models.Coin.find(query)
			.exec((err, coin) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, coin);
			})

	},
	delete: function (query, cb) {
		debug('delete function called.');
		Game.AppSource.Shop.Models.Coin.destroy(query)
			.exec((err, coin) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, coin);
			})
	},
	create: function (data) {
		var promise = new Promise(function (resolve, reject) {
			debug('Save Coin function called.');
			Game.AppSource.Shop.Models.Coin.create(data)
				.then(function (coin) {
					resolve(coin);  // Send success response
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
			Game.AppSource.Shop.Models.Coin.update(query, data)
				.then(function (coin) {
					resolve(coin);
				})
				.catch(function (err) {
					reject(err);
				});

		});
		return promise;
	},
	purchasecoin: function (socketData, data) {
		var promise = new Promise(function (resolve, reject) {

			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
			Game.Logger.debug('+ Purchase Coin EVENT RECEIVED +');
			Game.Logger.debug('+ PLAYER ID =', socketData.playerId);
			Game.Logger.debug('+ PURCHASED COIN =', data.coin);
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

			Game.AppSource.Shop.Models.Coin.findOne({ id: data.coin })
				.then(function (coin) {

					var price = coin.gems;
					Game.AppSource.Player.Models.Player.findOne({ id: socketData.playerId })
						.then(function (player) {
							if (player.gems >= price) {

								var coins = parseInt(player.coin) + parseInt(coin.coin);
								var gems = parseInt(player.gems) - parseInt(price); 
								Game.AppSource.Player.Models.Player.update({ id: socketData.playerId }, { coin: coins,gems:gems })
									.then(function (player) {

										Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player[0]['socket_id'],player[0]['id'],player[0]['coin'],player[0]['level'], function (err) { });
					 

										// Game.Io.to(player[0]['socket_id']).emit("coinupdated", {
										// 	playerid: player[0]['id'],
										// 	coin: player[0]['coin'],
										// 	level : player[0]['level']
										// });

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
