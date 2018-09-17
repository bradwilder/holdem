import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SocketService } from './socket.service';
import { GameState } from './game-state.model';

@Injectable()
export class GameStateService implements OnDestroy
{
	private gameState: GameState;
	gameStateChanged = new Subject<GameState>();
	
	constructor(private socketService: SocketService)
	{
		this.socketService.getSocket().on('gameState', (gameState) =>
		{
			this.gameState = gameState;
			this.gameStateChanged.next(this.gameState);
		});
	}
	
	getGameState()
	{
		return this.gameState;
	}
	
	ngOnDestroy()
	{
		this.socketService.getSocket().off('gameState');
	}
}
