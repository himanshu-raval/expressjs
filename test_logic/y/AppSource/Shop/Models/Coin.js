var Coin = {
	identity: 'shop_coin',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
		google_product_id : {
			type: 'string'
		},
		tag : {
			type: 'string'
		},
		coin : {
			type: 'float'
		},
		gems : {
			type: 'float'
		},
		chance :{
			type : 'float',
			required:true
		}
	}
};

module.exports = Coin;
