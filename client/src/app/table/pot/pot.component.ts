import { Component, Input } from '@angular/core';

@Component
({
	selector: 'app-pot',
	templateUrl: './pot.component.html',
	styleUrls: ['./pot.component.scss']
})
export class PotComponent
{
	@Input() potSize: number;
}
