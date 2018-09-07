// let Hand = require('../../hand/hand');
// let HighCard = require('../../hand/highCard');
let Pair = require('../../hand/pair');
// let TwoPair = require('../../hand/twoPair');
// let ThreeOfAKind = require('../../hand/threeOfAKind');
// let Straight = require('../../hand/straight');
// let Flush = require('../../hand/flush');
// let FullHouse = require('../../hand/fullHouse');
// let FourOfAKind = require('../../hand/fourOfAKind');
// let StraightFlush = require('../../hand/straightFlush');

let pair1 = Pair(3, [12, 7, 4]);
let pair2 = Pair(9, [12, 7, 4]);

console.log(pair1);


console.log(pair1.compare(pair2));