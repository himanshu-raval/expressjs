const async = require('async');

var debug = require('debug')('AppSource:Player:Controller:Player');

var FCM = require('fcm-node');
var serverKey = 'YOURSERVERKEYHERE'; //put your server key here
var fcm = new FCM(serverKey);



module.exports = {

	testandroidpush : function (data, cb) {

		var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
			to: 'registration_token', 
			// collapse_key: 'your_collapse_key',
			
			notification: {
				title: 'Title of your push notification', 
				body: 'Body of your push notification' 
			},
			
			data: {  //you can send only notification or only data(or include both)
				my_key: 'my value',
				my_another_key: 'my another value'
			}
		};
		
		fcm.send(message, function(err, response){
			if (err) {
				console.log("Something has gone wrong!");
				return callback(new Error("Error"));
			} else {
				console.log("Successfully sent with response: ", response);
				return cb(null, {});
			}
		});
	},

	getAll: function (query, cb) {
		debug('getAll function called.');
		Game.AppSource.Player.Models.Player.find(query)
			.exec((err, players) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, players);
			})

	},
	delete: function (query, cb) {
		debug('delete function called.');
		Game.AppSource.Player.Models.Player.destroy(query)
			.exec((err, players) => {
				if (err) { console.log(err); return cb(err) }
				return cb(null, players);
			})

	},
	update: (query, data, callback) => {
		Game.AppSource.Player.Models.Player.update(query, data)
			.exec((err, players) => {
				if (err) {
					return callback(err);
				}
				if (players.length > 0) {
					return callback(null, players[0]);
				}
				return callback(null, null)
			})
	},

	gettopplayer: function (data, cb) {
		console.log("Type :",data.type);

		if(data.type == 'all'){
			Game.AppSource.Player.Models.Player.find({select : ['username', 'coin', 'id']}).limit(10).sort({ coin: -1 }).exec((err, players) => {
				if (err) { console.log(err); return cb(err) }
				var result = [];
				players.forEach(function(plr){
					result.push({
						id : plr.id,
						name:plr.username,
						coin : plr.coin
					})
				})

				return cb(null, result);
		   })
		}else{

			let query = {};
			
			if(data.type == 'day'){

					var today = new Date();
					var dd = today.getDate();
					var mm = today.getMonth()+1; //January is 0!
					var yyyy = today.getFullYear();
					if(dd<10){ 		dd='0'+dd; } 
					if(mm<10){		mm='0'+mm; } 
										
					var todayStart = yyyy+'-'+mm+'-'+dd+'T00:00:00.000Z';
					var todayEnd = yyyy+'-'+mm+'-'+dd+'T23:30:00.000Z';

					//var today = '2017-12-19 00:00:00.000Z';
					//var todayEnd = '2017-12-19 99:99:99.999Z';

 					query.createdAt  = { $gt: new Date(todayStart),$lt: new Date(todayEnd) };
				 
				} else if(data.type == 'weekly'){

					console.log('weekly');

					var curr = new Date(); // get current date
					var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
					var last = first + 6; // last day is the first day + 6
					var firstday = new Date(curr.setDate(first));
 
					var fdd = firstday.getDate();
					var fmm = firstday.getMonth()+1; //January is 0!
					var fyyyy = firstday.getFullYear();
					if(fdd<10){ fdd='0'+fdd; } 
					if(fmm<10){	fmm='0'+fmm; } 
					//firstday = fyyyy+'-'+fmm+'-'+fdd+' 00:00:00.000';
					var lastday = new Date(curr.setDate(last));
					var ldd = lastday.getDate();
					var lmm = lastday.getMonth()+1; //January is 0!
					var lyyyy = lastday.getFullYear();
					if(ldd<10){ ldd='0'+ldd; } 
					if(lmm<10){	lmm='0'+lmm; } 
					//lastday = lyyyy+'-'+lmm+'-'+ldd+' 12:59:59.000';

					var weekStart = fyyyy+'-'+fmm+'-'+fdd+'T00:00:00.000Z';
					var weekEnd = lyyyy+'-'+lmm+'-'+ldd+'T23:30:00.000Z';

					query.createdAt  = { $gt: new Date(weekStart),$lt: new Date(weekEnd) };
				
				} else if(data.type == 'monthly'){
					console.log('monthly');

					var date = new Date();
					var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
							
					var fdd = firstDay.getDate();
					var fmm = firstDay.getMonth()+1; //January is 0!
					var fyyyy = firstDay.getFullYear();
					if(fdd<10){ fdd='0'+fdd; } 
					if(fmm<10){	fmm='0'+fmm; } 


					var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

					var ldd = lastDay.getDate();
					var lmm = lastDay.getMonth()+1; //January is 0!
					var lyyyy = lastDay.getFullYear();
					if(ldd<10){ ldd='0'+ldd; } 
					if(lmm<10){	lmm='0'+lmm; }

					var monthStart = fyyyy+'-'+fmm+'-'+fdd+'T00:00:00.000Z';
					var monthEnd = lyyyy+'-'+lmm+'-'+ldd+'T23:30:00.000Z';

					console.log(monthStart)
					console.log(monthEnd)

				 	query.createdAt  = { $gt: new Date(monthStart),$lt: new Date(monthEnd) };

				}else{

				var date = new Date();
				let year = date.getFullYear();

				 var yearStart = year+'-01-01T00:00:00.000Z';
				 var yearhEnd = year+'-12-31T23:30:00.000Z';
					query.createdAt  = { $gt: new Date(yearStart),$lt: new Date(yearhEnd) };

				}
					query.type = 'credit'; 
					console.log(query);
					Game.AppSource.Player.Models.Coinshistory.find(query).populate('player',{select:['username','coin']}).limit(10).sort({ coins: -1 }).exec((err, players) => {
							if (err) { console.log(err); return cb(err) }
							// console.log("players",players);
							var result = [];
							players.forEach(function(plr){
								if(plr.player && plr.player.id != undefined){ 
									result.push({
										id : plr.player.id,
										name:plr.player.username,
										coin : plr.player.coin
									})
								}
							})
							return cb(null, result);
					})
		}

	},

	updatestatistics: function (playerId, data) {
		var promise = new Promise(function (resolve, reject) {
			console.log("Update Statistics Function Called.");
			Game.AppSource.Player.Models.Player.find({ id: playerId, select: ['statistics'] })
				.then(function (statistics) {
					statistics.coins_won = data.coin;
					Game.AppSource.Player.Models.Player.update({ id: playerId }, { statistics: statistics })
						.then(function (statistics) {
							resolve(statistics);
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
	 * Get User Profile
	 */


	getUserProfile: function (playerData, callback) {
		//var promise = new Promise(function(resolve, reject){
		console.log("getUserProfile Function Called.");
		Game.AppSource.Player.Models.Player.findOne({ id: playerData.playerId })
			.exec((err, player) => {
				if (err) { console.log(err); return callback(err) }


				var profile = {};

				//  console.log("Player->",player);
				// Game.AppSource.Player.Models.Player.update({id: playerId},{statistics:statistics})
				// .then(function (statistics) {
				// 	resolve(statistics);
				// })
				// .catch(function (err) {
				// 	reject(err);
				// });


				profile.coins_won = parseInt( player.statistics.coins_won);
				profile.coins = parseInt( player.coin);
				profile.current_level = player.selected_landmark;
				profile.current_level_name = player.selected_landmark_name;
				profile.game_played = player.statistics.games_played;
				profile.game_won = player.statistics.game_won;
				profile.call_yaniv = player.statistics.call_yaniv;
				profile.assaf = player.statistics.call_yaniv_got_assaf;
				profile.achievement = player.achievement;
				profile.last_game_winning_coin = player.last_game_winning_coin;
				profile.avatar = player.selected_avatar;
				
				Game.AppSource.Shop.Models.Landmark.find({})
					.exec((err, landmark) => {
						if (err) { console.log(err); return callback(err) }
						var landmark_wins = [];
						profile.total_level = landmark.length;
						var counteDone = false;

						landmark.forEach(function (lan, key) {
							if (!counteDone) {
								profile.current_level_no = key + 1;
								if (lan.id == profile.current_level) {
									counteDone = true;
								}
							}
							
								let win = 0;
								if(player.statistics.locations[lan.id]){
									win = parseInt(player.statistics.locations[lan.id]);
								}
								//if (lan.id != profile.current_level) {
									landmark_wins[key] = {
										id: lan.id,
										image: lan.landmark,
										name: lan.landmark_name,
										win : win
									};
								// } else {
								// 	counteDone = true;
								// }
							//}
						});


						/**
						 * Calculate Rank
						 */
						var rank = (profile.current_level_no * 100) / landmark.length;
						console.log("profile.current_level_no : ", profile.current_level_no);
						console.log("Rank :", rank);
						if (rank > 80) {
							profile.rank = 'Grand Master';
						} else if (rank <= 80 && rank > 60) {
							profile.rank = 'Master';
						} else if (rank <= 60 && rank > 40) {
							profile.rank = 'Expert';
						} else if (rank <= 40 && rank > 20) {
							profile.rank = 'Intermediate';
						} else {
							profile.rank = 'Beginner';
						}

						var game_won = parseInt(player.statistics.tournament_won) + parseInt(player.statistics.game_won); // Get Sum of all Game.
						profile.win_percentage = (parseInt(game_won) * 100) / parseInt(player.statistics.games_played);
						profile.tournament_won = player.statistics.tournament_won;
						profile.win_streak = player.statistics.win_streak;
						profile.gems = player.gems;
						profile.landmark_wins = landmark_wins;
					 

						// Remove is Frontend is set

						profile.game_played = player.statistics.game_won; // Temporory Change for some issue OLD is : player.statistics.games_played;
						profile.game_won =  player.statistics.games_played; // Temporory Change for some issue OLD is : player.statistics.game_won;



						return callback(null, profile);
					});


			});

	},

	/**
	 * Search Player by Username
	 */


	searchPlayer: function (data, cb) {
		console.log(data);
		Game.AppSource.Player.Models.Player.find({ select: ['_id', 'username', 'socket_id'] }).where({ username: { contains: data.searchtext } })
			.exec((err, players) => {
				if (err) { console.log(err); return cb(err) }
				var pl = [];
				Game.AppSource.Player.Models.Player.findOne({ id: data.id })
					.exec(function (err, plyr) {
						if (err) { console.log(err); return cb(err) }
						var frd = plyr.friends;

						var i = 0;
						players.forEach(function (play, key) {
							var isAvilable = false;

							if (data.id != play.id) {
								frd.forEach(function (ply, key) {
									if (ply.friend_id == play.id) {
										isAvilable = true;
									}
								});
								var si = play.socket_id;
								console.log(play.socket_id);

								if (!isAvilable) {
									var live = false;
									if (Game.Io.sockets.sockets[play.socket_id] != undefined) {
										live = true;
									}
									pl[i++] = {
										id: play.id,
										username: play.username,
										live: live
									};
								}
							}

						});
						return cb(null, pl);
					});

			})

	},
	/**
	 * Search Player by Username
	 */


	sendInvitation: function (data, cb) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.toPlayerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return cb(err) }
				if (!player) {
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					Game.Logger.debug('+ Player Not Found +');
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					return cb(new Error('Player not found'));
				}


				Game.AppSource.Player.Models.Player.findOne({ id: data.fromPlayerId })
					.exec(function (err, plyr) {
						if (err) { console.log(err); return cb(err) }
						if (!plyr) {
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							Game.Logger.debug('+ From Player Not Found +');
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							return cb(new Error('From Player not found'));
						}

						/**
						 *  Check Player is Online
						 */

						if (Game.Io.sockets.sockets[player.socket_id] != undefined) {
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							Game.Logger.debug('+ Player Online +');
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							/**
							 * Player is Online so Send Brodcast
							 */
							Game.Io.to(player.socket_id).emit('addFriendsInvitation', { fromPlayerId: data.fromPlayerId, fromPlayerName: plyr.username });
						} else {
							/**
							 * Player is Ofline So Send Push Notification
							 */
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							Game.Logger.debug('+ Player Ofline +');
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
						}





						/**
						 * Add Player in Friends List to Player
						 */
						var frd = plyr.friends;
						var isAvilable = false;
						frd.forEach(function (ply, key) {
							if (ply.friend_id == data.toPlayerId) {
								isAvilable = true;
							}
						});

						if (!isAvilable) {
							frd.push({
								friend_id: data.toPlayerId,
								friend_name: player.username,
								status: "waiting"
							});
						}

						Game.AppSource.Player.Models.Player.update({ id: data.fromPlayerId }, { friends: frd })
							.exec((err, players) => {
								if (err) { return cb(err); }
								return cb(players.id);
							});

					})

			});

	},


	/**
	 * Send Game Invitation
	 */


	sendGameInvitation: function (data, cb) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.toPlayerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return cb(err) }
				if (!player) {
					return cb(new Error('Player not found'));
				}
				if (parseInt(player.coin) < 500) {
					return cb(new Error('Player Have insufficient Coin'));
				}

				Game.AppSource.Player.Models.Player.findOne({ id: data.fromPlayerId })
					.exec(function (err, plyr) {
						if (err) { console.log(err); return cb(err) }
						if (parseInt(plyr.coin) < 500) {
							return cb(new Error('You Have Insufficient Coin'));
						}
						
						if (!plyr) {
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							Game.Logger.debug('+ From Player Not Found +');
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							return cb(new Error('From Player not found'));
						}

						/**
						 *  Check Player is Online
						 */

						if (Game.Io.sockets.sockets[player.socket_id] != undefined) {
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							Game.Logger.debug('+ Player Online +');
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							/**
							 * Player is Online so Send Brodcast
							 */
							Game.Io.to(player.socket_id).emit('gamePlayInvitation', { fromPlayerId: data.fromPlayerId, fromPlayerName: plyr.username });
						} else {
							/**
							 * Player is Ofline So Send Push Notification
							 */
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							Game.Logger.debug('+ Player Ofline +');
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
						}

					});

			});

	},






	/**
	 * Get Friends List 
	 * 
	 */

	getMyFriends: function (data, cb) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return cb(err) }

				var pl = [];
				var i = 0;
				var tot = player.friends.length;
				if (player.friends.length == 0) {
					return cb(null, pl);
				}

				player.friends.forEach(function (ply, key) {

					Game.AppSource.Player.Models.Player.findOne({ id: ply.friend_id })
						.exec(function (err, player_data) {
							if (err) { console.log(err); return cb(err) }

							if (Game.Io.sockets.sockets[player_data.socket_id] != undefined) {
								pl[i++] = {
									id: ply.friend_id,
									username: ply.friend_name,
									status: ply.status,
									live: true
								};
							} else {
								pl[i++] = {
									id: ply.friend_id,
									username: ply.friend_name,
									status: ply.status,
									live: false
								};
							}
							if (tot == i) {

								return cb(null, pl);
							}

						});
				});



			});

	},







	/**
	 * Add Friend / Friend invitation Responce
	 * 
	 */

	invitationResponce: function (data, cb) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.fromPlayerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return cb(err) }
				if (!player) {
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					Game.Logger.debug('+ Player Not Found +');
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					return cb(new Error('Player not found'));
				}

				/**
				 * Add Player in Friends List to Player
				 */
				var fr_frd = player.friends;
				var fr_isAvilable = false;
				fr_frd.forEach(function (ply, key) {
					if (ply.friend_id == data.toPlayerId) {
						fr_isAvilable = true;
						ply.status = "friend";
					}

					if (fr_isAvilable == true && data.status == 'reject') {
						fr_frd.splice(key, 1); // Remove Player
					}

				});

				var player_name = player.username;

				Game.AppSource.Player.Models.Player.findOne({ id: data.toPlayerId })
					.exec(function (err, player) {
						if (err) { console.log(err); return cb(err) }
						if (!player) {
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							Game.Logger.debug('+ Player Not Found +');
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							return cb(new Error('Player not found'));
						}


						if (!fr_isAvilable && data.status == 'accept') {
							fr_frd.push({
								friend_id: data.toPlayerId,
								friend_name: player.username,
								status: "friend"
							});
						}

						/**
						 * Add Player in Friends List to Player
						 */
						var frd = player.friends;
						var isAvilable = false;
						frd.forEach(function (ply, key) {
							if (ply.friend_id == data.fromPlayerId) {
								isAvilable = true;
								ply.status = "friend";
							}
							if (isAvilable == true && data.status == 'reject') {
								frd.splice(key, 1); // Remove Player
							}
						});

						if (!isAvilable && data.status == 'accept') {
							frd.push({
								friend_id: data.fromPlayerId,
								friend_name: player_name,
								status: "friend"
							});
						}

						Game.AppSource.Player.Models.Player.update({ id: data.fromPlayerId }, { friends: fr_frd })
							.exec((err, frm_players) => {
								if (err) { return cb(err); }

								Game.AppSource.Player.Models.Player.update({ id: data.toPlayerId }, { friends: frd })
									.exec((err, to_players) => {
										if (err) { return cb(err); }

										console.log(player.socket_id);

										if (data.status == 'accept') {
											Game.Io.to(player.socket_id).emit('friendInvitationRes', { fromPlayerId: data.fromPlayerId, fromPlayerName: frm_players.username, status: 'accept' });
										} else {
											Game.Io.to(player.socket_id).emit('friendInvitationRes', { fromPlayerId: data.fromPlayerId, fromPlayerName: frm_players.username, status: 'reject' });
										}

										return cb(null, player.id);
									});

							});


					})
			})
	},




	/**
	 * Game Invitation Responce
	 * 
	 */

	gameInvitationRes: function (data, cb) {

		Game.AppSource.Player.Models.Player.findOne({ id: data.toPlayerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return cb(err) }
				if (!player) {
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					Game.Logger.debug('+ Player Not Found +');
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					return cb(new Error('Player not found'));
				}


				Game.AppSource.Player.Models.Player.findOne({ id: data.fromPlayerId })
					.exec(function (err, plyr) {
						if (err) { console.log(err); return cb(err) }

						var frd = player.friends;
						if (data.status == 'accept') {
							Game.Io.to(player.socket_id).emit('gameInvitationResponce', { fromPlayerId: data.fromPlayerId, fromPlayerName: plyr.username, status: 'accept' });
							frd.forEach(function (ply, key) {
								if (ply.friend_id == data.fromPlayerId) {
									ply.status = "invited";
								}
							});

						} else {
							Game.Io.to(player.socket_id).emit('gameInvitationResponce', { fromPlayerId: data.fromPlayerId, fromPlayerName: plyr.username, status: 'reject' });
						}

						Game.AppSource.Player.Models.Player.update({ id: data.toPlayerId }, { friends: frd })
							.exec((err, players) => {
								if (err) { return cb(err); }
								return cb(players.id);
							});

					});
			});


	},



	/**
	 * Left From PlayWith Friend
	 * 
	 */


	leftFromPlayWithFrd: function (data, cb) {
		
				Game.AppSource.Player.Models.Player.findOne({ id: data.toPlayerId })
					.exec(function (err, player) {
						if (err) { console.log(err); return cb(err) }
						if (!player) {
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							Game.Logger.debug('+ Player Not Found +');
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							return cb(new Error('Player not found'));
						}
		
		
						Game.AppSource.Player.Models.Player.findOne({ id: data.fromPlayerId })
							.exec(function (err, plyr) {
								if (err) { console.log(err); return cb(err) }
		
								var frd = player.friends;
								// reset Player Button invite.
								Game.Io.to(player.socket_id).emit('gameInvitationResponce', { fromPlayerId: data.fromPlayerId, fromPlayerName: plyr.username, status: 'reject' });

								frd.forEach(function (ply, key) {
									if (ply.friend_id == data.fromPlayerId) {
										ply.status = "friend"; // Player Leave Game Waiting Screen so Chnage status invited to Friend.
									}
								});
		
								 
		
								Game.AppSource.Player.Models.Player.update({ id: data.toPlayerId }, { friends: frd })
									.exec((err, players) => {
										if (err) { return cb(err); }
										return cb(players.id);
									});
		
							});
					});
		
		
			},







	/**
	 * Get Free Coin/Gems Status
	 * 
	 */

	getFreeCoinGemsStatus: function (data, callback) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return callback(err) }
				var date = new Date().getDate();
				var time = new Date().getTime();
				if (data == free_coin_date) {
					var result = {
						player_id: data.playerId,
						time: time,
						status: true
					};
				} else {
					var result = {
						player_id: data.playerId,
						time: time,
						status: false
					};
				}
				return callback(null, result);
			});

	},

	/**
	 *  Save Reward Coin/gems
	 */

	rewardFreeCoinGems: function (data, callback) {

		Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return callback(err) }
				var coin = player.coin;
				var gems = player.gems;

				if (data.type == 'coin') {
					coin = parseInt(coin) + 100;
				}
				if (data.type == 'gems') {
					gems = parseInt(gems) + 10;
				}

				Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player.socket_id,data.playerId,coin,player.level,function (err) { });


				// Game.Io.to(player.socket_id).emit("coinupdated", {
				// 	playerid: data.playerId,
				// 	coin: parseInt(coin),
				// 	level: parseInt(player.level)
				// });

				Game.AppSource.Player.Models.Player.update({ id: player.id }, { coin: coin, gems: gems })
					.then(function (p_data) {
						if (err) { console.log(err); return callback(err) }
						callback(null, p_data);
					});
			});
	},

	/**
	 *  Rewards Video Ads
	 */

	rewardVideoAds: function (data, callback) {

		Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return callback(err) }
				var coin = player.coin;

				//if (data.type == 'coin') {
					coin = parseInt(coin) + 100;
				//}

				Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player.socket_id,data.playerId,coin,player.level,function (err) { }); 

				// Game.Io.to(player.socket_id).emit("coinupdated", {
				// 	playerid: data.playerId,
				// 	coin: parseInt(coin),
				// 	level: parseInt(player.level)
				// });
				

				Game.AppSource.Player.Models.Player.update({ id: player.id }, { coin: coin })
					.then(function (p_data) {
						if (err) { console.log(err); return callback(err) }
						callback(null, p_data);
					});

			});
	},




	/**
	 *  get players statistics
	 */


	getplayersstatisticsdata: function (data, callback) {
		
				Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
					.exec(function (err, player) {
						if (err) { console.log(err); return callback(err) }

						let game_played = player.statistics['games_played'] == 0 ? 1 : player.statistics['games_played'];

						let  Locations_Played = 0;
						if(player.statistics['locations'] != undefined){
							Locations_Played = Object.keys(player.statistics['locations']).length;
						}

						let result = {
							'Games_Played' : player.statistics['games_played'],
							'Game_Won' :   player.statistics['game_won'],
							'Win_Percentage' :  ((parseInt(player.statistics['game_won'])/parseInt(game_played))*100),
							'Coins_Won' :  player.statistics['coins_won'],
							'Sit_n_Go_won' :  player.statistics['sit_n_go_won'],
							'Coin_games_won' :  player.statistics['coin_games_won'],
							'MTTs_Won' :  player.statistics['mtts_won'],
							'Times_Called_Yaniv' :  player.statistics['call_yaniv'],
							'Times_did_Assaf' :  player.statistics['got_assaf'],
							'Times_got_Assafd' :  player.statistics['call_yaniv_got_assaf'],
							'Average_Hand_Score' :  player.statistics['average_hand_score'],
							'Best_Match_Score' :  player.statistics['best_match_score'],
							'Longest_game_rounds' :  player.statistics['longest_game_rounds'],
							'Shortest_game_rounds' :  player.statistics['shortest_game_rounds'],
							'Locations_Played' :  Locations_Played,
						}	

 

						callback(null, result);
					});
	},


	/**
	 *  Rewards Time Coins
	 */

	rewardtimecoins: function (data, callback) {
		
				Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
					.exec(function (err, player) {
						if (err) { console.log(err); return callback(err) }
						var coin = player.coin;
		
						// if (data.type == 'coin') {
							coin = parseInt(coin) + 100;
						// }
		
						Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player.socket_id,data.playerId,coin,player.level,function (err) { });

						// Game.Io.to(player.socket_id).emit("coinupdated", {
						// 	playerid: data.playerId,
						// 	coin: parseInt(coin),
						// 	level: parseInt(player.level)
						// });
						Game.AppSource.Player.Models.Player.update({ id: player.id }, { coin: coin })
							.then(function (p_data) {
								if (err) { console.log(err); return callback(err) }
								callback(null, p_data);
							});
		
					});
			},



	freecoingemsinstant: function (data, callback) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
		.exec(function (err, player) {
			if (err) { console.log(err); return callback(err) }
			if(parseInt(player.gems) >= 10 ){
				player.gems = parseInt(player.gems) - 10;
				player.coin = parseInt(player.coin) + 100;
		
					Game.AppSource.Player.Models.Player.update({ id: player.id }, { coin: player.coin,gems : player.gems })
					.then(function (p_data) {
						if (err) { console.log(err); return callback(err) }
						Game.Io.to(p_data[0]['socket_id']).emit("gemsupdated", {
							playerid: p_data[0]['id'],
							gems: parseInt(p_data[0]['gems'])
						});

						Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(p_data[0]['socket_id'],p_data[0]['id'],p_data[0]['coin'],p_data[0]['level'],function (err) { });
						// Game.Io.to(p_data[0]['socket_id']).emit("coinupdated", {
						// 	playerid: p_data[0]['id'],
						// 	coin: p_data[0]['coin'],
						// 	level: p_data[0]['level']
						// });
						callback(null, p_data);
					});
			}else{
				callback(new Error('Insufficient Gems'));
			}
			
		});
	},




	/**
	 * scratchcardbuy
	 */

	scratchcard: function (data, callback) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return callback(err) }

				var ishaveturn = false;
				var ishaveturnType = null;
				var turnPass = false;
				var cards = [];
				var date = new Date();
				date = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
				if (data.type == 'singletime') {
					if(player.gems >= 10){
						player.gems = parseInt(player.gems) - 10;
						player.scratch_card.scratch_card_single = 1;
					
					}else{
						callback(new Error('Please Buy Gems'));
					}

					
				}
				if (data.type == 'monthbuy') {
					var date = new Date();
					player.scratch_card.scratch_card_buy = date;
					player.scratch_card.scratch_card_used = '00/00/0000';
				}

				if (data.type == 'scratchcard') {
					var isAvilable = false;
					var todayDate = new Date();
					var sc_date = new Date(player.scratch_card.scratch_card_buy);
					var timeDiff = Math.abs(sc_date.getTime() - todayDate.getTime());
					var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
					if (diffDays <= 28) {
						ishaveturn = true;
						ishaveturnType = 'monthbuy';
					}

					if (player.scratch_card.scratch_card_single == 1) {
						player.scratch_card.scratch_card_single = 0;
						ishaveturn = true;
						ishaveturnType = 'singletime';
					}

				}

				if (ishaveturn) {

					// FIX 8 Cards
					cards.push({'name':'diamond', 'value': 500 });
					cards.push({'name':'diamond', 'value': 500 });
					cards.push({ 'name':'clubs', 'value': 1000 });
					cards.push({ 'name':'clubs', 'value': 1000 });
					cards.push({ 'name':'hearts', 'value': 10000 });
					cards.push({ 'name':'hearts', 'value': 10000 });
					cards.push({ 'name':'spades', 'value': 50000 });
					cards.push({ 'name':'spades', 'value': 50000 });

					if(ishaveturnType == 'monthbuy'){
					if (player.scratch_card.scratch_card_used == date) {
						turnPass = true;
					} else {
						 
							var rand = Math.floor((Math.random() * 100) + 1);
							if (rand == 1) {
								cards.push({ 'name':'spades', 'value': 50000 });
							} else if (rand > 1 && rand < 6) {
								cards.push({ 'name':'hearts', 'value': 10000 });
							} else if (rand > 5 && rand < 11) {
								cards.push({ 'name':'clubs', 'value': 1000 });
							} else if (rand > 10 && rand < 37) {
								cards.push({'name':'diamond', 'value': 500 });
							} else {
								cards.push({ 'name':'joker', 'value' : 1000000 });
							}
					 
						player.scratch_card.scratch_card_used = date;
					}
				}else{
				 
						var rand = Math.floor((Math.random() * 100) + 1);
						if (rand == 1) {
							cards.push({ 'name':'spades', 'value': 50000 });
						} else if (rand > 1 && rand < 6) {
							cards.push({ 'name':'hearts', 'value': 10000 });
						} else if (rand > 5 && rand < 11) {
							cards.push({ 'name':'clubs', 'value': 1000 });
						} else if (rand > 10 && rand < 37) {
							cards.push({'name':'diamond', 'value': 500 });
						} else {
							cards.push({ 'name':'joker', 'value' : 1000000 });
						}
					 
				}





				}
				if (data.type == 'scratchcardrewardcoin') {

					player.coin = parseInt(player.coin) + parseInt(data.coin);

				}


				Game.AppSource.Player.Models.Player.update({ id: player.id }, { scratch_card: player.scratch_card, coin: player.coin,gems : player.gems })
					.then(function (p_data) {
						if (err) { console.log(err); return callback(err) }

						if(data.type == 'singletime'){
							Game.Io.to(p_data[0]['socket_id']).emit("gemsupdated", {
								playerid: p_data[0]['id'],
								gems: parseInt(p_data[0]['gems'])
							});
						}


						if (data.type == 'scratchcardrewardcoin') {

							Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(p_data[0]['socket_id'],p_data[0]['id'],p_data[0]['coin'],p_data[0]['level'],function (err) { });
							// Game.Io.to(p_data[0]['socket_id']).emit("coinupdated", {
							// 	playerid: p_data[0]['id'],
							// 	coin: p_data[0]['coin'],
							// 	level: p_data[0]['level']
							// });
							callback(null, p_data.id);
						}

						if (data.type == 'scratchcard') {
							if (ishaveturn) {
								if (turnPass) {
									callback(new Error('Your Today Turn Already Passed, Please wait for One Day'));
								} else {

								 
										var currentIndex = cards.length, temporaryValue, randomIndex;
										// While there remain elements to shuffle...
										while (0 !== currentIndex) {
									  	  // Pick a remaining element...
										  randomIndex = Math.floor(Math.random() * currentIndex);
										  currentIndex -= 1;
									  	  // And swap it with the current element.
										  temporaryValue = cards[currentIndex];
										  cards[currentIndex] = cards[randomIndex];
										  cards[randomIndex] = temporaryValue;
										}
							
									callback(null, cards);
								}

							} else {
								callback(new Error('Please Buy'));
							}

						} else {
							callback(null, {});
						}

					});

			});
	},



	/**
	 * Shark pool 
	 */

	sharkpool: function (data, callback) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return callback(err) }

				if (player.sharkpool == true) {

					// Shark Pool Logic
					// Game.AppSource.Player.Models.Player.update({ id: player.id }, { sharkpool:player.sharkpool,gems:player.gems})
					// .then(function (p_data) {
					// 	if (err) { console.log(err); return callback(err) }
					// 		callback(null, p_data);
					// });

					let task = []
					player.friends.forEach(function(plr){
						task.push(function(callback){
							Game.AppSource.Player.Models.Player.findOne({ id: plr.friend_id })
							.exec(function (err, player) {
								 
								//console.log(player);
								callback(null,{
									id : plr.friend_id,
									level : player.level,
									name : player.username,
									avatar : player.selected_avatar,
									coin : player.coin,
									sharkpoolrewordcoin : (player.coin * 1)/100
								})
							});
						})
					});
					async.parallel(task,function(err, results) {
						callback(null, results);
					});










				//    myFunction(query, function(returnValue) {
 				// 		let players = [];
				// 		query.forEach(function(plr){
				// 			Game.AppSource.Player.Models.Player.findOne({ id: plr.friend_id })
				// 			.exec(function (err, player) {
				// 				players.push({
				// 					id : plr.friend_id,
				// 					level : player.level,
				// 					name : player.username,
				// 					avatar : player.selected_avatar,
				// 					coin : player.coin
				// 				})
				// 			});
				// 		});
				// 		callback(response);
				// 	});

				// 	var returnValue = myFunction(player.friends);
					

				} else {
					callback(new Error('Please Purchase Shark Pool'));
				}

			});
	},



	
	/**
	 * Purchase Shark pool 
	 */

	purchasesharkpool: function (data, callback) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return callback(err) }

				if (player.gems >= 100) {
					player.gems = parseInt(player.gems) - 100;
					player.sharkpool = true;
					Game.AppSource.Player.Models.Player.update({ id: player.id }, { sharkpool: player.sharkpool, gems: player.gems })
						.then(function (p_data) {
							if (err) { console.log(err); return callback(err) }
							callback(null, p_data);
						});
				} else {
					callback(new Error('Please Buy Gems'));
				}

			});
	},


	/**
	 * Invite Shark pool 
	 */



	invitesharkpool: function (data, cb) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.toPlayerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return cb(err) }
				if (!player) {
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					Game.Logger.debug('+ Player Not Found +');
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					return cb(new Error('Player not found'));
				}
				if (parseInt(player.coin) < 200) {
					return cb(new Error('Player Have insufficient Coin'));
				}

				Game.AppSource.Player.Models.Player.findOne({ id: data.fromPlayerId })
					.exec(function (err, plyr) {
						if (err) { console.log(err); return cb(err) }
						if (!plyr) {
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							Game.Logger.debug('+ From Player Not Found +');
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							return cb(new Error('From Player not found'));
						}

						/**
						 *  Check Player is Online
						 */

						if (Game.Io.sockets.sockets[player.socket_id] != undefined) {
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							Game.Logger.debug('+ Player Online +');
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							/**
							 * Player is Online so Send Brodcast
							 */
							Game.Io.to(player.socket_id).emit('sharkPoolInvitation', { fromPlayerId: data.fromPlayerId, fromPlayerName: plyr.username });
						} else {
							/**
							 * Player is Ofline So Send Push Notification
							 */
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							Game.Logger.debug('+ Player Ofline +');
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
						}

					});

			});

	},


	/**
	 * Invite Responce Shark Pool
	 */

	inviteresponcesharkpool: function (data, cb) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.fromPlayerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return cb(err) }
				if (!player) {
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					Game.Logger.debug('+ Player Not Found +');
					Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
					return cb(new Error('Player not found'));
				}

				/**
				 * Add Player in Friends List to Player
				 */
				var fr_frd = player.sharkpool_friends;
				var fr_isAvilable = false;
				fr_frd.forEach(function (ply, key) {
					if (ply.friend_id == data.toPlayerId) {
						fr_isAvilable = true;
						ply.status = "friend";
					}

					if (fr_isAvilable == true && data.status == 'reject') {
						fr_frd.splice(key, 1); // Remove Player
					}

				});

				var player_name = player.username;

				Game.AppSource.Player.Models.Player.findOne({ id: data.toPlayerId })
					.exec(function (err, player) {
						if (err) { console.log(err); return cb(err) }
						if (!player) {
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							Game.Logger.debug('+ Player Not Found +');
							Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
							return cb(new Error('Player not found'));
						}


						if (!fr_isAvilable && data.status == 'accept') {
							fr_frd.push({
								friend_id: data.toPlayerId,
								friend_name: player.username,
								status: "friend"
							});
						}

						/**
						 * Add Player in Friends List to Player
						 */
						var frd = player.sharkpool_friends;
						var isAvilable = false;
						frd.forEach(function (ply, key) {
							if (ply.friend_id == data.fromPlayerId) {
								isAvilable = true;
								ply.status = "friend";
							}
							if (isAvilable == true && data.status == 'reject') {
								frd.splice(key, 1); // Remove Player
							}
						});

						if (!isAvilable && data.status == 'accept') {
							frd.push({
								friend_id: data.fromPlayerId,
								friend_name: player_name,
								status: "friend"
							});
						}

						Game.AppSource.Player.Models.Player.update({ id: data.fromPlayerId }, { sharkpool_friends: fr_frd })
							.exec((err, frm_players) => {
								if (err) { return cb(err); }

								Game.AppSource.Player.Models.Player.update({ id: data.toPlayerId }, { sharkpool_friends: frd })
									.exec((err, to_players) => {
										if (err) { return cb(err); }

										console.log(player.socket_id);

										if (data.status == 'accept') {
											Game.Io.to(player.socket_id).emit('sharkpoolInvitationRes', { fromPlayerId: data.fromPlayerId, fromPlayerName: frm_players.username, status: 'accept' });
										} else {
											Game.Io.to(player.socket_id).emit('sharkpoolInvitationRes', { fromPlayerId: data.fromPlayerId, fromPlayerName: frm_players.username, status: 'reject' });
										}

										return cb(null, player.id);
									});

							});


					})
			})
	},



	/**
	 * Get Coin Shark pool 
	 */

	getcoinsharkpool: function (data, callback) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return callback(err) }
				if (player.sharkpool) {

					Game.AppSource.Player.Models.Player.findOne({ id: data.getPlayerId })
						.exec(function (err, getplayer) {
							if (err) { console.log(err); return callback(err) }

							if (getplayer.coin > 1000) {
								var getcoin = (parseInt(getplayer.coin) * 1) / 100;
								player.coin = parseInt(player.coin) + getcoin;
								getplayer.coin = parseInt(getplayer.coin) - getcoin;

								Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player.socket_id,player.id,player.coin,player.level,function (err) { });

								Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(getplayer.socket_id,getplayer.id,getplayer.coin,getplayer.level,function (err) { });


								// Game.Io.to(player.socketid).emit("coinupdated", {
								// 	playerid: player.id,
								// 	coin: parseInt(player.coin),
								// 	level: parseInt(player.level)
								// });

								Game.AppSource.Player.Models.Player.update({ id: player.id }, { coin: player.coin })
									.then(function (p_data) {
										if (err) { console.log(err); return callback(err) }

										Game.AppSource.Player.Models.Player.update({ id: getplayer.id }, { coin: getplayer.coin })
											.then(function (pdata) {
												if (err) { console.log(err); return callback(err) }
												callback(null, pdata);
											});
									});

							} else {
								callback(new Error('Player Have Minimum Coin'));
							}

						});

				} else {
					callback(new Error('Please Purchase Shark Pool'));
				}

			});
	},






	/**
	 * Friends List 
	 */

	friendslist: function (data, callback) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return callback(err) }
					let task = []
					player.friends.forEach(function(plr){
						task.push(function(callback){
							Game.AppSource.Player.Models.Player.findOne({ id: plr.friend_id })
							.exec(function (err, player) {
								//console.log(player);
								callback(null,{
									id : plr.friend_id,
									name : player.username,
									avatar : player.selected_avatar,
								})
							});
						})
					});
					async.parallel(task,function(err, results) {
						callback(null, results);
					});
		 
			});
	},




	/**
	 * Send Coins
	 */

	sendcoins: function (data, callback) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.fromPlayerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return callback(err) }
					Game.AppSource.Player.Models.Player.findOne({ id: data.toPlayerId })
						.exec(function (err, toplayer) {
							if (err) { console.log(err); return callback(err) }
							if (player.coin > 1000) {
								player.coin = parseInt(player.coin) - 100;
								toplayer.coin = parseInt(toplayer.coin) + 100;

								Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player.socket_id,player.id,player.coin,player.level,function (err) { });

								Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(toplayer.socket_id,toplayer.id,toplayer.coin,toplayer.level,function (err) { });

								// Game.Io.to(player.socketid).emit("coinupdated", {
								// 	playerid: player.id,
								// 	coin: parseInt(player.coin),
								// 	level: parseInt(player.level)
								// });

								Game.AppSource.Player.Models.Player.update({ id: player.id }, { coin: player.coin })
									.then(function (p_data) {
										if (err) { console.log(err); return callback(err) }

										Game.AppSource.Player.Models.Player.update({ id: toplayer.id }, { coin: toplayer.coin })
											.then(function (pdata) {
												if (err) { console.log(err); return callback(err) }
												callback(null, pdata);
											});
									});

							} else {
								callback(new Error('Player Have Minimum Coin'));
							}

						});
			});
	},








	/**
	 * Rate Us Rewards 
	 */

	rateusrewards: function (data, callback) {
		Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
			.exec(function (err, player) {
				if (err) { console.log(err); return callback(err) }

				player.coin = parseInt(player.coin) + 100;

				Game.AppSource.Player.Models.Player.update({ id: player.id }, { coin: player.coin })
					.then(function (p_data) {
						if (err) { console.log(err); return callback(err) }

						Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(p_data.socket_id,p_data.id,p_data.coin,p_data.level,function (err) { });

						// Game.Io.to(p_data.socketid).emit("coinupdated", {
						// 	playerid: p_data.id,
						// 	coin: parseInt(p_data.coin),
						// 	level: parseInt(p_data.level)
						// });

						callback(null, p_data);
					});
			});
	},

}
