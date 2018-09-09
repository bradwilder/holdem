import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { LobbyService } from '../lobby.service';
import { Subscription } from 'rxjs/Subscription';

@Component
({
	selector: 'app-lobby',
	templateUrl: './lobby.component.html',
	styleUrls: ['./lobby.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LobbyComponent implements OnInit, OnDestroy
{
	private rooms: {id: number, name: string, bigBlind: number, maxPlayers: number}[];
	roomsSubscription: Subscription;
	
	constructor(private lobbyService: LobbyService) {}
	
	rowClick(room: {id: number, name: string, bigBlind: number, maxPlayers: number})
	{
		console.log(room);
		
	}
	
	ngOnInit()
	{
		this.roomsSubscription = this.lobbyService.roomsChanged.subscribe((rooms) =>
		{
			this.rooms = rooms;
		});
	}
	
	ngOnDestroy()
	{
		this.roomsSubscription.unsubscribe();
	}
}
