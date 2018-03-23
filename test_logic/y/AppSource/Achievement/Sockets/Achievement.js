var debug = require('debug')('AppSource:Achievement:Socket:Achievement');
module.exports = function (socket) {
	var client = Game.Io.engine.clients[socket.id];

    socket.on('GetAchievementList', function (data, callback) {
        
        console.log('GetAchievementList event called.');
        Game.AppSource.Achievement.Controllers.Achievement.getAllAchievement(client._userData, function(err, achievement){

        if(err){
            return callback({
                    status: '500',
                    result: err,
                    message: 'Something is wrong please try again later.'
            });
        }
    
        return callback({
            status: '200',
            result: achievement,
            message: 'All achievement list.'
        });
        
    })
 });


 

}
