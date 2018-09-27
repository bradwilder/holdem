let PlayerSimple = (name, chips, hasHoleCards, holeCards, ongoingRoundAction) =>
{
	return {
		name: name,
		chips: chips,
		hasHoleCards: hasHoleCards,
		holeCards: holeCards ? holeCards.slice() : null,
		ongoingRoundAction: Object.assign({}, ongoingRoundAction)
	}
}

module.exports = PlayerSimple;
