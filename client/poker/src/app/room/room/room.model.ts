export class Room
{
	id: number;
	name: string;
	bigBlind: number;
	players: number = 0;
	maxPlayers: number;
	
	constructor(id: number, name: string, bigBlind: number, maxPlayers: number)
	{
		this.id = id;
		this.name = name;
		this.bigBlind = bigBlind;
		this.maxPlayers = maxPlayers;
	}
}