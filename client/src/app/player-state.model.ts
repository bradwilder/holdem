import { Player } from "./table/player/player.model";
import { NextAction } from "./next-action.model";

export class PlayerState
{
	player: Player;
	isInHand: boolean;
	playerAction: NextAction;
}