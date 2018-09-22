let HandFactory = require('../../../game/hand/handFactory');
let Card = require('../../../game/card');

describe('creating with holes', () =>
{
	it('should create a flush', () =>
	{
		let boardCards =
		[
			Card(4),
			Card(0),
			Card(2),
			Card(45),
			Card(5)
		];
		
		let holeCards =
		[
			Card(8),
			Card(25)
		];
		// 0/4, 0/0, 0/2, 3/6, 0/5, 0/8, 1/12
		
		let hand = HandFactory().createHandWithHoles(boardCards, holeCards);
		expect(hand).not.toBe(null);
		expect(hand.getRank().getRank()).toBe(5);
		expect(hand.getValue(0)).toBe(8);
		expect(hand.getValue(1)).toBe(5);
		expect(hand.getValue(2)).toBe(4);
		expect(hand.getValue(3)).toBe(2);
		expect(hand.getValue(4)).toBe(0);
	});
	
	it('should create a flush with too many of the same suit', () =>
	{
		let boardCards =
		[
			Card(17),
			Card(13),
			Card(15),
			Card(20),
			Card(18)
		];
		
		let holeCards =
		[
			Card(21),
			Card(24)
		];
		// 1/4, 1/0, 1/2, 1/7, 1/5, 1/8, 1/11
		
		let hand = HandFactory().createHandWithHoles(boardCards, holeCards);
		expect(hand).not.toBe(null);
		expect(hand.getRank().getRank()).toBe(5);
		expect(hand.getValue(0)).toBe(11);
		expect(hand.getValue(1)).toBe(8);
		expect(hand.getValue(2)).toBe(7);
		expect(hand.getValue(3)).toBe(5);
		expect(hand.getValue(4)).toBe(4);
	});
	
	it('should create a flush instead of a straight', () =>
	{
		let boardCards =
		[
			Card(4),
			Card(3),
			Card(2),
			Card(45),
			Card(5)
		];
		
		let holeCards =
		[
			Card(8),
			Card(25)
		];
		// 0/4, 0/3, 0/2, 3/6, 0/5, 0/8, 1/12
		
		let hand = HandFactory().createHandWithHoles(boardCards, holeCards);
		expect(hand).not.toBe(null);
		expect(hand.getRank().getRank()).toBe(5);
		expect(hand.getValue(0)).toBe(8);
		expect(hand.getValue(1)).toBe(5);
		expect(hand.getValue(2)).toBe(4);
		expect(hand.getValue(3)).toBe(3);
		expect(hand.getValue(4)).toBe(2);
	});
	
	it('should create a straight flush', () =>
	{
		let boardCards =
		[
			Card(4),
			Card(3),
			Card(25),
			Card(6),
			Card(5)
		];
		
		let holeCards =
		[
			Card(8),
			Card(2)
		];
		// 0/4, 0/3, 1/12, 0/6, 0/5, 0/8, 0/2
		
		let hand = HandFactory().createHandWithHoles(boardCards, holeCards);
		expect(hand).not.toBe(null);
		expect(hand.getRank().getRank()).toBe(8);
		expect(hand.getHighValue()).toBe(6);
	});
	
	it('should create a full house', () =>
	{
		let boardCards =
		[
			Card(4),
			Card(45),
			Card(19),
			Card(23),
			Card(6)
		];
		
		let holeCards =
		[
			Card(30),
			Card(11)
		];
		// 0/4, 3/6, 1/6, 1/10, 0/6, 2/4, 0/11
		
		let hand = HandFactory().createHandWithHoles(boardCards, holeCards);
		expect(hand).not.toBe(null);
		expect(hand.getRank().getRank()).toBe(6);
		expect(hand.getThreeKindValue()).toBe(6);
		expect(hand.getPairValue(1)).toBe(4);
	});
	
	it('should create a full house with 2 three of a kinds', () =>
	{
		let boardCards =
		[
			Card(4),
			Card(45),
			Card(19),
			Card(23),
			Card(6)
		];
		
		let holeCards =
		[
			Card(30),
			Card(4)
		];
		// 0/4, 3/6, 1/6, 1/10, 0/6, 2/4, 0/4
		
		let hand = HandFactory().createHandWithHoles(boardCards, holeCards);
		expect(hand).not.toBe(null);
		expect(hand.getRank().getRank()).toBe(6);
		expect(hand.getThreeKindValue()).toBe(6);
		expect(hand.getPairValue(1)).toBe(4);
	});
	
	it('should create a three of a kind', () =>
	{
		let boardCards =
		[
			Card(19),
			Card(38),
			Card(51),
			Card(26),
			Card(25)
		];
		
		let holeCards =
		[
			Card(20),
			Card(17)
		];
		// 1/6, 2/12, 3/12, 2/0, 1/12, 1/7, 1/4
		
		let hand = HandFactory().createHandWithHoles(boardCards, holeCards);
		expect(hand).not.toBe(null);
		expect(hand.getRank().getRank()).toBe(3);
		expect(hand.getThreeKindValue()).toBe(12);
		expect(hand.getKicker(0)).toBe(7);
		expect(hand.getKicker(1)).toBe(6);
	});
	
	it('should create a straight using ace-low (Ace - 5)', () =>
	{
		let boardCards =
		[
			Card(38),
			Card(16),
			Card(8),
			Card(2),
			Card(13)
		];
		
		let holeCards =
		[
			Card(35),
			Card(40)
		];
		// 2/12, 1/3, 0/12, 0/2, 1/0, 2/9, 3/1
		
		let hand = HandFactory().createHandWithHoles(boardCards, holeCards);
		expect(hand).not.toBe(null);
		expect(hand.getRank().getRank()).toBe(4);
		expect(hand.getHighValue()).toBe(3);
	});
	
	it('should create a straight', () =>
	{
		let boardCards =
		[
			Card(33),
			Card(23),
			Card(8),
			Card(10),
			Card(19)
		];
		
		let holeCards =
		[
			Card(35),
			Card(49)
		];
		// 2/7, 1/10, 0/8, 0/10, 1/6, 2/9, 3/10
		
		let hand = HandFactory().createHandWithHoles(boardCards, holeCards);
		expect(hand).not.toBe(null);
		expect(hand.getRank().getRank()).toBe(4);
		expect(hand.getHighValue()).toBe(10);
	});
	
	it('should create a four of a kind', () =>
	{
		let boardCards =
		[
			Card(33),
			Card(23),
			Card(8),
			Card(10),
			Card(36)
		];
		
		let holeCards =
		[
			Card(35),
			Card(49)
		];
		// 2/7, 1/10, 0/8, 0/10, 2/10, 2/9, 3/10
		
		let hand = HandFactory().createHandWithHoles(boardCards, holeCards);
		expect(hand).not.toBe(null);
		expect(hand.getRank().getRank()).toBe(7);
		expect(hand.getFourKindValue()).toBe(10);
		expect(hand.getKicker()).toBe(9);
	});
	
	it('should create a high card', () =>
	{
		let boardCards =
		[
			Card(7),
			Card(5),
			Card(8),
			Card(0),
			Card(14)
		];
		
		let holeCards =
		[
			Card(35),
			Card(49)
		];
		// 0/7, 0/5, 0/8, 0/0, 1/1, 2/9, 3/10
		
		let hand = HandFactory().createHandWithHoles(boardCards, holeCards);
		expect(hand).not.toBe(null);
		expect(hand.getRank().getRank()).toBe(0);
		expect(hand.getValue(0)).toBe(10);
		expect(hand.getValue(1)).toBe(9);
		expect(hand.getValue(2)).toBe(8);
		expect(hand.getValue(3)).toBe(7);
		expect(hand.getValue(4)).toBe(5);
	});
	
	it('should create a pair', () =>
	{
		let boardCards =
		[
			Card(7),
			Card(5),
			Card(8),
			Card(0),
			Card(20)
		];
		
		let holeCards =
		[
			Card(35),
			Card(49)
		];
		// 0/7, 0/5, 0/8, 0/0, 1/7, 2/9, 3/10
		
		let hand = HandFactory().createHandWithHoles(boardCards, holeCards);
		expect(hand).not.toBe(null);
		expect(hand.getRank().getRank()).toBe(1);
		expect(hand.getPairValue()).toBe(7);
		expect(hand.getKicker(0)).toBe(10);
		expect(hand.getKicker(1)).toBe(9);
		expect(hand.getKicker(2)).toBe(8);
	});
	
	it('should create a two pair', () =>
	{
		let boardCards =
		[
			Card(7),
			Card(5),
			Card(8),
			Card(10),
			Card(20)
		];
		
		let holeCards =
		[
			Card(34),
			Card(49)
		];
		// 0/7, 0/5, 0/8, 0/10, 1/7, 2/8, 3/10
		
		let hand = HandFactory().createHandWithHoles(boardCards, holeCards);
		expect(hand).not.toBe(null);
		expect(hand.getRank().getRank()).toBe(2);
		expect(hand.getPairValue(0)).toBe(10);
		expect(hand.getPairValue(1)).toBe(8);
		expect(hand.getKicker()).toBe(7);
	});	
});
