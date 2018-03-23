var debug = require('debug')('AppSource:Tournament:Socket:Tournament');
module.exports = function (socket) {
	var client = Game.Io.engine.clients[socket.id];

    socket.on('GetTournamentList', function (data, callback) {
        debug('GetTournamentList event called.');
        console.log('GetTournamentList event called.');
        Game.AppSource.Tournament.Controllers.Tournament.getAll({}, function(err, tournament){

        if(err){
            return callback({
                    status: '500',
                    result: err,
                    message: 'Something is wrong please try again later.'
            });
        }
        return callback({
            status: '200',
            result: tournament,
            message: 'All tournament list.'
        });
        
    })

    });

}
