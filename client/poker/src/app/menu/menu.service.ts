import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MenuService 
{
	private pageTitle: string;
	private isLobby: boolean;
	roomChanged = new Subject<{title: string, isLobby: boolean}>();
	
	changeToLobby()
	{
		this.pageTitle = 'Lobby';
		this.isLobby = true;
		this.roomChanged.next({title: this.pageTitle, isLobby: this.isLobby});
	}
	
	changeToRoom(room: string)
	{
		this.pageTitle = room + ' Table';
		this.isLobby = false;
		this.roomChanged.next({title: this.pageTitle, isLobby: this.isLobby});
	}
}
