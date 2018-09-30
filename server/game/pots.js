let Pot = require('./pot');
let HoldEmState = require('./holdEmState');
let ActionLogEntry = require('./actionLogEntry');
let OngoingRoundAction = require('./ongoingRoundAction');
let AwardedPots = require('./awardedPots');

let Pots = (players, newPlayers, bigBlind) =>
{
	let potList = [];
	
	let pot = Pot(players);
	potList.push(pot);
	
	let ongoingRoundActions = {};
	
	let currentPotIndex = 0;
	let currentRoundSize = 0;
	
	let currentRaise = 0
	let shortStackOverraise = 0;
	let lastAggressor;
	
	let actionIndex = 0;
	
	let gotSmallBlind;
	let gotBigBlind;
	let playersActed;
	
	let state;
	
	let getCurrentPot = () => potList[currentPotIndex];
	
	let getMainPlayersCount = () =>
	{
		let main = self.getMainPot();
		if (!main)
		{
			return 0;
		}
		return main.getNumPlayers();
	}
	
	let moveActionIndex = () =>
	{
		actionIndex = (actionIndex + 1) % getCurrentPot().getNumPlayers();
	}
	
	let hasEligiblePlayers = () =>
	{
		let count = 0;
		let currentPot = getCurrentPot();
		if (currentPot)
		{
			for (let i = 0; i < currentPot.getNumPlayers(); i++)
			{
				if (currentPot.getPlayer(i).getChips() !== 0)
				{
					count++;
				}
			}
		}
		return count >= 2;
	}
	
	let getSmallBlind = () => bigBlind / 2;
	
	let getLastPot = () => potList[potList.length - 1];
	
	let refundIncontestableBet = () =>
	{
		if (!self.hasTwoOrMorePlayers())
		{
			return null;
		}
		
		let currentBet = self.getCurrentBet();
		
		let playerMatching;
		let players = getCurrentPot().getPlayers();
		players.forEach((player) =>
		{
			if (self.getChipsThisRound(player) == currentBet)
			{
				// If we just found a second player matching the current bet, we can exit now
				if (playerMatching)
				{
					return null;
				}
				playerMatching = player;
			}
		});
		
		if (playerMatching)
		{
			let lastPot = getLastPot();
			let lastPotBet = lastPot.getRoundCount(playerMatching);
			let refund = lastPotBet;
			players.forEach((player) =>
			{
				if (player.hasHoleCards() && player != playerMatching)
				{
					let playerChips = player.getChips();
					let currOwed = currentBet - self.getChipsThisRound(player);
					let amountUnder = (currOwed > playerChips ? currOwed - playerChips : 0);
					refund = Math.min(refund, amountUnder);
				}
			});
			
			if (refund > 0)
			{
				currentRoundSize -= refund;
				
				if (refund == lastPotBet)
				{
					if (lastPot.isContested())
					{
						return null;
					}
					playerMatching.awardChips(refund);
					removePot(lastPot);
					
					return ActionLogEntry("refunded " + refund, [playerMatching]);
				}
				else
				{
					playerMatching.awardChips(refund);
					try
					{
						lastPot.sub(playerMatching, refund);
					}
					catch (x)
					{
						console.log(x);
						return null;
					}
					return ActionLogEntry("refunded " + refund, [playerMatching]);
				}
			}
		}
		
		return null;
	}
	
	let getCurrentPlayerCount = () =>
	{
		let currentPot = getCurrentPot();
		if (currentPot)
		{
			return currentPot.getNumPlayers();
		}
		return 0;
	}
	
	let isBettingRoundOver = () =>
	{
		for (let playerName in playersActed)
		{
			if (!playersActed[playerName])
			{
				return false;
			}
		}
		return true;
	}
	
	let initializePlayersActed = () =>
	{
		playersActed = {};
		self.getMainPot().getPlayers().forEach((player) =>
		{
			if (player.getChips() > 0)
			{
				playersActed[player.name] = false;
			}
		});
	}
	
	let addPlayerChips = (player, addition) =>
	{
		let entry;
		
		if (state !== HoldEmState().BLINDS)
		{
			playersActed[player.name] = true;
		}
		
		if (addition == 0)
		{
			entry = ActionLogEntry("checked", [player]);
			ongoingRoundActions[player] = 'check';
		}
		else
		{
			player.bet(addition);
			
			let chipsThisRound = self.getChipsThisRound(player) + addition;
			let currBet = self.getCurrentBet();
			let incrAmount = chipsThisRound - currBet;
			let raise = chipsThisRound - (currBet - shortStackOverraise);
			let action;
			if (incrAmount > 0)
			{
				if (gotBigBlind)
				{
					if (raise < currentRaise)
					{
						shortStackOverraise = raise;
					}
					else
					{
						shortStackOverraise = 0;
					}
					currentRaise = Math.max(currentRaise, raise);
				}
				
				if (!gotSmallBlind)
				{
					gotSmallBlind = true;
					if (newPlayers.indexOf(player) !== -1)
					{
						gotBigBlind = true;
						let smallBlind = getSmallBlind();
						addition -= smallBlind;
						getCurrentPot().addDeadChips(smallBlind);
						action = "bought the button for " + chipsThisRound;
						ongoingRoundActions[player] = 'big-blind';
					}
					else
					{
						action = "called " + chipsThisRound + " small blind";
						ongoingRoundActions[player] = 'small-blind';
					}
				}
				else if (!gotBigBlind)
				{
					gotBigBlind = true;
					
					action = "called " + chipsThisRound + " big blind";
					ongoingRoundActions[player] = 'big-blind';
				}
				else
				{
					lastAggressor = player;
					action = "raised to " + chipsThisRound;
					ongoingRoundActions[player] = 'raise';
				}
			}
			else
			{
				action = "called";
				if (chipsThisRound < currBet)
				{
					action += " " + addition;
				}
				
				ongoingRoundActions[player] = 'call';
			}
			
			if (player.getChips() == 0)
			{
				action += " (all in)";
			}
			entry = ActionLogEntry(action, [player]);
			
			addPlayerChipsToPot(player, addition, currentPotIndex);
		}
		
		return entry;
	}
	
	let addPlayerChipsToPot = (player, addition, potIndex) =>
	{
		try
		{
			currentRoundSize += addition;
			
			let pot = potList[potIndex];
			
			let amountOwedToCurrentPot = pot.getRoundOwed(player);
			
			if (amountOwedToCurrentPot == 0 && pot.isBettingCapped())
			{
				addPlayerChipsToPot(player, addition, potIndex + 1);
			}
			else
			{
				if (pot.isBettingCapped())
				{
					let remaingChips = 0;
					if (amountOwedToCurrentPot > addition)
					{
						// This player couldn't cover the current bet
						let newPot = pot.add(player, addition);
						if (newPot)
						{
							potList.splice(potIndex + 1, 0, newPot);
						}
					}
					else
					{
						pot.add(player, amountOwedToCurrentPot);
						remaingChips = addition - amountOwedToCurrentPot;
						
						if (remaingChips > 0)
						{
							addPlayerChipsToPot(player, remaingChips, potIndex + 1);
						}
					}
				}
				else
				{
					// No one in the current pot is all in yet (except possibly this player)
					let newPot = pot.add(player, addition);
					if (newPot)
					{
						potList.splice(potIndex + 1, 0, newPot);
					}
				}
			}
		}
		catch (x)
		{
			console.log(x);
		}
	}
	
	let getMaxChipsRemainingPlayers = () =>
	{
		let maxChips = 0;
		let currentPot = getCurrentPot();
		
		for (let currentActionIndex = (actionIndex + 1) % currentPot.getNumPlayers(); currentActionIndex != actionIndex; currentActionIndex = (currentActionIndex + 1) % currentPot.getNumPlayers())
		{
			let player = currentPot.getPlayer(currentActionIndex);
			let playerChips = player.getChips() + self.getChipsThisRound(player);
			maxChips = Math.max(maxChips, playerChips);
		}
		
		return maxChips;
	}
	
	let removePot = (pot) =>
	{
		let potIndex = potList.indexOf(pot);
		if (potIndex >= 0)
		{
			potList.splice(potIndex, 1);
		}
	}
	
	let foldPlayer = (player) =>
	{
		let entries = [];
		
		let playerIndex = players.indexOf(player);
		players.splice(playerIndex, 1);
		
		delete playersActed[player.name];
		
		if (lastAggressor === player)
		{
			lastAggressor = null;
		}
		
		player.fold();
		
		potList.forEach((pot) =>
		{
			pot.fold(player);
		});
		
		entries.push(ActionLogEntry("folded", [player]));
		
		let refund = refundIncontestableBet();
		if (refund)
		{
			entries.push(refund);
		}
		
		ongoingRoundActions[player] = 'fold';
		
		if (playerIndex < actionIndex)
		{
			actionIndex--;
		}
		
		// actionIndex should always point to a valid index within the current pot
		// If we remove the last player, this will reset the index back to 0 instead of leaving it pointing to nothing
		let currentPlayers = getCurrentPlayerCount();
		if (currentPlayers > 0)
		{
			actionIndex = actionIndex % currentPlayers;
		}
		
		return entries;
	}
	
	let self =
	{
		getMainPot: () => potList[0],
		getNextActionPlayer: () =>
		{
			let startingIndex = actionIndex;
			let currentPot = getCurrentPot();
			while (currentPot)
			{
				let player = currentPot.getPlayer(actionIndex);
				if (player.getChips() > 0)
				{
					return player;
				}
				
				moveActionIndex();
				if (actionIndex == startingIndex)
				{
					return null;
				}
			}
			
			return null;
		},
		startRound: (newState) =>
		{
			state = newState;
			
			if (state !== HoldEmState().BET_PREFLOP)
			{
				initializePlayersActed();
				
				let pot;
				while (pot = getCurrentPot())
				{
					if (pot.isBettingCapped())
					{
						currentPotIndex++;
					}
					else
					{
						break;
					}
				}
				
				if (pot != null)
				{
					pot.clearRound();
				}
				
				actionIndex = 0;
				
				ongoingRoundActions = {};
				players.forEach((player) =>
				{
					ongoingRoundActions[player] = null;
				});
				
				currentRoundSize = 0;
			}
			
			currentRaise = bigBlind;
			shortStackOverraise = 0;
		},
		isBettingOver: () => self.isEven() && !hasEligiblePlayers(),
		hasTwoOrMorePlayers: () => getMainPlayersCount() >= 2,
		isEven: () =>
		{
			let bettingEven = true;
			switch (state)
			{
				case HoldEmState().BLINDS:
					return gotSmallBlind && gotBigBlind;
				default:
					for (let i = currentPotIndex; i < potList.length; i++)
					{
						let pot = potList[i];
						if (!pot.isEven())
						{
							bettingEven = false;
						}
					}
			}
			return bettingEven && isBettingRoundOver();
		},
		getTotalSize: () =>
		{
			let potSize = 0;
			potList.forEach((pot) =>
			{
				potSize += pot.getSize();
			});
			return potSize;
		},
		getSizeWithoutRound: () => self.getTotalSize() - currentRoundSize,
		getCurrentBet: () =>
		{
			let currentBet = 0;
			for (let i = currentPotIndex; i < potList.length; i++)
			{
				currentBet += potList[i].getCurrentBet();
			}
			return currentBet;
		},
		getChipsThisRound: (player) =>
		{
			// TODO: make this private, rely on ongoing round action for tests
			let chips = 0;
			for (let i = currentPotIndex; i < potList.length; i++)
			{
				chips += potList[i].getRoundCount(player);
			}
			return chips;
		},
		getOngoingActionThisRound: (player) =>
		{
			let action = ongoingRoundActions[player];
			let chips = self.getChipsThisRound(player);
			
			if (action || chips > 0)
			{
				return OngoingRoundAction(action, chips);
			}
			
			return null;
		},
		fold: () =>
		{
			let player = self.getNextActionPlayer();
			if (!player)
			{
				throw "Tried to fold with no action player";
			}
			
			return foldPlayer(player);
		},
		foldOutOfTurn: (player) =>
		{
			if (self.getMainPot().contains(player))
			{
				return foldPlayer(player);
			}
			return null;
		},
		addToPot: (addition) =>
		{
			let player = self.getNextActionPlayer();
			if (!player)
			{
				throw "Tried to add to pot with no action player";
			}
			
			let entry = addPlayerChips(player, addition);
			moveActionIndex();
			
			return entry;
		},
		getCall: () =>
		{
			let player = self.getNextActionPlayer();
			
			if (!player)
			{
				throw "No action player";
			}
			
			let playerChips = player.getChips();
			let currOwed = 0;
			let maxChipsRemainingPlayers = getMaxChipsRemainingPlayers();
			switch (state)
			{
				case HoldEmState().BLINDS:
					if (!gotSmallBlind)
					{
						if (newPlayers.indexOf(player) !== -1)
						{
							currOwed = Math.min(maxChipsRemainingPlayers, getSmallBlind() + bigBlind);
						}
						else
						{
							currOwed = Math.min(maxChipsRemainingPlayers, getSmallBlind());
						}
					}
					else if (!gotBigBlind)
					{
						currOwed = Math.min(maxChipsRemainingPlayers, bigBlind);
					}
					break;
				default:
					let currentBet = self.getCurrentBet();
					if (currentBet > 0)
					{
						let trueCurrentBet = Math.max(currentBet, bigBlind);
						currOwed = trueCurrentBet - self.getChipsThisRound(player);
					}
			}
			
			return Math.min(playerChips, currOwed);
		},
		getMinRaise: () =>
		{
			let player = self.getNextActionPlayer();
			let playerChips = player.getChips();
			
			let call = self.getCall();
			
			if (playerChips == call)
			{
				return 0;
			}
			
			let newRaise = call - shortStackOverraise + currentRaise;
			newRaise = Math.min(newRaise, getMaxChipsRemainingPlayers() - self.getChipsThisRound(player));
			let minRaise = Math.min(playerChips, newRaise); 
			return minRaise == call ? 0 : minRaise;
		},
		getMaxRaise: () =>
		{
			let player = self.getNextActionPlayer();
			let playerChips = player.getChips();
			
			let call = self.getCall();
			
			if (playerChips == call)
			{
				return 0;
			}
			
			let maxRaise = Math.min(playerChips, getMaxChipsRemainingPlayers() - self.getChipsThisRound(player)); 
			return maxRaise == call ? 0 : maxRaise;
		},
		awardPots: (boardCards) =>
		{
			let awardedPots = [];
			let pot;
			
			while (pot = getLastPot())
			{
				let awardedPot = pot.award(boardCards);
				if (awardedPot)
				{
					removePot(pot);
				}
				
				if (pot.getSize() !== 0)
				{
					awardedPots.push(awardedPot);
				}
			}
			
//			if (!lastAggressor)
//			console.log(JSON.stringify(AwardedPots(lastAggressor, awardedPots), null, 4));
			return AwardedPots(lastAggressor, awardedPots);
		}
	}
	
	return self;
}

module.exports = Pots;
