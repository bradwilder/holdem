export class CheckAction implements PlayerAction
{
	getClassName(): string
	{
		return 'check';
	}
	
	getValue(): number
	{
		return null;
	}
}