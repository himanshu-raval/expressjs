var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Deck = require('./Deck');
var Card = require('./Card');

module.exports = Yaniv = Yaniv

function Yaniv(callYaniv, gameOverPoint, jokersCount, table, roundNumber, point, roundPoints,deck, board, lastTurnCards) {
    var game = this
    this.callYaniv = callYaniv
    this.gameOverPoint = gameOverPoint;
    this.jokersCount = jokersCount;
    this.table = table;
    this.roundNumber = roundNumber | 1;
    if(point.length > 0){
        this.point = point
    }else {
        this.point = [];
        for(let i = 0; i < table.players.length; i++){
           // this.point[table.players[i].id] = 0;
           this.point[i] = {
            id : table.players[i].id,
            point :  0,
            win : 0,
            result : '',
            streak : 0
           }
        }
    }
    if(roundPoints.length){
        this.roundPoints = roundPoints
    }else{
        this.roundPoints = [];
        for(let i = 0; i < table.players.length; i++){
            this.roundPoints.push(0)
        }
    }
    if(deck){
        this.deck = new Deck(this.jokersCount, deck.cards);
    }else{
        this.deck = new Deck(this.jokersCount, []);
    }
    if(board.length){
        this.board = []
        board.forEach(function(card){
            game.board.push(new Card(card.rank, card.suite))
        })
    }else{
        this.board = [];
    }
    if(lastTurnCards.length){
        this.lastTurnCards = []
        lastTurnCards.forEach(function(card){
            game.lastTurnCards.push(new Card(card.rank, card.suite))
        })
    }else{
        this.lastTurnCards = [];
    }
    this.on('StartGame', this.startGame);
    this.on('FindWinners', this.findWinners);
}

util.inherits(Yaniv, EventEmitter);

Yaniv.prototype.toJson = function(){

    var game = {
        callYaniv : this.callYaniv,
        gameOverPoint : this.gameOverPoint,
        jokersCount : this.jokersCount,
        roundNumber : this.roundNumber,
        point : this.point,
        roundPoints : this.roundPoints,
        deck :this.deck.toJson(),
        board : [],
        lastTurnCards : []
    }
    if(this.board.length > 0 ){
        this.board.forEach(function(card){
            if(card){
         
            game.board.push(card.toJson())
            }
        })
    }
    if(this.lastTurnCards.length > 0 ){
        this.lastTurnCards.forEach(function(card){
            game.lastTurnCards.push(card.toJson())
        })
    }
    return game;
}

Yaniv.prototype.startGame = function(){
    var game = this;

    game.status = 'STARTING';
    game.deck.reset().shuffle();
    for (var i = 0; i < game.table.players.length; i++) {
        game.table.players[i].hand = game.deck.getPlayerHand();
    }
    game.board.push(game.deck.pop(1)[0]);
    // game.lastTurnCards.push(game.deck.pop(1)[0]);

   /**
    * Send Player to Table Data.
    */
    game.status = 'IN_PROGRESS';
    Game.Logger.info('Game started successfully.');

    if(game.table.type == 'tournament'){


        var players = [];
        game.table.players.forEach(function(ply) {
            players.push({
                id:ply.id,
                username : ply.username,
                avatar : ply.avatar,
                card : ply.card                    
            })
        }, this);

        var result = {
             players : players,
             table_id : game.table.id
        };

        Game.Io.to(game.table.id).emit('SetTournamentTable',result);
       // setTimeout(function(game){
            game.table.emit('StartNewRound');
        // },2000,game)

    }else{
        game.table.emit('StartNewRound');
    }

}

Yaniv.prototype.startNewRound = function(){
    var game = this;
    game.status = 'IN_PROGRESS';
    game.deck.reset().shuffle();
    for (var i = 0; i < game.table.players.length; i++) {
        game.table.players[i].hand = {}
        game.table.players[i].hand = game.deck.getPlayerHand();
 
    }

    game.board = [];
    game.lastTurnCards = [];
    game.board.push(game.deck.pop(1)[0]);
    Game.Logger.info('Game new round started.')
    game.table.emit('StartNewRound');
}
Yaniv.prototype.findWinners = function(){
    var game = this;
    game.status = 'FINISHED';
    var table = game.table
    var players = table.players
    var loser = table.loser
    Game.AppSource.Shop.Controllers.Landmark.getAll({id:table.landmark},function(err,landmark){
        var coin_per_point = (landmark.length > 0)?landmark[0].coin_per_point:1
        if(players.length == 1 && table.type == 'coin game'){
            var winner = players[0]
            var pot = 0
            var points = table.game.point

        } else{

        }
    })
}