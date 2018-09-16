import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService
{
	private socket;
	
	constructor()
	{
		let socketIOPort = 3000;
		let socketIOUrl = window.location.protocol + '//' + window.location.hostname + ':' + socketIOPort;
		this.socket = io(socketIOUrl);
	}
	
	getSocket()
	{
		return this.socket;
	}
}
