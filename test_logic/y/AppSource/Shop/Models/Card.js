var Card = {
	identity: 'shop_card',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
		
		card : {
			type: 'string',
			required: true
		},
		card_name : {
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

module.exports = Card;
