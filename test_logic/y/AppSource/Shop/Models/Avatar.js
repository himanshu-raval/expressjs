var Avatar = {
	identity: 'shop_avatar',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
		avatar : {
			type: 'string'
		},
		avatar_name : {
			type: 'string', 
			required: true
		},
		gems : {
			type: 'float', 
			required: true
		},
		chance :{
			type : 'float',
			required:true
		}
	}
};

module.exports = Avatar;
