var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Player = require('./Player');
var Yaniv = require('./Yaniv');
var config = require('./Config');

module.exports = Table = Table

function Table(callYaniv, gameOverPoint, jokersCount, room) {
	Game.Logger.info('New Table Created')
	this.callYaniv = callYaniv;
	this.gameOverPoint = gameOverPoint;
	this.jokersCount = jokersCount;
	this.minPlayers = config.minPlayers;
	this.maxPlayers = config.maxPlayers;
	this.room = room;
	this.id = room.id;
	this.players = [];
	this.currentTurn = null;
	this.on('StartNewRound', this.startNewRound);
}

util.inherits(Table, EventEmitter);

Table.prototype.startGame = function(){
	if (!this.game) {
		this.game = new Yaniv(this.callYaniv, this.gameOverPoint, this.jokersCount, this);
		Game.Logger.info('Game starting on table');
		this.game.emit('StartGame');
	}
}

Table.prototype.addPlayer = function(playerId,name){
	Game.Logger.info('New player added to table')
	var table = this;
	if(table.players.length < table.maxPlayers){
		table.players.push(new Player(playerId, name, table));
		return table;
	}else{
		console.log(new Error("Can't add new user limit exceeded."));
		return table;
	}
}
Table.prototype.getCurrentPlayer = function(){
	return this.players[ this.currentPlayer ];
};

Table.prototype.startNewRound = function(){
	Game.Logger.info('New round started.')
	var table = this;
	if(this.hasOwnProperty('game') &&  this.game.status == 'IN_PROGRESS'){
		if(table.currentPlayer == null){
			table.currentPlayer == 0;
			Game.emit('TableNewRoundStarted',{

			});
			Game.emit('TablePlayerTurn',{
				
			});
		}
	}
};
