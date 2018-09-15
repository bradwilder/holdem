export class FoldAction implements OngoingRoundAction
{
	getClassName(): string
	{
		return 'fold';
	}
	
	getValue(): number
	{
		return null;
	}
}