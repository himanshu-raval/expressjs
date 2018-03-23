var Table = require('./Table');

var table = new Table(7, 200, 2)
.addPlayer('Player 1')
.addPlayer('Player 2')
.addPlayer('Player 3')
.addPlayer('Player 4');

table.startGame();

// Game.Logger.data("Before swipe ",table.players[0].hand, table.board)

// table.players[0].swipeWithDeck([table.players[0].hand.cards[0]]);

// Game.Logger.data("After One swipe ",table.players[0].hand, table.players[1].hand, table.board)
// table.players[1].swipeWithBoard([table.players[1].hand.cards[0]], table.game.board[table.game.board.length -1]);
// Game.Logger.data("After Two swipe ",table.players[1].hand, table.board)