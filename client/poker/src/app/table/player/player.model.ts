export class Player
{
	name: string;
	chips: number;
	isInHand: boolean;
	isDealer: boolean;
	isSittingOut: boolean;
	holeCards: number[] = [];
	playerAction: PlayerAction;
	
	constructor(name: string, chips: number)
	{
		this.name = name;
		this.chips = chips;
	}
	
	
}