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
		
		// TODO: this is just for testing
		this.socket.on('event', (data) =>
		{
			console.log('on event', data);
		});
	}
	
	getSocket()
	{
		return this.socket;
	}
}
