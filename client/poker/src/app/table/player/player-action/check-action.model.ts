export class CheckAction implements OngoingRoundAction
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