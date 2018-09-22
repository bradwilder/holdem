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
	
	let sortCardsDesc = (a, b) => b.value - a.value;
	
	let createFlush = (cards, suit) =>
	{
		let flushCards = cards.filter((card) => card.suit === suit).sort(sortCardsDesc);
		return flushCards.slice(0, 5);
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
	
	let createStraight = (cards, highValue) => {
		let card1 = cards.filter((card) => card.value === highValue)[0];
		let card2 = cards.filter((card) => card.value === highValue - 1)[0];
		let card3 = cards.filter((card) => card.value === highValue - 2)[0];
		let card4 = cards.filter((card) => card.value === highValue - 3)[0];
		let card5 = cards.filter((card) => card.value === (highValue - 4 < 0 ? 12 : highValue - 4))[0];
		return [card1, card2, card3, card4, card5];
	}
	
	let findPairs = (valueCounts) =>
	{
		let pairs = [];
		for (let i = 12; i >= 0 ; i--)
		{
			if (valueCounts[i] >= 2)
			{
				pairs.push(i);
			}
		}
		return pairs;
	}
	
	let createPair = (cards, pairValue) =>
	{
		let pair = cards.filter((card) => card.value === pairValue);
		let kickers = cards.filter((card) => card.value !== pairValue).sort(sortCardsDesc).slice(0, 3);
		return pair.concat(kickers);
	}
	
	let createTwoPair = (cards, pairValues) =>
	{
		let pair1 = cards.filter((card) => card.value === pairValues[0]);
		let pair2 = cards.filter((card) => card.value === pairValues[1]);
		let kicker = cards.filter((card) => card.value !== pairValues[0] && card.value !== pairValues[1]).sort(sortCardsDesc).slice(0, 1);
		return pair1.concat(pair2).concat(kicker);
	}
	
	let createFullHouse = (cards, tripValue, pairValue) =>
	{
		let trip = cards.filter((card) => card.value === tripValue);
		let pair = cards.filter((card) => card.value === pairValue).slice(0, 2);
		return trip.concat(pair);
	}
	
	let findTrip = (valueCounts) =>
	{
		for (let i = 12; i >= 0; i--)
		{
			valueCount = valueCounts[i];
			if (valueCount >= 3)
			{
				return i;
			}
		}
		return -1;
	}
	
	let createTrip = (cards, tripValue) =>
	{
		let trips = cards.filter((card) => card.value === tripValue);
		let kickers = cards.filter((card) => card.value !== tripValue).sort(sortCardsDesc).slice(0, 2);
		return trips.concat(kickers);
	}
	
	let findQuad = (valueCounts) =>
	{
		for (let i = 0; i < valueCounts.length; i++)
		{
			valueCount = valueCounts[i];
			if (valueCount == 4)
			{
				return i;
			}
		}
		return -1;
	}
	
	let createQuad = (cards, quadValue) =>
	{
		let quads = cards.filter((card) => card.value === quadValue);
		let kicker = cards.filter((card) => card.value !== quadValue).sort(sortCardsDesc).slice(0, 1);
		return quads.concat(kicker);
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
	
	let self =
	{
		createHandWithHoles: (boardCards, holeCards) =>
		{
			if (!boardCards || !holeCards)
			{
				return null;
			}
			
			return self.createHand(boardCards.concat(holeCards));
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
					return StraightFlush(createStraight(cards.filter((card) => card.suit === flushSuit), straightFlushHighValue));
				}
				return Flush(createFlush(cards, flushSuit));
			}
			
			let straightHigh = findStraight(cards);
			if (straightHigh !== -1)
			{
				return Straight(createStraight(cards, straightHigh));
			}
			
			let valueCounts = getValueCounts(cards);
			
			let pairValues = findPairs(valueCounts);
			if (pairValues.length === 0)
			{
				return HighCard(cards.sort(sortCardsDesc).slice(0, 5));
			}
			
			let tripValue = findTrip(valueCounts);
			if (tripValue >= 0)
			{
				let quadValue = findQuad(valueCounts);
				
				if (quadValue >= 0)
				{
					return FourOfAKind(createQuad(cards, quadValue));
				}
				
				if (pairValues.length >= 2)
				{
					return FullHouse(createFullHouse(cards, tripValue, pairValues[1]));
				}
				
				return ThreeOfAKind(createTrip(cards, tripValue));
			}
			else if (pairValues.length > 1)
			{
				return TwoPair(createTwoPair(cards, pairValues.slice(0, 2)));
			}
			
			return Pair(createPair(cards, pairValues[0]));
		}
	}
	
	return self;
}

module.exports = HandFactory;
