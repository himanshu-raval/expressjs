 
module.exports = function (socket) {
	var client = Game.Io.engine.clients[socket.id];

    socket.on('GetGemsList', function (data, callback) {
 
        console.log('GetGemsList event called.');

        Game.AppSource.Shop.Controllers.Gems.getAll(client._userData.id, data)
        .then(function(gems){
            return callback({
            status: '200',
            result: gems,
            message: 'All Gems list.'
        });
        },function(err){
            return callback({
                    status: '500',
                    result: err,
                    message: 'Something is wrong please try again later.'
            });
        });



        // Game.AppSource.Shop.Controllers.Gems.getAll({}, function(err, gems){

        //     if(err){
        //         return callback({
        //                 status: '500',
        //                 result: err,
        //                 message: 'Something is wrong please try again later.'
        //         });
        //     }
        //     return callback({
        //         status: '200',
        //         result: gems,
        //         message: 'All Gems list.'
        //     });
        
        // })

    });

// GemstBuy

    socket.on('PurchaseGems', function (data, callback) {
 
        console.log('PurchaseGems event called.');
            Game.AppSource.Shop.Controllers.Gems.purchasegems(client._userData.id, data)
            .then(function(gems){
                return callback({
                status: '200',
                result: gems,
                message: 'Gems Successfully Purchased'
            });
   
            },function(err){
                console.log("Error = ",err);
                return callback({
                        status: '500',
                        result: err,
                        message: 'Something is wrong please try again later.'
                });
            }); 

    });
    socket.on('SetGems', function (data, callback) {
               console.log('SetGems event called.',data);
                   Game.AppSource.Shop.Controllers.Gems.setgems(client._userData.id, data)
                   .then(function(gems){
                       return callback({
                       status: '200',
                       result: '',
                       message: 'Gems Successfully Set'
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
