module.exports = {
	
	searchTable: function(data, callback){
		Game.AppSource.Player.Models.Player.findOne({id:data.playerId})
		.exec(function (err, player) {
			if(err) {
				Game.Logger.error('Error in player get method')
				return callback(err)
			}
			if(!player){
				Game.Logger.error('Player not found')
				return callback(new Error('Player not found'))
			}
			data.status = 'waiting';
			data.type = 'sitngo game';
			delete data.playerId
			Game.AppSource.Game.Controllers.TableService.getTable(data, function(err, table){
				if(err) {
					return callback(err)
				}
				if(table){
					Game.Logger.info('Sit&Go table found')
					/* check for players to start the game */
					Game.AppSource.Game.Controllers.SitngoGame.joinTable(table, player, function(err, table){
						if(err){
							return callback(err)
						}
						return callback(null, table)
					})
				}else{
					/* 
					If search result is undefined then create new table for the user
					with the given data
					*/
					Game.AppSource.Game.Controllers.TableService.addTable(data, function(err, table){
						if(err) {
							return callback(err)
						}
						Game.AppSource.Game.Controllers.SitngoGame.joinTable(table, player, function(err, table){
							if(err){
								return callback(err)
							}
							return callback(null, table)
						})
					})
				}
			})
		})
	},

	joinTable: function (table, player, callback) {
		table.addPlayer(player, function(err, table){
			if(err){
				return callback(err)
			}
			Game.AppSource.Game.Controllers.TableService.updateTable(table, function(err, table){
				if(err){
					return callback(err)
				}
				return callback(null, table)
			})
		})
	},

	defaultAction : function(id){
		Game.Logger.debug('defaultAction',id);
		Game.AppSource.Game.Controllers.TableService.getTable({id:id},function(err, table){
			Game.Logger.info('Default action performed for the player : ' + table.currentTurn)
			var player = table.getCurrentPlayer();
			player.swipeWithDeck(player.hand.highCard());
			table.currentTurn = parseInt(table.currentTurn) + 1;
			if(table.currentTurn == table.playersCount){
				table.currentTurn = 0	
			}
			Game.AppSource.Game.Controllers.TableService.updateTable(table, function(err, table){
				if(err){return}
					Game.Io.to(table.id).emit('SitngoGameActionPerformed', table.toJson())
				clearTimeout(Game.Timers[id]);
				Game.Timers[id] = setTimeout(Game.AppSource.Game.Controllers.SitngoGame.defaultAction,10000, id);
			})
			
		});
	},
	playerAction : function(socketData, data, callback) {
		Game.AppSource.Game.Controllers.TableService.getTable({id: data.tableId}, function(err, table){
			if(err) {return callback(err)}
				var player = table.getCurrentPlayer();
			if(Game.Timers[table.id]._called){
				return callback(new Error('It is not your turn. Turn is expire'))
			}
			if(player.id == data.playerId){
				clearTimeout(Game.Timers[table.id]);
				if(data.cardsPicked && data.cardsPicked.length > 0){
					var cards = [];
					data.cardsDroped.forEach(function(card){
						cards.push(new Game.AppSource.Game.Controllers.Card(card.rank, card.suite))
					})
					player.swipeWithBoard(cards, new Game.AppSource.Game.Controllers.Card(data.cardsPicked[0].rank, data.cardsPicked[0].suite));
					table.currentTurn = parseInt(table.currentTurn) + 1;
					if(table.currentTurn == table.playersCount){
						table.currentTurn = 0	
					}
					Game.AppSource.Game.Controllers.TableService.updateTable(table, function(err, table){
						if(err){return}
							Game.Io.to(table.id).emit('SitngoGameActionPerformed', table.toJson())
						clearTimeout(Game.Timers[table.id]);
						Game.Timers[table.id] = setTimeout(Game.AppSource.Game.Controllers.SitngoGame.defaultAction,10000, table.id);
						return callback(null,table)
					})
				} else {
					var cards = [];
					data.cardsDroped.forEach(function(card){
						cards.push(new Game.AppSource.Game.Controllers.Card(card.rank, card.suite))
					})
					player.swipeWithDeck(cards);
					table.currentTurn = parseInt(table.currentTurn) + 1;
					if(table.currentTurn == table.playersCount){
						table.currentTurn = 0	
					}
					Game.AppSource.Game.Controllers.TableService.updateTable(table, function(err, table){
						if(err){return }
							Game.Io.to(table.id).emit('SitngoGameActionPerformed', table.toJson())
						clearTimeout(Game.Timers[table.id]);
						Game.Timers[table.id] = setTimeout(Game.AppSource.Game.Controllers.SitngoGame.defaultAction,10000, table.id);
						return callback(null,table)
					})
				}
			}else{
				return callback(new Error('It is not your turn. 4'))
			}
		})
	},

	callYaniv : function(socketData, data, callback) {
		Game.AppSource.Game.Controllers.TableService.getTable({id: data.tableId}, function(err, table){
			if(err) {
				return callback(err)
			}
			var player = table.getCurrentPlayer();
			if(player.id == data.playerId){
				Game.Logger.debug('callYaniv for loop ')
				clearTimeout(Game.Timers[table.id]);
				var cards = [];
				player.sitnGocallYaniv(function(err, table){
					if(err){ return callback(err)}
						Game.Logger.debug(table.status);
						if(table.status == 'FINISHED'){
							Game.Logger.debug('SitngoGameGameFinished',table.id);
							var point = table.game.point
							var winner = table.players[0];
							for(let key in table.players){
								if(point >= table.game.point[key]){
									winner = table.players[key]
								}
							}
							Game.Io.to(data.tableId).emit('SitngoGameGameFinished', { winnerId: winner.id,winnerName: winner.username })
							clearTimeout(Game.Timers[table.id]);
							return callback(null,table)
						}else{
							var result = {
								roundpoints : table.toJson().game.roundPoints
							};
							//Game.Io.to(table.id).emit('SitngoGameRoundFinished', table.toJson())
							Game.Io.to(table.id).emit('SitngoGameRoundFinished', result)
							clearTimeout(Game.Timers[table.id]);
							Game.Timers[table.id] = setTimeout(Game.AppSource.Game.Controllers.SitngoGame.defaultAction,10000, table.id);
							return callback(null,table)
						}
					});
			}else{
				return callback(new Error('It is not your turn. 5'))
			}
		})
	},
	playerLeft : function(socketData, data, callback){
		Game.AppSource.Game.Controllers.TableService.getTable({id: data.tableId}, function(err, table){
			if(err) {
				return callback(err)
			}
			Game.Io.to(table.id).emit('SitngoGamePlayerLeft',{id: data.playerId})
			clearTimeout(Game.Timers[table.id])
			table.status = 'CLOSED'
			Game.AppSource.Game.Controllers.TableService.updateTable(table, function(err, table){
				if(err){return }
					return callback(null,table)
			})
		})
	}

}
