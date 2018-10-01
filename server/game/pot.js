let LinkedHashMap = require('./linkedHashMap');
let HandFactory = require('./hand/handFactory');
let AwardedPot = require('./awardedPot');
let WinnerStateClient = require('./winnerStateClient');

let Pot = (playersToAdd = null) =>
{
	let totalSize = 0;
	let bettingCapped = false;
	let playerCounts = LinkedHashMap();
	
	if (playersToAdd)
	{
		playersToAdd.forEach(player =>
		{
			playerCounts.set(player, 0);
		});
	}
	
	let getFirstPlayersByPosition = (playersNeeded) =>
	{
		if (playersNeeded > self.getNumPlayers())
		{
			return null;
		}
		
		let firstPlayers = [];
		let players = self.getPlayers();
		let playersFound = 0;
		let i = 0;
		while (i < players.length)
		{
			let player = players[i];
			if (self.contains(player))
			{
				firstPlayers.push(player);
				playersFound++;
				if (playersFound == playersNeeded)
				{
					return firstPlayers;
				}
			}
			i++;
		}
		return null;
	}
	
	let capBetting = (cap) =>
	{
		let newPlayerCounts = LinkedHashMap();
		playerCounts.itemSet().forEach((playerCount) =>
		{
			let player = playerCount.key;
			let count = playerCount.value ? playerCount.value : 0;
			
			let deduction = Math.max(count - cap, 0);
			if (deduction > 0)
			{
				self.sub(player, deduction);
			}
			
			let surplus = player.getChips() + count - cap;
			
			if (surplus > 0 || deduction > 0)
			{
				newPlayerCounts.set(player, deduction);
			}
		});
		
		let newPot;
		if (newPlayerCounts.size() >= 2)
		{
			newPot = Pot();
			newPot.initialize(newPlayerCounts, bettingCapped);
		}
		
		bettingCapped = true;
		
		return newPot;
	}
	
	let self =
	{
		getSize: () => totalSize,
		isBettingCapped: () => bettingCapped,
		getCurrentBet: () => Math.max(...playerCounts.itemSet().map((item) => item.value)),
		getNumPlayers: () => playerCounts.size(),
		isContested: () => self.getNumPlayers() >= 2,
		getPlayers: () => playerCounts.keySet(),
		getPlayer: (i) => self.getPlayers()[i],
		contains: (player) => playerCounts.contains(player),
		award: (boardCards) =>
		{
			let players = self.getPlayers();
			if (players.length === 0 || !self.isEven())
			{
				return null;
			}
			
			// Add the first player into the list; this will start as the best hand
			let winners = [];
			let firstPlayer = players[0];
			let bestHand = HandFactory().createHandWithHoles(boardCards, firstPlayer.getHoleCards());
			winners.push({player: firstPlayer, bestHand: bestHand});
			
			// If the best hand is null, we must be pre-flop; there's only a winner if there's only 1 player left
			if (!bestHand && players.length > 1)
			{
				return null;
			}
			
			for (let i = 1; i < players.length; i++)
			{
				let player = players[i];
				let playerHand = HandFactory().createHandWithHoles(boardCards, player.getHoleCards());
				let compare = bestHand.compare(playerHand);
				if (compare <= 0)
				{
					if (compare < 0)
					{
						winners = [];
					}
					bestHand = playerHand;
					winners.push({player: player, bestHand: playerHand});
				}
			}
			
			let numWinners = winners.length;
			let potSize = self.getSize();
			if (numWinners == 1)
			{
				winners[0].player.awardChips(potSize);
			}
			else
			{
				let rem = potSize % numWinners;
				let chipsPerWinner = Math.floor(potSize / numWinners);
				winners.forEach((winner) =>
				{
					winner.player.awardChips(chipsPerWinner);
				});
				if (rem > 0)
				{
					let players = getFirstPlayersByPosition(rem);
					players.forEach((player) =>
					{
						player.awardChips(1);
					});
				}
			}
			
			let winningCards = [];
			let winningHandStr;
			if (players.length > 1)
			{
				winners.forEach((winner) =>
				{
					winner.bestHand.getCards().forEach((card) =>
					{
						if (winningCards.indexOf(card) === -1)
						{
							winningCards.push(card);
						}
					});
				});
				
				winningHandStr = bestHand.toString();
			}
			
			return AwardedPot(players, WinnerStateClient(winningCards, winningHandStr, winners.map((winner) => winner.player)), potSize);
		},
		add: (player, addition) =>
		{
			if (addition <= 0)
			{
				throw "Attempted to add " + addition;
			}
			
			let roundCount = playerCounts.get(player);
			roundCount = roundCount ? roundCount : 0;
			
			let totalCount = roundCount + addition;
			let currentBet = self.getCurrentBet();
			
			if (bettingCapped && totalCount > currentBet)
			{
				throw "Attempted to add " + addition + " chips to pot with current bet at " + currentBet + " and player's current bet at " + roundCount;
			}
			
			playerCounts.set(player, totalCount);
			totalSize += addition;
			
			let newPot;
			if (totalCount < currentBet || player.getChips() == 0)
			{
				newPot = capBetting(totalCount);
			}
			
			return newPot;
		},
		addDeadChips: (addition) =>
		{
			if (addition <= 0)
			{
				throw "Attempted to add " + addition;
			}
			totalSize += addition;
		},
		sub: (player, deduction) =>
		{
			if (deduction > totalSize)
			{
				throw "Tried to remove " + deduction + " from pot with size " + totalSize;
			}
			else if (deduction <= 0)
			{
				throw "Attempted to remove " + deduction;
			}
			
			let roundCount = playerCounts.get(player);
			
			if (!roundCount)
			{
				throw "Attempted to remove chips from player that doesn't exist";
			}
			else if (roundCount < deduction)
			{
				throw "Tried to remove " + deduction + " from player with only " + roundCount;
			}
			
			roundCount -= deduction;
			playerCounts.set(player, roundCount);
			totalSize -= deduction;
		},
		fold: (player) =>
		{
			playerCounts.remove(player);
		},
		isEven: () =>
		{
			let currentBet = self.getCurrentBet();
			let items = playerCounts.itemSet();
			for (let i = 0; i < items.length; i++)
			{
				let playerCount = items[i];
				let player = playerCount.key;
				if (currentBet != self.getRoundCount(player))
				{
					return false;
				}
			}
			return true;
		},
		getRoundCount: (player) =>
		{
			let count = playerCounts.get(player);
			return count ? count : 0;
		},
		getRoundOwed: (player) => self.getCurrentBet() - self.getRoundCount(player),
		clearRound: () =>
		{
			playerCounts.itemSet().forEach((playerCount) =>
			{
				playerCounts.set(playerCount.key, 0);
			});
		},
		initialize: (newPlayerCounts, isBettingCapped) =>
		{
			playerCounts = newPlayerCounts;
			bettingCapped = isBettingCapped;
			playerCounts.itemSet().forEach((playerCount) =>
			{
				totalSize += playerCount.value;
			});
		}
	}
	
	return self;
}

module.exports = Pot;
