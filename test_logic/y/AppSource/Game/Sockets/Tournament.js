module.exports = function (socket) {
	var client = Game.Io.engine.clients[socket.id];

    socket.on('SearchTournament', function (data, callback) {
        Game.Logger.debug('SearchTournament Event Received',data)
        if(client._userData.playerId == undefined || client._userData.playerId == null){
            return callback({
                        status: '100',
                        result: 'Login Error',
                        message: 'Oops! Your Connection has Dropped, Please Login Again.'
                    });
        }
        data.socketId = client._userData.socketId;
        Game.AppSource.Game.Controllers.TournamentProcess.search(data, function (err, tournament) {
            if(err){ 
                if(err.ValidationError) {
                    return callback({
                        status: '400',
                        result: err.ValidationError,
                        message: 'There are some validation errors.'
                    });
                }
                return callback({
                    status: '500',
                    result: err,
                    message: err.message
                });
            }
            Game.Logger.info('Player joined successfully')
            socket.join(tournament.id);
            // var playerData = tournament.players[tournament.players.length - 1];
            // var gamewinPlayerData = {
            //     playerid : playerData.id,
            //     username : playerData.username,
            //     level : 0,
            //     point : 0
            // };
            // var table_id = '';
            // tournament.phase_player.qf.forEach(function(obj) {
            //     if(client._userData.playerId == obj.playerData.playerid){
            //             table_id = obj.tableId;
            //     }
            // });



                            /** Test */
                            /** Remove it */

                            
                            // var losePoint = [];

                            // losePoint.push({
                            //     id: '59f3168acee7d0a854f9ffc6',
                            //     point: 25
                            // });


                            // setTimeout(function () {
                            //     Game.Io.to(tournament.id).emit('GameFinished', { winnerId: '', winnerName: 'himanshu', coin: 123, loser_point: losePoint });
                            // }, 2000);

                            

                            // var winner = [];
                            // winner[0] = {
                            //     id : '59f3168acee7d0a854f9ffc6',
                            //     username: 'himanshu',
                            //     avatar: '59647bd9cc9c65a269686667',
                            //     coins: 500
                            // };

                            // winner[1] = {
                            //     id : '59f3228ebe51d7f15a351585',
                            //     username: 'himanshu',
                            //     avatar: '59647bd9cc9c65a269686667',
                            //     coins: 300
                            // };
                            // winner[2] = {
                            //     id : '59f3228ebe51d7f15a351585',
                            //     username: 'himanshu',
                            //     avatar: '59647bd9cc9c65a269686667',
                            //     coins: 150
                            // };
                            // winner[3] = {
                            //     id : '59f3228ebe51d7f15a351585',
                            //     username: 'himanshu',
                            //     avatar: '59647bd9cc9c65a269686667',
                            //     coins: 50
                            // }

                            // Game.Io.to(tournament.id).emit('TournamentFinished', {winner});


                            /** Remove it */


           var result = {
               id : tournament.id,
               fi : tournament.phase_player.fi,
               sf : tournament.phase_player.sf,
               qf : tournament.phase_player.qf
           }

            client._userData.tournamentId = tournament.id;
            client._userData.inTournament = true;
            return callback({
                status: '200',
                result: tournament.toJson(),
                message: 'Player joined Tournament.'
            });
        });
    });

    /**
     * Turnament Tree Player
     */
    // socket.on('GetTournamentPlayers', function (data, callback) {
    //     Game.Logger.debug('GetTournamentPlayers Event Received', data)
    //     Game.AppSource.Game.Controllers.TournamentProcess.getTournamentPlayers(data.tournamentid, function(err,players){
    //         if(err){ 
    //             if(err.ValidationError) {
    //                 return callback({
    //                     status: '400',
    //                     result: err.ValidationError,
    //                     message: 'There are some validation errors.'
    //                 });
    //             }
    //             return callback({
    //                 status: '500',
    //                 result: err,
    //                 message: err.message
    //             });
    //         }
    //         return callback({
    //             status: '200',
    //             result: players,
    //             message: 'Tourament Player List'
    //         });

    //     });
        

    // });


    socket.on('TournamentPlayerLeft', function (data, callback) {
        
            client._userData.inTournament = false;
            socket.leave(data.tableId);
            socket.leave(client._userData.tournamentId);
            return callback({
                status: '200',
                result: "Done",
                message: 'Player Left Tournament.'
            });
        });
}


