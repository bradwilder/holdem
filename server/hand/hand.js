let Hand = (rank) =>
{
	return {
		compare: (hand) => rank - hand.rank
	}
}

module.exports = Hand;
