let Pot = require('./pot');
let HoldEmState = require('./holdEmState');
let ActionLogEntry = require('./actionLogEntry');
let OngoingRoundAction = require('./ongoingRoundAction');

let Pots = (players, pendingPlayers, bigBlind) =>
{
	let potList = [];
	
	let pot = Pot(players);
	potList.push(pot);
	
	let ongoingRoundActions = {};
	
	let currentPotIndex = 0;
	
	let currentRaise = 0
	let shortStackOverraise = 0;
	let lastAggressor;
	
	let actionIndex = 0;
	
	let bettingOver;
	let gotSmallBlind;
	let gotBigBlind;
	let bigBlindPlayer;
	
	let state;
	
	let getCurrentPot = () => potList[currentPotIndex];
	
	let getPotName = (i) => i == 0 ? 'Main Pot' : 'Side Pot ' + i;
	
	let getMainPlayersCount = () =>
	{
		let main = self.getMainPot();
		if (!main)
		{
			return 0;
		}
		return main.getNumPlayers();
	}
	
	let getMainPlayer = (i) =>
	{
		let count = getMainPlayersCount();
		if (count == 0 || count <= i)
		{
			return null;
		}
		return getMainPot().getPlayers()[i];
	}
	
	let moveActionIndex = () =>
	{
		actionIndex = (actionIndex + 1) % getCurrentPot().getNumPlayers();
	}
	
	let resetOngoingRoundActions = () =>
	{
		ongoingRoundActions = {};
		players.forEach((player) =>
		{
			ongoingRoundActions[player] = null;
		});
	}
	
	let hasEligiblePlayers = () =>
	{
		let count = 0;
		let currentPot = getCurrentPot();
		if (currentPot)
		{
			for (let i = 0; i < currentPot.getNumPlayers(); i++)
			{
				if (!currentPot.getPlayer(i).isAllIn())
				{
					count++;
				}
			}
		}
		return count >= 2;
	}
	
	let getSmallBlind = () => bigBlind / 2;
	
	let refundIncontestableBet = () =>
	{
		if (self.isHandOver())
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
			let lastPot = self.getLastPot();
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
	
	let addPlayerChips = (player, addition) =>
	{
		let entry;
		
		if (addition == 0)
		{
			switch (state)
			{
				case HoldEmState().BET_PREFLOP:
					if (player === bigBlindPlayer)
					{
						// This means the big blind has checked the option
						bettingOver = true;
						entry = ActionLogEntry("checked the option", [player]);
					}
					else
					{
						entry = ActionLogEntry("checked", [player]);
					}
					break;
				default:
					entry = ActionLogEntry("checked", [player]);
					if (actionIndex == getCurrentPot().getNumPlayers() - 1)
					{
						// When the last player checks the table has checked around
						bettingOver = true;
					}
			}
			
			ongoingRoundActions[player] = 'check';
		}
		else
		{
			player.bet(addition);
			
			let chipsThisRound = self.getChipsThisRound(player) + addition;
			let currBet = self.getCurrentBet();
			let incrAmount = chipsThisRound - currBet;
			let raise = chipsThisRound - (currBet - shortStackOverraise);
			let raised = false;
			let action;
			if (incrAmount > 0)
			{
				raised = true;
				
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
					if (pendingPlayers.indexOf(player) !== -1)
					{
						gotBigBlind = true;
						bigBlindPlayer = player;
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
					bigBlindPlayer = player;
					
					action = "called " + chipsThisRound + " big blind";
					ongoingRoundActions[player] = 'big-blind';
				}
				else
				{
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
			
			if (raised)
			{
				lastAggressor = player;
			}
			
			addPlayerChipsToPot(player, addition, currentPotIndex);
			
			if (state > HoldEmState().BET_PREFLOP || addition > bigBlind)
			{
				// Set this to true so isEven() will only rely on whether the betting is even
				bettingOver = true; 
			}
		}
		
		return entry;
	}
	
	let addPlayerChipsToPot = (player, addition, potIndex) =>
	{
		try
		{
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
	
	let getFirstPlayersInPotByPosition = (pot, playersNeeded) =>
	{
		if (playersNeeded > pot.getNumPlayers())
		{
			return null;
		}
		
		let players = [];
		let numPlayers = getMainPlayersCount();
		let playersFound = 0;
		let i = 0;
		while (i < numPlayers)
		{
			let player = getMainPlayer(i);
			if (pot.contains(player))
			{
				players.push(player);
				playersFound++;
				if (playersFound == playersNeeded)
				{
					return players;
				}
			}
			
			i++;
		}
		return null;
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
		
		let playerIndex = self.getMainPot().getIndex(player);
		
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
		getLastPot: () => potList[potList.length - 1],
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
				
				resetOngoingRoundActions();
			}
			
			bettingOver = getCurrentPot() == null;
			
			currentRaise = bigBlind;
			shortStackOverraise = 0;
		},
		isBettingOver: () => self.isEven() && !hasEligiblePlayers(),
		isHandOver: () => getMainPlayersCount() <= 1,
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
			return bettingEven && bettingOver;
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
			let chips = 0;
			for (let i = currentPotIndex; i < potList.length; i++)
			{
				chips += potList[i].getRoundCount(player);
			}
			return chips;
		},
		getOngoingActionThisRound: (player) =>
		{
			let chips = self.getChipsThisRound(player);
			let roundAction = ongoingRoundActions[player];
			return OngoingRoundAction(roundAction, chips);
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
						if (pendingPlayers.indexOf(player) !== -1)
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
		awardPot: (boardCards) =>
		{
			let pot = self.getLastPot();
			if (pot)
			{
				let winners = pot.getWinners(boardCards);
				if (winners)
				{
					let numWinners = winners.length;
					let potSize = pot.getSize();
					if (numWinners == 1)
					{
						winners[0].awardChips(potSize);
					}
					else
					{
						let rem = potSize % numWinners;
						let chipsPerWinner = Math.floor(potSize / numWinners);
						winners.forEach((winner) =>
						{
							winner.awardChips(chipsPerWinner);
						});
						if (rem > 0)
						{
							let players = getFirstPlayersInPotByPosition(pot, iRem);
							players.forEach((player) =>
							{
								player.awardChips(1);
							});
						}
					}
					removePot(pot);
				}
			}
			return pot;
		},
		toString: () =>
		{
			let potsString = self.getMainPot().toString(getPotName(0));
			for (let i = 1; i < potList.length; i++)
			{
				potsString += "   " + potList[i].toString(getPotName(i));
			}
			return potsString
		}
	}
	
	return self;
}

module.exports = Pots;
