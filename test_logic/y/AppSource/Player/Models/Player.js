var Player = {
	identity: 'player',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
		appId : {
			type: 'string', 
			defaultsTo: null
		},
		devicetype : {
			type : 'string',
			defaultsTo : null
		},
		devicettoken : {
			type : 'string',
			defaultsTo : null
		},
		username : {
			type: 'string', 
			defaultsTo: null,
			required: true
		},
		email : {
			type: 'string', 
			defaultsTo: null,
			email: true
		},
		phone : {
			type: 'string', 
			defaultsTo: null,
		},
		status : {
			type: 'string', 
			defaultsTo: 'Active'       
		},
		socket_id : {
			type: 'string', 
			defaultsTo: null       
		},
		spin : {
			type: 'string', 
			defaultsTo: 'free',
		},
		coin : {
			type: 'float', 
			defaultsTo: 0.0,
		},
		gems : {
			type: 'float', 
			defaultsTo: 0.0,
		},
		sharkpool : {
			type: 'boolean', 
			defaultsTo: false,
		},
		free_coin_date : {
			type: 'float', 
			defaultsTo: new Date().getDate(),
		},
		scratch_card : {
			type: 'json',
			defaultsTo: {
				'scratch_card_buy': '01/01/1800',
				'scratch_card_single': 0,
				'scratch_card_used' : ''
			}
		},
		selected_avatar : {
			type: 'string', 
			defaultsTo: '',
		},
		selected_card : {
			type: 'string', 
			defaultsTo: '',
		},
		selected_sound : {
			type: 'string', 
			defaultsTo: '',
		},
		selected_landmark : {
			type: 'string', 
			defaultsTo: '',
		},
		selected_landmark_name : {
			type: 'string', 
			defaultsTo: '',
		},
		xp : {
			type: 'float', 
			defaultsTo: 0.0,
		},
		level : {
			type: 'float', 
			defaultsTo: 0,
		},
		friends : {
			type: 'array' ,
			defaultsTo:[],
		},
		sharkpool_friends : {
			type: 'array' ,
			defaultsTo:[],
		},
		chest : {
			type: 'array' ,
			defaultsTo:[],
		},
		avatar : {
			type: 'array' ,
			defaultsTo:[],
		},
		card : {
			type: 'array' ,
			defaultsTo:[],
		},
		landmark : {
			type: 'array' ,
			defaultsTo:[],
		},
		sound : {
			type: 'array' ,
			defaultsTo:[],
		},
		achievement : {
			type:'array',
			defaultsTo:[],
		},
		statistics : {
			type: 'json', 
			defaultsTo: {
				'round_play': 0,
				'round_won':0,
				'games_played' : 0,
				'game_won':0,
				'call_yaniv':0,
				'call_yaniv_win':0,
				'call_yaniv_got_assaf':0,
				'got_assaf':0,
				'hit_50':0,
				'hit_100':0,
				'hit_assaf_50':0,
				'hit_assaf_100':0,
				'call_yaniv_with_5_cards':0,
				'win_round_with_zero_score':0,
				'win_round_with_2_aces':0,
				'win_round_with_3_aces':0,
				'win_round_with_4_aces':0,
				'win_round_with_holding_a23':0,
				'share_winning_moment_facebook':0,
				'tweet_moment':0,
				'throw_4_card_straight_down':0,
				'throw_5_card_straight_down':0,
				'throw_down_3_of_a_kind':0,
				'throw_down_4_of_a_kind':0,
				'call_yaniv_on_7_when_a_player_has_less_than_3_cards':0,
				'throw_down_35_or_more_points_in_1_turn':0,
				'last_game_winning_coin':0,
				'tournament_won':0,
				'win_streak':0,
				'win_percentage':0,
				'coins_won':0,
				'sit_n_go_won':0,
				'coin_games_won':0,
				'mtts_won':0,
				'times_called_yaniv':0,
 				'average_hand_score':0,
				'best_match_score':0,
				'longest_game_rounds':0,
				'shortest_game_rounds':0,
				'locations_played':0,
                // For Get Another Statistics 
				'locations':{},
				
			}
		},
		setting : {
			type: 'json',
			defaultsTo : {
				callYaniv: 7,
				gameOverPoint: 100,
				playersCount: 4
			}
		}
	}
};

module.exports = Player;
