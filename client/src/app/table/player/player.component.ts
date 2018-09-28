import { Component, Input } from '@angular/core';
import { Player } from './player.model';
import { SocketService } from '../../socket.service';
import { Subscription } from 'rxjs/Subscription';
import { CurrentPlayerService } from '../../current-player.service';
import { Room } from '../../room/room.model';

@Component
({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss']
})
export class PlayerComponent
{
	@Input() player: Player;
	@Input() position: number;
	@Input() nextActionPlayer: Player;
	@Input() room: Room;
	@Input() winningCards: number[];
	
	private currentPlayer: Player;
	private currentPlayerSubscription: Subscription;
	private currentTable: number;
	private currentTableSubscription: Subscription;
	
	constructor(private socketService: SocketService, private currentPlayerService: CurrentPlayerService) {}
	
	ngOnInit()
	{
		this.currentPlayer = this.currentPlayerService.getCurrentPlayer();
		
		this.currentPlayerSubscription = this.currentPlayerService.currentPlayerChanged.subscribe((currentPlayer) =>
		{
			this.currentPlayer = currentPlayer;
		});
		
		this.currentTable = this.currentPlayerService.getCurrentTable();
		
		this.currentTableSubscription = this.currentPlayerService.currentTableChanged.subscribe((currentTable) =>
		{
			this.currentTable = currentTable;
		});
	}
	
	onJoinTable()
	{
		this.socketService.getSocket().emit('joinTable', this.room.id, +this.position);
		this.currentPlayerService.setCurrentTable(this.room.id);
	}
	
	ngOnDestroy()
	{
		this.currentPlayerSubscription.unsubscribe();
		this.currentTableSubscription.unsubscribe();
	}
}
