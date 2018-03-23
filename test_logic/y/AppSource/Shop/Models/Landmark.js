var Landmark = {
	identity: 'shop_landmark',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
		google_product_id : {
			type: 'string',
			required: true
		},
		landmark : {
			type: 'string',
			required: true
		},
		landmark_name : {
			type: 'string', 
			required: true
		},
		coin : {
			type: 'float', 
			required: true
		},
		gems : {
			type: 'float', 
			required: true
		},
		coin_per_point : {
			type: 'float', 
			required: true
		},
		chance :{
			type : 'float',
			required:true
		}
	}
};

module.exports = Landmark;
