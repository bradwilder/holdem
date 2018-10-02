let OngoingRoundAction = (type, value = 0) =>
{
	return {
		type: type,
		value: value
	}
}

module.exports = OngoingRoundAction;