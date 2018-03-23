var util = require('util');
const async = require('async');
var EventEmitter = require('events').EventEmitter;

var Player = require('./Player');
var Yaniv = require('./Yaniv');

function Table(tournamentId,callYaniv, gameOverPoint,level, jokersCount, type, playersCount,playersTotal,status, id, players, currentTurn, game, losers,chat) {
	var table = this
	this.tournamentId = tournamentId;
	this.callYaniv = callYaniv;
	this.gameOverPoint = gameOverPoint;
	this.jokersCount = jokersCount;
	this.type = type;
	this.playersCount = playersCount;
	this.playersTotal = playersTotal;
	this.status = status;
	this.level = level; // save id of table level/location/landmark
	this.id = id;
	this.chat = [];
	// if(chat.length){
	// 	this.chat = chat;
	// }else{
	// 	this.chat = [];
	// }
	this.players = [];
	if(players.length > 0){
		players.forEach(function(player){
			table.players.push(new Player(player.id, player.username, table, player.hand, player.robotcount,player.socketid,player.level,player.avatar,player.card))
		})
	}else{
		this.players = players;
	}
	this.losers = [];
	if(losers.length > 0){
		losers.forEach(function(loser){
			table.addLoser(loser, function(){})
		})
	}else{
		this.losers = losers;
	}
	if(game){
		this.game = new Yaniv(game.callYaniv, game.gameOverPoint, game.jokersCount, table, game.roundNumber, game.point, game.roundPoints,game.deck, game.board, game.lastTurnCards);
	}
	this.currentTurn = currentTurn;
	this.on('StartNewRound', this.startNewRound);
	this.on('StartTurn', this.StartTurn);
	this.on('StartGameProcess', this.StartGameProcess);
}

util.inherits(Table, EventEmitter);


Table.prototype.startGame = function(){
	if (!this.game) {

		if(this.type == 'sit-and-go'){ // Cut Player Coin When Game Start
			let room = this;


				let task = []
			room.players.forEach(function (plr) {
				task.push(function (callback) {
					 
					Game.AppSource.Player.Models.Player.findOne({ id: plr.id })
						.exec(function (err, player) {
							Game.AppSource.Shop.Models.Landmark.findOne({ id: room.level })
								.exec((err, landmark) => {
									if (err) {
										console.log(err);
										callback(err)
									}
									
									let levelCoin = parseInt(landmark.coin);
									let beforeCoin = parseInt(player.coin);
									var player_final_point = parseInt(player.coin) - parseInt(levelCoin);
										Game.AppSource.Player.Models.Player.update({ id: player.id }, { coin: player_final_point })
										.then(function (p_data) {

											Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player.socket_id, player.id, player_final_point, player.level, function (err) { });

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
													callback(err)
												}
												callback(null, { 'player': plr.id });
											})

										})
										.catch(function (err) {
											callback(err);
										});
								})
						});
				})
			});
				async.parallel(task,function(err, results) {
					//callback(null, results);
					room.game = new Yaniv(room.callYaniv, room.gameOverPoint,room.jokersCount, room,0, [], [],null, [], []);
					Game.Logger.info('Game starting on table');
					room.game.emit('StartGame');
				});


		}else{
			this.game = new Yaniv(this.callYaniv, this.gameOverPoint,this.jokersCount, this,0, [], [],null, [], []);
			Game.Logger.info('Game starting on table');
			
			this.game.emit('StartGame');
		}




		
	}
}


Table.prototype.StartGameProcess = function(){
	var table = this;
	// Game.Io.to(this.id).emit('GameStarting', this.toJson());
	Game.Io.to(table.id).emit('GameStarting', {});

	table.players.forEach(function(data){
		// Add Player To 5 XP
		Game.AppSource.Game.Controllers.CoinGame.PlayerXpUpdated(data.id,5).then(function (data) { return; }, function (err) { return; });
	});
	setTimeout(function(table, id){
		table.id = id
		table.startGame();
	},2000, table, table.id)
}
Table.prototype.toJson = function(){
	var players = [];
	var losers = [];
	// var chat = [];
	this.players.forEach(function(player){
		players.push(player.toJson())
	})
	this.losers.forEach(function(player){
		losers.push(player.toJson())
	})
	// this.chat.forEach(function(chats){
	// 	chat.push(chats.toJson())
	// })
	var table = {
		tournamentId : this.tournamentId,
		callYaniv: this.callYaniv,
		gameOverPoint: this.gameOverPoint,
		level: this.level,
		jokersCount: this.jokersCount,
		type: this.type,
		playersCount: this.playersCount,
		status: this.status,
		players: players,
		losers: losers,
		currentTurn: this.currentTurn,
		playersTotal: this.playersTotal,
		chat: this.chat

	}

	if(this.id){
		table.id = this.id
	}
	if(this.game){
		table.game = this.game.toJson()
	}
	return table
}


Table.prototype.StartPlaywithFriendsTable = function (count) {
	var table = this;
	//console.log("StartPlaywithFriendsTable");
	Game.Io.to(table.id).emit('PlayWithFriendStarting', { tableid: table.id, count: count })
	if (count == 0) {

		var players = [];
		table.players.forEach(function(ply) {
			players.push({
				id:ply.id,
				username : ply.username,
				avatar : ply.avatar,
				card : ply.card                    
			})
		}, this);

		var result = {
			 players : players,
			 table_id : table.id
		};

		Game.Io.to(table.id).emit('SetPlayWithFriendTable',result);
	   
		setTimeout(function (table) {
			table.emit('StartGameProcess');
			table.status = 'IN_PROGRESS';
		}, 1000, table);

	} else {
		setTimeout(function (count, table) {
			table.StartPlaywithFriendsTable(count - 1);
		}, 1000, count, table)
	}
}





Table.prototype.addPlayer = function(player, cb){
	var table = this;
	// console.log("Player for Join With Socket HR :",player);
	var playWithFriends = false;

	if(player.gametype != undefined && player.gametype == 'play-with-friends'){
		playWithFriends = true;
		delete player.gametype;
	}

	if(table.players.length < table.playersCount){
		if(table.hasPlayer(player.id)){
			return cb(null, table);
			//return cb(new Error("Can't add. Player already in table."));
		}
		table.players.push(new Player(player.id, player.username, table, player.hand, player.robotcount,player.socketid,player.level,player.avatar,player.card));
		if(table.players.length == table.playersCount){
			if(table.type != 'tournament'){
				if(playWithFriends){
					table.StartPlaywithFriendsTable(5);
				}else{
					table.emit('StartGameProcess');
					table.status = 'IN_PROGRESS';
				}
			}
		}
		return cb(null, table);
	}else{
		return cb(new Error("Can't add new user limit exceeded in table."));
	}
}
Table.prototype.addLoser = function(player, cb){
	var table = this;
	table.losers.push(new Player(player.id, player.username, table, player.hand, player.robotcount,player.socketid,player.level,player.avatar,player.card));
	return cb(null, table);

}
Table.prototype.getCurrentPlayer = function(){

	return this.players[ this.currentTurn ];
};
Table.prototype.getPlayer = function(id){
	var player;
	this.players.forEach(function(player_obj){
		if(player_obj.id == id){
			player = player_obj;
		}
	});
	return player;
};

Table.prototype.hasPlayer = function(id){
	var isPresent = false
	this.players.forEach(function(player){
		if(player.id == id){
			isPresent = true
		}
	});
	return isPresent
};





Table.prototype.startNewRound = function(){
	var table = this;
	// Game.Logger.info('New round started.',table.game)
	if(this.hasOwnProperty('game') &&  this.game.status == 'IN_PROGRESS'){
		if(table.game.roundNumber == 1){
			table.currentTurn = 0;
		}
		// Game.Io.to(table.id).emit('GameCardDistributed', table.toJson());
		var players = [];
		table.players.forEach(function(ply) {
			players.push({
				id:ply.id,
				username : ply.username,
				level: ply.level,
				hand : ply.hand                  
			})
		});
	  
		Game.Io.to(table.id).emit('GameCardDistributed', {data:players});
	
			// Game.Logger.info(table.players)

			/**
			 * Update Player Statistics
			 */
			table.players.forEach(function(player){
				if(table.game.roundNumber == 1){
				  Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'games_played', 1).then(function (data) { return; }, function (err) { return; });
				  Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'locations_played', table.level).then(function (data) { return; }, function (err) { return; });
				}
				 Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id,'round_play',1).then(function(data){return;},function(err){return;}); 
			})
			
			Game.AppSource.Game.Controllers.TableService.updateTable(table, function(err, table){
				if(err){console.log(err); return	}

				var countTimer = table.players.length * 1200;
				console.log("countTimer=",countTimer);

				Game.Timers[table.id] = setTimeout(function(table) {

					table.StartTurn();

				}, countTimer, table);

			})
		
	}
};

Table.prototype.StartTurn = function(){
	var table = this;

//	Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
//	Game.Logger.debug('+ START NEW ROUND +',table);
//	Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

	var players = [];
	table.players.forEach(function(ply) {
		players.push({
			id :ply.id
		});
	});
	var result = {
		currentturn : table.currentTurn,
		players : players,
		board : table.toJson().game.board,
		lastTurnCards : table.lastTurnCards
	};
	//Game.Io.to(table.id).emit('GameRoundStarted', table.toJson());
	Game.Io.to(table.id).emit('GameRoundStarted', result);
	Game.Timers[table.id] = setTimeout(Game.AppSource.Game.Controllers.CoinGame.defaultAction,10000, table.id);
};
module.exports = Table;