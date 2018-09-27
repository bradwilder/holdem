import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Player } from '../player/player.model';
// import { OngoingRoundAction } from '../player/player-action/ongoing-round-action.model';
import { GameStateService } from '../../game-state.service';
import { NextAction } from '../next-action/next-action.model';
import { Room } from '../../room/room.model';
import { GameState } from '../../game-state.model';

@Component
({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
	providers: [GameStateService]
})
export class TableComponent implements OnInit, OnDestroy
{
	@Input() room: Room;
	
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
		
		// this.player0.hasHoleCards = true;
		// //this.player1.hasHoleCards = true;
		// this.player2.hasHoleCards = true;
		// //this.player3.hasHoleCards = true;
		// this.player4.hasHoleCards = true;
		// this.player5.hasHoleCards = true;
		// //this.player6.hasHoleCards = true;
		// this.player7.hasHoleCards = true;
		// this.player8.hasHoleCards = true;
		
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
	
	processGameState(gameState: GameState)
	{
		console.log(gameState);
		
		if (gameState && this.room)
		{
			let spreadPlayers = this.spreadPlayers(gameState);
			
			this.player0 = spreadPlayers[0];
			this.player1 = spreadPlayers[1];
			this.player2 = spreadPlayers[2];
			this.player3 = spreadPlayers[3];
			this.player4 = spreadPlayers[4];
			this.player5 = spreadPlayers[5];
			this.player6 = spreadPlayers[6];
			this.player7 = spreadPlayers[7];
			this.player8 = spreadPlayers[8];
			this.player9 = spreadPlayers[9];
			
			this.board = gameState.board;
			
			this.potSize = gameState.potSize;
			
			this.nextAction = gameState.nextAction;
			this.nextActionPlayer = gameState.nextActionPlayer;
			
			this.bigBlind = gameState.bigBlind;
			
			
			
		}
	}
	
	private spreadPlayers(gameState: GameState)
	{
		let spreadPlayers;
		switch (this.room.maxPlayers)
		{
			case 2:
				spreadPlayers = Array(10).fill(null);
				spreadPlayers[0] = gameState.players[0];
				spreadPlayers[5] = gameState.players[1];
				break;
			case 4:
				spreadPlayers = Array(10).fill(null);
				spreadPlayers[0] = gameState.players[0];
				spreadPlayers[3] = gameState.players[1];
				spreadPlayers[5] = gameState.players[2];
				spreadPlayers[7] = gameState.players[3];
				break;
			case 6:
				spreadPlayers = Array(10).fill(null);
				spreadPlayers[0] = gameState.players[0];
				spreadPlayers[2] = gameState.players[1];
				spreadPlayers[3] = gameState.players[2];
				spreadPlayers[5] = gameState.players[3];
				spreadPlayers[7] = gameState.players[4];
				spreadPlayers[8] = gameState.players[5];
				break;
			case 10:
				spreadPlayers = gameState.players;
				break;
		}
		
		let spreadDealerIndex = this.spreadServerIndex(gameState.dealerIndex);
		spreadPlayers[spreadDealerIndex].isDealer = true;
		
		return spreadPlayers;
	}
	
	private spreadServerIndex(serverIndex)
	{
		switch (this.room.maxPlayers)
		{
			case 2:
				switch (serverIndex)
				{
					case 0:
						return 0;
					case 1:
						return 5;
				}
				break;
			case 4:
			case 4:
				switch (serverIndex)
				{
					case 0:
						return 0;
					case 1:
						return 3;
					case 2:
						return 5;
					case 3:
						return 7;
				}
				break;
			case 6:
			case 6:
				switch (serverIndex)
				{
					case 0:
						return 0;
					case 1:
						return 2;
					case 2:
						return 3;
					case 3:
						return 5;
					case 4:
						return 7;
					case 5:
						return 8;
				}
				break;
			case 10:
				return serverIndex;
		}
	}
	
	private translatePosition(positionIndex: number)
	{
		if (this.room)
		{
			switch (this.room.maxPlayers)
			{
				case 2:
					switch (positionIndex)
					{
						case 0:
							return 0;
						case 5:
							return 1;
					}
					break;
				case 4:
					switch (positionIndex)
					{
						case 0:
							return 0;
						case 3:
							return 1;
						case 5:
							return 2;
						case 7:
							return 3;
					}
					break;
				case 6:
					switch (positionIndex)
					{
						case 0:
							return 0;
						case 2:
							return 1;
						case 3:
							return 2;
						case 5:
							return 3;
						case 7:
							return 4;
						case 8:
							return 5;
					}
					break;
				case 10:
					return positionIndex;
			}
		}
	}
	
	ngOnDestroy()
	{
		this.gameStateService.gameStateChanged.unsubscribe();
	}
}
