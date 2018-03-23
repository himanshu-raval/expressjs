var Sound = {
	identity: 'shop_sound',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
		google_product_id : {
			type: 'string',
			required: true
		},
		sound : {
			type: 'string'
		},
		sound_name : {
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

module.exports = Sound;
