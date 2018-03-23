var Gems = {
	identity: 'shop_gems',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
		google_product_id : {
			type: 'string',
			required: true
		},
		gems : {
			type: 'string'
		},
		gems_name : {
			type: 'string', 
			required: true
		},
		gems_amount : {
			type: 'float', 
			required: true
		},
		price : {
			type: 'float', 
			required: true
		}
	}
};

module.exports = Gems;
