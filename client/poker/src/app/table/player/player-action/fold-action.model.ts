export class FoldAction implements PlayerAction
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