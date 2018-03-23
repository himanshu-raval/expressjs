var util = require('util');
var EventEmitter = require('events').EventEmitter;
module.exports = Hand = Hand;
// add event to update cards to recalculate renk of hand
function Hand(cards, player) {
    var hand = this;
    this.cards = cards;
    this.renk = 0;

    // bind events start 
    this.on('CardsChanged',function(e){
        hand.rankHand();
    })
    // bind events stop 

    this.rankHand();
    return this;
}
util.inherits(Hand, EventEmitter);

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
    var renk = 0, hand = this;
    for (var i = 0; i < hand.cards.length; i++) {
        if(parseInt(hand.cards[i].renk) >= 0 && parseInt(hand.cards[i].renk) <= 9){
            renk = renk + parseInt(hand.cards[i].renk);
        }else if(hand.cards[i].renk == 'A'){
            renk = renk + 1;
        }else{
            renk = renk + 10;
        }
    }
    hand.renk = renk;
    return hand;
}

