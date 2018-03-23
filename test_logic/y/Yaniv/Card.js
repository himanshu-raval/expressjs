module.exports = Card = Card

function Card(renk, suite) {
	this.renk = renk;
	this.suite = suite;
}
/*
	@return = for equal, < if card gretor > if card less
*/
Card.prototype.compare = function (card) {
    if(card.renk == this.renk && card.suite == this.suite){
    	return "=";
    } 
    if(card.renk < this.renk && card.suite == this.suite){
    	return ">";
    }
    if(card.renk > this.renk && card.suite == this.suite){
    	return "<";
    }
    return null;
}