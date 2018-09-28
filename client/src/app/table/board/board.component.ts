import { Component, Input } from '@angular/core';

@Component
({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss']
})
export class BoardComponent
{
	@Input() cards: number[];
	@Input() winningCards: number[];
}
