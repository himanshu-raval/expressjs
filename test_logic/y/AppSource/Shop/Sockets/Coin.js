 
module.exports = function (socket) {
	var client = Game.Io.engine.clients[socket.id];

    socket.on('GetCoinList', function (data, callback) {
      
        console.log('GetCoinList event called.');
        Game.AppSource.Shop.Controllers.Coin.getAll(client._userData.id, data)
        .then(function(coin){
            return callback({
            status: '200',
            result: coin,
            message: 'All Coin list.'
        });
        },function(err){
            return callback({
                    status: '500',
                    result: err,
                    message: 'Something is wrong please try again later.'
            });
        });

   

    //     Game.AppSource.Shop.Controllers.Coin.getAll({}, function(err, coin){

    //     if(err){
    //         return callback({
    //                 status: '500',
    //                 result: err,
    //                 message: 'Something is wrong please try again later.'
    //         });
    //     }
    //     return callback({
    //         status: '200',
    //         result: coin,
    //         message: 'All Coin list.'
    //     });
        
    // })

       
    });


    // Coin 

    socket.on('PurchaseCoin', function (data, callback) {
       
        console.log('PurchaseCoin event called.');
            Game.AppSource.Shop.Controllers.Coin.purchasecoin(client._userData, data)
            .then(function(coin){
                return callback({
                status: '200',
                result: coin,
                message: 'Coin Successfully Purchased'
            });
            },function(err){
                console.log(err);
                if(err.message == 'gems'){
                    return callback({
                        status: '500',
                        message: 'Player Have Insufficient Gems, Please Buy Gems'
                    });
                }else{
                    return callback({
                        status: '500',
                        message: 'Error On Purchase Coin'
                });
                }
            });

    });




}
