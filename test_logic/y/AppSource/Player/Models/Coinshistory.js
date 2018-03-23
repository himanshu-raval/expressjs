var Coinshistory = {
	identity: 'coinshistory',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
        player: { model: 'player', required: true },
        coins: { type: 'float', required: true },
        type: { type: 'string', defaultsTo: null }, // Credit/Debit
        flag: { type: 'string', defaultsTo: null },
        tableId: { type: 'string', defaultsTo: null }, // For Game Transection Only
        beforCoins: { type: 'float', defaultsTo: null },
        afterCoins: { type: 'float', defaultsTo: null },
        transactionNumber: { type: 'string', defaultsTo: null }, // Null for Game Transections
        status: { type: 'string', defaultsTo: 'success' } // if trasection require some conditions
		
	}
};

module.exports = Coinshistory;
