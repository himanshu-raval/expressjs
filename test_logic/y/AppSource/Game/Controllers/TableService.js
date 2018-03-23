var Table = require('./Table');
module.exports = (function () {
	var service = {
		addTable : function(data, cb){
			var table = new Table(null,data.callYaniv, data.gameOverPoint,data.level, Game.Config.Yaniv.jokers, data.type, data.playersCount,0,'waiting', undefined, [], null,null, [],[]);
			Game.AppSource.Game.Models.Table.create(table.toJson())
			.exec(function (err, table) {
				if(err) { console.log(err); return cb(err) }
				var tempTable = new Table(null,table.callYaniv, table.gameOverPoint,table.level, Game.Config.Yaniv.jokers, table.type, table.playersCount,table.playersTotal,table.status, table.id, table.players, table.currentTurn,table.game,table.losers,table.chat);
				return cb(null, tempTable);
			})
		},
		createTable : function(table, cb){

			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
			Game.Logger.debug('+ TOURNAMENT TABLE  + =');
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');  


			Game.AppSource.Game.Models.Table.create(table.toJson())
			.exec(function (err, table) {
				if(err) { console.log(err); return cb(err) }
				var tempTable = new Table(table.tournamentId,table.callYaniv, table.gameOverPoint,table.level, Game.Config.Yaniv.jokers, table.type, table.playersCount,table.playersTotal,table.status, table.id, table.players, table.currentTurn,table.game,table.losers,table.chat);
				return cb(null, tempTable);
			})
		},
		getTable : function(query, cb){
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
			Game.Logger.debug('+  TABLE  + =',query);
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');  
			Game.AppSource.Game.Models.Table.findOne(query)
			.exec(function (err, table) {
				if(err) { console.log(err); return cb(err) }
				if(table){
					var tempTable = new Table(table.tournamentId,table.callYaniv, table.gameOverPoint,table.level, Game.Config.Yaniv.jokers, table.type, table.playersCount,table.playersTotal,table.status, table.id, table.players, table.currentTurn,table.game,table.losers,table.chat);
					return cb(null, tempTable);
				}
				return cb(null, table);
			})
		},
		getTablesData : function(query, cb){
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
			Game.Logger.debug('+  TABLE IDS + =',query);
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');  
			Game.AppSource.Game.Models.Table.find(query)
			.exec(function (err, tables) {
				if(err) { console.log(err); return cb(err) }
				if(tables.length>0){
					var tempTables = [];
					tables.forEach(function(table) {
						tempTables.push(new Table(table.tournamentId,table.callYaniv, table.gameOverPoint,table.level, Game.Config.Yaniv.jokers, table.type, table.playersCount,table.playersTotal,table.status, table.id, table.players, table.currentTurn,table.game,table.losers,table.chat));
					}, this);				
					return cb(null, tempTables);
				}
				return cb(null, tables);
			})
		},
		getTournamentTable : function(query, cb){
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
			Game.Logger.debug('+ TOURNAMENT TABLE  + =',query);
			Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');  
			Game.AppSource.Game.Models.Table.findOne(query).where({'playersTotal':{'<':query.playersCount}})
			.exec(function (err, table) {
				if(err) { console.log(err); return cb(err) }
				if(table){
					if(table.playersCount == table.playersTotal){
						Game.Logger.debug('+ TABLE Full SO RETURN +');
						table.status = 'full';
						return cb(null, table);								
					}
					var tempTable = new Table(table.tournamentId,table.callYaniv, table.gameOverPoint,table.level, Game.Config.Yaniv.jokers, table.type, table.playersCount,table.playersTotal,table.status, table.id, table.players, table.currentTurn,table.game,table.losers,table.chat);
					return cb(null, tempTable);
				}
				return cb(null, table);
			})
		},
		updateTable : function(table, cb){
			var id = table.id 
			// delete table.id
		 
			Game.AppSource.Game.Models.Table.update({id: id}, table.toJson())
			.exec(function (err, tables) {
				if(err) { console.log('updateTable', err); return cb(err) }
				Game.Logger.info('Table updated')
				if(tables[0]){
					 
					var tempTable = new Table(tables[0].tournamentId,tables[0].callYaniv, tables[0].gameOverPoint,tables[0].level, Game.Config.Yaniv.jokers, tables[0].type, tables[0].playersCount,tables[0].playersTotal,tables[0].status, tables[0].id, tables[0].players, tables[0].currentTurn,tables[0].game,tables[0].losers,tables[0].chat);
					return cb(null, tempTable);
				}

				return cb(null, table);
			})
		}
	}
	return service;
})()

