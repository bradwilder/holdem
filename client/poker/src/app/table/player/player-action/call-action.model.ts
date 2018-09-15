export class CallAction implements OngoingRoundAction
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