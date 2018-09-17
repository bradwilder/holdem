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
	
	formatValue(value: number)
	{
		if (value >= 1000000)
		{
			let millions = Math.floor(value / 1000000);
			let hundredThousands = Math.floor((value % 1000) / 100);
			return millions + (hundredThousands > 0 ? ('.' + hundredThousands) : '') + 'm';
		}
		else if (value >= 1000)
		{
			let thousands = Math.floor(value / 1000);
			let hundreds = Math.floor((value % 1000) / 100);
			return thousands + (hundreds > 0 ? ('.' + hundreds) : '') + 'k';
		}
		else
		{
			return String(value);
		}
	}
}
