var util = require('util');
var EventEmitter = require('events').EventEmitter;


module.exports = Game = Game;

function Game() {
	this.Util = {},
	this.Config = {},
	this.Timers = {},
	this.Tournaments = {},
	this.Tables = {}
};
util.inherits(Game, EventEmitter);

require('../Events/Game');