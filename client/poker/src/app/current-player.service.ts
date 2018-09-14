import { SocketService } from "./socket.service";
import { Injectable } from "@angular/core";
import { Player } from "./table/player/player.model";
import { Subject } from "rxjs/Subject";

@Injectable()
export class CurrentPlayerService
{
	currentPlayer: Player;
	currentPlayerChanged = new Subject<Player>();
	
	constructor(private socketService: SocketService)
	{
		this.socketService.getSocket().on('login', (player) =>
		{
			this.currentPlayer = player;
			this.currentPlayerChanged.next(this.currentPlayer);
		});
	}
}
