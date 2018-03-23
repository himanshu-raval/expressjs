var util = require('util');
var EventEmitter = require('events').EventEmitter;
module.exports = Hand = Hand;
// add event to update cards to recalculate rank of hand
function Hand(cards, player) {
    var hand = this;
    this.cards = cards;
    this.rank = 0;

    // bind events start 
    this.on('CardsChanged',function(e){
        hand.rankHand();
    })
    // bind events stop 

    this.rankHand();
    return this;
}
util.inherits(Hand, EventEmitter);

Hand.prototype.toJson = function(){
    return {
        rank: this.rank,
        cards: (this.cards.length > 0)?this.cardsToJson():{}
    }
}
Hand.prototype.cardsToJson = function(){
    var cards = [] 
    this.cards.forEach(function(card){
        cards.push(card.toJson())
    })
    return cards
}

Hand.prototype.highCard = function () {
    var highCard = 0
    for (var i = 1; i < this.cards.length; i++) {
        if(this.cards[i].getRank() > this.cards[highCard].getRank()){
            highCard = i;
        }
    }
    var card = this.cards.splice(highCard,1)[0];
    this.emit('CardsChanged');
    return card;
}
Hand.prototype.findAndGet = function (card) {
    for (var i = 0; i < this.cards.length; i++) {
        if(this.cards[i].compare(card) == '='){
            this.cards.splice(i,1);
            this.emit('CardsChanged');
            return card;
        }
    }
    return null;
}
Hand.prototype.push = function (card) {
    this.cards.push(card);
    this.emit('CardsChanged');
    return this;
}

Hand.prototype.rankHand = function () {
    var rank = 0, hand = this;
    for (var i = 0; i < hand.cards.length; i++) {
        if(parseInt(hand.cards[i].rank) >= 0 && parseInt(hand.cards[i].rank) <= 9){
            rank = rank + parseInt(hand.cards[i].rank);
        }else if(hand.cards[i].rank == 'A'){
            rank = rank + 1;
        }else{
            rank = rank + 10;
        }
    }
    hand.cards.sort(function(a, b){
        var arank = 0, brank = 0;
        if(a.rank >= 0 && a.rank <= 9){
            arank = a.rank
        }else{
            switch(a.rank){
                case 'T':
                arank = 10;
                break;
                case 'J':
                arank = 11;
                break;
                case 'Q':
                arank = 12;
                break;
                case 'K':
                arank = 13;
                break;
                case 'A':
                arank = 1;
                break;
            }
        }
        if(b.rank >= 0 && b.rank <= 9){
            brank = b.rank
        }else{
            switch(b.rank){
                case 'T':
                brank = 10;
                break;
                case 'J':
                brank = 11;
                break;
                case 'Q':
                brank = 12;
                break;
                case 'K':
                brank = 13;
                break;
                case 'A':
                brank = 1;
                break;
            }
        }
        return arank - brank;
    });
    hand.rank = rank;
    return hand;
}

/**
 * Function for Calculate Hand Rank occurance
 */
Hand.prototype.rankCardsCount = function (card) {
    var hand = this, count = 0;
    for (var i = 0; i < hand.cards.length; i++) {
         if(hand.cards[i].rank == card){
            count++;
         }
    }
    return count;
}