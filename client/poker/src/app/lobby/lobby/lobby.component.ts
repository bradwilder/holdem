import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { LobbyService } from '../lobby.service';
import { Subscription } from 'rxjs/Subscription';
import { Room } from '../../room/room/room.model';
import { SocketService } from '../../socket.service';
import { MenuService } from '../../menu/menu.service';

@Component
({
	selector: 'app-lobby',
	templateUrl: './lobby.component.html',
	styleUrls: ['./lobby.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LobbyComponent implements OnInit, OnDestroy
{
	private rooms: Room[];
	roomsSubscription: Subscription;
	
	constructor(private lobbyService: LobbyService, private socketService: SocketService, private menuService: MenuService) {}
	
	ngOnInit()
	{
		this.roomsSubscription = this.lobbyService.roomsChanged.subscribe((rooms) =>
		{
			this.rooms = rooms;
		});
		
		this.socketService.getSocket().emit('enterLobby');
		
		this.menuService.changeToLobby();
	}
	
	ngOnDestroy()
	{
		this.roomsSubscription.unsubscribe();
		this.socketService.getSocket().emit('leaveLobby');
	}
}
