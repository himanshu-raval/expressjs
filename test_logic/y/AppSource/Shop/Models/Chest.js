var Chest = {
	identity: 'shop_chest',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
		
		avatar : {
			type: 'string',
			required: true
		},
		card : {
			type: 'string',
			required: true
		},
		landmark : {
			type: 'string',
			required: true
		},
		chest : {
			type: 'string',
			required: true
		},
		chest_name : {
			type: 'string', 
			required: true
		},
		chest_details : {
			type: 'string', 
			required: true
		},
		gems : {
			type: 'float', 
			required: true
		}
	}
};

module.exports = Chest;
