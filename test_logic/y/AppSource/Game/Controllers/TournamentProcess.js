module.exports = {
    search: function (data, callback) {
        console.log("------------------------------------------------------------");
        console.log("Data",data);
        Game.AppSource.Player.Models.Player.findOne({ id: data.playerId })
            .exec(function (err, player) {
                if (err) {
                    Game.Logger.error('Error in player get method')
                    return callback(err)
                }
                if (!player) {
                    Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                    Game.Logger.debug('+ Game Tournament Player NOT Found + ');
                    Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                    return callback(new Error('Player not found'))
                }
                data.status = 'waiting';
                // data.level = "59648dd7cc9c65a269686685"; // for Testing Set London

                Game.AppSource.Shop.Models.Landmark.findOne({id:data.level})
                .exec((err, landmark) => {
                    if (err) { console.log(err); return callback(err) }


                data.levelcoin = parseInt(landmark.coin);             
                var fees = parseInt(data.levelcoin);
                delete data.playerId;
                player.socketid = data.socketId;
                delete data.socketId;
                delete data.tableId;

                Game.Logger.data(data);

                if (parseInt(player.coin) < parseInt(fees)) {
                    Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                    Game.Logger.debug('+ PLAYER HAVE INSUFFICIENT COIN FOR PLAY TOURNAMENT IN THIS LEVEL +');
                    Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                    return callback(new Error(' PLAYER HAVE INSUFFICIENT COIN FOR PLAY TOURNAMENT IN THIS LEVEL'));
                }


                /**
                 * Subtract Coin form Players Accounts
                 */
                var player_final_point = parseInt(player.coin) - parseInt(fees);

                Game.AppSource.Player.Models.Player.update({ id: player.id }, { coin: player_final_point })
                    .then(function (p_data) {
                        /**
                        * When Player coin Updated
                        */

                        Game.AppSource.Game.Controllers.CoinGame.PlayerCoinLevelUpdated(player.socketid, player.id, player_final_point, p_data.level, function (err) { });

                        delete data.levelcoin; // Delete when We Search Tournaments                                                         

                        Game.AppSource.Game.Controllers.TournamentService.getTournament(data, function (err, tournament) {
                            if (err) {
                                return callback(err);
                            }
                            if (tournament) {

                                Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                                Game.Logger.debug('+ Game Tournament Found + ');
                                Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

                                /* check for players to start the game */
                                Game.AppSource.Game.Controllers.TournamentProcess.joinTournament(tournament, player, function (err, tournament) {
                                    if (err) {
                                        return callback(err)
                                    }
                                    return callback(null, tournament)
                                })
                            } else {
                                Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                                Game.Logger.debug('+ Game Tournament Not Found So Create New + ');
                                Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
                                /* 
                                If search result is undefined then create new tournament for the user
                                with the given data
                                */
                                data.levelcoin = fees;
                                Game.AppSource.Game.Controllers.TournamentService.addTournament(data, function (err, tournament) {
                                    if (err) {
                                        return callback(err)
                                    }
                                    Game.AppSource.Game.Controllers.TournamentProcess.joinTournament(tournament, player, function (err, tournament) {
                                        if (err) {
                                            return callback(err)
                                        }



                                        return callback(null, tournament)
                                    })
                                })
                            }
                        })
                    })
                    .catch(function (err) {
                        return err;
                    });



                })

            })
    },
    joinTournament: function (tournament, player, callback) {
        tournament.addPlayer(player, function (err, tournament) {
            if (err) {
                return callback(err)
            }

            Game.AppSource.Game.Controllers.TournamentService.updateTournament(tournament, function (err, tournament) {
                if (err) {
                    return callback(err)
                }
                return callback(null, tournament)
            });
        })
    },
    addWinnersToTournament: function (tournament, player, callback) {
        // console.log("tournament=>>>>>>>>",tournament);
        // console.log("player=>>>>>>>>>",player);
        tournament.addWinners(player, function (err, tournament) {
            if (err) {
                return callback(err)
            }
            Game.AppSource.Game.Controllers.TournamentService.updateTournament(tournament, function (err, tournament) {
                if (err) {
                    return callback(err)
                }
                return callback(null, tournament)
            })
        })
    },




    // getTournamentPlayers: function (tournamentid, callback) {
    //     Game.AppSource.Game.Controllers.TournamentService.getTournament({id:tournamentid}, function(err, tournament){
    //         // if(err) {
    //         //     return callback(err);
    //         // }


    //         tournament.players.forEach(function(element,key) {

    //         });

    //         // var count = parseInt(tournament.players.lenght) / 4;
    //         // console.log("Count :",tournament.players);
    //          var qf_players = [];
    //         // for(i=0;i<count;i++){
    //         //     var data =  tournament.players.splice(1,4);
    //         //     console.log("Splice :",data);
    //         //     qf_players.push(data);

    //         // }


    //         var tournamentPlayerPhase = {
    //             'fi': {

    //             },
    //             'sf': {

    //             },
    //             'qf':{
    //                 players : qf_players
    //             }
    //         };

    //         callback(tournamentPlayerPhase);


    //     })
    // },
}