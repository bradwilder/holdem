import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Player } from '../player/player.model';
// import { OngoingRoundAction } from '../player/player-action/ongoing-round-action.model';
import { GameStateService } from '../../game-state.service';
import { NextAction } from '../next-action/next-action.model';

@Component
({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
	providers: [GameStateService]
})
export class TableComponent implements OnInit, OnDestroy
{
	@Input() roomID: number;
	
	private player0: Player;
	private player1: Player;
	private player2: Player;
	private player3: Player;
	private player4: Player;
	private player5: Player;
	private player6: Player;
	private player7: Player;
	private player8: Player;
	private player9: Player;
	
	private board: number[];
	
	private potSize: number;
	
	private nextAction: NextAction;
	private nextActionPlayer: Player;
	
	private bigBlind: number;
	
	constructor(private gameStateService: GameStateService) {}
	
	ngOnInit()
	{
		this.processGameState(this.gameStateService.getGameState());
		
		this.gameStateService.gameStateChanged.subscribe((gameState) =>
		{
			this.processGameState(gameState);
		});
		
				
		
		
		// this.player0 = new Player('Ted', 25000);
		// //this.player1 = new Player('Poon dog', 25000);
		// this.player2 = new Player('player2', 25000);
		// //this.player3 = new Player('Dodgers fan', 25000);
		// this.player4 = new Player('Seth', 25000);
		// this.player5 = new Player('Jose', 25000);
		// //this.player6 = new Player('Sally', 25000);
		// this.player7 = new Player('stupid', 333838);
		// this.player8 = new Player('mark', 25000);
		// this.player9 = new Player('cheech', 25000);
		
		// //this.currentPlayer = this.player0;
		
		// this.player0.isInHand = true;
		// //this.player1.isInHand = true;
		// this.player2.isInHand = true;
		// //this.player3.isInHand = true;
		// this.player4.isInHand = true;
		// this.player5.isInHand = true;
		// //this.player6.isInHand = true;
		// this.player7.isInHand = true;
		// this.player8.isInHand = true;
		
		// this.player0.isDealer = true;
		
		// this.player0.holeCards = [14, 26];
		// //this.player1.holeCards = [19, 46];
		// this.player2.holeCards = [19, 46];
		// //this.player3.holeCards = [19, 46];
		// this.player4.holeCards = [19, 46];
		// this.player5.holeCards = [19, 46];
		// //this.player6.holeCards = [19, 46];
		// //this.player7.holeCards = [19, 46];
		// //this.player8.holeCards = [19, 46];
		// //this.player9.holeCards = [19, 46];
		
		// this.player0.ongoingRoundAction = new OngoingRoundAction('raise', 499990);
		// this.player2.ongoingRoundAction = new OngoingRoundAction('call', 50);
		// this.player4.ongoingRoundAction = new OngoingRoundAction('check', 999999);
		// this.player5.ongoingRoundAction = new OngoingRoundAction('fold', 5350);
		// this.player7.ongoingRoundAction = new OngoingRoundAction('small-blind', 30);
	}
	
	processGameState(gameState)
	{
		console.log(gameState);
		
		if (gameState)
		{
			let players = gameState.players;
			
			this.player0 = players[0];
			this.player1 = players[1];
			this.player2 = players[2];
			this.player3 = players[3];
			this.player4 = players[4];
			this.player5 = players[5];
			this.player6 = players[6];
			this.player7 = players[7];
			this.player8 = players[8];
			this.player9 = players[9];
			
			this.board = gameState.board;
			
			this.potSize = gameState.potSize;
			
			this.nextAction = gameState.nextAction;
			this.nextActionPlayer = gameState.nextActionPlayer;
			
			this.bigBlind = gameState.bigBlind;
			
			
			
		}
	}
	
	ngOnDestroy()
	{
		this.gameStateService.gameStateChanged.unsubscribe();
	}
}
