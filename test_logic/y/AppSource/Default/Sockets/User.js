var debug = require('debug')('Socket:user');
module.exports = function (socket) {
    debug('New Socket connection received.')
    var client = Game.Io.engine.clients[socket.id];
    if(client._userData){
        client._userData['status'] = 'offline';
    }else{
    	client._userData = {
			socketId : socket.id,
			status: 'offline'
	    };
    }
    

    socket.on("disconnect", function(data) {
        Game.Io.emit('onPlayerLeft', {
            socketId: client._userData.id
        });
        client._userData.status = 'offline';
    });
}