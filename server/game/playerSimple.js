let PlayerSimple = (name, chips, hasHoleCards, holeCards, ongoingRoundAction, isDealer) =>
{
	return {
		name: name,
		chips: chips,
		hasHoleCards: hasHoleCards,
		holeCards: holeCards ? holeCards.slice() : null,
		ongoingRoundAction: Object.assign({}, ongoingRoundAction),
		isDealer: isDealer
	}
}

module.exports = PlayerSimple;
