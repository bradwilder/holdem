let HighCard = require('./highCard');
let Pair = require('./pair');
let TwoPair = require('./twoPair');
let ThreeOfAKind = require('./threeOfAKind');
let Straight = require('./straight');
let Flush = require('./flush');
let FullHouse = require('./fullHouse');
let FourOfAKind = require('./fourOfAKind');
let StraightFlush = require('./straightFlush');

let HandFactory = () =>
{
	let findFlush = (cards) =>
	{
		let suitCounts = Array(4).fill(0);
		cards.forEach(card =>
		{
			suitCounts[card.suit]++;
		});
		
		for (let i = 0; i < 4; i++)
		{
			let suitCount = suitCounts[i];
			if (suitCount >= 5)
			{
				return i;
			}
		};
		
		return -1;
	}
	
	let sortAsc = (a, b) => a - b;
	
	let sortDesc = (a, b) => b - a;
	
	let getFlush = (cards, suit) =>
	{
		let values = cards.filter((card) => card.suit === suit).map((card) => card.value).sort(sortDesc);
		return values.slice(0, 5);
	}
	
	let findStraightFlush = (cards, suit) =>
	{
		let suitedCards = cards.filter((card) => card.suit === suit);
		return findStraight(suitedCards);
	}
	
	let findStraight = (cards) =>
	{
		// (!) Ace can be high or low in a straight, so we have to add an extra value
		// (!) We will offset values by +1, and treat ace-low as 0
		
		let valuesPresent = [];
		cards.forEach((card) =>
		{
			valuesPresent[card.value + 1] = true; // Offset +1 for each value
			if (card.value == 12)
			{
				// For ace, also set the value for ace-low
				valuesPresent[0] = true;
			}
		});
		
		for (let i = 13; i >= 4; i--)
		{
			if (valuesPresent[i] &&
				valuesPresent[i - 1] &&
				valuesPresent[i - 2] &&
				valuesPresent[i - 3] &&
				valuesPresent[i - 4])
			{
			   return i - 1; // Finally, offset -1 to account for the offset described above
			}
		}
		
		return -1;
	}
	
	let findPairs = (valueCounts) =>
	{
		let pairs = 0;
		valueCounts.forEach((valueCount) =>
		{
			if (valueCount >= 2)
			{
				pairs++;
			}
		});
		return pairs;
	}
	
	let getPair = (valueCounts) =>
	{
		let values = [];
		for (let i = 12; i >= 0 ; i--)
		{
			if (valueCounts[i] == 2)
			{
				values.push(i);
				valueCounts[i] = 0;
				break;
			}
		}
		
		let kickers = getKickers(valueCounts, 3);
		values.push(kickers[0]);
		values.push(kickers[1]);
		values.push(kickers[2]);
		return values;
	}
	
	let getTwoPair = (valueCounts) =>
	{
		let values = [];
		let pairs = 0;
		for (let i = 12; i >= 0 ; i--)
		{
			if (valueCounts[i] == 2)
			{
				values.push(i);
				valueCounts[i] = 0;
				pairs++;
				if (pairs == 2)
				{
					break;
				}
			}
		}
		
		let kickers = getKickers(valueCounts, 1);
		values.push(kickers[0]);
		return values;
	}
	
	let getFullHouse = (valueCounts) =>
	{
		let values = [];
		for (let i = 12; i >= 0 ; i--)
		{
			if (valueCounts[i] == 3)
			{
				values[0] = i;
				valueCounts[i] = 0;
				break;
			}
		}
		
		for (let i = 12; i >= 0 ; i--)
		{
			if (valueCounts[i] >= 2)
			{
				values[1] = i;
				break;
			}
		}
		return values;
	}
	
	let getTrip = (valueCounts) =>
	{
		let values = [];
		for (let i = 12; i >= 0 ; i--)
		{
			if (valueCounts[i] == 3)
			{
				values[0] = i;
				valueCounts[i] = 0;
				break;
			}
		}
		
		let kickers = getKickers(valueCounts, 2);
		values.push(kickers[0]);
		values.push(kickers[1]);
		return values;
	}
	
	let hasTrip = (valueCounts) =>
	{
		for (let i = 0; i < valueCounts.length; i++)
		{
			valueCount = valueCounts[i];
			if (valueCount >= 3)
			{
				return true;
			}
		}
		return false;
	}
	
	let getQuad = (valueCounts) =>
	{
		let values = [];
		for (let i = 12; i >= 0 ; i--)
		{
			if (valueCounts[i] == 4)
			{
				values[0] = i;
				valueCounts[i] = 0;
				break;
			}
		}
		
		let kickers = getKickers(valueCounts, 1);
		values.push(kickers[0]);
		return values;
	}
	
	let hasQuad = (valueCounts) =>
	{
		for (let i = 0; i < valueCounts.length; i++)
		{
			valueCount = valueCounts[i];
			if (valueCount == 4)
			{
				return true;
			}
		}
		return false;
	}
	
	let getValueCounts = (cards) =>
	{
		let valueCounts = Array(13).fill(0);
		cards.forEach((card) =>
		{
			valueCounts[card.value]++;
		});
		return valueCounts;
	}
	
	let getKickers = (valueCounts, kickersNeeded) =>
	{
		let kickers = [];
		for (let i = 12; i >= 0 ; i--)
		{
			if (valueCounts[i] > 0)
			{
				kickers.push(i);
				if (kickers.length == kickersNeeded)
				{
					break;
				}
			}
		}
		return kickers;
	}
	
	let self =
	{
		createHandWithHoles: (boardCards, holeCards) =>
		{
			if (!boardCards || !holeCards)
			{
				return null;
			}
			
			let allCards = [];
			
			for (let i = 0; i < boardCards.length; i++)
			{
				allCards.push(boardCards[i]);
			}
			
			for (let i = 0; i < holeCards.length; i++)
			{
				allCards.push(holeCards[i]);
			}
			
			return self.createHand(allCards);
		},
		createHand: (cards) =>
		{
			if (!cards || cards.length < 5)
			{
				return null;
			}
			
			let flushSuit = findFlush(cards);
			if (flushSuit !== -1)
			{
				let straightFlushHighValue = findStraightFlush(cards, flushSuit);
				if (straightFlushHighValue !== -1)
				{
					return StraightFlush(straightFlushHighValue);
				}
				return Flush(getFlush(cards, flushSuit));
			}
			
			let straightHigh = findStraight(cards);
			if (straightHigh !== -1)
			{
				return Straight(straightHigh);
			}
			
			let valueCounts = getValueCounts(cards);
			
			let pairCount = findPairs(valueCounts);
			if (pairCount === 0)
			{
				return HighCard(getKickers(valueCounts, 5));
			}
			
			if (hasTrip(valueCounts))
			{
				if (hasQuad(valueCounts))
				{
					return FourOfAKind(getQuad(valueCounts));
				}
				
				if (pairCount >= 2)
				{
					return FullHouse(getFullHouse(valueCounts));
				}
				
				return ThreeOfAKind(getTrip(valueCounts));
			}
			else if (pairCount > 1)
			{
				return TwoPair(getTwoPair(valueCounts));
			}
			
			return Pair(getPair(valueCounts));
		}
	}
	
	return self;
}

module.exports = HandFactory;
