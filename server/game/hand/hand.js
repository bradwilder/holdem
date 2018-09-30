let Rank = require('./rank');

class Hand
{
	constructor(cards, rankValue)
	{
		if (new.target === Hand)
		{
			throw 'Cannot construct Hand instances directly';
		}
		
		this.rank = Rank(rankValue);
		this.cards = cards;
	}
	
	getRank()
	{
		return this.rank;
	}
	
	getCards()
	{
		return this.cards;
	}
	
	compare(hand)
	{
		let rankCompare = this.rank.compare(hand.getRank());
		if (rankCompare)
		{
			return rankCompare;
		}
		
		return this.compareSameRank(hand);
	}
	
	compareSameRank(hand)
	{
		throw 'Not implemented'
	}
	
	toJSON()
	{
		return this.cards;
	}
}

module.exports = Hand;
