let Deck = require('../../game/deck');

const deck = Deck();
deck.shuffle();

for (let i = 0; i < 52; i++)
{
	console.log(deck.deal());
}