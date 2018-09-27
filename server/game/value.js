let Value = (value) =>
{
	return {
		value: value,
		toString: () =>
		{
			switch (value)
			{
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
					return '' + (value + 2);
				case 9:
					return 'Jack';
				case 10:
					return 'Queen';
				case 11:
					return 'King';
				case 12:
					return 'Ace';
			}
		}
	}
}

module.exports = Value;
