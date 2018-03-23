 
module.exports = function (socket) {
	var client = Game.Io.engine.clients[socket.id];

    socket.on('GetSoundList', function (data, callback) {
       
        console.log('GetSoundList event called.');

        Game.AppSource.Shop.Controllers.Sound.getAll(client._userData.id, data)
        .then(function(sound){
            return callback({
            status: '200',
            result: sound,
            message: 'All sound list.'
        });
        },function(err){
            return callback({
                    status: '500',
                    result: err,
                    message: 'Something is wrong please try again later.'
            });
        });



    //     Game.AppSource.Shop.Controllers.Sound.getAll({}, function(err, sound){

    //     if(err){
    //         return callback({
    //                 status: '500',
    //                 result: err,
    //                 message: 'Something is wrong please try again later.'
    //         });
    //     }
    //     return callback({
    //         status: '200',
    //         result: sound,
    //         message: 'All Sound list.'
    //     });
        
    // })

});

  // Purchas Buy

  socket.on('PurchaseSound', function (data, callback) {
    
    console.log('PurchaseSound event called.');
        Game.AppSource.Shop.Controllers.Sound.purchasesound(client._userData.id, data)
        .then(function(sound){
            return callback({
            status: '200',
            result: sound,
            message: 'Sound Successfully Purchased'
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
                    message: 'Error On Purchase Sound'
            });
            }
        });

});

socket.on('SetSound', function (data, callback) {
    console.log('SetSound event called.',data);
        Game.AppSource.Shop.Controllers.Sound.setsound(client._userData.id, data)
        .then(function(avatar){
            return callback({
            status: '200',
            result: '',
            message: 'Sound Successfully Set'
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
