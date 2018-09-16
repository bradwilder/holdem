export class OngoingRoundAction
{
	private value: number;
	private className: string;
	
	constructor(className: string, value = 0)
	{
		this.className = className;
		this.value = value;
	}
	
	getClassName(): string
	{
		return this.className;
	}
	
	getValue(): number
	{
		return this.value;
	}
	
	getFormattedValue(): string
	{
		if (this.value >= 1000000)
		{
			let millions = Math.floor(this.value / 1000000);
			let hundredThousands = Math.floor((this.value % 1000) / 100);
			return millions + (hundredThousands > 0 ? ('.' + hundredThousands) : '') + 'm';
		}
		else if (this.value >= 1000)
		{
			let thousands = Math.floor(this.value / 1000);
			let hundreds = Math.floor((this.value % 1000) / 100);
			return thousands + (hundreds > 0 ? ('.' + hundreds) : '') + 'k';
		}
		else
		{
			return String(this.value);
		}
	}
}