import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuService } from './menu.service';
import { Subscription } from 'rxjs/Subscription';
import { CurrentPlayerService } from '../current-player.service';
import { Player } from '../table/player/player.model';
import { SocketService } from '../socket.service';

@Component
({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy
{
	private showLobbyButton = false;
	private menuObject: {title: string, isLobby: boolean} = {title: '', isLobby: false};
	private menuSubscription: Subscription;
	private currentPlayer: Player;
	private currentTable: number;
	private currentPlayerSubscription: Subscription;
	private currentTableSubscription: Subscription;
	
	constructor(private menuService: MenuService, private currentPlayerService: CurrentPlayerService, private socketService: SocketService) {}
	
	ngOnInit()
	{
		this.menuObject = this.menuService.getRoomData();
		
		this.menuSubscription = this.menuService.roomChanged.subscribe((menuObject) =>
		{
			this.menuObject = menuObject;
			this.showLobbyButton = !menuObject.isLobby;
		});
		
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
	
	standClicked()
	{
		this.socketService.getSocket().emit('leaveTable', this.currentTable);
		this.currentPlayerService.setCurrentTable();
	}
	
	ngOnDestroy()
	{
		this.menuSubscription.unsubscribe();
		this.currentPlayerSubscription.unsubscribe();
		this.currentTableSubscription.unsubscribe();
	}
}
