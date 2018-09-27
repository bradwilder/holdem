import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from '../socket.service';
import { MenuService } from '../menu/menu.service';
import { LobbyService } from '../lobby/lobby.service';
import { Room } from './room.model';

@Component
({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy
{
	private roomID: number;
	private room: Room;
	private routeSubscription: Subscription;
	private lobbySubscription: Subscription;
	
	constructor(private route: ActivatedRoute, private socketService: SocketService, private menuService: MenuService, private lobbyService: LobbyService) {}
	
	ngOnInit()
	{
		this.routeSubscription = this.route.params.subscribe(params =>
		{
			this.roomID = +params['id'];
			this.room = this.lobbyService.getRoom(this.roomID);
			
			if (this.room)
			{
				this.updateRoom();
			}
		});
		
		this.socketService.getSocket().on('serverStart', () =>
		{
			if (this.room)
			{
				this.socketService.getSocket().emit('enterRoom', this.room.id);
			}
		});
		
		this.lobbySubscription = this.lobbyService.roomsChanged.subscribe((rooms) =>
		{
			if (!this.room)
			{
				this.room = rooms.find((room) => room.id === this.roomID);
				if (this.room)
				{
					this.updateRoom();
				}
			}
		});
	}
	
	private updateRoom()
	{
		this.socketService.getSocket().emit('enterRoom', this.room.id);
		this.menuService.changeToRoom(this.room.name);
	}
	
	ngOnDestroy()
	{
		if (this.room)
		{
			this.socketService.getSocket().emit('leaveRoom', this.room.id);
		}
		this.socketService.getSocket().off('serverStart');
		this.routeSubscription.unsubscribe();
		this.lobbySubscription.unsubscribe();
	}
}
