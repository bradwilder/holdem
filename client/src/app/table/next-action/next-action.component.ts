import { Component, Input } from '@angular/core';
import { SocketService } from '../../socket.service';
import { NextAction } from './next-action.model';

@Component
({
	selector: 'app-next-action',
	templateUrl: './next-action.component.html',
	styleUrls: ['./next-action.component.scss']
})
export class NextActionComponent
{
	@Input() roomID: number;
	@Input() action: NextAction;
	@Input() bigBlind: number;
	private raiseAmount: number;
	private showingRaiseDialogue = false;
	
	constructor(private socketService: SocketService) {}
	
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
		this.socketService.getSocket().emit('tableAction', this.roomID, 'fold');
		this.showingRaiseDialogue = false;
	}
	
	checkClicked()
	{
		this.socketService.getSocket().emit('tableAction', this.roomID, 'check');
		this.showingRaiseDialogue = false;
	}
	
	callClicked()
	{
		this.socketService.getSocket().emit('tableAction', this.roomID, 'call');
		this.showingRaiseDialogue = false;
	}
	
	raiseClicked()
	{
		if (!this.showingRaiseDialogue)
		{
			this.raiseAmount = this.action.minRaise;
			if (this.action.minRaise === this.action.maxRaise)
			{
				this.socketService.getSocket().emit('tableAction', this.roomID, 'raise', this.raiseAmount);
			}
		}
		else
		{
			this.socketService.getSocket().emit('tableAction', this.roomID, 'raise', this.raiseAmount);
		}
		
		if (this.action.minRaise !== this.action.maxRaise)
		{
			this.showingRaiseDialogue = !this.showingRaiseDialogue;
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
