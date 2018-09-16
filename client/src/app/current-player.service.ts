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
		this.socketService.getSocket().on('loggedIn', (player) =>
		{
			this.currentPlayer = new Player(player.name, player.chips);
			this.currentPlayerChanged.next(this.currentPlayer);
		});
		
		this.socketService.getSocket().on('serverStart', () =>
		{
			this.currentPlayer = null;
			this.currentPlayerChanged.next(this.currentPlayer);
		});
	}
	
	login(name)
	{
		this.socketService.getSocket().emit('login', name);
	}
}
