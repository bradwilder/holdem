import { Injectable, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';

@Injectable()
export class LobbyService implements OnDestroy
{
	private rooms: {id: number, name: string, bigBlind: number, maxPlayers: number}[] = [];
	roomsChanged = new Subject<{id: number, name: string, bigBlind: number, maxPlayers: number}[]>();
	private socket;
	
	constructor(private dataService: DataService)
	{
		this.getRooms();
		
		
		
		// TODO
		let socketIOPort = 3000;
		let socketIOUrl = window.location.protocol + '//' + window.location.hostname + ':' + socketIOPort;
		this.socket = io(socketIOUrl);
		this.socket.emit('enterLobby', 'hey');
		this.socket.on('event', (data) =>
		{
			console.log('on event', data);
		});
	}
	
	private getRooms()
	{
		this.dataService.getRooms().subscribe((rooms) =>
		{
			this.rooms = rooms.slice();
			this.roomsChanged.next(this.rooms);
		});
	}
	
	ngOnDestroy()
	{
		this.socket.emit('leaveLobby', 'hey');
	}
}
