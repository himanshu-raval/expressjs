var Table = require('./Table');
var async = require('async');
var TableService = require('./TableService');

function buildTournament(data){
	var tournament = new Game.AppSource.Game.Controllers.Tournament(data.name,data.id,data.callYaniv,data.gameOverPoint,data.jokersCount, data.maxPlayers,data.playersOnTable,data.playerCount, data.joiningCoin, data.totalCoin, data.level,data.fees, data.status, data.players,data.losers,data.winners,data.tables,data.phase_player,data.phase);
	return tournament
}
module.exports = (function () {
	var service = {
		addTournament : function(data, cb){
			var fees = parseInt(data.levelcoin);

			var tournament = buildTournament({
				name: data.name,
				callYaniv: data.callYaniv,
				gameOverPoint: data.gameOverPoint,
				jokersCount: Game.Config.Yaniv.jokers, 
				maxPlayers: data.maxPlayers,
				playersOnTable: data.playersOnTable,
				playerCount: data.playerCount, 
				joiningCoin: data.joiningCoin, 
				totalCoin: data.totalCoin, 
				level: data.level, 
				fees: fees,
				status: 'waiting', 
				players: [],
				losers: [],
				winners: []
				
			});
			Game.AppSource.Game.Models.Tournament.create(tournament.toJson())
			.exec(function (err, tournament) {
				if(err) { console.log(err); return cb(err) }

			// Create All Table At Same Time.
			var playerOntable = 2;
				var data = {};
				data.callYaniv = tournament.callYaniv;
				data.gameOverPoint = tournament.gameOverPoint;
				data.level = tournament.level;
				data.jokersCount = tournament.jokersCount;
				data.playersCount = playerOntable;

				var tempTable = new Table(tournament.id,data.callYaniv, data.gameOverPoint, data.level, data.jokersCount, 'tournament', data.playersCount, 0, 'waiting', undefined, [], null, null, []);
				
				let tasks = [];

			//var totalTable = parseInt(tournament.maxPlayers) / parseInt(playerOntable);
			var totalTable = 7;
				for(i=0;i<totalTable;i++){
					tasks.push(function(callback){
						TableService.createTable(tempTable, function (err, table) {
							if (err) {
								return callback(err);
							}
							return callback(null, table);
						});
					})
				}
				
				
			async.parallel(tasks, function(err, results){
				// console.log(results);
			 	for(j=0;j<results.length;j++){
					// console.log("Table =",results[j].id);
						if(j<4){
							tournament.tables.qf.push({ id: results[j].id });
						}else if(j<6 && j>3){
							tournament.tables.sf.push({ id: results[j].id });
						}else{
							tournament.tables.fi.push({ id: results[j].id });
						}
					}
					Game.Tournaments[tournament.id] = buildTournament(tournament);
					return cb(null, Game.Tournaments[tournament.id]);
				});
			})
		},
		getTournament : function(query, cb){

			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
			Game.Logger.debug('+ SEARCH TOURNAMENT + =',query);
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');  

			if((query.id) && (Game.Tournaments[query.id])){
				console.log("Here me 1");
				return cb(null, Game.Tournaments[query.id]);
			}else{
				console.log("Here me 2");
				Game.AppSource.Game.Models.Tournament.findOne(query)
				.exec(function (err, tournament) {
					if(err) { console.log(err); return cb(err) }
					if(tournament){
						Game.Tournaments[tournament.id] = buildTournament(tournament);
						return cb(null, Game.Tournaments[tournament.id]);
					}
					return cb(null,null);
				})
			}
		},
		updateTournament : function(tournament, cb){
			var id = tournament.id 
			// delete tournament.id
			Game.AppSource.Game.Models.Tournament.update({id: id}, Game.Tournaments[id].toJson())
			.exec(function (err, tournaments) {
				if(err) { console.log('updateTournament', err); return cb(err) }
				Game.Logger.info('Tournament updated')
				if(tournaments[0]){
					Game.Tournaments[id] = buildTournament(tournaments[0]);
					return cb(null, Game.Tournaments[id]);
					
				}
				return cb(new Error('Tournament not found.'))
			})
		}
	}
	return service;
})()