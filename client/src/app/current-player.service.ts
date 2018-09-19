import { SocketService } from "./socket.service";
import { Injectable, OnDestroy } from "@angular/core";
import { Player } from "./table/player/player.model";
import { Subject } from "rxjs/Subject";

@Injectable()
export class CurrentPlayerService implements OnDestroy
{
	private currentPlayer: Player;
	currentPlayerChanged = new Subject<Player>();
	
	private currentTable: number;
	currentTableChanged = new Subject<number>();
	
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
			this.currentTable = null;
			this.currentPlayerChanged.next(this.currentPlayer);
			this.currentTableChanged.next(this.currentTable);
		});
	}
	
	getCurrentPlayer()
	{
		return this.currentPlayer;
	}
	
	getCurrentTable()
	{
		return this.currentTable;
	}
	
	login(name)
	{
		this.socketService.getSocket().emit('login', name);
	}
	
	setCurrentTable(roomID)
	{
		this.currentTable = roomID;
		this.currentTableChanged.next(this.currentTable);
	}
	
	ngOnDestroy()
	{
		this.socketService.getSocket().off('loggedIn');
		this.socketService.getSocket().off('serverStart');
	}
}
