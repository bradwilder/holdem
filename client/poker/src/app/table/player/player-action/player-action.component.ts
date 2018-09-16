import { Component, Input } from '@angular/core';
import { OngoingRoundAction } from './ongoing-round-action.model';

@Component
({
	selector: 'app-player-action',
	templateUrl: './player-action.component.html',
	styleUrls: ['./player-action.component.scss']
})
export class PlayerActionComponent
{
	@Input() ongoingRoundAction: OngoingRoundAction;
}
