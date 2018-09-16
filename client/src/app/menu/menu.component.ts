import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuService } from './menu.service';
import { Subscription } from 'rxjs/Subscription';
import { CurrentPlayerService } from '../current-player.service';
import { Player } from '../table/player/player.model';

@Component
({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy
{
	private pageTitle = "";
	private showLobbyButton = false;
	private menuSubscription: Subscription;
	private currentPlayer: Player;
	private currentPlayerSubscription: Subscription;
	
	constructor(private menuService: MenuService, private currentPlayerService: CurrentPlayerService) {}
	
	ngOnInit()
	{
		this.menuSubscription = this.menuService.roomChanged.subscribe((menuObject) =>
		{
			this.pageTitle = menuObject.title;
			this.showLobbyButton = !menuObject.isLobby;
		});
		
		this.currentPlayerSubscription = this.currentPlayerService.currentPlayerChanged.subscribe((currentPlayer) =>
		{
			this.currentPlayer = currentPlayer;
		});
	}
	
	ngOnDestroy()
	{
		this.menuSubscription.unsubscribe();
		this.currentPlayerSubscription.unsubscribe();
	}
}
