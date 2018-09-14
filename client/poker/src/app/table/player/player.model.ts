export class Player
{
	name: string;
	chips: number;
	isInHand = false;
	isDealer = false;
	isSittingOut = false;
	holeCards: number[] = [];
	playerAction: PlayerAction;
	
	constructor(name: string, chips: number)
	{
		this.name = name;
		this.chips = chips;
	}
	
	
}