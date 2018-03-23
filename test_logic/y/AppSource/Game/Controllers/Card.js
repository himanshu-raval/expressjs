module.exports = Card = Card

function Card(rank, suite) {
	this.rank = rank;
	this.suite = suite;
}
/*
@return = for equal, < if card gretor > if card less
*/
Card.prototype.compare = function (card) {
    if(card.rank == this.rank && card.suite == this.suite){
     return "=";
 } 
 if(card.rank < this.rank && card.suite == this.suite){
     return ">";
 }
 if(card.rank > this.rank && card.suite == this.suite){
     return "<";
 }
 return null;
}


Card.prototype.getRank = function () {
    if(['A'].indexOf(this.rank) != -1){
        return 1
    }
    if(['K'].indexOf(this.rank) != -1){
        return 13
    }

    if(['Q'].indexOf(this.rank) != -1){
        return 12
    }
    if(['J'].indexOf(this.rank) != -1){
        return 11
    }
    if(['T'].indexOf(this.rank) != -1){
        return 10
    }
    return this.rank
}

Card.prototype.toJson = function () {
    return {
        rank : this.rank,
        suite : this.suite
    }
}