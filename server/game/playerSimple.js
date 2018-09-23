let PlayerSimple = (name, chips, hasHoleCards, holeCards, ongoingRoundAction, isDealer) =>
{
	return {
		name: name,
		chips: chips,
		hasHoleCards: hasHoleCards,
		holeCards: holeCards.slice(),
		ongoingRoundAction: Object.assign({}, ongoingRoundAction),
		isDealer: isDealer
	}
}

module.exports = PlayerSimple;
