import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component
({
	selector: 'app-lobby',
	templateUrl: './lobby.component.html',
	styleUrls: ['./lobby.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LobbyComponent implements OnInit
{
	private tables: {name: string, isSimulation: boolean, bigBlind: number, maxPlayers: number}[] =
	[
		{
			name: "10-handed",
			isSimulation: false,
			bigBlind: 20,
			maxPlayers: 10
		},
		{
			name: "Simulation",
			isSimulation: true,
			bigBlind: 0,
			maxPlayers: 10
		}
	];
	
	rowClick(table: {name: string, isSimulation: boolean, bigBlind: number, maxPlayers: number})
	{
		//console.log(table);
		if (table.isSimulation)
		{
			
		}
		else
		{
			
		}
	}
	
	ngOnInit()
	{
		//console.log(io);
		let socket = io('http://localhost:8080');
		/*socket.on('connect', () =>
		{
			
		});
		socket.on('event', (data) =>
		{
			
		});
		socket.on('disconnect', () =>
		{
			
		});*/
	}
}
