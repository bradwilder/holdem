import { Player } from "./table/player/player.model";

export class PlayerActionState
{
	player: Player;
	call: number;
	minRaise: number;
	maxRaise: number;
}