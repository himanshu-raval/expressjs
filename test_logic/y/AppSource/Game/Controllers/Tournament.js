var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Table = require('./Table');
var Player = require('./Player');
var TournamentService = require('./TournamentService');
var TableService = require('./TableService');
var Yaniv = require('./Yaniv');



function Tournament(name, id, callYaniv, gameOverPoint, jokersCount, maxPlayers, playersOnTable, playerCount, joiningCoin, totalCoin, level,fees, status, players, losers, winners, tables, phase_player, phase) {
	var tournament = this
	this.name = name;
	this.id = id;
	this.callYaniv = callYaniv;
	this.gameOverPoint = gameOverPoint;
	this.jokersCount = jokersCount;
	this.maxPlayers = maxPlayers;
	this.playersOnTable = playersOnTable;
	this.playerCount = playerCount;
	this.joiningCoin = joiningCoin;
	this.totalCoin = totalCoin;
	this.level = level;
	this.fees = fees;
	this.status = status;
	this.tables = tables;
	this.phase_player = phase_player;
	this.phase = phase;

    /**
     * For Add Players
     */
	this.players = [];
	if (players && players.length > 0) {
		players.forEach(function (player) {
			tournament.players.push(new Player(player.id, player.username, null, player.hand, player.robotcount, player.socketid, player.level, player.avatar, player.card))
		})
	}
    /**
     * For Add Losers
     */
	this.losers = [];
	if (losers && losers.length > 0) {
		losers.forEach(function (loser) {
			tournament.losers.push(new Player(loser.id, loser.username, null, loser.hand, loser.robotcount, loser.socketid, loser.level, loser.avatar, loser.card))
		})
	}

    /**
     * For Add Winnes
     */
	this.winners = [];
	if (winners && winners.length > 0) {
		winners.forEach(function (winner) {
			tournament.winners.push(new Player(winner.id, winner.username, null, winner.hand, winner.robotcount, winner.socketid, winner.level, winner.avatar, winner.card))
		})
	}

	// /**
	//  * For Add Tables
	//  */
	// this.tables = [];
	// if (tables && tables.length > 0) {
	// 	tournament.tables = tables;
	// }

	this.on('StartTournament', this.StartTournament);
}

util.inherits(Tournament, EventEmitter);

Tournament.prototype.toJson = function () {
	var players = [];
	var losers = [];
	var winners = [];
	this.players.forEach(function (player) {
		players.push(player.toJson())
	})
	this.losers.forEach(function (player) {
		losers.push(player.toJson())
	})
	this.winners.forEach(function (player) {
		winners.push(player.toJson())
	})

	var tournament = {
		name: this.name,
		id: this.id,
		callYaniv: this.callYaniv,
		gameOverPoint: this.gameOverPoint,
		jokersCount: this.jokersCount,
		maxPlayers: this.maxPlayers,
		playersOnTable: this.playersOnTable,
		playerCount: this.playerCount,
		joiningCoin: this.joiningCoin,
		totalCoin: this.totalCoin,
		level: this.level,
		fees: this.fees,
		status: this.status,
		players: players,
		losers: losers,
		winners: winners,
		tables: this.tables,
		phase_player: this.phase_player,
		phase: this.phase

	}

	if (this.id) {
		tournament.id = this.id
	}
	if (this.game) {
		tournament.game = this.game.toJson()
	}
	return tournament
}


Tournament.prototype.addPlayerTotable = function (player, callback) {
	Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
	Game.Logger.debug('+ Add Player To Table +');
	Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
	var tournament = this;

	// callYaniv: 7,
	// gameOverPoint: 100,
	// playersCount: 4,
	// level: '59648dd7cc9c65a269686685',
	var data = {};
	data.callYaniv = this.callYaniv;
	data.gameOverPoint = this.gameOverPoint;
	data.level = this.level;
	data.jokersCount = this.jokersCount;
	data.playersCount = 2;
	data.type = 'tournament',
		data.status = 'waiting';


	Game.AppSource.Game.Controllers.TableService.getTournamentTable(data, function (err, table) {
		if (err) {
			return callback(err);
		}
		var phase = player.phase;
		delete player.phase;
		if (table) {
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
			Game.Logger.debug('+ TOURNAMENT TABLE FOUND  +');
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
			table.addPlayer(player, function (err, table) {
				if (err) {
					return console.log(err)
				}
				table.playersTotal = parseInt(table.playersTotal) + 1; // Add 1 when Player Join Table
				Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
					if (err) {
						return callback(err);
					}
					Game.Io.sockets.connected[player.socketid].join(table.id);
					/**
					 * Save Table in Tournament
					 */

					var playerData = {
						playerid: player.id,
						username: player.username,
						profile: player.selected_avatar,
						level: 0,
						phase: phase,
						point: 0,
						totalplayer: tournament.players.length + 1
					};
					if (phase == 'sf') {
						tournament.phase_player.sf.push({
							"tableId": table.id,
							"playerData": playerData
						});
					} else if (phase == 'fi') {
						tournament.phase_player.fi.push({
							"tableId": table.id,
							"playerData": playerData
						});
					} else {
						tournament.phase_player.qf.push({
							"tableId": table.id,
							"playerData": playerData
						});
					}


					if (phase == 'qf') {
						player.hand = {};
						tournament.players.push(new Player(player.id, player.username, tournament, player.hand, 0, player.socketid, player.level, player.selected_avatar, player.selected_card));
						tournament.playerCount++
					} else {
						player.hand = {};
						tournament.winners.push(new Player(player.id, player.username, tournament, player.hand, 0, player.socketid, player.level, player.selected_avatar, player.selected_card));
					}



					Game.Io.to(tournament.id).emit('TournamentPlayerJoin', {
						"tableid": table.id,
						"playerdata": playerData
					});

					TournamentService.updateTournament(tournament, function (err, tournament) { // Update Tournaments
						if (err) {
							return callback(err);
						}
						return callback(null, table.id);
					});
				})
			})


		} else {
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
			Game.Logger.debug('+ TOURNAMENT TABLE NOT-FOUND  +');
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');


			var tempTable = new Table(tournament.id, data.callYaniv, data.gameOverPoint, data.level, data.jokersCount, 'tournament', data.playersCount, 0, 'waiting', undefined, [], null, null, []);
			TableService.createTable(tempTable, function (err, table) {
				if (err) {
					return callback(err);
				}

				table.addPlayer(player, function (err, table) {
					if (err) {
						return callback(err);
					}
					table.playersTotal = parseInt(table.playersTotal) + 1; // Add 1 when Player Join Table
					Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
						if (err) {
							return callback(err);
						}
						Game.Io.sockets.connected[player.socketid].join(table.id);
						/**
						 * Save Table in Tournament
						 */

						// tournament.phase_player.qf[table.id] = [];

						var playerData = {
							playerid: player.id,
							username: player.username,
							profile: player.selected_avatar,
							level: 0,
							phase: phase,
							point: 0,
							totalplayer: tournament.players.length + 1
						};

						if (phase == 'sf') {
							tournament.tables.sf.push({ id: table.id });
							tournament.phase_player.sf.push({
								"tableId": table.id,
								"playerData": playerData
							});
						} else if (phase == 'fi') {
							tournament.tables.fi.push({ id: table.id });
							tournament.phase_player.fi.push({
								"tableId": table.id,
								"playerData": playerData
							});
						} else {
							tournament.tables.qf.push({ id: table.id });
							tournament.phase_player.qf.push({
								"tableId": table.id,
								"playerData": playerData
							});
						}


						if (phase == 'qf') {
							player.hand = {};
							tournament.players.push(new Player(player.id, player.username, tournament, player.hand, 0, player.socketid, player.level, player.selected_avatar, player.selected_card));
							tournament.playerCount++
						} else {
							player.hand = {};
							tournament.winners.push(new Player(player.id, player.username, tournament, player.hand, 0, player.socketid, player.level, player.selected_avatar, player.selected_card));
						}


						Game.Io.to(tournament.id).emit('TournamentPlayerJoin', {
							"tableId": table.id,
							"playerData": playerData
						});
						TournamentService.updateTournament(tournament, function (err, tournament) { // Update Tournaments
							if (err) {
								return callback(err);
							}
							return callback(null, table.id);
						});
					})
				})
			})
		}
	});
}

Tournament.prototype.startGame = function () {
	Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
	Game.Logger.debug('+ Tournament Game Start +');
	Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
	let tournament = this;

	let ids = tournament.tables.qf.map(function (item) {
		return item.id;
	})
	Game.AppSource.Game.Controllers.TableService.getTablesData({ id: ids }, function (err, tbls) {
		if (err) {
			return;
		}

		tbls.forEach(function (table, key) {
			// console.log("Table : ",table);
			table.emit('StartGameProcess');
			table.status = 'IN_PROGRESS';
			Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
				if (err) {
					return;
				}
				return;
			})
		});
	});

	tournament.status = "IN_PROGRESS";
	TournamentService.updateTournament(tournament, function (err, tournament) { // Update Tournaments

	});

	//let tablesCount = this.maxPlayers / this.playersOnTable
	// var tables = []
	// for (let i = 0; i < tablesCount; i++) {
	// 	tables.push(new Table(this.callYaniv, this.gameOverPoint, this.level, this.jokersCount, 'tournament', 4, 0, 'waiting', undefined, [], null, null, []));

	// }

	// Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
	// Game.Logger.debug('+ Tournament Tables Data +', tables);
	// Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

	// // save the tables to the database
	// (function savetables(index) {
	// 	console.log("We Are on Save Tables ");
	// 	if (index == tables.length) {
	// 		startAllGames();
	// 	} else {

	// 		Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
	// 		Game.Logger.debug('+ Table +', tables[index]);
	// 		Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
	// 		TableService.createTable(tables[index], function (err, table) {
	// 			if (err) {
	// 				return
	// 			}
	// 			/**
	// 			 * Save Table in Tournament
	// 			 */
	// 			tournament.tables.push({ id: table.id });


	// 			tables[index] = table
	// 			savetables(index + 1);
	// 		})
	// 	}
	// })(0)
	// function startAllGames() {
	// 	for (let i = 0; i < tablesCount; i++) {
	// 		for (let j = 0; j < tournament.playersOnTable; j++) {
	// 			console.log('tournament players index', (i * tournament.playersOnTable) + j)
	// 			tables[i].addPlayer(tournament.players[(i * tournament.playersOnTable) + j], function (err, table) {
	// 				if (err) {
	// 					return console.log(err)
	// 				}
	// 				table.playersTotal = parseInt(table.playersTotal) + 1; // Add 1 when Player Join Table
	// 				Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
	// 					if (err) {
	// 						return console.log(err)
	// 					}
	// 					Game.Io.sockets.connected[tournament.players[(i * tournament.playersOnTable) + j].socketid].join(table.id);
	// 				})
	// 			})
	// 		}
	// 	}

	// 	TournamentService.updateTournament(tournament, function (err, tournament) { // Update Tournaments
	// 	});
	// }


}

Tournament.prototype.StartTournament = function (count) {
	var tournament = this;
	console.log("TournamentStrting");
	Game.Io.to(tournament.id).emit('TournamentStrting', { tournamentId: tournament.id, count: count })
	if (count == 0) {
		setTimeout(function (tournament) {
			tournament.startGame();
		}, 1000, tournament)
	} else {
		setTimeout(function (count, tournament) {
			tournament.StartTournament(count - 1);
		}, 1000, count, tournament)
	}
}

Tournament.prototype.addPlayer = function (player, callback) {
	var tournament = Game.Tournaments[this.id];
	console.log("Add Player in Tournaments ::",player.username);

	if (tournament.players.length < tournament.maxPlayers) {
		if (tournament.hasPlayer(player.id)) {
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
			Game.Logger.debug('+ Can Not ADD, Player Already in Tournament + ');
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

			return callback(null, tournament);

			//return cb(new Error("Can't add. Player already in tournament."));
		}

		// player.phase = 'qf';
		// tournament.addPlayerTotable(player, function (err, tableid) { // Update Tournaments
		// 	if (err) {
		// 		return cb(err);
		// 	}
		//	Game.Logger.debug('+ Player Table ID +', tableid);
		// tournament.players.push(new Player(player.id, player.username, tournament, player.hand, player.robotcount, player.socketid,player.level,player.selected_avatar,player.selected_card));
		// tournament.playerCount++

		var data = {};
		//data.id = this.tournament.id;

		var totalPlayer = tournament.players.length;
		var table_id = 0;
		if (totalPlayer >= 0 && totalPlayer < 2) {
			table_id = tournament.tables.qf[0].id;
		} else if (totalPlayer >= 2 && totalPlayer < 4) {
			table_id = tournament.tables.qf[1].id;
		} else if (totalPlayer >= 4 && totalPlayer < 6) {
			table_id = tournament.tables.qf[2].id;
		} else {
			table_id = tournament.tables.qf[3].id;
		}
		data.id = table_id;
		var phase = 'qf';
		Game.AppSource.Game.Controllers.TableService.getTable(data, function (err, table) {
			if (err) {
				return callback(err);
			}

			player.robotcount = 0;
			table.addPlayer(player, function (err, table) {
				if (err) {
					return console.log(err);
					return callback(err);
				}
				table.playersTotal = parseInt(table.playersTotal) + 1; // Add 1 when Player Join Table
				Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
					if (err) {
						return callback(err);
					}
					Game.Io.sockets.connected[player.socketid].join(table.id);
					/**
					 * Save Table in Tournament
					 */

					var playerData = {
						playerid: player.id,
						username: player.username,
						profile: player.selected_avatar,
						level: 0,
						phase: phase,
						point: 0,
						totalplayer: tournament.players.length + 1
					};
					if (phase == 'sf') {
						tournament.phase_player.sf.push({
							"tableId": table.id,
							"playerData": playerData
						});
					} else if (phase == 'fi') {
						tournament.phase_player.fi.push({
							"tableId": table.id,
							"playerData": playerData
						});
					} else {
						tournament.phase_player.qf.push({
							"tableId": table.id,
							"playerData": playerData
						});
					}


					if (phase == 'qf') {
						player.hand = {};
						tournament.players.push(new Player(player.id, player.username, tournament, player.hand, 0, player.socketid, player.level, player.selected_avatar, player.selected_card));
						tournament.playerCount++
					} else {
						player.hand = {};
						tournament.winners.push(new Player(player.id, player.username, tournament, player.hand, 0, player.socketid, player.level, player.selected_avatar, player.selected_card));
					}



					Game.Io.to(tournament.id).emit('TournamentPlayerJoin', {
						"tableid": table.id,
						"playerdata": playerData
					});

					TournamentService.updateTournament(tournament, function (err, tournament) { // Update Tournaments
						if (err) {
							return callback(err);
						}
						//return callback(null, table.id);

	
						if (tournament.players.length == tournament.maxPlayers) {
							tournament.StartTournament(5);
						}
						return callback(null, tournament);

					});
				})
			})
		});
		//});
	} else {
		return callback(new Error("Can't add new user limit exceeded."));
	}
}

Tournament.prototype.addWinners = function (player, callback) {
	var tournament = Game.Tournaments[this.id];
	// console.log("Player for Join With Socket HR :",player);
	var phase = 'qf';
	var data = {};
	var totalPlayer = tournament.winners.length;
	console.log("Winners Count : ", totalPlayer);
	var table_id = 0;
	if (tournament.phase == 'qf') {
		phase = 'sf';

		if (totalPlayer >= 0 && totalPlayer < 2) {
			table_id = tournament.tables.sf[0].id;
		} else {
			table_id = tournament.tables.sf[1].id;
		}
		data.id = table_id;
	} else {
		phase = 'fi';
		data.id = tournament.tables.fi[0].id;
	}

	if (tournament.phase == 'fi') {
		player.hand = {};
		tournament.winners.push(new Player(player.id, player.username, tournament, player.hand, 0, player.socketid, player.level, player.selected_avatar, player.selected_card));



		TournamentService.updateTournament(tournament, function (err, tournament) { // Update Tournaments
			if (err) {
				return callback(err);
			}
			//return callback(null, table.id);

			return callback(null, tournament);

		});
	} else {

		Game.AppSource.Game.Controllers.TableService.getTable(data, function (err, table) {
			if (err) {
				return callback(err);

			}
			console.log("Table  : ", table.id);
			console.log("Add Player : ", player.username);

			player.robotcount = 0;
			player.hand = {};
			table.addPlayer(player, function (err, table) {
				if (err) {
					return console.log(err);
					return callback(err);
				}
				table.playersTotal = parseInt(table.playersTotal) + 1; // Add 1 when Player Join Table
				Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
					if (err) {
						return callback(err);
					}
					Game.Io.sockets.connected[player.socketid].join(table.id);
					/**
					 * Save Table in Tournament
					 */

					var playerData = {
						playerid: player.id,
						username: player.username,
						profile: player.selected_avatar,
						level: 0,
						phase: phase,
						point: 0,
						totalplayer: tournament.winners.length + 1
					};
					if (phase == 'sf') {
						tournament.phase_player.sf.push({
							"tableId": table.id,
							"playerData": playerData
						});
					} else if (phase == 'fi') {
						tournament.phase_player.fi.push({
							"tableId": table.id,
							"playerData": playerData
						});
					} else {
						tournament.phase_player.qf.push({
							"tableId": table.id,
							"playerData": playerData
						});
					}

					Game.Io.to(tournament.id).emit('TournamentTreeUpdate', {
						"tableid": table.id,
						"playerdata": playerData
					});

					player.hand = {};
					tournament.winners.push(new Player(player.id, player.username, tournament, player.hand, 0, player.socketid, player.level, player.selected_avatar, player.selected_card));



					TournamentService.updateTournament(tournament, function (err, tournament) { // Update Tournaments
						if (err) {
							return callback(err);
						}
						//return callback(null, table.id);

						return callback(null, tournament);

					});
				})
			})
		});

	}


	// if(tournament.phase != 'fi'){
	// 	tournament.addPlayerTotable(player, function (err, tableid) { // Update Tournaments
	// 		if (err) {
	// 			return cb(err);
	// 		}
	// 		Game.Logger.debug('+ Player Table ID +', tableid);
	// 		//tournament.winners.push(new Player(player.id, player.username, tournament, player.hand, player.robotcount, player.socketid,player.level,player.avatar,player.card));
	// 		// tournament.playerCount++
	// 		// if (tournament.players.length == tournament.maxPlayers) {
	// 		// 	tournament.StartTournament(5);
	// 		// }
	// 		return cb(null, tournament);
	// 	});

	// }else{
	// 	return cb(null, tournament);
	// }
	// } else {
	// 	return cb(new Error("Can't add Player."));
	// }
}


Tournament.prototype.hasPlayer = function (id) {
	var isPresent = false
	this.players.forEach(function (player) {
		if (player.id == id) {
			isPresent = true
		}
	});
	return isPresent
};

Tournament.prototype.startNewRound = function () {

	Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
	Game.Logger.debug('+ Start New Round  Tournament +');
	Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

	var tournament = Game.Tournaments[this.id];

	Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
	Game.Logger.debug('+ Tournament +', tournament);
	Game.Logger.debug('+ Winners length = ', tournament.winners.length);
	Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');



	if (tournament.winners.length == 1) {
		// tournament finished
		Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
		Game.Logger.debug('+ Winners length is ONE So Tournament Finished +');
		Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
		tournament.status == 'FINISHED';
		var tot = parseInt(tournament.players.length);
		var totalWinningAmount = tot * parseInt(tournament.fees);
		var one_amount = (totalWinningAmount * 50)/100;
		var two_amount = (totalWinningAmount * 30)/100;
		var three_amount = (totalWinningAmount * 15)/100;
		var four_amount = (totalWinningAmount * 5)/100;

		// Update Tournament


		var winner = [];
		winner[0] = {
			id : tournament.winners[0].id,
			username: tournament.winners[0].username,
			avatar:tournament.winners[0].avatar,
			coins: one_amount
		};

		winner[1] = {
			id : tournament.losers[tournament.losers.length - 1].id,
			username: tournament.losers[tournament.losers.length - 1].username,
			avatar: tournament.losers[tournament.losers.length - 1].avatar,
			coins: two_amount
		};
		winner[2] = {
			id : tournament.losers[tournament.losers.length - 2].id,
			username: tournament.losers[tournament.losers.length - 2].username,
			avatar: tournament.losers[tournament.losers.length - 2].avatar,
			coins: three_amount
		};
		winner[3] = {
			id : tournament.losers[tournament.losers.length - 3].id,
			username: tournament.losers[tournament.losers.length - 3].username,
			avatar: tournament.losers[tournament.losers.length - 3].avatar,
			coins: four_amount
		}
		Game.Io.to(tournament.id).emit('TournamentFinished', {winner});
		// Game.Io.to(tournament.id).emit('TournamentFinished', {
		// 	winner_one: tournament.winners[0].id,
		// 	winner_one_username: tournament.winners[0].username,
		// 	winner_one_avatar: tournament.winners[0].avatar,
		// 	winner_one_coins: one_amount,
		// 	winner_two: tournament.losers[tournament.losers.length - 1].id,
		// 	winner_two_username: tournament.losers[tournament.losers.length - 1].username,
		// 	winner_two_avatar: tournament.losers[tournament.losers.length - 1].avatar,
		// 	winner_two_coins: two_amount,
		// 	winner_three: tournament.losers[tournament.losers.length - 2].id,
		// 	winner_three_username: tournament.losers[tournament.losers.length - 2].username,
		// 	winner_three_avatar: tournament.losers[tournament.losers.length - 2].avatar,
		// 	winner_three_coins: three_amount,
		// 	winner_four: tournament.losers[tournament.losers.length - 3].id,
		// 	winner_four_username: tournament.losers[tournament.losers.length - 3].username,
		// 	winner_four_avatar: tournament.losers[tournament.losers.length - 3].avatar,
		// 	winner_four_coins: four_amount
		// });


		tournament.status = 'FINISHED';
		TournamentService.updateTournament(tournament, function (err, tournament) { // Update Tournaments
			Game.Logger.debug('+ Tournament updated after winers brodcast +');
		});
		return; // End Tournament
	}

	//let remainder = this.winners.length % this.playersOnTable;
	// let tablesCount = this.winners.length / this.playersOnTable;
	// var count = 4;
	// console.log("tablesCount = ", tablesCount);
	// if (tablesCount < 1) {
	// 	tablesCount = 1;
	// 	count = this.winners.length;
	// }

	// console.log("count = ", count);

	//var tables = []

	// for (let i = 0; i < tablesCount; i++) {
	// 	tables.push(new Table(this.callYaniv, this.gameOverPoint, this.level, this.jokersCount, 'tournament', count, 0, 'waiting', undefined, [], null, null, []));

	// }

	// (function savetables(index) {
	// 	console.log("We Are on Save Tables --- ", tables.length);
	// 	console.log("We Are on Save Tables --- ", index);

	// 	if (index == tables.length) {
	// 		console.log("startAllGamesNewRound before ");
	// 		startAllGamesNewRound();

	// 	} else {

	// 		Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
	// 		Game.Logger.debug('+ Table +', tables[index]);
	// 		Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
	// 		TableService.createTable(tables[index], function (err, table) {
	// 			if (err) {
	// 				return
	// 			}
	// 			/**
	// 			 * Save Table in Tournament
	// 			 */
	// 			tournament.tables.push({ id: table.id });
	// 			tables[index] = table
	// 			savetables(index + 1);
	// 		})
	// 	}
	// })(0)


	// function startAllGamesNewRound() {




	// 	console.log("tablesCount : ", tablesCount);
	// 	for (let i = 0; i < tablesCount; i++) {
	// 		console.log(" tables[i].playerCount : ", tables[i].playersCount);
	// 		for (let j = 0; j < tables[i].playersCount; j++) {
	// 			console.log('New Rouund Tournament players index', (i * tables[i].playersCount) + j)
	// 			tables[i].addPlayer(util._extend({}, tournament.winners[(i * tables[i].playersCount) + j]), function (err, table) {
	// 				if (err) {
	// 					return console.log(err)
	// 				}
	// 				table.playersTotal = parseInt(table.playersTotal) + 1; // Add 1 when Player Join Table
	// 				Game.Io.sockets.connected[tournament.winners[(i * tables[i].playersCount) + j].socketid].join(table.id);
	// 				Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
	// 					if (err) {
	// 						return console.log(err)
	// 					}
	// 				})
	// 			})
	// 		}
	// 	}



	// if(tournament.phase == 'qf'){
	// 	tournament.phase_player.sf = util._extend({},tournament.winners)
	// 	tournament.phase = 'sf';
	// }else{
	// 	tournament.phase_player.fi = util._extend({},tournament.winners)
	// 	tournament.phase = 'fi';
	// }

	var ids = "";
	if (tournament.phase == 'qf') {
		ids = tournament.tables.sf.map(function (item) {
			return item.id;
		})
	} else {
		ids = tournament.tables.fi.map(function (item) {
			return item.id;
		})
	}
	console.log("ids =", ids);
	Game.AppSource.Game.Controllers.TableService.getTablesData({ id: ids }, function (err, tbls) {
		if (err) {
			return;
		}
		console.log("Tables List", tbls);

		tbls.forEach(function (table, key) {
			//console.log("Table : ",table);
			//if(table.players.length > 0){
			table.emit('StartGameProcess');
			table.status = 'IN_PROGRESS';
			Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
				if (err) {
					return;
				}
				return;
			});
			//}
		});
	});


	if (tournament.phase == 'qf') {
		tournament.phase = 'sf';
	} else {
		tournament.phase = 'fi';
	}

	tournament.winners = [];  // Clear All Winner Player

	TournamentService.updateTournament(tournament, function (err, tournament) { // Update Tournaments
		console.log("Tournament Updated AFTER Start New Round :");
	});


	//}
};

module.exports = Tournament;
