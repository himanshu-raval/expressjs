var debug = require('debug')('AppSource:Achievement:Controller:Achievement');

module.exports = {
	
	getAll: function(query, cb){
		debug(' achievement function called.');
		Game.AppSource.Achievement.Models.Achievement.find(query)
		.exec((err, achievement) => {
			if(err) { console.log(err); return cb(err) }
			 	return cb(null, achievement);
		})
	},
	
	getAllAchievement: function(data, cb){
		debug('getAll achievement function called.');
		Game.AppSource.Achievement.Models.Achievement.find({})
		.exec((err, achievement) => {
			if(err) { console.log(err); return cb(err) }
			Game.AppSource.Player.Models.Player.findOne({id:data.playerId})
			.exec((err, player)=>{
				if(err) { console.log(err); return cb(err) }
				achievement.forEach(function(achi){
				if(achi.action_on != 'call_yaniv_on_7_when_a_player_has_less_than_3_cards'){
					achi.currunt_count = 0;
					achi.isrewarded = false;
					if(achi.action_count >= 0 ){
						achi.currunt_count = player.statistics[achi.action_on];
						player.achievement.forEach(function(achiv){
						 	if(achiv.id  == achi.id){
								achi.isrewarded = achiv.isrewarded;
							} 
						});
					}
				}else{
					delete achi;
				}
		
				});
				
				return cb(null, achievement);
			});
		})
	},
	delete: function(query, cb){
		debug('delete function called.');
		Game.AppSource.Achievement.Models.Achievement.destroy(query)
		.exec((err, achievement) => {
			if(err) { console.log(err); return cb(err) }
			return cb(null, achievement);
		})
		
	},
	create: function(data){
		var promise = new Promise(function(resolve, reject){
			debug('Save achievement function called.');
			Game.AppSource.Achievement.Models.Achievement.create(data)
			.then(function (achievement) {
				resolve(achievement);  // Send success response
			})
			.catch(function (err) {
				reject(err); // Send Fails Response
			});

		});
		return promise;
	},
	update: function(query, data){
		var promise = new Promise(function(resolve, reject){
			debug('get function called.');
			Game.AppSource.Achievement.Models.Achievement.update(query, data)
			.then(function (achievement) {
		 		resolve(achievement);
			})
			.catch(function (err) {
				reject(err);
			});

		});
		return promise;
	}

}
