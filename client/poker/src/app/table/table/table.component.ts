import { Component, OnInit } from '@angular/core';
import { Player } from '../player/player.model';
import { RaiseAction } from '../player/player-action/raise-action.model';
import { CallAction } from '../player/player-action/call-action.model';
import { CheckAction } from '../player/player-action/check-action.model';
import { FoldAction } from '../player/player-action/fold-action.model';

@Component
({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit
{
	private player0: Player = new Player('Ted', 25000);
	private player1: Player = new Player('Poon dog', 25000);
	private player2: Player = new Player('player2', 25000);
	private player3: Player = new Player('Dodgers fan', 25000);
	private player4: Player = new Player('Seth', 25000);
	private player5: Player = new Player('Jose', 25000);
	private player6: Player = new Player('Sally', 25000);
	private player7: Player = new Player('mandy', 25000);
	private player8: Player = new Player('mark', 25000);
	private player9: Player = new Player('cheech', 25000);
	
	ngOnInit()
	{
		this.player0.isInHand = true;
		this.player2.isInHand = true;
		this.player3.isInHand = true;
		this.player5.isInHand = true;
		this.player6.isInHand = true;
		this.player8.isInHand = true;
		
		this.player1.isSittingOut = true;
		
		this.player0.playerAction = new RaiseAction(50);
		this.player2.playerAction = new CallAction(50);
		this.player3.playerAction = new CheckAction();
		this.player4.playerAction = new FoldAction();
	}
}
