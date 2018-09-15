export class RaiseAction implements OngoingRoundAction
{
	private value: number;
	
	constructor(value: number)
	{
		this.value = value;
	}
	
	getClassName(): string
	{
		return 'raise';
	}
	
	getValue(): number
	{
		return this.value;
	}
}