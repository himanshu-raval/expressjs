var debug = require('debug')('AppSource:Wheel:Controller:Slice');

module.exports = {
	getSpin: function (query) {
		var promise = new Promise(function (resolve, reject) {
			debug('Get All Spin function called.');
			console.log(query);
			Game.AppSource.Wheel.Models.Slice.find(query)
				.then(function (slices) {
					resolve(slices);
				})
				.catch(function (err) {
					reject(err);
				});
		});
		return promise;
	},
	getSpinWheel: function (playerId) {
		var promise = new Promise(function (resolve, reject) {
			debug('getSpinWheel function called.');
			console.log("getSpinWheel function called." + playerId);
			Game.AppSource.Player.Models.Player.findOne({ id: playerId, select: ['spin'] })
				.then(function (player) {
					var todayDate = new Date().getDate();
					var query = 'free';
					if (player.spin == todayDate) query = 'paid';
					Game.AppSource.Wheel.Models.Slice.find({ type: query })
						.then(function (slices) {
							var spin = {
								spinType: query,
								spinData: slices
							}
							resolve(spin);
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
	update: function (query, data) {
		var promise = new Promise(function (resolve, reject) {
			debug('get function called.');
			Game.AppSource.Wheel.Models.Slice.update(query, data)
				.then(function (slices) {
					if (slices.length > 0) {
						resolve(slices[0]);
					} else {
						reject(Throw('Limit exceeds'));
					}
				})
				.catch(function (err) {
					reject(err);
				});

		});
		return promise;
	},
	create: function (data) {
		var promise = new Promise(function (resolve, reject) {
			debug('get function called.');
			Game.AppSource.Wheel.Models.Slice.find({ type: data.type })
				.then(function (slices) {
					if (slices.length >= 10) {
						reject(Throw('Limit exceeds'));
					} else {
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
	updateRemaining: function (data, userData) {
		var promise = new Promise(function (resolve, reject) {
			todayDate = new Date().getDate();
			Game.AppSource.Wheel.Models.Slice.findOne({ id: data.id })
				.then(function (spin) {
					Game.AppSource.Player.Models.Player.findOne({ id: userData.playerId })
						.then(function (player) {
							player.coin = parseInt(player.coin) + parseInt(spin.value);
							Game.AppSource.Player.Models.Player.update({ id: userData.playerId }, { spin: todayDate , coin : player.coin })
								.then(function (Player) {

									Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(userData.socketId,userData.playerId,player.coin,player.level,function (err) { });


									// Game.Io.to(userData.socketId).emit("coinupdated", {
									// 	playerid: userData.playerId,
									// 	coin: parseInt(player.coin),
									// 	level:  parseInt(player.level)
									// });

									resolve(player.coin);
								})
								.catch(function (err) {
									reject(err);
								});
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

}
