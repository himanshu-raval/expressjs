var debug = require('debug')('AppSource:Player:Controller:Player');

module.exports = {
	
	getAll: function(query, cb){
		debug('getAll function called.');
		Game.AppSource.Player.Models.Player.find(query)
		.exec((err, players) => {
			if(err) { console.log(err); return cb(err) }
			return cb(null, players);
		})
		
	},
	delete: function(query, cb){
		debug('delete function called.');
		Game.AppSource.Player.Models.Player.destroy(query)
		.exec((err, players) => {
			if(err) { console.log(err); return cb(err) }
			return cb(null, players);
		})
		
	},

}
