var debug = require('debug')('AppSource:Shop:Controller:Card');

module.exports = {

	getAll: function (playerId, cb) {
		debug('getAll function called.');


		var promise = new Promise(function (resolve, reject) {
			Game.AppSource.Shop.Models.Card.find({})
				.then(function (card) {
					Game.AppSource.Player.Models.Player.findOne({ id: playerId, select: ['card'] })
						.then(function (player) {
							var player_card = player.card;
							card.forEach(function (lan, key) {
								//if (key != 0) {
								var isAvilable = false;
								player_card.forEach(function (p_lan, key) {
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
							resolve(card);
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

		// Game.AppSource.Shop.Models.Card.find(query)
		// .exec((err, card) => {
		// 	if(err) { console.log(err); return cb(err) }
		// 	return cb(null, card);
		// })

	},
	getAllCard: function (query, cb) {
		debug('getAllCard function called.');
		Game.AppSource.Shop.Models.Card.find(query)
			.exec((err, card) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, card);
			})
	},
	delete: function (query, cb) {
		debug('Delete function called.');
		Game.AppSource.Shop.Models.Card.destroy(query)
			.exec((err, card) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, card);
			})

	},
	create: function (data) {
		var promise = new Promise(function (resolve, reject) {
			debug('Save card function called.');
			Game.AppSource.Shop.Models.Card.create(data)
				.then(function (card) {
					resolve(card);  // Send success response
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
			Game.AppSource.Shop.Models.Card.update(query, data)
				.then(function (card) {
					resolve(card);
				})
				.catch(function (err) {
					reject(err);
				});

		});
		return promise;
	},
	purchasecard: function (playerId, data) {


		var promise = new Promise(function (resolve, reject) {
			console.log("purchasecard function called.");
			Game.AppSource.Shop.Models.Card.findOne({ id: data.card })
				.then(function (card) {
					var price = parseInt(card.gems);
					Game.AppSource.Player.Models.Player.findOne({ id: playerId, select: ['gems', 'card'] })
						.then(function (player) {
							if (player.gems >= price) {
								var card = player.card;
								card.push(data.card);
								var gems = parseInt(player.gems) - parseInt(price); 
								Game.AppSource.Player.Models.Player.update({ id: playerId }, { card: card,gems:gems })
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
	setcard: function (playerId, data) {
		var promise = new Promise(function (resolve, reject) {
			console.log("setcard  function called.");

			Game.AppSource.Player.Models.Player.findOne({ id: playerId })
				.then(function (player) {
					var isPurched = false;
					Game.AppSource.Player.Models.Player.update({ id: playerId }, { selected_card: data.card_id })
						.then(function (card) {
							resolve(card);
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
