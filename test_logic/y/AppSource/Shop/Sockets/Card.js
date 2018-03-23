 
module.exports = function (socket) {
	var client = Game.Io.engine.clients[socket.id];

    socket.on('GetCardList', function (data, callback) {
 
        Game.AppSource.Shop.Controllers.Card.getAll(client._userData.id, data)
        .then(function(card){
            return callback({
            status: '200',
            result: card,
            message: 'All Card list.'
        });
        },function(err){
            return callback({
                    status: '500',
                    result: err,
                    message: 'Something is wrong please try again later.'
            });
        });




    //     console.log('GetCardList event called.');
    //     Game.AppSource.Shop.Controllers.Card.getAll({}, function(err, card){

    //     if(err){
    //         return callback({
    //                 status: '500',
    //                 result: err,
    //                 message: 'Something is wrong please try again later.'
    //         });
    //     }
    //     return callback({
    //         status: '200',
    //         result: card,
    //         message: 'All Card list.'
    //     });
        
    // })

});


    // Card 

    socket.on('PurchaseCard', function (data, callback) {
      
        console.log('PurchaseCard event called.');
            Game.AppSource.Shop.Controllers.Card.purchasecard(client._userData.id, data)
            .then(function(card){
                return callback({
                status: '200',
                result: card,
                message: 'Card Successfully Purchased'
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
                        message: 'Error On Purchase Card'
                });
                }
            });

    });

    socket.on('SetCard', function (data, callback) {
        console.log('SetCard event called.',data);
        Game.AppSource.Shop.Controllers.Card.setcard(client._userData.id, data)
            .then(function(card){
                return callback({
                status: '200',
                result: '',
                message: 'Card Successfully Set'
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
