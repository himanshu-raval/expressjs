var ObjectId = require('mongodb').ObjectID

module.exports = {
	searchTable: function (data, callback) {
		// Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(data.playerId,'call_yaniv',1).then(function(data){return;},function(err){return;});
		console.log("Data:", data);
		Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
			.exec(function (err, player) {
				Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
				Game.Logger.debug('+ GAME SEARCH DATA +', data);
				Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
				var tableType = data.type;
				var levelCoin = parseInt(data.levelcoin);
				if (err) {
					Game.Logger.error('Error in player get method')
					return callback(err)
				}
				if (!player) {
					Game.Logger.error('Player not found')
					return callback(new Error('Player not found'))
				}
				data.status = 'waiting'

				if (tableType == 'sit-and-go') {

					if (parseInt(player.coin) < parseInt(levelCoin)) {
						Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
						Game.Logger.debug('+ PLAYER HAVE INSUFFICIENT COIN FOR PLAY GAME IN THIS LEVEL +');
						Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
						return callback(new Error(' PLAYER HAVE INSUFFICIENT COIN FOR PLAY GAME IN THIS LEVEL'));
					}


				} else {
					/**
					 * Check Player Have Minimum Coin
					 */

					var game_over = (parseInt(data.gameOverPoint) + 50) * parseInt(data.coinsperpoint);  // Max Game Loss Coin
					// var game_over =  parseInt(data.gameOverPoint) + 50  ;  // Max Game Loss Coin

					if (parseInt(player.coin) < game_over) {
						Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
						Game.Logger.debug('+ PLAYER HAVE INSUFFICIENT COIN  +');
						Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
						return callback(new Error('Player Have Insufficient Coin'));
					}


				}


				delete data.playerId;
				player.socketid = data.socketId;
				delete data.socketId;
				delete data.levelcoin;
				delete data.coinsperpoint;

				Game.AppSource.Game.Controllers.TableService.getTable(data, function (err, table) {
					if (err) {
						return callback(err)
					}
					if (table) {
						Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
						Game.Logger.debug('+ TABLE FOUND  +');
						Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
						/* check for players to start the game */

						Game.AppSource.Game.Controllers.CoinGame.joinTable(table, player, function (err, table) {
							if (err) {
								return callback(err)
							}

							if (tableType == 'sit-and-go') {

								/**
								 * Subtract Coin form Players Accounts
								 */
								/*

								let beforeCoin = parseInt(player.coin);
								var player_final_point = parseInt(player.coin) - parseInt(levelCoin);

								Game.AppSource.Player.Models.Player.update({ id: player.id }, { coin: player_final_point })
									.then(function (p_data) {

 
										Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player.socketid,player.id,player_final_point,p_data.level,function (err) { }); 


											Game.AppSource.Player.Models.Coinshistory.create({
												player: player.id,
												coins: levelCoin,
												type: 'debit',
												flag: 'Sit N Go Table Charge',
												tableId: table.id,
												beforCoins: beforeCoin,
												afterCoins: player_final_point,
												status: 'success'
											}).exec(function (err, ch) {
											if (err) {
												return callback(err)
											} */
												return callback(null, table);
										/*	})

									})
									.catch(function (err) {
										return callback(err);
										// return err;
									});
								*/

							} else {

								return callback(null, table);
							}




						})
					} else {
						/* 
						If search result is undefined then create new table for the user
						with the given data
						*/

						Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
						Game.Logger.debug('+ CREATE NEW TABLE  +');
						Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

						Game.AppSource.Game.Controllers.TableService.addTable(data, function (err, table) {
							if (err) {
								return callback(err)
							}
							Game.AppSource.Game.Controllers.CoinGame.joinTable(table, player, function (err, table) {
								if (err) {
									return callback(err)
								}

								if (tableType == 'sit-and-go') {

									/**
									 * Subtract Coin form Players Accounts
									 */
									/*
									let beforeCoin = parseInt(player.coin);
									var player_final_point = parseInt(player.coin) - parseInt(levelCoin);

									Game.AppSource.Player.Models.Player.update({ id: player.id }, { coin: player_final_point })
										.then(function (p_data) {
											 

											Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player.socketid,player.id,player_final_point,p_data.level,function (err) { });


											Game.AppSource.Player.Models.Coinshistory.create({
												player: player.id,
												coins: levelCoin,
												type: 'debit',
												flag: 'Sit N Go Table Charge',
												tableId: table.id,
												beforCoins: beforeCoin,
												afterCoins: player_final_point,
												status: 'success'
											}).exec(function (err, ch) {
											if (err) { 
												return callback(err)
											} */
											return callback(null, table);
										/* })
										})
										.catch(function (err) {
											return err;
										});
										*/
								} else {

									return callback(null, table);
								}
							})
						})
					}
				})
			})
	},

	/**
	 *  Play With Friends.
	 */
	playWithFriendsGameStart: function (data, callback) {

		var count = data.ids.length;

		if (count > 3) {
			count = 3;
		}

		console.log("count :", count);

		Game.AppSource.Shop.Models.Landmark.find({}).limit(1)
			.exec((err, landmark) => {
				if (err) { console.log(err); return callback(err) }


				var table_data = {
					callYaniv: data.callYaniv,
					gameOverPoint: data.gameOverPoint,
					playersCount: count + 1,
					level: landmark[0]['id'],
					type: 'sit-and-go'
				};

				player_arr = [];
				player_arr.push(data.playerId);
				for (i = 0; i < count; i++) {
					player_arr.push(data.ids[i]);
				}


				Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
				Game.Logger.debug('+ CREATE BLANK TABLE  +');
				Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');


				/**
				 * Create Blank Table
				 */
				Game.AppSource.Game.Controllers.TableService.addTable(table_data, function (err, table) {
					if (err) {
						return callback(err)
					}
					/**
					 * Add Player's
					 */
					//players_data.forEach(function (ply, key) {



					for (i = 0; i < player_arr.length; i++) {

						Game.AppSource.Player.Models.Player.findOne({ id: player_arr[i] })
							.exec(function (err, player) {
								if (err) {
									return callback(err)
								}
								var friends = player.friends;
								if (player.id == data.playerId) {
									friends.forEach(function (frd) {
										frd.status = 'friend';
									});
								}

								
								if(Game.Io.sockets.connected[player.socket_id] != undefined){
									Game.Io.sockets.connected[player.socket_id].join(table.id); // Join Player in Table
								}
								

								player.gametype = 'play-with-friends';
								player.socketid = player.socket_id;
								Game.AppSource.Game.Controllers.CoinGame.joinTable(table, player, function (err, table) {
									if (err) {
										return callback(err);
									}
									var levelCoin = 500; // Default 500 Coin for Game Play. //landmark[0]['coin']; // for Temp set coin value for london

									var player_final_point = parseInt(player.coin) - parseInt(levelCoin);

									Game.AppSource.Player.Models.Player.update({ id: player.id }, { coin: player_final_point, friends: friends })
										.then(function (p_data) {
											/**
											* When Player coin Updated
											*/
											Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player.socket_id,player.id,player_final_point,p_data.level,function (err) { });


											// return callback(null, table);
										})
										.catch(function (err) {
											return callback(err);
											// return err;
										});


								});

							});
					}

					return callback(null, table);
				});


				//});


			});







	},
	joinTable: function (table, player, callback) {


		var p_avatar = '', p_card = '', p_sound = '';

		console.log("Game Type :", player.gametype);

		// if(player.selected_avatar == '' || player.selected_avatar == null){
		// 	player.selected_avatar = '1234';
		// }
		// if(player.selected_card == '' || player.selected_card == null){
		// 	player.selected_card = '1234';
		// }


		Game.AppSource.Shop.Models.Avatar.findOne({ id: player.selected_avatar })
			.exec((err, avatar) => {
				if (err) {
					return callback(err);
				}
				if (avatar) {
					p_avatar = avatar.avatar;
				}
				Game.AppSource.Shop.Models.Card.findOne({ id: player.selected_card })
					.exec((err, card) => {
						if (err) {
							return callback(err);
						}
						if (card) {
							p_card = card.card;
						}
						player.avatar = p_avatar;
						player.card = p_card;

						table.addPlayer(player, function (err, table) {
							if (err) {
								return callback(err);
							}
							table.playersTotal = parseInt(table.playersTotal) + 1; // Add 1 when Player Join Table
							Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
								if (err) {
									return callback(err);
								}
								return callback(null, table)
							})
						});

					});
			});





	},

	defaultAction: function (id) {
		Game.Logger.debug('defaultAction', id);
		Game.AppSource.Game.Controllers.TableService.getTable({ id: id }, function (err, table) {


			if (table.playersTotal == 0) {
				console.log("Game Player Zero");
				return 'No Players Found';
			}

			if (table.status == 'FINISHED') {
				console.log("Game Finshed");
				return 'Game FINISHED';
			}


			// Game.Logger.info('Default action performed for the player : ' + table.currentTurn)
			var player = table.getCurrentPlayer();
			if(!player){
				console.log("Player Not Found for Default Turn");
				return 'No Players Found';
			}

			var player_id = player.id;
			var player_username = player.username;

			if (player.robotcount == 2) {

				// console.log("Robocount Name : ", player_username);

				var players = table.players;
				var loser = [];
				var left_playerId = player.socketid;
				
				players.forEach(function (ply, key) {
					if (ply.id == player.id) {
					
						players.splice(key, 1); // Remove Player
						loser = ply;
						table.losers.push(ply);
						table.playersTotal = parseInt(table.playersTotal) - 1;
						if (table.playersTotal == table.currentTurn) {
							table.currentTurn = 0
						}
					}

				})

				Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
					if (err) { return }
					Game.Io.to(table.id).emit('GamePlayerLeft', { leftId: player_id, leftName: player_username, playersTotal: table.playersTotal, isGamePlay: true })
					Game.Io.sockets.connected[left_playerId]?Game.Io.sockets.connected[left_playerId].leave(table.id):''; // Remove Player Socket from Table.
					clearTimeout(Game.Timers[table.id]);
					if (table.playersTotal == 1 || table.playersTotal == 0) { // Game Over 
						clearTimeout(Game.Timers[table.id]);
						//console.log("Player Single", table)
						//console.log("playersTotal "+table.playersTotal);
						table.status = 'FINISHED';
						if(table.players.length == 0){
							console.log("Single Player Found But Player Not Found! 1");
							return 'No Players Found';
						}
						if (table.players[0] == undefined) {
							console.log("Single Player Found But Player Not Found! 2");
							return 'No Players Found';
						}
						if (table.players[0].id == undefined) {
							console.log("Single Player Found But Player Not Found! 3");
							return 'No Players Found';
						}
						console.log("table.players[0].id=" + table.players[0].id);
						var player = table.getPlayer(table.players[0].id);

						/**
						 *  Get Player Socket ID.
						 */
						var playerSocketId = '';
						for (let sid in Game.Io.engine.clients) {
							console.log(Game.Io.engine.clients[sid]._userData)
							if (player.id == Game.Io.engine.clients[sid]._userData.playerId) {
								playerSocketId = Game.Io.engine.clients[sid]._userData.socketId;
							}
						}


						player.callYanivCall(playerSocketId, function (err, table) {
							if (err) { return }
							Game.Logger.debug(table.status);
							Game.Logger.debug('GameGameFinished', table.id);
							var point = table.game.point;
							var winner = table.players[0];
							//console.log("Player one ",table.players);
							for (let key in table.players) {
								winner = table.players[key]
							}
							Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
								if (err) { return }
								clearTimeout(Game.Timers[table.id]);
							})
							// Game.Io.to(table.id).emit('GameGameFinished', { winnerId: winner.id,winnerName: winner.username })

						});
					} else { // Game continue
						//console.log("playersCount More = "+table.playersTotal);
						Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
							if (err) { return }
							var players = [];
							table.players.forEach(function (ply) {
								players.push({
									id: ply.id,
									username: ply.username,
									level: ply.level,
									hand: ply.hand
								})
							});
							var result = {
								PlayerId: null,
								OpenDeck: false,
								OpenDeckCardsPosition: [],
								PlayerCardsPosition: [],
								currentTurn: table.currentTurn,
								lastTurnCards: table.toJson().game.lastTurnCards,
								players: players
							};
							Game.Io.to(table.id).emit('GameActions', result);
							//Game.Io.to(table.id).emit('GameActionPerformed', table.toJson())
							clearTimeout(Game.Timers[id]);
							Game.Timers[id] = setTimeout(Game.AppSource.Game.Controllers.CoinGame.defaultAction, 10000, id);
						})
					}
				})
				// })
			} else {

				/**
				 * Players Crads Positions
				 */
				// var cardActions = { PlayerId: player.id, OpenDeck: false, OpenDeckCardsPosition: [], PlayerCardsPosition: [player.hand.cards.length - 1] };
				// Game.Io.to(table.id).emit('GameCardsActions', cardActions);


				player.robotcount = player.robotcount + 1; // Count Ideal Movement
				// var hand = [player.hand.highCard()];
				player.swipeWithDeck(player.hand.highCard());
				console.log("Curent turn : ", table.currentTurn);

				table.currentTurn = parseInt(table.currentTurn) + 1;

				if (table.currentTurn == table.playersTotal) {
					table.currentTurn = 0
				}
				console.log("Curent turn : ", table.currentTurn);
				Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
					if (err) { return }

					var players = [];
					table.players.forEach(function (ply) {
						players.push({
							id: ply.id,
							username: ply.username,
							level: ply.level,
							hand: ply.hand
						})
					});
					var result = {
						PlayerId: player.id,
						OpenDeck: false,
						OpenDeckCardsPosition: [],
						PlayerCardsPosition: [player.hand.cards.length - 1],
						currentTurn: table.currentTurn,
						lastTurnCards: table.toJson().game.lastTurnCards,
						players: players
					};
					// 	console.log("Players :",players);
					Game.Io.to(table.id).emit('GameActions', result);
					//Game.Io.to(table.id).emit('GameActionPerformed', table.toJson())
					clearTimeout(Game.Timers[id]);
					Game.Timers[id] = setTimeout(Game.AppSource.Game.Controllers.CoinGame.defaultAction, 10000, id);
				})
			}
		});
	},
	playerAction: function (socketData, data, callback) {
		Game.AppSource.Game.Controllers.TableService.getTable({ id: data.tableId }, function (err, table) {
			if (err) { return callback(err) }
			var player = table.getCurrentPlayer();
			if (Game.Timers[table.id]._called) {
				return callback(new Error('It is not your turn. Turn is expire'))
			}

			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
			Game.Logger.debug('+ DATA +', data);
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

			if(!player){
				return callback(new Error('it seems game is not running'));
			}

			if (player.id == data.playerId) {
				Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
				Game.Logger.debug('+ CURRENT PLAYER TURN +');
				Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
				/**
				 * Players Crads Positions
				 */
				//console.log("Player Data :",data);
				// var cardActions = { PlayerId: data.playerId, OpenDeck: false, OpenDeckCardsPosition: [], PlayerCardsPosition: [] };

				// if (data.cardsPicked != undefined && data.cardsDroped != undefined) {
				// 	cardActions['OpenDeck'] = true;

				// }
				// if (data.cardsPicked != undefined) {
				// 	data.cardsPicked.forEach(function (card) {
				// 		cardActions['OpenDeckCardsPosition'].push(card.OpenDeckCardsPosition)
				// 	});


				// }
				// if (data.cardsDroped != undefined) {
				// 	data.cardsDroped.forEach(function (card) {
				// 		cardActions['PlayerCardsPosition'].push(card.PlayerCardsPosition)
				// 	});
				// }


				// console.log("GameCardsActions :",cardActions);
				// Game.Io.to(table.id).emit('GameCardsActions', cardActions);



				clearTimeout(Game.Timers[table.id]);
				console.log('=====================================')
				console.log('data.cardsDroped',data.cardsDroped)
				console.log('data.cardsPicked',data.cardsPicked)
				console.log('=====================================')
				if (data.cardsPicked && data.cardsPicked.length > 0) {
					var cards = [];
					var card_rank = 0;
					var cards_arr = [];
					data.cardsDroped.forEach(function (card) {
						cards.push(new Game.AppSource.Game.Controllers.Card(card.rank, card.suite))
						card_rank += (card.rank == 'A') ? 1 :(card.rank == 'T' || card.rank == 'J' || card.rank == 'Q' || card.rank == 'K') ? 10 : parseInt(card.rank);
						cards_arr.push(card_rank);  // Push Rank in Array for check Cards Sequances
					})
					/**
					 * Check Card Droped Rank sum
					 */
					console.log('=====================================')
					console.log('data.cardsDroped card_rank',card_rank)
					console.log('=====================================')
					if (card_rank >= 35) {
						Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(data.playerId, 'throw_down_35_or_more_points_in_1_turn', 1).then(function (data) { return; }, function (err) { return; });
					}
					if (data.cardsDroped.length == 3) {
						Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(data.playerId, 'throw_down_3_of_a_kind', 1).then(function (data) { return; }, function (err) { return; });
					}
					if (data.cardsDroped.length == 4) {
						Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(data.playerId, 'throw_down_4_of_a_kind', 1).then(function (data) { return; }, function (err) { return; });
					}
					/**
					 * Throw a 4/5 card straight down
					 */
					if (data.cardsDroped.length == 4 || data.cardsDroped.length == 5) {
						cards_arr.sort();
						var min_val = cards_arr[0] + 1;
						var isStraight = true;
						for (var i = 1; i < cards_arr.length; i++) {
							if (cards_arr[i] != min_val) {
								isStraight = false;
							}
							min_val++;
						}
						if (isStraight) {
							if (data.cardsDroped.length == 4) {
								Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(data.playerId, 'throw_4_card_straight_down', 1).then(function (data) { return; }, function (err) { return; });
							}
							if (data.cardsDroped.length == 5) {
								Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(data.playerId, 'throw_5_card_straight_down', 1).then(function (data) { return; }, function (err) { return; });
							}
						}
					}


					player.swipeWithBoard(cards, new Game.AppSource.Game.Controllers.Card(data.cardsPicked[0].rank, data.cardsPicked[0].suite));
					table.currentTurn = parseInt(table.currentTurn) + 1;
					if (table.currentTurn == table.playersTotal) {
						table.currentTurn = 0
					}

					player.robotcount = 0; // Set Ideal Movement to 0

					Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
						if (err) { return }

						var players = [];
						table.players.forEach(function (ply) {
							players.push({
								id: ply.id,
								username: ply.username,
								level: ply.level,
								hand: ply.hand
							})
						});


						var result = {
							PlayerId: player.id,
							OpenDeck: false,
							OpenDeckCardsPosition: [],
							PlayerCardsPosition: [], //player.hand.cards.length - 1
							currentTurn: table.currentTurn,
							lastTurnCards: table.toJson().game.lastTurnCards,
							players: players
						};

						if (data.cardsPicked != undefined && data.cardsDroped != undefined) {
							result['OpenDeck'] = true;

						}
						if (data.cardsPicked != undefined) {
							data.cardsPicked.forEach(function (card) {
								result['OpenDeckCardsPosition'].push(card.OpenDeckCardsPosition)
							});


						}
						if (data.cardsDroped != undefined) {
							data.cardsDroped.forEach(function (card) {
								result['PlayerCardsPosition'].push(card.PlayerCardsPosition)
							});
						}

						//console.log(result);

						Game.Io.to(table.id).emit('GameActions', result);

						// Game.Io.to(table.id).emit('GameActionPerformed', table.toJson())
						clearTimeout(Game.Timers[table.id]);
						Game.Timers[table.id] = setTimeout(Game.AppSource.Game.Controllers.CoinGame.defaultAction, 10000, table.id);
						return callback(null, table)
					})
				} else {



					var cards = [];
					data.cardsDroped.forEach(function (card) {
						cards.push(new Game.AppSource.Game.Controllers.Card(card.rank, card.suite))
					})
					player.swipeWithDeck(cards);
					table.currentTurn = parseInt(table.currentTurn) + 1;
					if (table.currentTurn == table.playersTotal) {
						table.currentTurn = 0
					}

					player.robotcount = 0; // Set Ideal Movement to 0

					Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
						if (err) { return }

						var players = [];
						table.players.forEach(function (ply) {
							players.push({
								id: ply.id,
								username: ply.username,
								level: ply.level,
								hand: ply.hand
							})
						});

						var result = {
							PlayerId: player.id,
							OpenDeck: false,
							OpenDeckCardsPosition: [],
							PlayerCardsPosition: [], // player.hand.cards.length - 1
							currentTurn: table.currentTurn,
							lastTurnCards: table.toJson().game.lastTurnCards,
							players: players
						};

						if (data.cardsPicked != undefined && data.cardsDroped != undefined) {
							result['OpenDeck'] = true;

						}
						if (data.cardsPicked != undefined) {
							data.cardsPicked.forEach(function (card) {
								result['OpenDeckCardsPosition'].push(card.OpenDeckCardsPosition)
							});


						}
						if (data.cardsDroped != undefined) {
							data.cardsDroped.forEach(function (card) {
								result['PlayerCardsPosition'].push(card.PlayerCardsPosition)
							});
						}

						Game.Io.to(table.id).emit('GameActions', result);

						//Game.Io.to(table.id).emit('GameActionPerformed', table.toJson())
						clearTimeout(Game.Timers[table.id]);
						Game.Timers[table.id] = setTimeout(Game.AppSource.Game.Controllers.CoinGame.defaultAction, 10000, table.id);
						return callback(null, table)
					})
				}
			} else {

				if (data.isSlapDown) {
					/**
					 * When SlapDown Occure.
					 */

					var player = table.getPlayer(data.playerId);

					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					Game.Logger.debug('+ SLAP DOWN +');
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');


					//var cardActions = { PlayerId: data.playerId, OpenDeck: false, OpenDeckCardsPosition: [], PlayerCardsPosition: [] };

					// if (data.cardsPicked != undefined && data.cardsDroped != undefined) {
					// 	cardActions['OpenDeck'] = true;

					// }
					// if (data.cardsPicked != undefined) {
					// 	data.cardsPicked.forEach(function (card) {
					// 		cardActions['OpenDeckCardsPosition'].push(card.OpenDeckCardsPosition)
					// 	});


					// }
					// if (data.cardsDroped != undefined) {
					// 	data.cardsDroped.forEach(function (card) {
					// 		cardActions['PlayerCardsPosition'].push(card.PlayerCardsPosition)
					// 	});
					// }

					// console.log("GameCardsActions :",cardActions);
					// Game.Io.to(table.id).emit('GameCardsActions', cardActions);
					// clearTimeout(Game.Timers[table.id]);

					if (data.cardsPicked && data.cardsPicked.length > 0) {
						var cards = [];
						var card_rank = 0;
						var cards_arr = [];
						data.cardsDroped.forEach(function (card) {
							cards.push(new Game.AppSource.Game.Controllers.Card(card.rank, card.suite))
							card_rank += card.rank == 'A' ? 1 : card.rank;
							card_rank += (card.rank == 'T' || card.rank == 'J' || card.rank == 'J' || card.rank == 'K') ? 10 : card.rank;
							cards_arr.push(card_rank);  // Push Rank in Array for check Cards Sequances
						})

						player.swipeWithBoard(cards, new Game.AppSource.Game.Controllers.Card(data.cardsPicked[0].rank, data.cardsPicked[0].suite));

						player.robotcount = 0; // Set Ideal Movement to 0

						Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
							if (err) { return }

							var players = [];
							table.players.forEach(function (ply) {
								players.push({
									id: ply.id,
									username: ply.username,
									level: ply.level,
									hand: ply.hand
								})
							});

							var result = {
								PlayerId: player.id,
								OpenDeck: false,
								OpenDeckCardsPosition: [],
								PlayerCardsPosition: [player.hand.cards.length - 1],
								currentTurn: table.currentTurn,
								lastTurnCards: table.toJson().game.lastTurnCards,
								players: players
							};

							if (data.cardsPicked != undefined && data.cardsDroped != undefined) {
								result['OpenDeck'] = true;

							}
							if (data.cardsPicked != undefined) {
								data.cardsPicked.forEach(function (card) {
									result['OpenDeckCardsPosition'].push(card.OpenDeckCardsPosition)
								});


							}
							if (data.cardsDroped != undefined) {
								data.cardsDroped.forEach(function (card) {
									result['PlayerCardsPosition'].push(card.PlayerCardsPosition)
								});
							}



							Game.Io.to(table.id).emit('GameActions', result);




							//Game.Io.to(table.id).emit('GameActionPerformed', table.toJson())
							//clearTimeout(Game.Timers[table.id]);
							//Game.Timers[table.id] = setTimeout(Game.AppSource.Game.Controllers.CoinGame.defaultAction, 10000, table.id);
							return callback(null, table)
						})
					}


				} else {
					return callback(new Error('It is not your turn. 1'))
				}




			}
		})
	},

	callYaniv: function (socketData, data, callback) {
		Game.AppSource.Game.Controllers.TableService.getTable({ id: data.tableId }, function (err, table) {
			if (err) {
				return callback(err)
			}
			var player = table.getCurrentPlayer();
			if (player.id == data.playerId) {
				Game.Logger.debug('callYaniv ', table.id)
				clearTimeout(Game.Timers[table.id]);
				var cards = [];
				player.callYaniv(socketData.socketId, function (err, table) {
					if (err) { return callback(err) }
					Game.Logger.debug(table.status);
					if (table.status == 'FINISHED') {
						// Game.Logger.debug('GameGameFinished',table.id);
						var point = table.game.point;
						var players = table.players;
						var winner = table.players[0];
						// players.forEach(function(player,key){
						//     point.forEach(function(point,key){

						//     })
						// })
						Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
							if (err) { return }
							clearTimeout(Game.Timers[table.id]);
							return callback(null, {})
						})
					} else {

						console.log("==============================================");
						console.log("Players Total =", table.playersTotal);
						console.log("==============================================");
						if ((table.playersTotal == 1 || table.playersTotal == 0) && table.type == 'sit-and-go') { // Game Over 

							table.status = 'FINISHED';
							var player = table.getPlayer(table.players[0].id);
							player.callYanivCall(socketData.socketId, function (err, table) {
								if (err) { return }
								Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
									if (err) { return }
									console.log("==============================================");
									console.log("Sit-N-Go Game Over");
									console.log("Single Player Left So Game Over");
									console.log("==============================================");
									clearTimeout(Game.Timers[table.id]);
									return callback(null, {})
								})

							});
						} else if ((table.playersTotal == 1 || table.playersTotal == 0) && table.type == 'tournament') {

							table.status = 'FINISHED';
							var player = table.getPlayer(table.players[0].id);
							player.callYanivCall(socketData.socketId, function (err, table) {
								if (err) { return }
								Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
									if (err) { return }
									console.log("==============================================");
									console.log(" + Tournament Game Over + ");
									console.log(" + Single Player Left So Game Over + ");
									console.log("==============================================");
									clearTimeout(Game.Timers[table.id]);
									return callback(null, {})
								})

							});

						} else {
							//Game.Io.to(table.id).emit('GameRoundFinished', table.toJson())
							var point = [];
							table.game.point.forEach(function (pnt) {
								point.push({
									id: pnt.id,
									point: pnt.point
								});
							});
							var result = {
								point: point
							};
							Game.Io.to(table.id).emit('GameRoundFinished', result);
							// clearTimeout(Game.Timers[table.id]);
							// Game.Timers[table.id] = setTimeout(Game.AppSource.Game.Controllers.CoinGame.defaultAction,10000, table.id);
							return callback(null, {});

						}
					}
				});
			} else {
				return callback(new Error('It is not your turn. 2'))
			}
		})
	},
	playerLeft: function (socketData, data, callback) {



		Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
		Game.Logger.debug('+ PLAYER LEFT +');
		Game.Logger.debug('+ DATA =', data);
		Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');


		Game.AppSource.Game.Controllers.TableService.getTable({ id: data.tableId }, function (err, table) {
			if (err) {
				return callback(err)
			}

			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
			Game.Logger.debug('+ TABLE STATUS =' + table.status);
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

			if (table.playersTotal == 0) {
				Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
				Game.Logger.debug('+ PLAYER COUNT ZERO SO RETURN');
				Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
				return callback(new Error('No Players Found'));
			}

			if (table.status == 'FINISHED') {
				Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
				Game.Logger.debug('+ GAME ALREADY FINISED SO RETURN');
				Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
				return callback(new Error('Game Already Finished'));
			}


			if (table.status == 'waiting') {
				var player = table.getPlayer(data.playerId);

				if ((!player) || player.id == undefined || player.id == null) {
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					Game.Logger.debug('+ GAME WAITING - PLAYER NOT NOT FOUND SO RETURN');
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					return callback(new Error('No Players Found'));
				}


				var players = table.players;
				var player_id = player.id;
				var player_username = player.username;
				// var key = 0;
				
				players.forEach(function (ply, key) {
					if (ply.id == player.id) {
						//var lsr = players.slice(key, key + 1);
						
						players.splice(key, 1); // Remove Player
						table.playersTotal = parseInt(table.playersTotal) - 1;
					}
					// key++;
				})
				Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
					if (err) { return }
					Game.Io.to(table.id).emit('GamePlayerLeft', { leftId: player_id, leftName: player_username, playersTotal: table.playersTotal, isGamePlay: false })
					return callback(null, table)
				})
			} else if (table.status == 'IN_PROGRESS' && table.currentTurn == null) {

				Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
				Game.Logger.debug('+ GAME STARTED - BUT CURRENT TURN IS NULL');
				Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');


				clearTimeout(Game.Timers[table.id]);
				// console.log("BEFORE GAME",table);

				var player = table.getPlayer(data.playerId);
				var players = table.players;
				var loser = [];
				// var key = 0;
				var player_id = player.id;
				var player_username = player.username;
				var isSitandGo = false;

				if (table.type == 'sit-and-go') {
					isSitandGo = true;
				}
			
				players.forEach(function (ply, key) {
					if (ply.id == player.id) {
						//var lsr = players.slice(key, key + 1);
						
						players.splice(key, 1); // Remove Player
						table.losers.push(ply)
						table.playersTotal = table.playersTotal - 1;
					}
					// key++;
				})
				Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
					if (err) { return }


					Game.Io.to(table.id).emit('GamePlayerLeft', { leftId: player_id, leftName: player_username, playersTotal: table.playersTotal, isGamePlay: true })

					// console.log("After Player Left Table : ",table);
					if (table.playersTotal == 1) { // Game Over

						clearTimeout(Game.Timers[table.id]);
						table.status = 'FINISHED';
						var player = table.getPlayer(table.players[0].id);
						// Game.Logger.debug('GameGameFinished',table.id);
						var winner = table.players[0];
						for (let key in table.players) {
							winner = table.players[key]
						}

						// table.game.status = 'FINISHED';
						table.status = 'FINISHED';
						Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
							if (err) { return }


							Game.AppSource.Shop.Controllers.Landmark.getAllLandmark({}, function (err, landmark) {
								if (err) {
									return;
								}


								var sit_n_go_final_point = 0;
								var point_per_coin = 1;
								var selected_landmark = table.level;
								var selected_landmark_name = '';

								landmark.forEach(function (land, key) {
									if (land.id == table.level) {
										point_per_coin = land.coin_per_point;

										if (isSitandGo == true) {
											sit_n_go_final_point = parseInt(land.coin) * parseInt(table.playersCount);
										}

									}
								})


								Game.AppSource.Player.Models.Player.findOne({ id: winner.id })
									.then(function (ply) {

										if (isSitandGo == true) {
											var player_final_point = parseInt(ply.coin) + parseInt(sit_n_go_final_point);
										} else {
											var player_final_point = parseInt(ply.coin);
										}
										Game.AppSource.Player.Models.Player.update({ id: winner.id }, { coin: player_final_point })
											.then(function (p_data) {

												if (socketData.socketId != null) {

													Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(socketData.socketId,winner.id,player_final_point,p_data.level,function (err) { });


												}


												Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
												Game.Logger.debug('+ GAME FINISED - ON START GAME +');
												Game.Logger.debug('+ TABLE STATUS =' + table.status);
												Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

												if (isSitandGo == true) {
													Game.Io.to(table.id).emit('GameFinished', { winnerId: winner.id, winnerName: winner.username, coin: sit_n_go_final_point, loser_point: [] });
												} else {
													Game.Io.to(table.id).emit('GameFinished', { winnerId: winner.id, winnerName: winner.username, coin: 0, loser_point: [] });
												}




												clearTimeout(Game.Timers[table.id]);
												return callback(null, table);
											})
											.catch(function (err) {
												return err;
											})
									})
									.catch(function (err) {
										return err;
									})
							});
						});

					} else {
						// Game.Io.to(table.id).emit('GameActionPerformed', table.toJson());
						Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
						Game.Logger.debug('+ RESTART TURN +');
						Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
						clearTimeout(Game.Timers[table.id]);
						console.log("Here Restart Turn");
						Game.Timers[table.id] = setTimeout(function (table) {
							table.emit('StartTurn')
						}, 5000, table);
					}
				})




			} else {   // When Game Started and Player Left


				var player = table.getPlayer(data.playerId);

				if (player == undefined || player.id == undefined || player.id == null) {
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					Game.Logger.debug('+ GAME STARTED - PLAYER NOT NOT FOUND SO RETURN');
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					return callback(new Error('No Players Found'));
				}


				var players = table.players;
				var loser = [];
				//var key = 0;
				var player_id = player.id;
				var player_username = player.username;
				 
				players.forEach(function (ply, key) {
					if (ply.id == player.id) {
						// var lsr = players.slice(key, key + 1);
						
						players.splice(key, 1); // Remove Player
						table.losers.push(ply)

						table.playersTotal = table.playersTotal - 1;
						// table.currentTurn = parseInt(table.currentTurn) + 1;

						if (key > table.currentTurn) {
							table.currentTurn = parseInt(table.currentTurn) + 1;
						}
						if (table.currentTurn == table.playersTotal) {
							table.currentTurn = 0
						}

					}
					// key++;
				})

				Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
					if (err) { return }
					Game.Io.to(table.id).emit('GamePlayerLeft', { leftId: player_id, leftName: player_username, playersTotal: table.playersTotal, isGamePlay: true })

					if (table.playersTotal == 1) { // Game Over

						Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
						Game.Logger.debug('+ PLAYER LEFT - ONE PLAYER FOUND SO GAME OVER +');
						Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

						clearTimeout(Game.Timers[table.id]);
						table.status = 'FINISHED';
						var player = table.getPlayer(table.players[0].id);
						// player.callYanivCall(socketData.socketId, function (err, table) {
						player.callYanivCall(player.socketid, function (err, table) {
							if (err) { return }
							Game.Logger.debug(table.status);
							//Game.Logger.debug('GameGameFinished',table.id);
							var point = table.game.point
							var winner = table.players[0];
							for (let key in table.players) {
								winner = table.players[key]
							}

							Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
								if (err) { return }
								//	Game.Io.to(table.id).emit('GameGameFinished', { winnerId: winner.id,winnerName: winner.username, tableId: table.id })
								clearTimeout(Game.Timers[table.id]);
								return callback(null, table)
							})

						});
					} else { // Game continue

						//Game.AppSource.Game.Controllers.TableService.updateTable(table, function(err, table){
						//	if(err){return}
						Game.Io.to(table.id).emit('GameActionPerformed', table.toJson())
						clearTimeout(Game.Timers[table.id]);
						Game.Timers[table.id] = setTimeout(Game.AppSource.Game.Controllers.CoinGame.defaultAction, 10000, table.id);
						// })
					}
				})
			}
		})
	},
	/**
	 *  Score Board
	 */

	gameScoreBoard: function (data, callback) {
		Game.AppSource.Game.Controllers.TableService.getTable({ id: data.tableId }, function (err, table) {
			if (err) {
				return callback(err)
			}

			if (table.status != 'waiting') {



				var point = table.game.point;
				Game.AppSource.Player.Models.Player.find({})
					.then(function (player) {
						player.forEach(function (play) {
							point.forEach(function (pnt) {
								if (pnt.id == play.id) {
									pnt.name = play.username;
									pnt.avatar = play.selected_avatar;
								}

							})
						})

						return callback(point);
					})
					.catch(function (err) {
						return err;
					})
			} else {
				return callback(new Error('Game on Waiting Stage'));
			}
		})
	},



	playerusernamechange : function (data, callback) {
		Game.AppSource.Player.Models.Player.native(function (err, playerObj) {
			Game.AppSource.Player.Models.Player.find({appId:{'!':null}}).then(function(players){
				players.forEach(function(plr){
					if (plr.username.indexOf(plr.appId) >= 0){
						console.log("Player befores :",plr.username);
						let username = plr.username.replace(plr.appId,'');
						console.log("Player After :",username);
						playerObj.update({ "_id": new ObjectId(plr.id) },
						{ $set: { 'username' : username } },
						function (err, plr) {
							if (err) {
								console.log(err);
							} 
						});


					}
				})
			}).catch(function (err) {
				reject(err);
			});
		});
	},

	/*
		Player  Statistics Update When Player Do Some Event.
	*/
	PlayerStatisticsUpdate: function (playerId, field, value) {


		var updated_statistics = 0;
		var promise = new Promise(function (resolve, reject) {
			// For Native Save Data
			Game.AppSource.Player.Models.Player.native(function (err, playerObj) {

			Game.AppSource.Player.Models.Player.findOne({ id: playerId })
				.then(function (player) {
					console.log("Field ::: ",field);
					console.log("value",value);
					if (field == 'best_match_score' || field == 'average_hand_score' || field == 'locations_played' || field == 'game_playing_time') {
						if (field == 'locations_played') {
							
							if(!player.statistics.locations[value]){ // check if Already Avilable
								let query_field = `statistics.locations.${value}`;
								playerObj.update({ "_id": new ObjectId(playerId) },
								{ $set: { [query_field] :  0 } },
								function (err, plr) {
									if (err) {
										console.log(err);
										reject(err);
									} else {
										resolve(player);
									}
								});
							}
						}else if(field == 'game_playing_time'){
							if(value == 0){
								value = 1;
							}
							
							let shortest_game_rounds = parseInt(player.statistics['shortest_game_rounds']);
							if(shortest_game_rounds == 0){
								shortest_game_rounds = 1;
							}
						
							let longest_game_rounds = parseInt(player.statistics['longest_game_rounds']);
							if(longest_game_rounds == 0){
								longest_game_rounds = 1;
							}
							if (parseInt(longest_game_rounds) > parseInt(value)) {
								shortest_game_rounds = parseInt(value);
							}
							if (parseInt(longest_game_rounds) < parseInt(value)) {
								longest_game_rounds = parseInt(value);
							}

							
							playerObj.update({ "_id": new ObjectId(playerId) },
							{ $set: { 'statistics.shortest_game_rounds' :shortest_game_rounds , 'statistics.longest_game_rounds' : longest_game_rounds } },
							function (err, data) {
								if (err) {
									console.log(err);
									reject(err);
								} else {
									console.log(data.result);
									resolve(player);
								}
							});


						} else {
							if (parseInt(player.statistics[field]) < parseInt(value)) {
							let	query_field = `statistics.${field}`;
								playerObj.update({ "_id": new ObjectId(playerId) },
								{ $set: { [query_field] :  value } },
								function (err, data) {
									if (err) {
										console.log(err);
										reject(err);
									} else {
										console.log(data.result);
										resolve(player);
									}
								});
							}
						}
					} else {
						// if (player.statistics[field] == 0) { // Remove If for Start Multiple Acchivment
							player.statistics[field] = parseInt(player.statistics[field]) + 1; // Add +1 to statstics Count.
 							Game.AppSource.Achievement.Models.Achievement.find({ action_on: field })
								.exec(function (err, achievements) {
									// Update Player xp When win Game.
									let location_id = value;
									value = 1;
									if (field == 'game_won') {
										player.xp = parseInt(player.xp) + 20;
										var xp_obj = [{
											min: 1,
											max: 50,
											level: 1
										}, {
											min: 51,
											max: 100,
											level: 2
										}, {
											min: 101,
											max: 200,
											level: 3
										}, {
											min: 201,
											max: 400,
											level: 4
										}, {
											min: 401,
											max: 800,
											level: 5
										}, {
											min: 801,
											max: 1000,
											level: 6
										}, {
											min: 1001,
											max: 1200,
											level: 7
										}, {
											min: 1201,
											max: 1400,
											level: 8
										}, {
											min: 1401,
											max: 1600,
											level: 9
										}, {
											min: 1601,
											max: 1800,
											level: 10
										},
										];

										xp_obj.forEach(function (obj) {
											if (obj.min <= player.xp && obj.max >= player.xp) {
												if (parseInt(player.level) != parseInt(obj.level)) {
													let level = parseInt(obj.level);
													// Player Update Level
										 			playerObj.update({ "_id": new ObjectId(playerId) },
													{ $set: { 'level' :  level } },
													function (err, plr) {
														if (err) {
															console.log(err);
															reject(err);
														} else {
															Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player.socket_id, player.id, player.coin, player.level, function (err) { });
															
														}
													});


													
												}
											}
										});

										let Win = parseInt(player.statistics.locations[location_id]);
										Win = Win + 1; // win game +1
										let query_field = `statistics.locations.${location_id}`;
										playerObj.update({ "_id": new ObjectId(playerId) },
										{ $set: { [query_field] :  Win } },
										function (err, plr) {
											if (err) {
												console.log(err);
												reject(err);
											} else {
												resolve(player);
											}
										});



									}
									if (achievements.length > 0) {
										let loop_counter = 0;
										achievements.forEach(function (achi, key) {
											// Check Achivment Type is Multiple Achivment
											if (achi.action_on == 'hit_50' || achi.action_on == 'hit_100' || achi.action_on == 'hit_assaf_50' || achi.action_on == 'hit_assaf_100' || achi.action_on == 'call_yaniv_with_5_cards' || achi.action_on == 'win_round_with_zero_score' || achi.action_on == 'win_round_with_2_aces' || achi.action_on == 'win_round_with_holding_a23' || achi.action_on == 'win_round_with_3_aces' || achi.action_on == 'win_round_with_4_aces' || achi.action_on == 'throw_5_card_straight_down' || achi.action_on == 'throw_down_4_of_a_kind' || achi.action_on == 'throw_down_3_of_a_kind' || achi.action_on == 'throw_down_4_of_a_kind' || achi.action_on == 'throw_down_35_or_more_points_in_1_turn' || achi.action_on == 'call_yaniv_on_7_when_a_player_has_less_than_3_cards') {

												

												// Check  Achivment is Equal to Action Count.
												if (parseInt(player.statistics[field]) == parseInt(achi.action_count)) {

													Game.Io.to(player.socket_id).emit('PlayerAchiveAchivment', { playerId: playerId, achievement: achi.name, achievement_details: achi.details, coin: achi.coin_reward });
													

													let value = parseInt(player.statistics[field]); // We already +1
													// Save Player 
													let query_field = `statistics.${field}`;
													playerObj.update({ "_id": new ObjectId(playerId) },{ $set: { [query_field] :  value } , $push: { achievement: { id: achi.id, isrewarded: false } } },
													function (err, plr) {
														if (err) {
															console.log(err);
															reject(err);
														} else {
															resolve(player);
															Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
															Game.Logger.debug('+ PLAYER ACHIVMENTS ADDED 1 +');
															Game.Logger.debug('+ NAME =', achi.name);
															Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
														}
													})
												}else{
													let value = parseInt(player.statistics[field]); // We already +1
													
													field = `statistics.${field}`;
													playerObj.update({ "_id": new ObjectId(playerId) },
													{ $set: { [field] :  value } },
													function (err, data) {
														if (err) {
															console.log(err);
															reject(err);
														} else {
															console.log(data.result);
															resolve(player);
														}
													});
												}
											} else {
												// is not Multiple Achivment

												// Check Achivment count is equal to Action Count.
												if (parseInt(achi.action_count) == parseInt(player.statistics[field])) {
													var isPresent = false;
													player.achievement.forEach(function (p_achi) {
														if (p_achi.id == achi.id) {
															isPresent = true
														}
													});

													if (!isPresent) {
														//Send Player Notifications
														Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
														Game.Logger.debug('+ PLAYER GET ACHIVMENTS +');
														Game.Logger.debug('+ NAME =', achi.name);
														Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

														Game.Io.to(player.socket_id).emit('PlayerAchiveAchivment', { playerId: playerId, achievement: achi.name, achievement_details: achi.details, coin: achi.coin_reward });
													 
															playerObj.update({ "_id": new ObjectId(playerId) },{ $push: { achievement: { id: achi.id, isrewarded: false } } },function (err, plr) {
																	if (err) {
																		console.log(err);
																		reject(err);
																	} else {
																		resolve(player);
																		Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
																		Game.Logger.debug('+ PLAYER ACHIVMENTS ADDED 2 +');
																		Game.Logger.debug('+ NAME =', achi.name);
																		Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
																	}
																})
														 

													}else{



													let value = parseInt(player.statistics[field]); // We already add +1
														
													let query_field = `statistics.${field}`;
														playerObj.update({ "_id": new ObjectId(playerId) },
														{ $set: { [query_field] :  value } },
														function (err, plr) {
															if (err) {
																console.log(err);
																reject(err);
															} else {
																Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
																Game.Logger.debug('+ PLAYER GET ACTION 1 +');
																Game.Logger.debug('+ NAME =', field);
																Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
																resolve(player);
															}
														});


													}

												}else{

												if(loop_counter == 0){ // First time run this code.
													loop_counter++; // 
													let value = parseInt(player.statistics[field]); // We already add +1
													let query_field = `statistics.${field}`;
													playerObj.update({ "_id": new ObjectId(playerId) },
													{ $set: { [query_field] :  value } },
													function (err, plr) {
														if (err) {
															console.log(err);
															reject(err);
														} else {
															Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
															Game.Logger.debug('+ PLAYER GET ACTION  2+');
															Game.Logger.debug('+ NAME =', field);
															Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
															resolve(player);
														}
													});
												}
												}
											}
										});
									} else {
										let value = parseInt(player.statistics[field]); // We already +1
										
										let query_field = `statistics.${field}`;
										console.log(query_field);
										playerObj.update({ "_id": new ObjectId(playerId) },
										{ $set: { [query_field] :  value } },
										function (err, plr) {
											if (err) {
												console.log(err);
												reject(err);
											} else {
												Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
												Game.Logger.debug('+ PLAYER GET ACTION 3+',value);
												Game.Logger.debug('+ NAME =', field);
												Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
												resolve(player);
											}
										});
									}
								})
								.catch(function (err) {
									reject(err);
								});

						// } else {
						// 	let value = parseInt(player.statistics[field]) + 1;

						// 	field = `statistics.${field}`;
						// 	playerObj.update({ "_id": new ObjectId(playerId) },
						// 	{ $set: { [field] :  value } },
						// 	function (err, data) {
						// 		if (err) {
						// 			console.log(err);
						// 			reject(err);
						// 		} else {
						// 			console.log(data.result);
						// 			resolve(player);
						// 		}
						// 	});
						// }
					}
				})
				.catch(function (err) {
					reject(err);
				});
			});
		});
		return promise;
	},

	/**
	 *  Player Conin & Level Update Send To Player
	 */
 

	PlayerCoinLevelUpdated: function (socketId, playerId, coin, level) {

		console.log("Data --------------------------> :",socketId);

		console.log("socketId :",socketId);
		console.log("playerId :",playerId);
		console.log("coin :",coin);
		console.log("level :",level);

		// Send Updated Coin & Level To Player
		Game.Io.to(socketId).emit("coinupdated", {
			playerid: playerId,
			coin: parseInt(coin),
			level: parseInt(level)
		});

	},


	/**
	 *  Player Xp Updated
	 */

	PlayerXpUpdated: function (playerId, xp) {

		console.log("Player Id",playerId);

		var promise = new Promise(function (resolve, reject) {
			Game.AppSource.Player.Models.Player.native(function (err, playerObj) {
			Game.AppSource.Player.Models.Player.findOne({ id: playerId })
				.then(function (player) {
					player.xp = parseInt(player.xp) + xp;

					console.log("player.xp",player.xp);

					var xp_obj = [{
						min: 1,
						max: 50,
						level: 1
					}, {
						min: 51,
						max: 100,
						level: 2
					}, {
						min: 101,
						max: 200,
						level: 3
					}, {
						min: 201,
						max: 400,
						level: 4
					}, {
						min: 401,
						max: 800,
						level: 5
					}, {
						min: 801,
						max: 1000,
						level: 6
					}, {
						min: 1001,
						max: 1200,
						level: 7
					}, {
						min: 1201,
						max: 1400,
						level: 8
					}, {
						min: 1401,
						max: 1600,
						level: 9
					}, {
						min: 1601,
						max: 1800,
						level: 10
					},
					];

					xp_obj.forEach(function (obj) {
						if (obj.min <= player.xp && obj.max >= player.xp) {
							if (parseInt(player.level) != parseInt(obj.level)) {
								player.level = parseInt(obj.level);
								Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player.socket_id,player.id,player.coin,player.level,function (err) { });
							}
						}
					});


					 
					playerObj.update({ "_id": new ObjectId(playerId) },
					{ $set: { 'xp' :  player.xp , 'level' : player.level } },
					function (err, data) {
						if (err) {
							console.log(err);
							reject(err);
						} else {
							console.log(data.result);
							resolve(player);
						}
					});
				})
				.catch(function (err) {
					reject(err);
				});
		});
	});
		return promise;
	},


	/**
	 *  Player Coin Update When they Lose the game
	 * 
	 */

	PlayerLoseCoinUpdate: function (playerId, coin, tableid) {

		var promise = new Promise(function (resolve, reject) {
			Game.AppSource.Player.Models.Player.findOne({ id: playerId })
				.then(function (player) {

					var coins = parseInt(player.coin) - parseInt(coin);

					console.log("==============================================");
					console.log(" LOSER COIN UPDATE");
					console.log(" PLAYER NAME =", player.username);
					console.log(" OLD COIN =", player.coin);
					console.log(" UPDATED COIN =", coins);
					console.log(" Table ID =", tableid);
					console.log("==============================================");


					/**
					* When Player coin Updated
					*/

					Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player.socket_id,playerId,coins,player.level,function (err) { }); 



					Game.AppSource.Player.Models.Player.update({ id: playerId }, { coin: coins })
						.then(function (ply) {
							resolve(coins);
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


	/**
	 * Achivemt Reward 
	 */


	AchievementReward: function (playerId, achievement_id, socketId) {

		var promise = new Promise(function (resolve, reject) {
			Game.AppSource.Player.Models.Player.findOne({ id: playerId })
				.then(function (player) {
					
					Game.AppSource.Achievement.Models.Achievement.findOne({ id: achievement_id })
						.then(function (achievement) {

							player.coin = parseInt(player.coin) + parseInt(achievement.coin_reward);

							/**
							 * When Player coin Updated
							 */

							Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player.socket_id,playerId,player.coin,player.level,function (err) { });

							player.achievement.forEach(function (achiv) {
								if (achiv.id == achievement_id) {
									achiv.isrewarded = true;
								}
							});

							player.save(function (err) {
								resolve(player);
								console.log("Player Rewarded Achivments:");
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




	/**
	 * Send Game Chat
	 */

	gamechat: function (data,callback) {
 
			Game.AppSource.Game.Controllers.TableService.getTable({ id: data.tableId }, function (err, table) {
				if (err) {
					return callback(err)
				}
				if(data.type == 'text'){
					table.chat.push({
						'id': data.playerId,
						'name': data.playerName,
						'msg': data.message
					});
				}

				Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
					if (err) {
						return callback(err)
					}
					Game.Io.to(table.id).emit("chatMessage", {
						playerid: data.playerId,
						playerName: data.playerName,
						type : data.type,
						msg: data.message
					});
					return callback(null,data.playerId)
				});
			});
	}
}