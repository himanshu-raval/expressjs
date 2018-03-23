 
module.exports = function (socket) {
	var client = Game.Io.engine.clients[socket.id];

    socket.on('GetChestList', function (data, callback) {
         
        console.log('GetChestList event called.');

        Game.AppSource.Shop.Controllers.Chest.getAll(client._userData.id, data)
        .then(function(chest){
            return callback({
            status: '200',
            result: chest,
            message: 'All Chest list.'
        });
        },function(err){
            return callback({
                    status: '500',
                    result: err,
                    message: 'Something is wrong please try again later.'
            });
        });




    //     Game.AppSource.Shop.Controllers.Chest.getAll({}, function(err, chest){

    //     if(err){
    //         return callback({
    //                 status: '500',
    //                 result: err,
    //                 message: 'Something is wrong please try again later.'
    //         });
    //     }
    //     return callback({
    //         status: '200',
    //         result: chest,
    //         message: 'All Chest list.'
    //     });
        
    // })

});

// Chest 

    socket.on('PurchaseChest', function (data, callback) {
       
        console.log('PurchaseChest event called.',data);
            Game.AppSource.Shop.Controllers.Chest.purchasechest(client._userData.id, data)
            .then(function(chest){
                return callback({
                status: '200',
                result: chest,
                message: 'Chest Successfully Purchased'
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
                        message: 'Error On Purchase Chest'
                });
                }
            });

    });


}
