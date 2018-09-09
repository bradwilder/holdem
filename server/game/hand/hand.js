let Hand = (rank) =>
{
	return {
		compare: (hand) => rank - hand.getRank(),
		getRank: () => rank
	}
}

module.exports = Hand;
