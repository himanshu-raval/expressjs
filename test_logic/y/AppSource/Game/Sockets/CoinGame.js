module.exports = function (socket) {
    var client = Game.Io.engine.clients[socket.id];
    socket.on('GameSearchTable', function (data, callback) {
        Game.Logger.debug('GameSearchTable event received')
        if (client._userData.playerId == undefined || client._userData.playerId == null) {
            return callback({
                status: '100',
                result: 'Login Error',
                message: 'Oops! Your Connection has Dropped, Please Login Again.'
            });
        }
        if (client._userData.inTournament != undefined && client._userData.inTournament == true) {
            return callback({
                status: '101',
                result: 'You Are in Tournament',
                message: 'Oops! You Are in Tournament so Can not Play any Game'
            });
        }
        data.socketId = client._userData.socketId;
        Game.AppSource.Game.Controllers.CoinGame.searchTable(data, function (err, table) {
            if (err) {
                if (err.ValidationError) {
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
            socket.join(table.id);
            var playerIndex = parseInt(table.players.length) - 1;

            var player = {
                id : table.players[table.players.length - 1].id,
                username : table.players[table.players.length - 1].username,
                avatar : table.players[table.players.length - 1].avatar,
                card : table.players[table.players.length - 1].card 
            };
            
            Game.Io.to(table.id).emit('GameNewPlayerJoined', player);


            client._userData.tableId = table.id;
            client._userData.inTournament = false;
            var players = [];
            var seatIndex = 0;
            table.players.forEach(function(ply) {
                players.push({
                    id:ply.id,
                    username : ply.username,
                    avatar : ply.avatar,
                    card : ply.card ,
                    seatIndex : seatIndex++,
                    test : '123'                   
                })
            }, this);

            var result = {
                 players : players,
                 table_id : table.id
            };

            Game.Io.to(table.id).emit('UpdatedGameNewPlayerJoined',result); // New Broadcast for Update
            return callback({
                status: '200',
                result: result,
                message: 'Player joined table.'
            });
        });
    });
    socket.on('CoinGamePerformAction', function (data, callback) {
        // Game.Logger.debug('CoinGamePerformAction event received', data)
        Game.AppSource.Game.Controllers.CoinGame.playerAction(client._userData, data, function (err, table) {
            if (err) {
                if (err.ValidationError) {
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
            return callback({
                status: '200',
                result: table.toJson(),
                message: 'Player joined table.'
            });
        })
    });

    socket.on('CoinGameCallYaniv', function (data, callback) {
        Game.Logger.debug('CoinGame CallYaniv Event Received :',data);
        console.log('==========================================================')
        console.log('CoinGameCallYaniv event cvalled')
        console.log('client._userData',client._userData)
        console.log('==========================================================')
        Game.AppSource.Game.Controllers.CoinGame.callYaniv(client._userData, data, function (err, table) {
            if (err) {
                if (err.ValidationError) {
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
            return callback({
                status: '200',
                result: '',
                message: 'Player Call Yaniv.'
            });
        })
    });
    socket.on('CoinGamePlayerLeft', function (data, callback) {

        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ CoinGamePlayerLeft EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('+ TABLE ID =',client._userData.tableId);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

        if(data.tableId == ''){
            return callback({
                status: '200',
                result: "",
                message: 'Player Left With No Table.'
            });
        }

        // Leave Player From Table.
        socket.leave(client._userData.tableId);

        Game.Io.emit('playerOffline', {playerId : client._userData.playerId });

        Game.AppSource.Game.Controllers.CoinGame.playerLeft(client._userData, data, function (err, table) {
            if (err) {
                return callback({
                    status: '500',
                    result: err,
                    message: err.message
                });
            }
            return callback({
                status: '200',
                result: table.toJson(),
                message: 'Player Left table.'
            });
        })
    });
    socket.on('disconnect', function (resion) {


        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ PLAYER DISCONNECTED +');
        Game.Logger.debug('+ RESION =',resion);
        Game.Logger.debug('+ PLAYER ID =',client._userData.playerId);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

		Game.Io.emit('playerOffline', {playerId : client._userData.playerId });

        if(resion == 'ping timeout'){
            Game.Logger.debug('Sending session end event to socket client');
            socket.emit('SessionTimeOut',{});
        }else{
            if ((client._userData.playerId != undefined || client._userData.playerId != null) && (client._userData.tableId != undefined || client._userData.tableId != null)) {
                var ply_id = client._userData.playerId;
                var table_id = client._userData.tableId;
                if (client._userData.tableId) {
                    Game.AppSource.Game.Controllers.CoinGame.playerLeft(client._userData, { playerId: ply_id, tableId: table_id }, function (err, table) {
                        if (err) {
                            return;
                        }
                        socket.leave(client._userData.tableId)
                        return;
                    })
                }
            }
        }

        // socket.leave(client._userData.tableId)
        // // check for game stop or not
        // clearTimeout(Game.Timers[client._userData.tableId])
        // socket.broadcast.to(client._userData.tableId).emit('CoinGamePlayerLeft', {id: client._userData.id})
    });


    /**
     * Get Game ScoreBoard
     */

    socket.on('GameScoreBoard', function (data, callback) {

        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ GameScoreBoard EVENT RECIVED +');
        Game.Logger.debug('+ DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

        Game.AppSource.Game.Controllers.CoinGame.gameScoreBoard(data, function (err, data) {
            if (err) {
                if (err.ValidationError) {
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
            return callback({
                status: '200',
                result: data,
                message: 'GameScoreBoard Data.'
            });
        })
    });

    /**
     * Statistics Update By Game
     */
    socket.on('UpdateStatistics', function (data, callback) {
        Game.Logger.debug('UpdateStatistics Event Received')
        Game.AppSource.Game.Controllers.CoinGame.PlayerStatisticsUpdate(data.playerId, data.statistics, 1);
        return callback({
            status: '200',
            result: 'Done',
            message: 'Statistics Updated.'
        });

    });

    /**
     * Achivment Reward 
     */
    socket.on('AchievementReward', function (data, callback) {
        Game.Logger.debug('AchivmentReward Event Received', data)
        Game.AppSource.Game.Controllers.CoinGame.AchievementReward(data.playerid, data.achievement_id, client._userData.socketId);
        return callback({
            status: '200',
            result: 'Done',
            message: 'Achievement Reward.'
        });

    });

    /**
     * Get My Friends
     * Paramiter : data.playerId 
     */
    socket.on('PlayWithFriendsGameStart', function (data, callback) {
        
            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
            Game.Logger.debug('+ PlayWithFriendsGameStart EVENT RECEIVED +');
            Game.Logger.debug('+ EVENT DATA =',data);
            Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
            
        
            Game.AppSource.Game.Controllers.CoinGame.playWithFriendsGameStart(data,
                function (err, table) {
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
                        message: 'No Friend Found!'
                    });
                }
                return callback({
                    status: '200',
                    result: table,
                    message: 'Play With Friends Game Start'
                });
            });
    });

    /**
     * Game Chat
     */
    socket.on('SendChat', function (data, callback) {
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ SendChat EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.AppSource.Game.Controllers.CoinGame.gamechat(data,
            function (err, table) {
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
                    message: 'No Table Found'
                });
            }
            return callback({
                status: '200',
                message: 'chat Message Send'
            });
        });



        // socket.broadcast.emit('GameChat', data)
        //         return callback({
        //             status: '200',
        //             result: data,
        //             message: 'Player Send Chat'
        // }); 
        
    });


    /**
     * Remove After Test.
     */
    socket.on('playerusernamechange', function (data, callback) {
        Game.Logger.debug('playerusernamechange Event Received')
        Game.AppSource.Game.Controllers.CoinGame.playerusernamechange();
        return callback({
            status: '200',
            result: 'Done',
            message: 'playerusernamechange.'
        });

    });




}

