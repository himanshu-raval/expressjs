var debug = require('debug')('AppSource:Auth:Controller:Player');

module.exports = {

	registerLogin: function (data, cb) {
		let query = '';
		if(data.isFbLogin){
			if(data.appId == ''){
				return cb(new Error("App Id Not Avilable"));
			}
			query = { appId: data.appId }
		}else{
			query = {
				username: data.username,
				email : data.email,
				appId: null
			}
		}
		console.log("Query :",query);
		Game.AppSource.Player.Models.Player.findOne(query).exec((err, player) => {
			if (err) { console.log(err); return cb(new Error("No Player Found!")); }

			if (player) {
				if(player.socket_id && Game.Io.sockets.connected[player.socket_id]){
					return cb(new Error('Player already logged in.'));
				}
				Game.Io.emit('playerOnline', { playerId: player.id });
				Game.AppSource.Player.Models.Player.update({ id: player.id }, { socket_id: data.socket_id,devicetype:data.devicetype,devicettoken : data.devicettoken })
					.exec((err, players) => {
						if (err) {
							return cb(err);
						}
						var p_avatar = '', p_card = '', p_sound = '';
						Game.AppSource.Shop.Models.Avatar.findOne({ id: player.selected_avatar })
							.exec((err, avatar) => {
								if (err) {
									return cb(err);
								}
								if (avatar) {
									p_avatar = avatar.avatar;
								}
								Game.AppSource.Shop.Models.Card.findOne({ id: player.selected_card })
									.exec((err, card) => {
										if (err) {
											return cb(err);
										}
										if (card) {
											p_card = card.card;
										}
										player.avatar = p_avatar;
										player.card = p_card;

										return cb(null, player);
									});
							});

					});
				} else if (data.isFbLogin) {
					delete data.isFbLogin;
					delete data.phone;
					// data.selected_avatar = data.profile;
					// delete data.profile;
					data.username = data.username; // Remove  + data.appId
					data.selected_landmark = '';
					data.selected_landmark_name = '';
					data.coin = parseInt(200);
					data.gems = parseInt(0);
					data.devicetype = data.devicetype;
					data.devicettoken = data.devicettoken;
					Game.AppSource.Player.Models.Player.create(data)
						.exec(function (err, player) {
							if (err) { console.log(err); return cb(err) }
							Game.Io.emit('playerOnline', { playerId: player.id });
							player.avatar = '';
							player.card = '';
							return cb(null, player);
						})
				} else {
					delete data.isFbLogin;
					delete data.appId;
					data.selected_landmark = '';
					data.selected_landmark_name = '';
					data.coin = parseInt(200);
					data.gems = parseInt(0);
					data.devicetype = data.devicetype;
					data.devicettoken = data.devicettoken;
					Game.AppSource.Player.Models.Player.create(data)
						.exec(function (err, player) {
							if (err) { 
								console.log("Error:",err);
								return cb(err) 
							}

							Game.AppSource.Player.Models.Coinshistory.create({
								player: player.id,
								coins: 200,
								type: 'credit',
								flag: 'New Registartion',
								gameId: null,
								beforCoins: 0,
								afterCoins: 200,
								status: 'success'
							}).exec(function (err, ch) {
								if (err) {
									return cb(err)
								}
								Game.Io.emit('playerOnline', { playerId: player.id });
								player.avatar = '';
								player.card = '';
								return cb(null, player);


							})
					})
				}
			})

	}

}
