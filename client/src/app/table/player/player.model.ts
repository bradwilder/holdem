import { OngoingRoundAction } from "./player-action/ongoing-round-action.model";

export class Player
{
	name: string;
	chips: number;
	hasHoleCards = false;
	isDealer = false;
	holeCards: number[] = [];
	ongoingRoundAction: OngoingRoundAction;
	
	constructor(name: string, chips: number)
	{
		this.name = name;
		this.chips = chips;
	}
	
	
}