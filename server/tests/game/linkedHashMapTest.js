let LinkedHashMap = require('../../game/linkedHashMap');

let linkedMap = LinkedHashMap();

linkedMap.set({name: '0'}, 5);
//console.log(linkedMap.map);

linkedMap.set({name: '1'}, 3);
//console.log(linkedMap.map);

linkedMap.set({name: '2'}, 2);
//console.log(linkedMap.map);

linkedMap.set({name: '3'}, 1);
//console.log(linkedMap.map);

for (let iterator = linkedMap.getIterator(); iterator; iterator = iterator.next)
{
	console.log(iterator);
}