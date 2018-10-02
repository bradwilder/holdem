import { Component, OnInit, Input } from '@angular/core';

@Component
({
	selector: 'app-best-hand',
	templateUrl: './best-hand.component.html',
	styleUrls: ['./best-hand.component.css']
})
export class BestHandComponent
{
	@Input() bestHand: string;
}
