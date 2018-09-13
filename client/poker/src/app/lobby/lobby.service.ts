import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Subject } from 'rxjs/Subject';
import { Room } from '../room/room/room.model';
import { SocketService } from '../socket.service';

@Injectable()
export class LobbyService
{
	private rooms: Room[] = [];
	roomsChanged = new Subject<Room[]>();
	
	constructor(private dataService: DataService, private socketService: SocketService)
	{
		this.getRooms();
		
		this.socketService.getSocket().on('roomCounts', (roomCounts) =>
		{
			let updated = false;
			roomCounts.forEach((roomCount) =>
			{
				let matchingRoom = this.rooms.find((room) => room.id === roomCount.id);
				
				if (matchingRoom)
				{
					matchingRoom.players = roomCount.players;
					updated = true;
				}
			});
			if (updated)
			{
				this.roomsChanged.next(this.rooms);
			}
		});
	}
	
	private getRooms()
	{
		this.dataService.getRooms().subscribe((rooms) =>
		{
			this.rooms = rooms.map((room) => new Room(room.id, room.name, room.bigBlind, room.maxPlayers));
			this.roomsChanged.next(this.rooms);
		});
	}
}
