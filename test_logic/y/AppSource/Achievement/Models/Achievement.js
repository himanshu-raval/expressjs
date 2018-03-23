var Achievement = {
	identity: 'achievement',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
		name : {
			type: 'string', 
			required: true
		},
		details : {
			type: 'string', 
			required: true
		},
		coin_reward : {
			type: 'string', 
			required: true
		},
		action_on : {
			type: 'string', 
			required: true
		},
		action_count : {
			type: 'float', 
			required: true			
		} 
	}
};

module.exports = Achievement;
