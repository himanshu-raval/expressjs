var Hand = require('./Hand');

module.exports = Player = Player;

function Player(playerId, name, table) {
    this.playerId = playerId;
    this.playerName = name;
    this.table = table; 
    this.hand = {};
}

Player.prototype.swipeWithDeck = function(dropedCards){
    Game.Logger.info('swipeWithDeck called')
    Game.Logger.debug('swipeWithDeck params :', dropedCards)
    var player = this;
    if(this.verifyDropedCards(dropedCards)){
        player.dropCardsToBoard(dropedCards).getCardFromTableDeck();
    }
    return player;
}

Player.prototype.swipeWithBoard = function(dropedCards, pickedCard){
    var player = this;
    if(this.verifyDropedCards(dropedCards)){
        player.getCardFromTableBoard(pickedCard).dropCardsToBoard(dropedCards);
    }
    return player;
}
Player.prototype.verifyDropedCards = function(dropedCards){

    return true;
}
Player.prototype.verifyLastTurnDropedCard = function(pickedCard){
    var player = this;
    for (var i = 0; i < player.table.lastTurnCards.length; i++) {
        if(player.table.lastTurnCards[i].compare(pickedCard) == '='){
            return true;
        }
    }
    return false;
}
Player.prototype.getCardFromTableDeck = function(){
    var player = this;
    player.hand.push(player.table.game.deck.pop(1)[0]);
    player.hand.emit('CardsChanged');
    return player;
}
Player.prototype.getCardFromTableBoard = function(pickedCard){
    var player = this;
    console.log(this.verifyLastTurnDropedCard(pickedCard))
    if(this.verifyLastTurnDropedCard(pickedCard)){
        for (var i = player.table.game.board.length - 1; i >= 0; i--) {
            if(player.table.game.board[i].compare(pickedCard) == '='){
                player.table.game.board.splice(i,1);
                player.hand.push(pickedCard);
                return player;
            }
        }
    }else{
        return player;
    }
}
Player.prototype.dropCardsToBoard = function(dropedCards){
    var player = this;
    for (var i = 0; i < dropedCards.length; i++) {
        var card = player.hand.findAndGet(dropedCards[i]);
        player.table.game.board.push(card);
    }
    player.table.lastTurnCards = dropedCards;
    return player;
}
