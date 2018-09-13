import { Player } from "./table/player/player.model";
import { PlayerActionState } from "./player-action-state.model";

export class PlayerState
{
	player: Player;
	isInHand: boolean;
	playerAction: PlayerActionState;
}