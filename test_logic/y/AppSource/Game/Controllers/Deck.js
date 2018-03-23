var  Card = require('./Card');
var Hand = require('./Hand');

module.exports = Deck = Deck

function Deck(jokersCount, cards) {
	var deck = this
	this.jokersCount = jokersCount;
	this.cards = [];
	this.suites = ['S','H','D','C'];
	this.ranks = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];
	if(cards.length > 0){
		cards.forEach(function(card){
			deck.cards.push(new Card(card.rank, card.suite))
		})
	}else{
		this.fillDeck(this.cards);
	}
}
Deck.prototype.toJson = function () {
	return {
		jokersCount : this.jokersCount,
		cards : this.cards,
		suites : this.suites,
		ranks : this.ranks
	}
}

// Fill the cards with whole cards
Deck.prototype.fillDeck = function () {
	var self = this;
	self.suites.forEach(function(suite){
		self.ranks.forEach(function(rank){
			self.cards.push(new Card(rank, suite));
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
	for (var i = 0; i < Game.Config.Yaniv.playerHandCards; i++) {
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