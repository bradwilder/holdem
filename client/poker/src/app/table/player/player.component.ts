import { Component, Input } from '@angular/core';
import { Player } from './player.model';
import { SocketService } from '../../socket.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

@Component
({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss']
})
export class PlayerComponent
{
	@Input() player: Player;
	@Input() position: number;
	@Input() currentPlayer: Player;
	
	private roomID: number;
	private routeSubscription: Subscription;
	
	constructor(private route: ActivatedRoute, private socketService: SocketService) {}
	
	ngOnInit()
	{
		this.routeSubscription = this.route.params.subscribe(params =>
		{
			this.roomID = +params['id'];
		});
	}
	
	onJoinTable()
	{
		this.socketService.getSocket().emit('joinTable', this.roomID, this.position);
	}
	
	ngOnDestroy()
	{
		this.routeSubscription.unsubscribe();
	}
}
