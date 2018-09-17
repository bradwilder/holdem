import { Component, Input } from '@angular/core';

@Component
({
	selector: 'app-next-action',
	templateUrl: './next-action.component.html',
	styleUrls: ['./next-action.component.scss']
})
export class NextActionComponent
{
	@Input() action: {call: number, minRaise: number, maxRaise: number} = {call: 50, minRaise: 100, maxRaise: 200};
	
	getFormattedValue(value: number): string
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
