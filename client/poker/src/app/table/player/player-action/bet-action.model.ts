export class BetAction implements PlayerAction
{
	private value: number;
	
	constructor(value: number)
	{
		this.value = value;
	}
	
	getClassName(): string
	{
		return 'bet';
	}
	
	getValue(): number
	{
		return this.value;
	}
}