import { Player } from "../player/player.model";

export class NextAction
{
	player: Player;
	action: {call: number, minRaise: number, maxRaise: number};
}