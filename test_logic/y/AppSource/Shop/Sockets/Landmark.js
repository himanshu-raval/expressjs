 
module.exports = function (socket) {
	var client = Game.Io.engine.clients[socket.id];

    socket.on('GetLandmarkList', function (data, callback) {
        console.log('GetLandmarkList event called.');
        Game.AppSource.Shop.Controllers.Landmark.getAll(client._userData.id, data)
        .then(function(landmark){
            return callback({
            status: '200',
            result: landmark,
            message: 'All Landmark list.'
        });
        },function(err){
            return callback({
                    status: '500',
                    result: err,
                    message: 'Something is wrong please try again later.'
            });
        });
    });

    // Get Landmark List With Coin Avilable Status.
    /**
    *   Paramiter : gameType:sit-n-go/coingame, gameOverPoint:100/200
    *
    **/

    socket.on('GetLandmarkListWithCoin', function (data, callback) {
        console.log('GetLandmarkList event called.');
        Game.AppSource.Shop.Controllers.Landmark.getAllLandmarkwithcoin(client._userData.id, data)
        .then(function(landmark){
            return callback({
            status: '200',
            result: landmark,
            message: 'All Landmark list.'
        });
        },function(err){
            return callback({
                    status: '500',
                    result: err,
                    message: 'Something is wrong please try again later.'
            });
        });
    });


    // Purchas Buy

    socket.on('PurchaseLandmark', function (data, callback) {
        
        console.log('PurchaseLandmark event called.');
            Game.AppSource.Shop.Controllers.Landmark.purchaselandmark(client._userData.id, data)
            .then(function(landmark){
                return callback({
                status: '200',
                result: landmark,
                message: 'Landmark Successfully Purchased'
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
                        message: 'Error On Purchase Landmark'
                });
                }
            });

    });




}
