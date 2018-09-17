let PlayerSimple = (name, chips, isInHand, holeCards, chipsThisRound, isDealer) =>
{
	return {
		name: name,
		chips: chips,
		isInHand: isInHand,
		holeCards: holeCards,
		chipsThisRound: chipsThisRound,
		isDealer: isDealer
	}
}

module.exports = PlayerSimple;
