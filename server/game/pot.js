let LinkedHashMap = require('./linkedHashMap');
let HandFactory = require('./hand/handFactory');

let Pot = (players = null) =>
{
	let totalSize = 0;
	let bettingCapped = false;
	let playerCounts = LinkedHashMap();
	
	if (players)
	{
		players.forEach(player =>
		{
			playerCounts.set(player, 0);
		});
	}
	
	let capBetting = (cap) =>
	{
		let newPlayerCounts = LinkedHashMap();
		for (let playerCount = playerCounts.getIterator(); playerCount; playerCount = playerCount.next)
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
		}
		
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
		getCurrentBet: () =>
		{
			let maxBet = 0;
			for (let playerCount = playerCounts.getIterator(); playerCount; playerCount = playerCount.next)
			{
				maxBet = Math.max(maxBet, playerCount.value);
			}
			return maxBet;
		},
		getNumPlayers: () => playerCounts.size(),
		isContested: () => self.getNumPlayers() >= 2,
		getPlayers: () => playerCounts.keySet(),
		getPlayer: (i) => self.getPlayers()[i],
		getIndex: (player) => players.indexOf(player),
		contains: (player) => playerCounts.contains(player),
		getWinners: (boardCards) =>
		{
			if (self.getNumPlayers() === 0 || !self.isEven())
			{
				return null;
			}
			
			let players = self.getPlayers();
			if (players.length === 0)
			{
				return null;
			}
			
			// Add the first player into the list; this will start as the best hand
			let winners = [];
			let firstPlayer = players[0];
			winners.push(firstPlayer);
			let bestHand = HandFactory().createHandWithHoles(boardCards, firstPlayer.getHoleCards());
			
			// If the best hand is null, we must be pre-flop; there's only a winner if there's only 1 player left
			if (!bestHand)
			{
				if (players.length === 1)
				{
					return winners;
				}
				else
				{
					return null;
				}
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
					winners.push(player);
				}
			}
			
			return winners;
		},
		getBestHand: (boardCards) =>
		{
			if (self.getNumPlayers() === 0)
			{
				return null;
			}
			
			let players = self.getPlayers();
			if (players.length === 0)
			{
				return null;
			}
			
			// Add the first player into the list; this will start as the best hand
			let bestHand = HandFactory().createHandWithHoles(boardCards, players[0].getHoleCards());
			
			// If the best hand is null, that means there aren't enough board cards to make a hand, so return null
			if (!bestHand)
			{
				return null;
			}
			
			for (let i = 1; i < players.length; i++)
			{
				let playerHand = HandFactory().createHandWithHoles(boardCards, players[i].getHoleCards());
				let compare = bestHand.compare(playerHand);
				if (compare <= 0)
				{
					bestHand = playerHand;
				}
			}
			
			return bestHand;
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
			for (let playerCount = playerCounts.getIterator(); playerCount; playerCount = playerCount.next)
			{
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
		getRoundOwed: (player) =>
		{
			return self.getCurrentBet() - self.getRoundCount(player);
		},
		clearRound: () =>
		{
			for (let playerCount = playerCounts.getIterator(); playerCount; playerCount = playerCount.next)
			{
				playerCounts.set(playerCount.key, 0);
			}
		},
		initialize: (newPlayerCounts, isBettingCapped) =>
		{
			playerCounts = newPlayerCounts;
			bettingCapped = isBettingCapped;
			for (let playerCount = newPlayerCounts.getIterator(); playerCount; playerCount = playerCount.next)
			{
				totalSize += playerCount.value;
			}
		},
		toString: (name) =>
		{
			return name + ' (' + totalSize + ')';
		}
	}
	
	return self;
}

module.exports = Pot;