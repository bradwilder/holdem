// let Hand = require('../../hand/hand');
// let HighCard = require('../../hand/highCard');
let Pair = require('../../hand/pair');
// let TwoPair = require('../../hand/twoPair');
// let ThreeOfAKind = require('../../hand/threeOfAKind');
 let Straight = require('../../hand/straight');
// let Flush = require('../../hand/flush');
// let FullHouse = require('../../hand/fullHouse');
// let FourOfAKind = require('../../hand/fourOfAKind');
// let StraightFlush = require('../../hand/straightFlush');

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
