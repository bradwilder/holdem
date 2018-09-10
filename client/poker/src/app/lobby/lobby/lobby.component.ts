import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { LobbyService } from '../lobby.service';
import { Subscription } from 'rxjs/Subscription';
import { Room } from '../../room/room/room.model';
import { SocketService } from '../../socket.service';

@Component
({
	selector: 'app-lobby',
	templateUrl: './lobby.component.html',
	styleUrls: ['./lobby.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [LobbyService]
})
export class LobbyComponent implements OnInit, OnDestroy
{
	private rooms: Room[];
	roomsSubscription: Subscription;
	
	constructor(private lobbyService: LobbyService, private socketService: SocketService) {}
	
	ngOnInit()
	{
		this.roomsSubscription = this.lobbyService.roomsChanged.subscribe((rooms) =>
		{
			this.rooms = rooms;
		});
		
		this.socketService.getSocket().emit('enterLobby');
	}
	
	ngOnDestroy()
	{
		this.roomsSubscription.unsubscribe();
		this.socketService.getSocket().emit('leaveLobby');
	}
}
