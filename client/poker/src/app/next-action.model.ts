import { Player } from "./table/player/player.model";

export class NextAction
{
	player: Player;
	call: number;
	minRaise: number;
	maxRaise: number;
}