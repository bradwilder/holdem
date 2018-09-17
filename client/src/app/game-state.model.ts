import { Player } from "./table/player/player.model";
import { NextAction } from "./table/next-action/next-action.model";

export class GameState
{
	holdEmState: number;
	potSize: number;
	bigBlind: number;
	players: Player[];
	nextAction: NextAction;
	board: number[];
}