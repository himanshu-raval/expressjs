var debug = require('debug')('AppSource:Help:Controller:Help');

module.exports = {
	get: function(){
		var promise = new Promise(function(resolve, reject){
			debug('get function called.');
			Game.AppSource.Help.Models.Help.find()
			.then(function (helps) {
				if(helps.length > 0){
					resolve(helps[0]);
				}else{
					resolve({
						text:'Help Text',
						video:''
					});
				}
			})
			.catch(function (err) {
				reject(err);
			});
		});
		return promise;
	},
	update: function(data){
		debug('update function called.');
		var promise = new Promise(function(resolve, reject){
			Game.AppSource.Help.Models.Help.find()
			.then(function (helps) {
				if(helps.length > 0){
					Game.AppSource.Help.Models.Help.update({id:helps[0].id},data)
					.then(function(helps){
						if(helps.length > 0){
							resolve(helps[0]);
						}else{
							resolve({
								text:'Help Text',
								video:''
							});
						}
					})
					.catch(function (err) {
						reject(err);
					});
				}else{
					Game.AppSource.Help.Models.Help.create(data)
					.then(function(help){
						resolve(help);
					})
					.catch(function (err) {
						reject(err);
					});
				}
			})
			.catch(function (err) {
				reject(err);
			});
		});
		return promise;
	},

}
