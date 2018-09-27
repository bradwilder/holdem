let Rank = require('./rank');

class Hand
{
	constructor(rankValue)
	{
		if (new.target === Hand)
		{
			throw 'Cannot construct Hand instances directly';
		}
		
		this.rank = Rank(rankValue);
	}
	
	getRank()
	{
		return this.rank;
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
}

module.exports = Hand;
