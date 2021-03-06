var  Card = require('./Card');
var config = require('./Config');
var Hand = require('./Hand');

module.exports = Deck = Deck

function Deck(jokersCount) {
	this.jokersCount = jokersCount;
	this.cards = [];
	this.suites = ['S','H','D','C'];
	this.renks = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];
	this.fillDeck(this.cards);
}
// Fill the cards with whole cards
Deck.prototype.fillDeck = function () {
	var self = this;
	self.suites.forEach(function(suite){
		self.renks.forEach(function(renk){
			self.cards.push(new Card(renk, suite));
		});
	});
	for (var i = 0; i < self.jokersCount; i++) {
		self.cards.push(new Card('0', 'W'));
	}
	self.shuffle(self.cards);
	return this;
}
// Get hand from deck
Deck.prototype.getPlayerHand = function () {
	var cards = [];
	for (var i = 0; i < config.playerHandCards; i++) {
		cards.push(this.cards.pop());
	}
	return new Hand(cards);
}
// pop cartd from deck
Deck.prototype.pop = function (counts) {
	var cards = [];
	for (var i = 0; i < counts; i++) {
		cards.push(this.cards.pop());
	}
	return cards;
}
// Reset the cards array with Fisher-Yates
Deck.prototype.reset = function () {
	this.cards = [];
	this.fillDeck();
	return this;
}
// Shuffle the cards array
Deck.prototype.shuffle = function (cards) {
	var i, j, tempi, tempj;
	if(cards){
		for (i = 0; i < cards.length; i += 1) {
			j = Math.floor(Math.random() * (i + 1));
			tempi = cards[i];
			tempj = cards[j];
			cards[i] = tempj;
			cards[j] = tempi;
		}
		return cards;
	}else {
		for (i = 0; i < this.cards.length; i += 1) {
			j = Math.floor(Math.random() * (i + 1));
			tempi = this.cards[i];
			tempj = this.cards[j];
			this.cards[i] = tempj;
			this.cards[j] = tempi;
		}
		return this;
	}
}