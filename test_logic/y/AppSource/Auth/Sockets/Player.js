var debug = require('debug')('AppSource:Auth:Socket:Player');
module.exports = function (socket) {
	var client = Game.Io.engine.clients[socket.id];
       console.log("Socket Created : ", socket.id);

      if(client._userData == undefined || client._userData == null){
           Game.Io.to(socket.id).emit('PlayerLogInRequire','You Are Disconnected From Server, Please Login To Continue.');
                console.log("One ");
      }else{
        if(client._userData.playerId == undefined || client._userData.playerId == null){
            Game.Io.to(socket.id).emit('PlayerLogInRequire','You Are Disconnected From Server, Please Login To Continue.');
                 console.log("Two");
        }
      }

    socket.on('AuthPlayerRegister', function (data, callback) {

        if(data.appId == '' && data.isFbLogin == true){
            return callback({
                status: '500',
                result: '',
                message: 'Problem Authenticating With Facebook'
            });
        }

        data.socket_id = socket.id;
        Game.AppSource.Auth.Controllers.Player.registerLogin(data, function (err, player) {
            if(err){ 
                return callback({
                    status: '500',
                    result: err,
                    message: err.message/*'Username Already Exists'.*/
                });
            }
            client._userData.playerId = player.id;
            client._userData.id = player.id;
            client._userData.username = player.username;
            client._userData.socketId = socket.id;
            client._userData.isHitted = false;
            console.log('Player registered/Login successfully. Player ID : ',player.id);
            return callback({
                status: '200',
                result: {
                    setting:player.setting,
                    id: player.id,
                    username: player.username,
                    avatar: player.selected_avatar,
                    card: player.selected_card,
                    coin : player.coin,
                    gems : player.gems,
                    level : player.level,
                    sound : player.selected_sound
                },
                message: 'Player registered/login successfully..'
            });
        });
    });


}
