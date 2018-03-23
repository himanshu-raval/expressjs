var Hand = require('./Hand');
var Card = require('./Card');
var ObjectId = require('mongodb').ObjectID;
const async = require('async');
module.exports = Player = Player;

function Player(id, username, table, hand, robotcount, socketid,level,avatar,card) {
    this.id = id;
    this.username = username;
    this.table = table;
    this.robotcount = robotcount | 0;
    this.socketid = socketid;
    this.level = level;
    this.avatar = avatar;
    this.card = card;
    if (hand && Object.keys(hand).length > 1) {
        var cards = [];
        hand.cards.forEach(function (card) {
            cards.push(new Card(card.rank, card.suite))
        })
        this.hand = new Hand(cards, this)
    } else {
        this.hand = {};
    }
}

Player.prototype.toJson = function () {
    return {
        id: this.id,
        username: this.username,
        robotcount: this.robotcount,
        socketid: this.socketid,
        level : this.level,
        avatar : this.avatar,
        card : this.card,
        hand: (Object.keys(this.hand).length > 0) ? this.hand.toJson() : {}
    }
}
Player.prototype.swipeWithDeck = function (dropedCards) {
     Game.Logger.debug('swipeWithDeck called', dropedCards)
    var player = this;

    // Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
    // Game.Logger.debug('+ dropedCards =', dropedCards);
    // Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

    if (this.verifyDropedCards(dropedCards)) {
        player.dropCardsToBoard(dropedCards).getCardFromTableDeck(dropedCards.length, dropedCards);
    }
    return player;
}

Player.prototype.swipeWithBoard = function (dropedCards, pickedCard) {
   // Game.Logger.debug('swipeWithBoard called', dropedCards)
    var player = this;

    if (this.verifyDropedCards(dropedCards)) {
        player.getCardFromTableBoard(pickedCard)
        player.dropCardsToBoard(dropedCards);
    }
    return player;
}
Player.prototype.verifyDropedCards = function (dropedCards) {
    return true;
}
Player.prototype.verifyLastTurnDropedCard = function (pickedCard) {
    var player = this;
    if (player.table.game.lastTurnCards.length > 0) {
        for (var i = 0; i < player.table.game.lastTurnCards.length; i++) {
            if (player.table.game.lastTurnCards[i].compare(pickedCard) == '=') {
                return true;
            }
        }
    } else {
        return true
    }
    return false;
}
Player.prototype.getCardFromTableDeck = function (len, dropedCards) {
    var player = this;
    var isSameRank = false;
    var top_card = player.table.game.deck.cards[player.table.game.deck.cards.length - 1];
    // console.log("top_card", top_card.rank);
    if (dropedCards.length == undefined) {
        if (top_card.rank == dropedCards.rank) {
            isSameRank = true;
        }
    } else {
        dropedCards.forEach(function (card) {
            if (top_card.rank == card.rank) {
                isSameRank = true;
            }
        });
    }
    if (isSameRank) {
        var slapdown = {
            playerId: player.id,
            cards: {
                rank: top_card.rank,
                suite: top_card.suite
            }
        };
        Game.Io.to(player.table.id).emit('SameCardSlapDown', slapdown);
    }



    player.hand.push(player.table.game.deck.pop(1)[0]);

    // Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
    // Game.Logger.debug('+ DECK +',player.table.game.deck);
    // Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');


    player.hand.emit('CardsChanged');

    if (player.table.game.deck.cards <= 1) {
        // Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        // Game.Logger.debug('+ Deck Cards Shuffle +');
        // Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

        player.table.game.deck.cards = player.table.game.board.splice(0, player.table.game.board.length - len); // Copy Bord to Deck When Deck have Zero Cards
        player.table.game.deck.shuffle(); // Shuffle Cards.
    }


    return player;
}
Player.prototype.getCardFromTableBoard = function (pickedCard) {
    var player = this;
  // console.log("Cards :",player.table.game.deck.cards);

    if (this.verifyLastTurnDropedCard(pickedCard)) {
        for (var i = player.table.game.board.length - 1; i >= 0; i--) {
            if (player.table.game.board[i].compare(pickedCard) == '=') {
                player.table.game.board.splice(i, 1);
                player.hand.push(pickedCard);
                return player;
            }
        }
    } else {
        return player;
    }
}
Player.prototype.dropCardsToBoard = function (dropedCards) {
    var player = this;
    // console.log("Last Turn Cards",dropedCards);
    if (dropedCards instanceof Card) {
        player.table.game.board.push(dropedCards);
        player.table.game.lastTurnCards = [dropedCards];
    } else {
        for (var i = 0; i < dropedCards.length; i++) {
            var card = player.hand.findAndGet(dropedCards[i]);
            player.table.game.board.push(card);
        }
        player.table.game.lastTurnCards = dropedCards;
    }
    return player;
}



Player.prototype.callYaniv = function (socketId, callback) {

    var player = this;
    var table = player.table;
    var game = table.game;
    var players = table.players;
    var point = table.game.point;
    var ranks = [];
    var isAssf = false;
    var rank = player.hand.rank;
    var winnerid = table.currentTurn;
    var player_id = player.id;
    var winner = players[0];
    var min_point = point[0].point;
    var out_player = [];
    var out_player_point = [];
    var isSitandGo = false;
    var isTournament = false;
    var isGameOver = false;


    if (table.type == 'sit-and-go') {
        isSitandGo = true;
    }

    if (table.type == 'tournament') {
        isTournament = true;
    }

    /**
     * Player Call Yaniv With 5 Cards
     */
    if (player.hand.cards.length == 5) {
        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'call_yaniv_with_5_cards', 1).then(function (data) { return; }, function (err) { return; }); // 
    }
    if (player.hand.rankCardsCount('A') == 2 && player.hand.cards.length == 2) {
        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'win_round_with_2_aces', 1).then(function (data) { return; }, function (err) { return; }); //  
    }
    if (player.hand.rankCardsCount('A') == 3 && player.hand.cards.length == 3 ) {
        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'win_round_with_3_aces', 1).then(function (data) { return; }, function (err) { return; }); //  
    }
    if (player.hand.rankCardsCount('A') == 4 && player.hand.cards.length == 4 ) {
        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'win_round_with_4_aces', 1).then(function (data) { return; }, function (err) { return; }); //  
    }

    // if (table.callYaniv == 7 && player.hand.cards.length < 3) {
    //     Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'call_yaniv_on_7_when_a_player_has_less_than_3_cards', 1).then(function (data) { return; }, function (err) { return; });  
    // }


    if (players[winnerid].hand.cards.length == 3) {
        var one = 0, two = 0, three = 0;

        for (var i = 0; i < players[winnerid].hand.cards.length; i++) {
            if (players[winnerid].hand.cards[i].rank == 'A') {
                one++;
            }
            if (players[winnerid].hand.cards[i].rank == 2) {
                two++;
            }
            if (players[winnerid].hand.cards[i].rank == 3) {
                three++;
            }
        }
        if (one == 1 && two == 1 && three == 3) {
            Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(players[winnerid].id, 'win_round_with_holding_a23', 1).then(function (data) { return; }, function (err) { return; }); // Call Yaniv
        }
    }


    Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'call_yaniv', 1).then(function (data) { return; }, function (err) { return; }); // Call Yaniv

    for (let key in players) {
        let minhand = parseInt(player.hand.rank);
        if (key == table.currentTurn) {
            continue;
        }

        // Update Player avarage Hand Statastic
        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(players[key].id, 'average_hand_score', players[key].hand.rank).then(function (data) { return; }, function (err) { return; });


        if (players[key].id != player.id) {

            if (parseInt(player.hand.rank) >= parseInt(players[key].hand.rank) && parseInt(minhand) >= parseInt(players[key].hand.rank)) {
                isAssf = true
                minhand = parseInt(players[key].hand.rank);
                rank = parseInt(players[key].hand.rank)
                winnerid = key;
                table.currentTurn = key; // Set Current Turn to Winner Turn.
                console.log("Assrf Done Playe Key :", key);
            }
        }
    }





    game.roundNumber++;
    if (isAssf) {

        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ PLAYER WIN - ASSF +');
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

        /**
         * Update Player Statistics When Win Round
         */

        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(players[winnerid].id, 'got_assaf', 1).then(function (data) { return; }, function (err) { return; });  // 
        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(players[winnerid].id, 'round_won', 1).then(function (data) { return; }, function (err) { return; });  // 

        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player_id, 'call_yaniv_got_assaf', 1).then(function (data) { return; }, function (err) { return; });  // 
        Game.Io.to(table.id).emit('GameYanivCallAssf', { winnerId: players[winnerid].id, winnerName: players[winnerid].username, loserId: player.id, message: 'You lose the round' })
        player.hand.rank = player.hand.rank + 30;

        //set round player points
        game.roundPoints = []
        players.forEach(function (player) {
            game.roundPoints.push(player.hand.rank + rank);
            if(players[winnerid].id != player.id){
                // Update Userdata when Chnage Player Poits
                Game.Io.engine.clients[player.socketid]._userData.isHitted = false; // Update
            }
            
            point.forEach(function (point, key) {
                if (point.id == player.id && players[winnerid].id != player.id) {
                    point.point = point.point + (player.hand.rank);
                    point.result = '+' + player.hand.rank;
                }
                if (point.id == player.id && player_id == player.id) {
                    point.result = 'ASSAF';
                }
                

                if (point.id == player.id && players[winnerid].id == player.id) {
                    point.point = point.point + (player.hand.rank);
                    point.win = point.win + 1;
                    point.result = 'YANIV';
                }

                

                if ((point.point == 50 || point.point == 100) && players[winnerid].id != player.id && point.id == player.id) {
                    if (point.point == 50) {
                        point.point = 0;
                        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'hit_assaf_50', 1).then(function (data) { return; }, function (err) { return; });
                    }
                    if (point.point == 100) {
                        point.point = 50;
                        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'hit_assaf_100', 1).then(function (data) { return; }, function (err) { return; });
                    }
                }
            })

        })

        // check for game over

        players.forEach(function (player, key) {
            point.forEach(function (point, key) {
                if (point.id == player.id) {
                    // game.gameOverPoint
                    if (point.point >= game.gameOverPoint) {  // check Game Over Point to Player's Point
                        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                        Game.Logger.debug('+ GAME OVER POINT FOUND - ASSAF +');
                        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                        isGameOver = true;
                        out_player = player;
                        out_player_point = point.point;
                    }
                    if (point.point < min_point) {
                        min_point = point.point;
                        winner = player;
                    }
                }

            })
        })

        if (isGameOver == true && isSitandGo == false && isTournament == false) {
            var final_point = 0;
            point.forEach(function (point, key) {
                if (point.id != winner.id) {
                    final_point = parseInt(final_point) + (parseInt(point.point) - parseInt(min_point));

                }
            })
            // final_point = final_point + min_point; // final Point of Game Winner.


            Game.AppSource.Shop.Controllers.Landmark.getAllLandmark({}, function (err, landmark) {
                if (err) {
                    return;
                }


                var tot = landmark.length;
                var point_per_coin = 1;
                var selected_landmark = table.level;
                var selected_landmark_name = '';
                landmark.forEach(function (land, key) {
                    if (land.id == table.level) {
                        point_per_coin = parseInt(land.coin_per_point);
                        // if (key < tot - 1) {
                        //     selected_landmark = landmark[key + 1].id;
                        //     selected_landmark_name = landmark[key + 1].landmark_name;
                        // }
                    }
                });




                /**
                 *  Update Looser Coin
                 */
                var losePoint = [];
                // var k= 0;
                point.forEach(function (point, key) {
                    if (point.id != winner.id) {
                        var finalPoint = (parseInt(point.point) - parseInt(min_point)) * parseInt(point_per_coin);
                        Game.AppSource.Game.Controllers.CoinGame.PlayerLoseCoinUpdate(point.id, finalPoint, table.id).then(function (data) { return; }, function (err) { return; });
                        losePoint.push({
                            id: point.id,
                            point: finalPoint
                        });
                        // losePoint[key]['id'] = point.id;
                        // losePoint[key]['point'] = finalPoint;
                        // k++;
                    }
                });


                Game.AppSource.Player.Models.Player.findOne({ id: winner.id })
                    .then(function (ply) {
                        final_point = parseInt(final_point) * parseInt(point_per_coin); // convert Point to Coin
                        if (final_point < 0) {
                            final_point = 0;
                        }
                        let beforeCoin = parseInt(ply.coin);
                        var player_final_point = parseInt(ply.coin) + parseInt(final_point);


                        

                        Game.AppSource.Player.Models.Player.update({ id: winner.id }, { coin: player_final_point })
                            .then(function (landmark) {
                                /// resolve(landmark);  
                                // final_point = final_point * landmark.coin_per_point; // conver Point to coin
                                // console.log("Game Finised :",final_point);
                                // /**
                                //  * Update Player Statistics
                                //  **/



                                Game.AppSource.Game.Models.Table.native(function (err, tblObj) {
                                    tblObj.findOne({ "_id": new ObjectId(table.id) }, function (err, tbl) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            var start = new Date(tbl.createdAt);
                                            var end = new Date(tbl.updatedAt);
                                            var diffMs = (end - start);
                                            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                                            players.forEach(function (plr) {
    
                                                Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(plr.id, 'game_playing_time', diffMins).then(function (data) { return; }, function (err) { return; });
    
                                            });
    
                                        }
                                    });
    
                                });


                                Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(winner.id, 'game_won', table.level).then(function (data) { return; }, function (err) { return; });


                                game.status = 'FINISHED';
                                table.status = 'FINISHED';
                                

                                /**
                                * When Player coin Updated
                                */

                                Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(socketId,winner.id,player_final_point,ply.level,function (err) { });

                                // Game.Io.to(socketId).emit("coinupdated", {
                                //     playerid: winner.id,
                                //     coin: parseInt(player_final_point),
                                //     level : parseInt(ply.level)
                                // });


                                Game.AppSource.Player.Models.Coinshistory.create({
                                    player: winner.id,
                                    coins: final_point,
                                    type: 'credit',
                                    flag: 'Game Winning Coins',
                                    tableId: table.id,
                                    beforCoins: beforeCoin,
                                    afterCoins: player_final_point,
                                    status: 'success'
                                }).exec(function (err, ch) {
                                if (err) {
                                    return callback(err)
                                }
                                    
                                    Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                                    Game.Logger.debug('+ GAME FINISED - ASSAF +');
                                    Game.Logger.debug('+ TABLE STATUS =' + table.status);
                                    Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

                                    Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(winner.id, 'best_match_score', final_point).then(function (data) { return; }, function (err) { return; });

                                    Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(winner.id, 'coin_games_won', 1).then(function (data) { return; }, function (err) { return; });


                                    Game.Io.to(table.id).emit('GameFinished', { winnerId: winner.id, winnerName: winner.username, coin: final_point, loser_point: losePoint })
                                    // Game.Io.to(table.id).emit('GameOver', { message: 'Calculating coins as per winners' })
                                    // game.emit('FindWinners');

                                    return callback(null, table);
                                })
                                
                            })
                            .catch(function (err) {
                                return err;
                            })
                    })
                    .catch(function (err) {
                        return err;
                    })


            });





        } else if (isGameOver == true && isSitandGo == true && isTournament == false) {

            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
            Game.Logger.debug('+ SIT-N-GO PLAYER GAME FINISED - ASSAF+');
            Game.Logger.debug('+ TABLE STATUS =' + table.status);
            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

            players.forEach(function (ply, key) {
                if (ply.id == out_player.id) {
                    players.splice(key, 1); // Remove Player
                    table.losers.push(ply);
                    table.playersTotal = table.playersTotal - 1;
                    // if (key > table.currentTurn) {
                    //     table.currentTurn = parseInt(table.currentTurn) + 1;
                    // }
                    // if (table.currentTurn == table.playersTotal) {
                    //     table.currentTurn = 0
                    // }
                    if (table.currentTurn == table.playersTotal) {
                        table.currentTurn = parseInt(table.currentTurn) - 1;
                    }
                    if (key == table.playersTotal) {
                        table.currentTurn = 0;
                    }


                }
            })


            Game.AppSource.Shop.Controllers.Landmark.getLandmark({id:table.level}, function (err, landmark) {
                if (err) {
                     return callback(err);
                }




            Game.Io.to(table.id).emit('SitandGoPlayerOut', { playerId: out_player.id, playerName: out_player.username, point: out_player_point,coin: '-'+landmark.coin, playersTotal: table.playersTotal, isGamePlay: true })


            // Leave room 
            Game.Io.sockets.connected[out_player.socketid]?Game.Io.sockets.connected[out_player.socketid].leave(table.id):''; // Remove Player Socket from Table.

            if (table.playersTotal != 1) {
                setTimeout(function (game) {
                    game.startNewRound();
                }, 10000, game);
            }
            return callback(null, table);

        });

        } else if (isGameOver == true && isSitandGo == false && isTournament == true) {

            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
            Game.Logger.debug('+ TOURNAMENT REMOVE PLAYER - ASSAF+');
            Game.Logger.debug('+ TABLE STATUS =' + table.status);
            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

            players.forEach(function (ply, key) {
                if (ply.id == out_player.id) {
                    players.splice(key, 1); // Remove Player
                    table.losers.push(ply);
                    table.playersTotal = table.playersTotal - 1;
                    // if (key > table.currentTurn) {
                    //     table.currentTurn = parseInt(table.currentTurn) + 1;
                    // }
                    // if (table.currentTurn == table.playersTotal) {
                    //     table.currentTurn = 0
                    // }
                    if (table.currentTurn == table.playersTotal) {
                        table.currentTurn = parseInt(table.currentTurn) - 1;
                    }
                    if (key == table.playersTotal) {
                        table.currentTurn = 0;
                    }


                }
            })

            Game.AppSource.Shop.Controllers.Landmark.getLandmark({id:table.level}, function (err, landmark) {
                if (err) {
                    console.log(err);
                     return callback(err);
                }

            


            Game.Io.to(table.id).emit('SitandGoPlayerOut', { playerId: out_player.id, playerName: out_player.username, point: out_player_point,coin: '-'+landmark.coin, playersTotal: table.playersTotal, isGamePlay: true });


            // Leave room 
            Game.Io.sockets.connected[out_player.socketid]?Game.Io.sockets.connected[out_player.socketid].leave(table.id):''; // Remove Player Socket from Table.


            if (table.playersTotal != 1) {
                setTimeout(function (game) {
                    game.startNewRound();
                }, 10000, game);
            }
            return callback(null, table);

        });

        } else {
            setTimeout(function (game) {
                game.startNewRound();
            }, 10000, game);

            return callback(null, table);
        }

    } else {



        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ PLAYER WIN - YANIV +');
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'round_won', 1).then(function (data) { return; }, function (err) { return; });

        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'call_yaniv_win', 1).then(function (data) { return; }, function (err) { return; });
        if (player.hand.rank == 0) {
            Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'win_round_with_zero_score', 1).then(function (data) { return; }, function (err) { return; }); // Call Yaniv
        }

        Game.Io.to(table.id).emit('GameYanivCallWin', { winnerId: player.id, winnerName: player.username, message: 'You win the round' })
        //set round player points
        game.roundPoints = [];
        var streak = 0;
        players.forEach(function (player, key) {
            game.roundPoints.push(player.hand.rank + rank);
            point.forEach(function (point, key) {

                if (point.id == player.id && player_id != player.id) {
                    point.point = point.point + player.hand.rank;
                    point.result = '+' + player.hand.rank;
                    point.streak = 0;
                }
                if (point.id == player.id && player_id == player.id) {
                    point.win = point.win + 1;
                    point.result = 'YANIV';
                    point.streak = point.streak + 1;
                    streak = point.streak;
                }
      
                 if ((point.point == 50 || point.point == 100) && player_id != player.id && point.id == player.id) {
                     
                    if (point.point == 50) {
                        point.point = 0;
                        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'hit_50', 1).then(function (data) { return; }, function (err) { return; });
                    }
                    if (point.point == 100) {
                        point.point = 50;
                        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player.id, 'hit_100', 1).then(function (data) { return; }, function (err) { return; });
                    }
                }


            })

        })

        /**
         *  Update Player Streak
         */
        if (streak == 3) {
            Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(player_id, 'win_streak', 1).then(function (data) { return; }, function (err) { return; }); // Call Yaniv
        }




        // Check for game over
        players.forEach(function (player, key) {
            point.forEach(function (point, key) {
                if (point.id == player.id) {
                    // game.gameOverPoint
                    if (point.point >= game.gameOverPoint) {  // check Game Over Point to Player's Point
                        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                        Game.Logger.debug('+ GAME OVER POINT FOUND - YANIV +');
                        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                        isGameOver = true
                        out_player.push(player); // if Multiple Player So Push Player
                        out_player_point.push(point.point);
                    }
                    if (point.point < min_point) {
                        min_point = point.point;
                        winner = player;
                    }
                }
            })
        })

        // /*
        // Point Caluclations. 
        // */

        if (isGameOver == true && isSitandGo == false && isTournament == false) {

            var final_point = 0;
            point.forEach(function (point, key) {
                if (point.id != winner.id) {
                    final_point = parseInt(final_point) + (parseInt(point.point) - parseInt(min_point));  // Add Final Winning Point
                }
                // if (winner.id == point.id) {
                //     final_point = final_point - point.point; // Subtract Winners Old Point from Winning Point
                // }
            })
            // final_point = final_point + min_point; // final Point of Game Winner.

            Game.AppSource.Shop.Controllers.Landmark.getAllLandmark({}, function (err, landmark) {
                if (err) {
                    return;
                }
                console.log("on Landmark");
                var tot = landmark.length;
                var point_per_coin = 1;
                var selected_landmark = table.level;
                var selected_landmark_name = '';
                landmark.forEach(function (land, key) {
                    if (land.id == table.level) {
                        point_per_coin = land.coin_per_point;
                        // if (key < tot - 1) {
                        //     selected_landmark = landmark[key + 1].id;
                        //     selected_landmark_name = landmark[key + 1].landmark_name;
                        // }
                    }
                });




                /**
                *  Update Looser Coin
                */
                var losePoint = [];
                // var k = 0;
                point.forEach(function (point, key) {
                    if (point.id != winner.id) {
                        var finalPoint = (parseInt(point.point) - parseInt(min_point)) * parseInt(point_per_coin);

                        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                        Game.Logger.debug('+ LOSER - YANIV+');
                        Game.Logger.debug('+ POINT =' + finalPoint);
                        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

                        Game.AppSource.Game.Controllers.CoinGame.PlayerLoseCoinUpdate(point.id, finalPoint, table.id).then(function (data) { return; }, function (err) { return; });

                        losePoint.push({
                            id: point.id,
                            point: finalPoint
                        });

                    }
                });





                Game.AppSource.Player.Models.Player.findOne({ id: winner.id })
                    .then(function (ply) {

                        final_point = parseInt(final_point) * parseInt(point_per_coin); // conver Point to coin
                        if (final_point < 0) {
                            final_point = 0;
                        }
                        let beforeCoin = parseInt(ply.coin);
                        var player_final_point = parseInt(ply.coin) + parseInt(final_point);

                        ply.statistics['coins_won']  = parseInt(ply.statistics['coins_won']) + parseInt(final_point);
                         
                        Game.AppSource.Player.Models.Player.update({ id: winner.id }, { coin: player_final_point,statistics:ply.statistics })
                            .then(function (landmark) {
                                /// resolve(landmark);  
                                //  console.log("Game Finised :",final_point);
                                /**
                                 * Update Player Statistics
                                 **/

                                Game.AppSource.Game.Models.Table.native(function (err, tblObj) {
                                    tblObj.findOne({ "_id": new ObjectId(table.id) }, function (err, tbl) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            var start = new Date(tbl.createdAt);
                                            var end = new Date(tbl.updatedAt);
                                            var diffMs = (end - start);
                                            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                                            players.forEach(function (plr) {
    
                                                Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(plr.id, 'game_playing_time', diffMins).then(function (data) { return; }, function (err) { return; });
    
                                            });
    
                                        }
                                    });
    
                                });







                                Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(winner.id, 'game_won', table.level).then(function (data) { return; }, function (err) { return; });

                                game.status = 'FINISHED'
                                table.status = 'FINISHED'

                                /**
                                * When Player coin Updated
                                */

                                Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(socketId,winner.id,player_final_point,ply.level,function (err) { });

                                // Game.Io.to(socketId).emit("coinupdated", {
                                //     playerid: winner.id,
                                //     coin: parseInt(player_final_point),
                                //     level : parseInt(ply.level)
                                // });



                                Game.AppSource.Player.Models.Coinshistory.create({
                                    player: winner.id,
                                    coins: final_point,
                                    type: 'credit',
                                    flag: 'Game Winning Coins',
                                    tableId: table.id,
                                    beforCoins: beforeCoin,
                                    afterCoins: player_final_point,
                                    status: 'success'
                                }).exec(function (err, ch) {
                                    if (err) {
                                        return callback(err)
                                    }

                                    Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                                    Game.Logger.debug('+ GAME FINISED - YANIV+');
                                    Game.Logger.debug('+ TABLE STATUS =' + table.status);
                                    Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

                                    Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(winner.id, 'best_match_score', final_point).then(function (data) { return; }, function (err) { return; });

                                    Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(winner.id, 'coin_games_won', 1).then(function (data) { return; }, function (err) { return; });


                                    Game.Io.to(table.id).emit('GameFinished', { winnerId: winner.id, winnerName: winner.username, coin: final_point, loser_point: losePoint });

                                    // Game.Io.to(table.id).emit('GameOver', { message: 'Calculating coins as per winners' })
                                    // game.emit('FindWinners');

                                    return callback(null, table);
                                });

                            })
                            .catch(function (err) {
                                return err;
                            })
                    })
                    .catch(function (err) {
                        return err;
                    });

            });
        } else if (isGameOver == true && isSitandGo == true && isTournament == false) {


                Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                Game.Logger.debug('+ SIT-N-GO PLAYER GAME FINISED - YANIV+');
                Game.Logger.debug('+ TABLE STATUS =' + table.status);
                Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');


                let task = []
                
                out_player.forEach(function (out_plr,index) {
                    task.push(function (callback) {

                        players.forEach(function (ply, key) {
                            if (ply.id == out_plr.id) {
                                players.splice(key, 1); // Remove Player
                                table.losers.push(ply);
                                table.playersTotal = parseInt(table.playersTotal) - 1;
                               
                                if (table.currentTurn == table.playersTotal) {
                                    table.currentTurn = parseInt(table.currentTurn) - 1;
                                }
                                if (key == table.playersTotal) {
                                    table.currentTurn = 0;
                                }
                            }
                        })
            
                        Game.AppSource.Shop.Controllers.Landmark.getLandmark({id:table.level}, function (err, landmark) {
                            if (err) { return callback(err); }
             
                            Game.Io.to(table.id).emit('SitandGoPlayerOut', { playerId: out_plr.id, playerName: out_plr.username, point: out_player_point[index], coin: '-'+landmark.coin, playersTotal: table.playersTotal, isGamePlay: true });
            
                            // Leave room 
                            Game.Io.sockets.connected[out_plr.socketid]?Game.Io.sockets.connected[out_plr.socketid].leave(table.id):''; // Remove Player Socket from Table.

                            callback(null, { 'player': out_plr.id });
                        });
                        
                    })
                });
				async.parallel(task,function(err, results) {


                    if (table.playersTotal != 1) {
                        setTimeout(function (game) {
                            game.startNewRound();
                        }, 10000, game);
                    }
                    return callback(null, table);

				});

        } else if (isGameOver == true && isTournament == true && isSitandGo == false) {



            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
            Game.Logger.debug('+ TOURNAMENT REMOVE PLAYER - YANIV+');
            Game.Logger.debug('+ TABLE STATUS =' + table.status);
            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');


            let task = [];
            out_player.forEach(function (out_plr,index) {
                task.push(function (callback) {
                 
                    players.forEach(function (ply, key) {
                        if (ply.id == out_plr.id) {
                            players.splice(key, 1); // Remove Player
                            table.losers.push(ply);
                            table.playersTotal = parseInt(table.playersTotal) - 1;
                            if (table.currentTurn == table.playersTotal) {
                                table.currentTurn = parseInt(table.currentTurn) - 1;
                            }
                            if (key == table.playersTotal) {
                                table.currentTurn = 0;
                            }
                        }
                    });
        
                    Game.AppSource.Shop.Controllers.Landmark.getLandmark({id:table.level}, function (err, landmark) {
                    if (err) {    return callback(err); }
        
                        Game.Io.to(table.id).emit('SitandGoPlayerOut', { playerId: out_plr.id, playerName: out_plr.username, point: out_player_point[index], coin: '-'+landmark.coin, playersTotal: table.playersTotal, isGamePlay: true });
        
                        // Leave room 
                        Game.Io.sockets.connected[out_plr.socketid]?Game.Io.sockets.connected[out_plr.socketid].leave(table.id):''; // Remove Player Socket from Table.
                        callback(null, { 'player': out_plr.id });
                    });
                  
                })
            });
            async.parallel(task,function(err, results) {
                
                if (table.playersTotal != 1) {
                    setTimeout(function (game) {
                        game.startNewRound();
                    }, 10000, game);
                }
                return callback(null, table);

            });

        } else {
            setTimeout(function (game) {
                game.startNewRound();
            }, 10000, game);

            return callback(null, table);
        }

    }
}



// Default game win


Player.prototype.callYanivCall = function (socketId, callback) {

    Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
    Game.Logger.debug('+ SINGLE PLAYER FOUND SO GAME OVER +');
    Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

    var player = this;
    var table = player.table;
    var game = table.game;
    var players = table.players;
    var player_currunt = table.players[0];
    var point = table.game.point;
    var ranks = [];
    var isAssf = false;
    var rank = player.hand.rank;
    var winnerid = table.currentTurn;
    var isSitandGo = false;
    var isTournament = false;
    var tournamentId = null;
    var losers = table.losers;
    game.roundNumber++;


    if (table.type == 'sit-and-go') {
        isSitandGo = true;
    }
    if (table.type == 'tournament') {
        isTournament = true;
        //tournamentId = Game.Io.engine.clients[socketId]._userData.tournamentId;
        tournamentId = table.tournamentId;
    }



    // player win

    //set round player points
    game.roundPoints = []

    // set game points for all players
    var final_point = 0;
    var winner_point = 0
    var winner = player_currunt;



    point.forEach(function (point, key) {
        if (point.id == winner.id) {
            winner_point = point.point;
        }
    })
    final_point = 0;
    point.forEach(function (point, key) {
        if (point.id != winner.id && point.point != 0) {
            final_point = parseInt(final_point) + (parseInt(point.point) - parseInt(winner_point));
        }
    })


    Game.AppSource.Shop.Controllers.Landmark.getAllLandmark({}, function (err, landmark) {
        if (err) {
            return;
        }

        var tot = landmark.length;
        var point_per_coin = 1;
        var selected_landmark = table.level;
        var selected_landmark_name = '';

        var sit_n_go_final_point = 0;

        landmark.forEach(function (land, key) {
            if (land.id == table.level) {
                point_per_coin = land.coin;
                if (isSitandGo == true) {
                    sit_n_go_final_point = parseInt(point_per_coin) * parseInt(table.playersCount);
                }
            }
        });


        if (isSitandGo == false && isTournament == false) {
            /**
            *  Update Looser Coin
            */
            var losePoint = [];
            // var k = 0;
            point.forEach(function (point, key) {
                if (point.id != winner.id) {
                    var finalPoint = (parseInt(point.point) - parseInt(winner_point)) * parseInt(point_per_coin);
                    Game.AppSource.Game.Controllers.CoinGame.PlayerLoseCoinUpdate(point.id, finalPoint, table.id).then(function (data) { return; }, function (err) { return; });
                    losePoint.push({
                        id: point.id,
                        point: finalPoint
                    });


                }
            });
        }

        if (isSitandGo == false && isTournament == true) {
            // Tournament Code Here 

            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
            Game.Logger.debug('+ Tournament Game Over : Table ID :+', table.id);
            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

            /**
             * Save Winners to Tournamnets 
             */

             /*
                or:[
                    { 'tables.qf': [{ id: table.id }] },
                    { 'tables.sf': [{ id: table.id }] },
                    { 'tables.fi': [{ id: table.id }] },
                ]
             */


            Game.AppSource.Game.Controllers.TournamentService.getTournament({id:tournamentId}, function (err, tournament) {
                if(err) {
                    return callback(err);
                }



                // tournament.winners.push(winner);
                Game.AppSource.Game.Controllers.TournamentProcess.addWinnersToTournament(tournament, winner, function (err, tournament) {
                    if(err) {
                        return callback(err)
                    }

                    losers.forEach(function (losers, key) {
                        tournament.losers.push(losers);
                    });
                    Game.AppSource.Game.Controllers.TournamentService.updateTournament(tournament, function (err, tournament) {
                        // Save Tournament
                        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                        Game.Logger.debug('+ Tournament Updated :+', tournament.tables);
                        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

                        game.status = 'FINISHED';
                        table.status = 'FINISHED';
                        if (final_point < 0) {
                            final_point = 0;
                        }

                        Game.Io.to(table.id).emit('GameFinished', { winnerId: winner.id, winnerName: winner.username, coin: 0,loser_point: 0 });

                        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                        Game.Logger.debug('+ Check For Tournament Table Finished :+');
                        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

                        let qf_ids = tournament.tables.qf.map(function (item) {
                            return item.id;
                        });

                        let sf_ids = tournament.tables.sf.map(function (item) {
                            return item.id;
                        });

                        let fi_ids = tournament.tables.fi.map(function (item) {
                            return item.id;
                        });

                        var ids = [];
                        if(qf_ids.includes(table.id)){
                           // console.log("IN QF",qf_ids);
                            ids = qf_ids;
                        }
                        if(sf_ids.includes(table.id)){
                          // console.log("IN SF",sf_ids);
                            ids = sf_ids;
                        }
                        if(fi_ids.includes(table.id)){
                           // console.log("IN FI",fi_ids);
                            ids = fi_ids;
                        }

                       // console.log("IDS>>",ids);


                        var isAllTablePlaying = true;

                        Game.AppSource.Game.Controllers.TableService.updateTable(table, function (err, table) {
                            if(err) {
                                return callback(err)
                            }
                            console.log("==============================================");
                            console.log(" + Tournament Table Game Over + ");
                            console.log(" + Single Player Left So Game Over + ");
                            console.log("==============================================");

                            Game.AppSource.Game.Models.Table.find({ id: ids })
                                .exec(function (err, tbls) {
                                    if(err) {
                                        return callback(err)
                                    }

                                    tbls.forEach(function (table, key) {
                                      //  console.log("Table ID : "+table.id+"-"+table.status);
                                        if (table.status != 'FINISHED') {
                                            isAllTablePlaying = false;
                                        }
                                    });

                                    /**
                                     * Set Brodcast For Player win Table
                                     */

                                    // var gamewinPlayerData = {
                                    //     playerid: winner.id,
                                    //     username: winner.username,
                                    //     level: 0,
                                    //     point: winner_point
                                    // };
                                    // Game.Io.to(tournament.id).emit('TournamentGameWin', gamewinPlayerData);

                                    if (isAllTablePlaying) {
                                        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                                        Game.Logger.debug('+ Tournament All Table Finished So Start New Round :+');
                                        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                                        setTimeout(function (game) {
                                            tournament.startNewRound();
                                        }, 10000, game);
                                    }{
                                        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                                        Game.Logger.debug('+ ALL Table Not Finished So Game Contnue..:+');
                                        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                                    }
                                    return callback(null, table);
                                });

                        });
                    });

                });
            




            });

            // Game.AppSource.Game.Models.Tournament.update({id: id}, tournament.toJson())
            // .exec(function (err, tournaments) {
            //     if(err) { console.log('updateTournament', err); return cb(err) }
            //     Game.Logger.info('Tournament updated')
            //     if(tournaments[0]){
            //         return cb(null, buildTournament(tournaments[0]));
            //     }
            //     return cb(new Error('Tournament not found.'))
            // })



        }


        if (isTournament == false) { // if Game is Sit-n-go OR Coin Game

            Game.AppSource.Player.Models.Player.findOne({ id: winner.id })
                .then(function (ply) {

                    final_point = parseInt(final_point) * parseInt(point_per_coin); // conver Point to coin
                    let beforeCoin = parseInt(ply.coin);
                    let addedCoins = 0;
                    let player_final_point =  parseInt(ply.coin);
                    if (isSitandGo == true) {
                        addedCoins =  parseInt(sit_n_go_final_point);
                         player_final_point = parseInt(ply.coin) + parseInt(sit_n_go_final_point);
                    } else {
                        addedCoins =  parseInt(final_point);
                         player_final_point = parseInt(ply.coin) + parseInt(final_point);
                    }

                  //  console.log("ply.coin"+ply.coin+"player_final_point"+player_final_point+"sit_n_go_final_point"+sit_n_go_final_point);


                    // Save Player Statistic
                     
                    ply.statistics['coins_won']  = parseInt(ply.statistics['coins_won']) + parseInt(addedCoins);
              

                    Game.AppSource.Player.Models.Player.update({ id: winner.id }, { coin: player_final_point,statistics:ply.statistics})
                        .then(function (p_data) {
                            /// resolve(landmark);  
                            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                            Game.Logger.debug('+ GAME FINISED - SINGLE PLAYER + WINNER');
                            Game.Logger.debug('+ NAME =' + ply.username);
                            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

                            /**
                             * Update Player Statistics
                             **/


                            // 

                            Game.AppSource.Game.Models.Table.native(function (err, tblObj) {
                                tblObj.findOne({ "_id": new ObjectId(table.id) }, function (err, tbl) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var start = new Date(tbl.createdAt);
                                        var end = new Date(tbl.updatedAt);
                                        var diffMs = (end - start);
                                        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                                        players.forEach(function (plr) {

                                            Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(plr.id, 'game_playing_time', diffMins).then(function (data) { return; }, function (err) { return; });

                                        });

                                    }
                                });

                            });



                           

                            Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(winner.id, 'game_won', table.level).then(function (data) { return; }, function (err) { return; });

                            game.status = 'FINISHED';
                            table.status = 'FINISHED';
                            if (final_point < 0) {
                                final_point = 0;
                            }

                            /**
                            * When Player coin Updated
                            */
                            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                            Game.Logger.debug('Socket id of winner',socketId);
                            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                            if (socketId != null) {

                                Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(socketId,winner.id,player_final_point,p_data.level,function (err) { });

                                // Game.Io.to(socketId).emit("coinupdated", {
                                //     playerid: winner.id,
                                //     coin: parseInt(player_final_point),
                                //     level : parseInt(p_data.level)
                                // });


                                Game.AppSource.Player.Models.Coinshistory.create({
                                    player: winner.id,
                                    coins: addedCoins,
                                    type: 'credit',
                                    flag: 'Game Winning Coins',
                                    tableId: table.id,
                                    beforCoins: beforeCoin,
                                    afterCoins: player_final_point,
                                    status: 'success'
                                }).exec(function (err, ch) {
                                if (err) {
                                    return callback(err)
                                }
                                   
                                })
                            }

                            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                            Game.Logger.debug('+ GAME FINISHED - SINGLE PLAYER +');
                            Game.Logger.debug('+ TABLE STATUS =' + table.status);
                            Game.Logger.debug(" Points = ",sit_n_go_final_point);
                            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

                            if (isSitandGo == true) {
                                Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(winner.id, 'sit_n_go_won', 1).then(function (data) { return; }, function (err) { return; });

                                Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(winner.id, 'best_match_score', sit_n_go_final_point).then(function (data) { return; }, function (err) { return; });

                                Game.Io.to(table.id).emit('GameFinished', { winnerId: winner.id, winnerName: winner.username, coin: sit_n_go_final_point, loser_point: [] });
                            } else {

                                Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(winner.id, 'coin_games_won', 1).then(function (data) { return; }, function (err) { return; });

                                Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(winner.id, 'best_match_score', final_point).then(function (data) { return; }, function (err) { return; });

                                Game.Io.to(table.id).emit('GameFinished', { winnerId: winner.id, winnerName: winner.username, coin: final_point, loser_point: losePoint });
                            }


                            //Game.Io.to(table.id).emit('GameOver', { message: 'Calculating coins as per winners' })
                            // game.emit('FindWinners');
                            return callback(null, table);

                        })
                        .catch(function (err) {
                            return err;
                        })
                })
                .catch(function (err) {
                    return err;
                })
        } // 


    });


}







