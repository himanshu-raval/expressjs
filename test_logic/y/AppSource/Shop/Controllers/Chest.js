module.exports = {
	getAll: function (playerId, cb) {
		var promise = new Promise(function (resolve, reject) {
			Game.AppSource.Shop.Models.Chest.find({})
				.then(function (chest) {
					Game.AppSource.Player.Models.Player.findOne({ id: playerId, select: ['chest'] })
						.then(function (player) {
							var player_chest = player.chest;
							chest.forEach(function (lan, key) {
								// if (key != 0) {
								var isAvilable = false;
								player_chest.forEach(function (p_lan, key) {
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
							resolve(chest);
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
		// Game.AppSource.Shop.Models.Chest.find(query)
		// .exec((err, chest) => {
		// 	if(err) { console.log(err); return cb(err) }
		// 	return cb(null, chest);
		// })

	},
	getAllChest: function (query, cb) {
		// debug('getAllChest function called.');
		Game.AppSource.Shop.Models.Chest.find(query)
			.exec((err, chest) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, chest);
			})

	},
	delete: function (query, cb) {

		Game.AppSource.Shop.Models.Chest.destroy(query)
			.exec((err, chest) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, chest);
			})

	},
	create: function (data) {
		var promise = new Promise(function (resolve, reject) {

			Game.AppSource.Shop.Models.Chest.create(data)
				.then(function (chest) {
					resolve(chest);  // Send success response
				})
				.catch(function (err) {
					reject(err); // Send Fails Response
				});

		});
		return promise;
	},
	update: function (query, data) {
		var promise = new Promise(function (resolve, reject) {

			Game.AppSource.Shop.Models.Chest.update(query, data)
				.then(function (chest) {
					resolve(chest);
				})
				.catch(function (err) {
					reject(err);
				});

		});
		return promise;
	},
	purchasechest: function (playerId, data) {
		var promise = new Promise(function (resolve, reject) {
			console.log("Purchase Chest function called.");
			var var_avatar = [];
			var var_avatar_name = "";
			var var_card = [];
			var var_card_name = "";
			var var_chest = [];
			var var_landmark = [];
			var var_landmark_name = "";
			var var_coin = 0;
			var player_coin = 0;
			var var_gems = 0;
			Game.AppSource.Shop.Models.Chest.findOne({ id: data.chest })
				.then(function (chest) {
					var price = parseInt(chest.gems);
					function yourFunction(callback) {
						Game.AppSource.Player.Models.Player.findOne({ id: playerId, select: ['gems', 'chest', 'avatar', 'card', 'landmark','coin'] })
							.then(function (player) {

								if (player.gems >= price) {

									var_gems = parseInt(player.gems) - parseInt(price);
									var_chest = player.chest;
									var_chest.push(data.chest);
									player_coin = parseInt(player.coin); 
									var_avatar = player.avatar;
									var_card = player.card;
									var_landmark = player.landmark;
									Game.AppSource.Shop.Models.Chest.findOne({ id: data.chest })
										.then(function (chest) {
											// var_coin = player.coin + chest.coin;
											Game.AppSource.Shop.Models.Avatar.find({ select: ['id','chance','avatar'] })
												.then(function (avatars) {
													Game.AppSource.Shop.Models.Card.find({ select: ['id','chance','card'] })
														.then(function (cards) {
															Game.AppSource.Shop.Models.Landmark.find({ select: ['id','chance','landmark'] })
																.then(function (landmarks) {
																	
																	if (chest.avatar == 'true') {
																		
																		var avatar_arr = [];
																		var avatar_arr_name = [];
																		var isAvilable = false;
																		avatars.forEach(function(avt){
																			for(i=1;i<=avt.chance;i++){
																				avatar_arr.push(avt.id);
																				avatar_arr_name.push(avt.avatar);
																			}
																		});
																		var rand = Math.floor(Math.random() * 100) + 1;
																		var_avatar.forEach(function(av){
																			if(av == avatar_arr[rand]){
																				isAvilable = true;
																			}
																		});
																		if(!isAvilable){
																			var_avatar.push(avatar_arr[rand]);
																		}
																	
																		var_avatar_name = avatar_arr_name[rand];

																		// var_avatar = avatars.map(function (avatar) {
																		// 	return avatar.id;
																		// });

																	}
																	if (chest.card == 'true') {

																		var card_arr = [];
																		var card_arr_name = [];
																		var isAvilable = false;
																		cards.forEach(function(crd){
																			for(i=1;i<=crd.chance;i++){
																				card_arr.push(crd.id);
																				card_arr_name.push(crd.card);
																			}
																		});
																		var rand = Math.floor(Math.random() * 100) + 1;
																		var_card.forEach(function(cr){
																			if(cr == card_arr[rand]){
																				isAvilable = true;
																			}
																		});

																		if(!isAvilable){
																			var_card.push(card_arr[rand]);
																		}
																		var_card_name = card_arr_name[rand];

																		// var_card = cards.map(function (card) {
																		// 	return card.id;
																		// })
																	}
																	if (chest.landmark == 'true') {

																		var landmark_arr = [];
																		var landmark_arr_name = [];
																		var isAvilable = false;
																		landmarks.forEach(function(lan){
																			for(i=1;i<=lan.chance;i++){
																				landmark_arr.push(lan.id);
																				landmark_arr_name.push(lan.landmark);
																			}
																		});
																		var rand = Math.floor(Math.random() * 100) + 1;

																		var_landmark.forEach(function(le){
																			if(le == landmark_arr[rand]){
																				isAvilable = true;
																			}
																		});

																		if(!isAvilable){
																			var_landmark.push(landmark_arr[rand]);
																		}

																		console.log("var_landmark_name",landmark_arr_name[rand]);

																		var_landmark_name = landmark_arr_name[rand];

																		
																		// var_landmark = landmarks.map(function (landmark) {
																		// 	return landmark.id;
																		// })
																	}
																	var rand = Math.floor((Math.random() * 100) + 1);
																	if(chest.chest_name == 'gold'){
																	
																		if (rand == 1) {
																			var_coin = 1000000; 
																		} else if (rand > 1 && rand < 16) {
																			var_coin = 10000;
																		} else if (rand > 15 && rand < 22) {
																			var_coin = 20000;
																		} else {
																			var_coin = 5000;
																		}

																	}else if(chest.chest_name == 'silver'){
																		if (rand > 0 && rand < 6) {
																			var_coin = 50000; 
																		} else if (rand > 5 && rand < 21) {
																			var_coin = 5000;
																		} else {
																			var_coin = 2500;
																		}


																	}else{ // bronze
																		if (rand > 0 && rand < 6) {
																			var_coin = 20000; 
																		} else if (rand > 5 && rand < 21) {
																			var_coin = 5000;
																		} else {
																			var_coin = 1000;
																		}


																	}


																	callback();
																});
														});
												});
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
					}
					yourFunction(function () {


						player_coin = parseInt(player_coin) + parseInt(var_coin);
						Game.AppSource.Player.Models.Player.update({ id: playerId }, {gems:var_gems, chest: var_chest, avatar: var_avatar, card: var_card, landmark: var_landmark,coin:player_coin })
							.then(function (player) {
								Game.Io.to(player[0]['socket_id']).emit("gemsupdated", {
									playerid: player[0]['id'],
									gems: parseInt(player[0]['gems'])
								});

								Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player[0]['socket_id'],player[0]['id'],player[0]['coin'],player[0]['level'],function (err) { });


								// Game.Io.to(player[0]['socket_id']).emit("coinupdated", {
								// 	playerid: player[0]['id'],
								// 	coin: parseInt(player[0]['coin']),
								// 	level: parseInt(player[0]['level'])
								// });
								

								if(var_avatar_name == undefined){
									var_avatar_name = '';
								}

								if(var_landmark_name == undefined){
									var_landmark_name = '';
								}

								if(var_card_name == undefined){
									var_card_name = '';
								}
								if(var_coin == undefined){
									var_coin = 0;
								}
								

								var result = {
									"avatar" : var_avatar_name,
									"landmark": var_landmark_name,
									"card" : var_card_name,
									'coin' : var_coin
								};

								console.log("result",result); 
								resolve(result);
							 
							})
							.catch(function (err) {
								reject(err);
							});
					})



				})
				.catch(function (err) {
					reject(err);
				});


		});
		return promise;

	}

}
