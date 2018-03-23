var debug = require('debug')('AppSource:Auth:Socket:Player');
module.exports = function (socket) {
	var client = Game.Io.engine.clients[socket.id];


    socket.on('PlayerUpdateSetting', function (data, callback) {
        console.log('PlayerUpdateSetting event called.',data);
        Game.AppSource.Player.Controllers.Player.update({
        	id: client._userData.id
        }, {
        	setting: data.setting
        }, function (err, player) {
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
                    message: 'Some thing is wrong please try again later'
                });
            }
            return callback({
                status: '200',
                result: player,
                message: 'Player setting updated.'
            });
        });
    });

  


    // Get top 10 Player for Leader Board

    socket.on('GetAllTopTenPlayer', function (data, callback) {
         
        Game.AppSource.Player.Controllers.Player.gettopplayer({ type : 'all' },
            function (err, player) {
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
                    message: 'Some thing is wrong please try again later'
                });
            }
            return callback({
                status: '200',
                result: player,
                message: 'Top Player List.'
            });
        });
    });


        // Get Day 10 Player for Leader Board

    socket.on('GetDayTopTenPlayer', function (data, callback) {
        
        Game.AppSource.Player.Controllers.Player.gettopplayer({ type : 'day' },
            function (err, player) {
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
                    message: 'Some thing is wrong please try again later'
                });
            }
            return callback({
                status: '200',
                result: player,
                message: 'Day Top Player List.'
            });
        });
    });
    


        // Get Weekly 10 Player for Leader Board

    socket.on('GetWeeklyTopTenPlayer', function (data, callback) {
         
        Game.AppSource.Player.Controllers.Player.gettopplayer({ type : 'weekly' },
            function (err, player) {
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
                    message: 'Some thing is wrong please try again later'
                });
            }
            return callback({
                status: '200',
                result: player,
                message: 'Weekly Top Player List.'
            });
        });
    });


    // Get Monthly 10 Player for Leader Board

    socket.on('GetMonthlyTopTenPlayer', function (data, callback) {
         
        Game.AppSource.Player.Controllers.Player.gettopplayer({ type : 'monthly' },
            function (err, player) {
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
                    message: 'Some thing is wrong please try again later'
                });
            }
            return callback({
                status: '200',
                result: player,
                message: 'Monthly Top Player List.'
            });
        });
    });



    // Update Avatar 

     socket.on('PlayerUpdateAvatar', function (data, callback) {
        debug('PlayerUpdateAvatar event called.');
        console.log("Avatar",data);
        Game.AppSource.Player.Controllers.Player.update({
            id: client._userData.id
        }, {
            selected_avatar : data.avatar
        }, function (err, player) {
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
                    message: 'Some thing is wrong please try again later'
                });
            }
            return callback({
                status: '200',
                result: player,
                message: 'Player Avatar updated.'
            });
        });
    });


     // Update Card 

    socket.on('PlayerUpdateCard', function (data, callback) {
        debug('PlayerUpdateCard event called.');
        Game.AppSource.Player.Controllers.Player.update({
            id: client._userData.id
        }, {
            selected_card: data.card
        }, function (err, player) {
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
                    message: 'Some thing is wrong please try again later'
                });
            }
            return callback({
                status: '200',
                result: player,
                message: 'Player Card updated.'
            });
        });
    });


      // Update Landmark 

     socket.on('PlayerUpdateLandmark', function (data, callback) {
        debug('PlayerUpdateLandmark event called.');
        Game.AppSource.Player.Controllers.Player.update({
            id: client._userData.id
        }, {
            selected_landmark: data.landmark
        }, function (err, player) {
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
                    message: 'Some thing is wrong please try again later'
                });
            }
            return callback({
                status: '200',
                result: player,
                message: 'Player Landmark updated.'
            });
        });
    });


      // Update Card 

     socket.on('PlayerUpdateSound', function (data, callback) {
        debug('PlayerUpdateSound event called.');
        Game.AppSource.Player.Controllers.Player.update({
            id: client._userData.id
        }, {
            selected_sound: data.sound
        }, function (err, player) {
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
                    message: 'Some thing is wrong please try again later'
                });
            }
            return callback({
                status: '200',
                result: player,
                message: 'Player Sound updated.'
            });
        });
    });


 /**
  * Get User Profile Details
  */


  socket.on('GetUserProfile', function (data, callback) {
    debug('GetUserProfile event called.');
    Game.AppSource.Player.Controllers.Player.getUserProfile(data, function (err, responce) {
        if(err){ 
           return callback({
                status: '500',
                result: err,
                message: 'Some thing is wrong please try again later'
            });
        }
   
        return callback({
            status: '200',
            result: responce,
            message: 'GetUserProfile Data'
        });
    });
});



/**
 * Search Player By Username
 */


socket.on('SearchFriends', function (data, callback) {

    Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
    Game.Logger.debug('+ SearchFriends EVENT RECEIVED +');
    Game.Logger.debug('+ EVENT DATA =',data);
    Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
    
    data.id = client._userData.id;
    Game.AppSource.Player.Controllers.Player.searchPlayer(data,
        function (err, player) {
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
                message: 'Some thing is wrong please try again later'
            });
        }
        if(player.length < 1){
            return callback({
                status: '500',
                message: 'Player Not Found!'
            });
        }else{
            return callback({
                status: '200',
                result: player,
                message: 'Search Player List'
            });
        }
       
    });
});


/**
 * Send Invitaion  for Add to Friends
 * Paramiter : data.toplayerId , data.fromPlayerId
 */


socket.on('SendInvitation', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ SendInvitation EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.sendInvitation(data,
            function (err, player) {
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
                    message: 'No Player Found!'
                });
            }
            return callback({
                status: '200',
                result: '',
                message: 'Invitation Sent!'
            });
        });
    });


/**
 * Send Invitaion  for Game Play
 * Paramiter : data.toplayerId , data.fromPlayerId
 */


socket.on('SendGameInvitation', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ SendGameInvitation EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.sendGameInvitation(data,
            function (err, player) {
            if(err){ 
                if(err.ValidationError) {
                    return callback({
                        status: '400',
                        message: 'There are some validation errors.'
                    });
                }
                return callback({
                    status: '500',
                    message: err.message
                });
            }
            return callback({
                status: '200',
                message: 'Game Invitation Sent!'
            });
        });
    });



/**
 * Get My Friends Respoce
 * Paramiter : data.playerId 
 */

socket.on('InvitationResponce', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ InvitationResponce EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.invitationResponce(data,
            function (err, player) {
            if(err){ 
                if(err.ValidationError) {
                    return callback({
                        status: '400',
                        message: 'There are some validation errors.'
                    });
                }
                console.log("Err-",err);
                return callback({
                    status: '500',
                    message: 'No Friend Found!'
                });
            }
            return callback({
                status: '200',
                message: 'Friends List'
            });
        });
    });



/**
 *  Add Friend for Game Play
 * Paramiter : data.playerId 
 */

socket.on('GameInvitationRes', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ gameInvitationResponce EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.gameInvitationRes(data,
            function (err, player) {
            if(err){ 
                if(err.ValidationError) {
                    return callback({
                        status: '400',
                        message: 'There are some validation errors.'
                    });
                }
                return callback({
                    status: '500',
                    message: 'No Friend Found!'
                });
            }
            return callback({
                status: '200',
                message: 'Friends List'
            });
        });
    });






/**
 *  Left From PlayWith Friend
 * Paramiter : data.toplayerId , data.fromPlayerId 
 */

socket.on('leftFromPlayWithFrd', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ leftFromPlayWithFrd EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.leftFromPlayWithFrd(data,
            function (err, player) {
            if(err){ 
                if(err.ValidationError) {
                    return callback({
                        status: '400',
                        message: 'There are some validation errors.'
                    });
                }
                return callback({
                    status: '500',
                    message: 'No Player Found!'
                });
            }
            return callback({
                status: '200',
                message: 'Friends List'
            });
        });
    });







    /**
 * Get My Friends
 * Paramiter : data.playerId 
 */


socket.on('GetMyFriends', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ GetMyFriends EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.getMyFriends(data,
            function (err, player) {
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
                result: player,
                message: 'Players Friends List'
            });
        });
});





/**
 * get Status for free coin/gems
 * Paramiter : playerid
 */

socket.on('GetFreeCoinGemsStatus', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ GetFreeCoinGemsStatus EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');

        Game.AppSource.Player.Controllers.Player.getFreeCoinGemsStatus(data,
            function (err, data) {
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
                    message: 'No Data Found!'
                });
            }
            return callback({
                status: '200',
                result: data,
                message: 'Get Free Coin/Gems Status Data'
            });
        });
});





/**
 * Reward free coin/gems
 * Paramiter : type= coin/gems , playerid
 */

socket.on('RewardFreeCoinGems', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ RewardFreeCoinGems EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.rewardFreeCoinGems(data,
            function (err, data) {
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
                    message: 'No Data Found!'
                });
            }
            return callback({
                status: '200',
                message: 'Reward Free Coin/Gems'
            });
        });
});


/**
 * Reward video ads coin
 * Paramiter : playerid
 */


socket.on('FreeCoinGemsinstant', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ FreeCoinGemsinstant EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.freecoingemsinstant(data,
            function (err, data) {
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
                    message: 'No Data Found!'
                });
            }
            var d = new Date();
  
            // var result = {
            //    'DD': d.getDate(),
            //    'MM': d.getMonth(),
            //    'YY': d.getFullYear()
            // }
            return callback({
                status: '200',
                message: 'Free coin Gems Instant Success'
               
            });
        });
});

/**
 * Reward video ads coin
 * Paramiter : playerid
 */


socket.on('RewardVideoAds', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ RewardVideoAds EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.rewardVideoAds(data,
            function (err, data) {
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
                    message: 'No Data Found!'
                });
            }
            var d = new Date();
  
            // var result = {
            //    'DD': d.getDate(),
            //    'MM': d.getMonth(),
            //    'YY': d.getFullYear()
            // }
            return callback({
                status: '200',
                message: 'Reward Video Coin Success'
               
            });
        });
});


/**
 * Reward video ads coin
 * Paramiter : playerid
 */


socket.on('RewardTimeCoins', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ RewardTimeCoins EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.rewardtimecoins(data,
            function (err, data) {
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
                    message: 'No Data Found!'
                });
            }
   
            return callback({
                status: '200',
                message: 'Reward Times Coin Success'
               
            });
        });
});

/**
 * Scratch card
 * Paramiter : playerid,type,
 */


socket.on('ScratchCard', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ Scratchcard EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.scratchcard(data,
            function (err, data) {
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
                    message: err.message
                });
            }
            return callback({
                status: '200',
                result : data,
                message: 'Scratch Card Success'
            });
        });
});



/**
 * Purchase Shark pool 
 * Paramiter : playerid,
 * 
  */


socket.on('SharkPool', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ SharkPool EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.sharkpool(data,
            function (err, data) {
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
                    result: err.message,
                    message: err.message
                });
            }
            return callback({
                status: '200',
                result : data,
                message: 'Shark Pool Success'
            });
        });
});
 

/**
 * Purchase Shark pool 
 * Paramiter : playerid,
 * 
 */


socket.on('PurchaseSharkPool', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ PurchaseSharkPool EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.purchasesharkpool(data,
            function (err, data) {
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
                    result: err.message,
                    message: err.message
                });
            }
            return callback({
                status: '200',
                result : data,
                message: 'Purchase Shark Pool Success'
            });
        });
});





/**
 * Invite Shark pool 
 * Paramiter : toPlayerId,fromPlayerId
 * 
  */


socket.on('InviteSharkPool', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ InviteSharkPool EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.invitesharkpool(data,
            function (err, data) {
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
                    result: err.message,
                    message: err.message
                });
            }
            return callback({
                status: '200',
                result : data,
                message: 'Invite Shark Pool Success'
            });
        });
});





/**
 * Invite Responce Shark pool 
 * Paramiter : toPlayerId,fromPlayerId
 * 
  */


  socket.on('InviteResponceSharkPool', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ InviteResponceSharkPool EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.inviteresponcesharkpool(data,
            function (err, data) {
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
                    result: err.message,
                    message: err.message
                });
            }
            return callback({
                status: '200',
                result : data,
                message: 'Invite Responce Shark Pool Success'
            });
        });
});



/**
 * Get Coin Shark pool 
 * Paramiter : playerId,getPlayerId
 * 
  */


  socket.on('GetCoinSharkPool', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ GetCoinSharkPool EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.getcoinsharkpool(data,
            function (err, data) {
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
                    result: err.message,
                    message: err.message
                });
            }
            return callback({
                status: '200',
                message: 'Get Coin Shark Pool Success'
            });
        });
});








/**
 * Rate Us Rewards 
 * Paramiter : playerid,
 * 
  */


socket.on('RateUsRewards', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ RateUsRewards EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.rateusrewards(data,
            function (err, data) {
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
                    result: err.message,
                    message: err.message
                });
            }
            return callback({
                status: '200',
                result : data,
                message: 'Rate Us Rewards Success'
            });
        });
});


/**
 * Friends List
 * Paramiter : playerId
 */

socket.on('FriendsList', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ FriendsList EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.friendslist(data,
            function (err, data) {
            if(err){ 
                return callback({
                    status: '500',
                    result: err.message,
                    message: err.message
                });
            }
            return callback({
                status: '200',
                result: data,
                message: 'Friends List Success'
            });
        });
});





/**
 * Player Statestic
 * Paramiter : playerId
 */

socket.on('getPlayersStatisticsData', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ getPlayersStatistics EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
           

        Game.AppSource.Player.Controllers.Player.getplayersstatisticsdata(data,
            function (err, data) {
            if(err){ 
                return callback({
                    status: '500',
                    result: err.message,
                    message: err.message
                });
            }
            return callback({
                status: '200',
                data: data,
                message: 'Player Statistics'
            });
        });
});








/**
 * Send Coins
 * Paramiter : toPlayerId,fromPlayerId,
 * 
  */


  socket.on('SendCoins', function (data, callback) {
    
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ SendCoins EVENT RECEIVED +');
        Game.Logger.debug('+ EVENT DATA =',data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        
        Game.AppSource.Player.Controllers.Player.sendcoins(data,
            function (err, data) {
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
                    result: err.message,
                    message: err.message
                });
            }
            return callback({
                status: '200',
                message: 'Send Coins Success'
            });
        });
});








// Test Push

socket.on('SendPush', function (data, callback) {
    Game.AppSource.Player.Controllers.Player.testandroidpush(data,
        function (err, data) {
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
                message: err.message
            });
        }
        return callback({
            status: '200',
            result : data,
            message: 'Send Push Success'
        });
    });
});




}
