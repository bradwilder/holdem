export class Player
{
	name: string;
	chips: number;
	isInHand = false;
	isDealer = false;
	holeCards: number[] = [];
	ongoingRoundAction: OngoingRoundAction;
	
	constructor(name: string, chips: number)
	{
		this.name = name;
		this.chips = chips;
	}
	
	
}