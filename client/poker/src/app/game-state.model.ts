import { NextAction } from "./next-action.model";
import { Player } from "./table/player/player.model";

export class GameState
{
	holdEmState: number;
	potSize: number;
	players: Player[];
	action: NextAction;
	board: number[];
}