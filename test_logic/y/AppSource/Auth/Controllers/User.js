var jwt = require('jsonwebtoken');
var debug = require('debug')('AppSource:User:Controller:User');

module.exports = {
	
	register: function(data, cb){
		debug('registerLogin function called.');
		Game.AppSource.User.Models.User.create(data)
		.exec(function (err, user) {
			if(err) { console.log(err); return cb(err) }
			return cb(null, user);
		})
		
	},
	login: function(data, cb){
		Game.AppSource.User.Models.User.findOne({ username: data.username }, function (err, user) {
        if(err) { console.log(err); return cb(err) }
        if (user && user.verifyPassword(data.password)) {
            return cb(null, {
                _id: user._id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                token: jwt.sign({ sub: user._id }, Game.Config.App.secret)
            })
        } else {
            return cb(null, null, 'Password or username does not match.')
        }
    });
	},

}