import { Component, Input } from '@angular/core';
import { Player } from './player.model';
import { SocketService } from '../../socket.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { CurrentPlayerService } from '../../current-player.service';

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
	
	private roomID: number;
	private routeSubscription: Subscription;
	private currentPlayer: Player;
	private currentPlayerSubscription: Subscription;
	
	constructor(private route: ActivatedRoute, private socketService: SocketService, private currentPlayerService: CurrentPlayerService) {}
	
	ngOnInit()
	{
		this.routeSubscription = this.route.params.subscribe(params =>
		{
			this.roomID = +params['id'];
		});
		
		this.currentPlayerSubscription = this.currentPlayerService.currentPlayerChanged.subscribe((currentPlayer) =>
		{
			this.currentPlayer = currentPlayer;
		});
	}
	
	onJoinTable()
	{
		this.socketService.getSocket().emit('joinTable', this.roomID, this.position);
	}
	
	ngOnDestroy()
	{
		this.routeSubscription.unsubscribe();
		this.currentPlayerSubscription.unsubscribe();
	}
}