 
module.exports = function (socket) {
	var client = Game.Io.engine.clients[socket.id];

    socket.on('GetAvatarList', function (data, callback) {
 
        console.log('GetAvatarList event called.');

        Game.AppSource.Shop.Controllers.Avatar.getAll(client._userData.id, data)
        .then(function(avatar){
            return callback({
            status: '200',
            result: avatar,
            message: 'All Avatar list.'
        });
        },function(err){

            return callback({
                    status: '500',
                    result: err,
                    message: 'Something is wrong please try again later.'
            });
        });



        // Game.AppSource.Shop.Controllers.Avatar.getAll({}, function(err, avatar){

        //     if(err){
        //         return callback({
        //                 status: '500',
        //                 result: err,
        //                 message: 'Something is wrong please try again later.'
        //         });
        //     }
        //     return callback({
        //         status: '200',
        //         result: avatar,
        //         message: 'All Avatar list.'
        //     });
        
        // })

    });

// AvatartBuy

    socket.on('PurchaseAvatar', function (data, callback) {
 
        console.log('PurchaseAvatar event called.');
            Game.AppSource.Shop.Controllers.Avatar.purchaseavatar(client._userData.id, data)
            .then(function(avatar){
                return callback({
                status: '200',
                result: avatar,
                message: 'Avatar Successfully Purchased'
            });
            },function(err){
                if(err.message == 'gems'){
                    return callback({
                        status: '500',
                        message: 'Player Have Insufficient Gems, Please Buy Gems'
                    });
                }else{
                    return callback({
                        status: '500',
                        message: 'Error On Purchase Avatar'
                });
                }
               
            }); 

    });
    socket.on('SetAvatar', function (data, callback) {
               console.log('SetAvatar event called.',data);
                   Game.AppSource.Shop.Controllers.Avatar.setavatar(client._userData.id, data)
                   .then(function(avatar){
                       return callback({
                       status: '200',
                       result: '',
                       message: 'Avatar Successfully Set'
                   });
                   },function(err){
                       return callback({
                               status: '500',
                               result: err,
                               message: 'Something is wrong please try again later.'
                       });
                   });
       
           });


}
