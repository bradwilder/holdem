export class CallAction implements PlayerAction
{
	private value: number;
	
	constructor(value: number)
	{
		this.value = value;
	}
	
	getClassName(): string
	{
		return 'call';
	}
	
	getValue(): number
	{
		return this.value;
	}
}