var debug = require('debug')('Controller:user');

module.exports = {
	register: function(data, cb){
	  	game.models.user.create(data)
	  	.exec(function (err, user) {
	  		if(err) { console.log(err); return cb(err) }
	  		return cb(null, user)
	  	})
	},
	login: function(data, cb){
	  	game.models.user.findOne({email: data.email})
	  	.exec(function (err, user) {
	  		if(err) { console.log(err); return cb(err) }
	  		if(!user){
	  			return cb(null, null)
	  		}
	  		if(user.verifyPassword(data.password)){
	  			return cb(null, user);
	  		}
	  		return cb(null, null)
	  	})
	},

	update: function(data, cb){
	  	game.models.user.update({id: data.id},data.data)
	  	.exec(function (err, users) {
	  		if(err) { console.log(err); return cb(err) }
	  		return cb(null, users[0]);
	  	})
	},
	find: function (data, cb) {
		game.models.user.find(data)
		.exec(function(err, users){
			if(err) { console.log(err); return cb(err) }
	  		return cb(null, users);
		})
	},
}