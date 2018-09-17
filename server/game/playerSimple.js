let PlayerSimple = (name, chips, isInHand, holeCards, ongoingRoundAction, isDealer) =>
{
	return {
		name: name,
		chips: chips,
		isInHand: isInHand,
		holeCards: holeCards,
		ongoingRoundAction: ongoingRoundAction,
		isDealer: isDealer
	}
}

module.exports = PlayerSimple;
