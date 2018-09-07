let PlayerAction = (player, call, minRaise, maxRaise) =>
{
	return {
		player: player,
		call: call,
		minRaise: minRaise,
		maxRaise: maxRaise
	}
}

module.exports = PlayerAction;
