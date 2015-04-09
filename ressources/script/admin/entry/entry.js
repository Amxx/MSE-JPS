function Entry() {}
Entry.prototype.post = function() {
	var properties = {};
	for (var prop in this)
		if (typeof this[prop] !== 'function')
			properties[prop] = this[prop];
	return properties;
};
