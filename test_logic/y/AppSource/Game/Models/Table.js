var Table = {
	identity: 'table',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
		tournamentId : {
			type : 'string',
			defaultsTo : null,
		},
		callYaniv : {
			type: 'float', 
			defaultsTo: 7,
		},
        gameOverPoint: {
			type: 'float', 
			defaultsTo: 100,
		},
        playersCount: {
			type: 'float', 
			defaultsTo: 4,
		},
		playersTotal: {
			type: 'float', 
			defaultsTo: 0,
		},
		type: {
			type: 'string',
			defaultsTo: 'coin game'
		},
		status: {
			type: 'string',
			defaultsTo: 'waiting'
		},
		jokersCount: {
			type: 'float', 
			defaultsTo: 2,
		},

	}
};

module.exports = Table;
