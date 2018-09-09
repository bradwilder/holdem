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

describe('comparing', () =>
{
	it('should compare pairs', () =>
	{
		let pair1 = Pair([3, 12, 7, 4]);
		let pair2 = Pair([9, 12, 7, 4]);
		expect(pair1.compare(pair2)).toBeLessThan(0);
	});
	
	it('should compare different ranks', () =>
	{
		let pair = Pair([3, 12, 7, 4]);
		let straight = Straight(9);
		expect(pair.compare(straight)).toBeLessThan(0);
	});
});
