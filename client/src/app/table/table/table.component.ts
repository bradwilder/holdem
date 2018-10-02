import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Player } from '../player/player.model';
import { GameStateService } from '../../game-state.service';
import { NextAction } from '../next-action/next-action.model';
import { Room } from '../../room/room.model';
import { GameState } from '../../game-state.model';
import { Howl } from 'howler';

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
	
	private winningCards: number[];
	private bestHand: string;
	
	private timeout;
	
	constructor(private gameStateService: GameStateService) {}
	
	ngOnInit()
	{
		this.processGameState(this.gameStateService.getGameState());
		
		this.gameStateService.gameStateChanged.subscribe((gameState) =>
		{
			this.processGameState(gameState);
		});
	}
	
	private playAudioOnTimer(audioValues: string[], millis = 200)
	{
		if (this.timeout)
		{
			clearTimeout(this.timeout);
		}
		
		let i = 0;
		
		let playAudio = () =>
		{
			if (i < audioValues.length)
			{
				this.timeout = null;
				let sound = new Howl({src: ["./assets/sounds/" + audioValues[i] + ".mp3"]});
				sound.play();
				i++;
				this.timeout = setTimeout(() => playAudio(), millis);
			}
		}
		
		playAudio();
	}
	
	private processGameState(gameState: GameState)
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
			
			this.board = gameState.board ? gameState.board.map((card) => card.code) : [];
			
			this.potSize = gameState.potSize;
			
			this.nextAction = gameState.nextAction;
			this.nextActionPlayer = gameState.nextActionPlayer;
			
			this.bigBlind = gameState.bigBlind;
			
			this.winningCards = gameState.winnerState && gameState.winnerState.winningCards.length > 0 ? gameState.winnerState.winningCards.map((card) => card.code) : null;
			this.bestHand = gameState.winnerState ? gameState.winnerState.handDescription : null;
			
			if (gameState.lastAction.length > 0)
			{
				this.playAudioOnTimer(gameState.lastAction);
			}
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
		
		return spreadPlayers;
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
