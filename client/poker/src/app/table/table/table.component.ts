import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player } from '../player/player.model';
// import { RaiseAction } from '../player/player-action/raise-action.model';
// import { CallAction } from '../player/player-action/call-action.model';
// import { CheckAction } from '../player/player-action/check-action.model';
// import { FoldAction } from '../player/player-action/fold-action.model';
import { GameStateService } from '../../game-state.service';

@Component
({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy
{
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
	
	constructor(private gameStateService: GameStateService) {}
	
	ngOnInit()
	{
		this.gameStateService.gameStateChanged.subscribe((gameState) =>
		{
			
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
		
		// this.player0.isInHand = false;
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
		// this.player7.holeCards = [19, 46];
		// this.player8.holeCards = [19, 46];
		// this.player9.holeCards = [19, 46];
		
		// this.player0.playerAction = new RaiseAction(50000);
		// this.player2.playerAction = new CallAction(50);
		// this.player4.playerAction = new CheckAction();
		// this.player7.playerAction = new FoldAction();
	}
	
	ngOnDestroy()
	{
		this.gameStateService.gameStateChanged.unsubscribe();
	}
}
