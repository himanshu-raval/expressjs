var Help = {
	identity: 'help',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
		text : {
			type: 'string', 
			defaultsTo: 'Help text.'
		},
		video : {
			type: 'string', 
			defaultsTo: '',
		},
	}
};

module.exports = Help;
