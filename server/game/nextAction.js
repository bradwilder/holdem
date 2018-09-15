let NextAction = (player, call, minRaise, maxRaise) =>
{
	return {
		player: player,
		action:
		{
			call: call,
			minRaise: minRaise,
			maxRaise: maxRaise
		}
	}
}

module.exports = NextAction;
