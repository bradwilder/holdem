// let Hand = require('../../../game/hand/hand');
// let HighCard = require('../../../game/hand/highCard');
let Pair = require('../../../game/hand/pair');
// let TwoPair = require('../../../game/hand/twoPair');
// let ThreeOfAKind = require('../../../game/hand/threeOfAKind');
 let Straight = require('../../../game/hand/straight');
// let Flush = require('../../../game/hand/flush');
// let FullHouse = require('../../../game/hand/fullHouse');
// let FourOfAKind = require('../../../game/hand/fourOfAKind');
// let StraightFlush = require('../../../game/hand/straightFlush');
let Card = require('../../../game/card');

describe('comparing', () =>
{
	it('should compare pairs', () =>
	{
		let cards1 =
		[
			Card(3),
			Card(16),
			Card(12),
			Card(7),
			Card(4)
		];
		
		let cards2 =
		[
			Card(9),
			Card(22),
			Card(12),
			Card(7),
			Card(4)
		];
		
		let pair1 = Pair(cards1);
		let pair2 = Pair(cards2);
		expect(pair1.compare(pair2)).toBeLessThan(0);
	});
	
	it('should compare different ranks', () =>
	{
		let pairCards =
		[
			Card(3),
			Card(16),
			Card(12),
			Card(7),
			Card(4)
		];
		
		let straightCards =
		[
			Card(9),
			Card(8),
			Card(19),
			Card(7),
			Card(5)
		];
		
		let pair = Pair(pairCards);
		let straight = Straight(straightCards);
		expect(pair.compare(straight)).toBeLessThan(0);
	});
});
