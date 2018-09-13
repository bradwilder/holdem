export class Player
{
	name: string;
	chips: number;
	isInHand: boolean;
	isShowing: boolean;
	isDealer: boolean;
	isSittingOut: boolean;
	playerAction: PlayerAction;
	
	constructor(name: string, chips: number)
	{
		this.name = name;
		this.chips = chips;
	}
	
	
}