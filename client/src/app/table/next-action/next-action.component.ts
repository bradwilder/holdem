import { Component, Input } from '@angular/core';
import { NextAction } from './next-action.model';

@Component
({
	selector: 'app-next-action',
	templateUrl: './next-action.component.html',
	styleUrls: ['./next-action.component.scss']
})
export class NextActionComponent
{
	@Input() action: NextAction;
	@Input() bigBlind: number;
	private raiseAmount: number;
	private showingRaiseDialogue = false;
	
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
	
	foldClicked()
	{
		// TODO
		console.log('fold');
	}
	
	checkClicked()
	{
		// TODO
		console.log('check');
	}
	
	callClicked()
	{
		// TODO
		console.log('call');
	}
	
	raiseClicked()
	{
		if (!this.showingRaiseDialogue)
		{
			this.showingRaiseDialogue = true;
			this.raiseAmount = this.action.minRaise;
		}
		else
		{
			// TODO
			console.log('raise ' + this.raiseAmount);
		}
	}
	
	onRaiseIncrease()
	{
		this.raiseAmount += this.bigBlind;
		this.raiseAmount = Math.min(this.raiseAmount, this.action.maxRaise);
	}
	
	onRaiseDecrease()
	{
		this.raiseAmount -= this.bigBlind;
		this.raiseAmount = Math.max(this.raiseAmount, this.action.minRaise);
	}
}
