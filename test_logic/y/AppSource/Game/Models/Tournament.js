var Tournament = {
	identity: 'tournament',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
		name : {
			type: 'string', 
        },
        callYaniv : {
			type: 'float', 
			defaultsTo: 7,
		},
        gameOverPoint: {
			type: 'float', 
			defaultsTo: 100,
        },
        jokersCount: {
			type: 'float', 
			defaultsTo: 2,
		},
        maxPlayers: {
			type: 'float', 
			defaultsTo: 8,
		},
        playersOnTable: {
			type: 'float', 
			defaultsTo: 2,
        },
        playerCount:{
            type:'float',
            defaultsTo:0,
        },
        fees:{
            type:'float',
            defaultsTo:100,    
        },
        totalCoin:{
            type:'float',
            defaultsTo:0,
        },
        level:{
            type:'string',
            defaultsTo:null,
        },
	    status: {
			type: 'string',
			defaultsTo: 'waiting'
        },
        phase:{
            type : 'string',
            defaultsTo: 'qf'
        },
        tables:{
            type : 'JSON',
            defaultsTo:{
                'fi':[],
                'sf':[],
                'qf':[]
            }
        },
        phase_player:{
            type : 'JSON',
            defaultsTo:{
                'fi':[],
                'sf':[],
                'qf':[]
            }
        }
	}
};
module.exports = Tournament;
