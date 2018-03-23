var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Deck = require('./Deck');

module.exports = Yaniv = Yaniv

function Yaniv(callYaniv, gameOverPoint, jokersCount, table) {
    this.callYaniv = callYaniv
    this.gameOverPoint = gameOverPoint;
    this.jokersCount = jokersCount;
    this.table = table;
    this.pot = 0;
    this.roundNumber = 0;
    this.point = [];
    this.roundPoints = [];
    this.deck = new Deck(this.jokersCount);
    this.board = [];
    this.lastTurnCards = [];
    this.on('StartGame', this.startGame);
}

util.inherits(Yaniv, EventEmitter);

Yaniv.prototype.startGame = function(){
    var game = this;
    game.status = 'STARTING';
    game.deck.reset().shuffle();
    for (var i = 0; i < game.table.players.length; i++) {
        game.table.players[i].hand = game.deck.getPlayerHand();
    }
    game.board.push(game.deck.pop(1)[0]);
    game.status = 'IN_PROGRESS';
    Game.Logger.info('Game started successfully.')
    game.table.emit('StartNewRound');
}
Yaniv.prototype.callYaniv = function(){
    var game = this;
    var player = game.table.getCurrentPlayer();
    if(player.hand.renk <= game.callYaniv){
        var assaf = null;
        // check for assaf
        for (var i = 0; i < game.table.players.length; i++) {
            if(game.table.players[i] != game.table.currentPlayer && game.table.players[i].hand.renk <= player.hand.renk){
                assaf = i;
            }
        }
        if(assaf){
            console.log('you lose')
            Game.emit('TableGameCallYanivLose',{});
        }else{
            console.log('you win')
            Game.emit('TableGameCallYanivWin',{});
        }
    }else{
        Game.emit('TableGameCallYanivError',{});
    }
}
