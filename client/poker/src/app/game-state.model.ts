import { PlayerActionState } from "./player-action-state.model";
import { Player } from "./table/player/player.model";

export class GameState
{
	holdEmState: number;
	potSize: number;
	players: Player[];
	action: PlayerActionState;
}