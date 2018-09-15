import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from '../socket.service';
import { GameStateService } from '../game-state.service';
import { MenuService } from '../menu/menu.service';
import { LobbyService } from '../lobby/lobby.service';

@Component
({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css'],
	providers: [GameStateService]
})
export class RoomComponent implements OnInit, OnDestroy
{
	private roomID: number;
	private routeSubscription: Subscription;
	private lobbySubscription: Subscription;
	
	constructor(private route: ActivatedRoute, private socketService: SocketService, private menuService: MenuService, private lobbyService: LobbyService) {}
	
	ngOnInit()
	{
		this.routeSubscription = this.route.params.subscribe(params =>
		{
			this.roomID = +params['id'];
			this.socketService.getSocket().emit('enterRoom', this.roomID);
			
			let room = this.lobbyService.getRoom(this.roomID);
			if (room)
			{
				this.menuService.changeToRoom(room.name);
			}
		});
		
		this.socketService.getSocket().on('serverStart', () =>
		{
			this.socketService.getSocket().emit('enterRoom', this.roomID);
		});
		
		this.lobbySubscription = this.lobbyService.roomsChanged.subscribe((rooms) =>
		{
			if (this.roomID >= 0)
			{
				this.menuService.changeToRoom(rooms.find((room) => room.id === this.roomID).name);
			}
		});
	}
	
	ngOnDestroy()
	{
		this.socketService.getSocket().emit('leaveRoom', this.roomID);
		this.routeSubscription.unsubscribe();
		this.lobbySubscription.unsubscribe();
	}
}
