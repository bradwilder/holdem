import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from '../../socket.service';

@Component
({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy
{
	private roomID: number;
	private routeSubscription: Subscription;
	
	constructor(private route: ActivatedRoute, private socketService: SocketService) {}
	
	ngOnInit()
	{
		this.routeSubscription = this.route.params.subscribe(params =>
		{
			this.roomID = +params['id'];
			this.socketService.getSocket().emit('enterRoom', this.roomID);
			
			// TODO: for testing only!!!!!
			//this.socketService.getSocket().emit('joinTable', this.roomID);
		});
	}
	
	ngOnDestroy()
	{
		this.socketService.getSocket().emit('leaveRoom', this.roomID);
		this.routeSubscription.unsubscribe();
	}
}
