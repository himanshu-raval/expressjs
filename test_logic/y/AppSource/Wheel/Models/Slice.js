var Slice = {
	identity: 'wheel_slice',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
		type : {
			type: 'string', 
		},
		title : {
			type: 'string', 
		},
		value : {
			type: 'float', 
		},
		percent : {
			type: 'string',
		},
		remaining : {
			type: 'string',      
		}
	}
};

module.exports = Slice;
