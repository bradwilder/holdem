let LinkedHashMap = () =>
{
	let map = {};
	let head = null;
	let tail = null;
	let length = 0;
	
	const self =
	{
		get: (key) =>
		{
			let item = map[key.getName()];
			return item ? item.value : null;
		},
		set: (key, value) =>
		{
			if (!self.contains(key))
			{
				let item =
				{
					key: key,
					value: value,
					prev: tail,
					next: null
				};
				
				if (tail)
				{
					tail.next = item;
					tail = item;
				}
				else
				{
					tail = item;
					head = item;
				}
				
				length++;
				map[key.getName()] = item;
			}
			else
			{
				let item = map[key.getName()];
				item.value = value;
			}
		},
		remove: (key) =>
		{
			if (self.contains(key))
			{
				let item = map[key.getName()];
				
				if (item.prev)
				{
					item.prev.next = item.next;
				}
				else
				{
					head = item.next;
				}
				
				if (item.next)
				{
					item.next.prev = item.prev;
				}
				else
				{
					tail = item.prev;
				}
				
				delete map[key.getName()];
				length--;
			}
		},
		getIterator: () => head,
		itemSet: () =>
		{
			let items = [];
			let item = head;
			while (item)
			{
				items.push({key: item.key, value: item.value});
				item = item.next;
			}
			
			return items;
		},
		keySet: () =>
		{
			let keys = [];
			let item = head;
			while (item)
			{
				keys.push(item.key);
				item = item.next;
			}
			
			return keys;
		},
		contains: (key) => map.hasOwnProperty(key.getName()),
		size: () => length
	}
	
	return self;
}

module.exports = LinkedHashMap;
