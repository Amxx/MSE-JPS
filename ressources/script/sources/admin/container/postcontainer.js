/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

/******************************************************************************
 *                               POST Container                               *
 ******************************************************************************/
function POSTContainer(params)
{
	Container.apply(this);
	for (var prop in params)
		this[prop] = params[prop];
}
POSTContainer.prototype = new Container();
POSTContainer.prototype.select = function()
{
	var self = this;
	var popup = openPopup().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: token, QUERY: self.query_select }, function(data){
		if (data.values) // Sanity
		for (entry of data.values)
		{
			var obj = new self.allocator();
			obj.parse(entry);
			self.set(obj);
		}
		closePopup(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}
POSTContainer.prototype.insert = function(obj)
{
	var self = this;
	var popup = openPopup().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: token, QUERY: self.query_insert, object: obj.post() }, function(data){
		obj.id = data.id;
		self.set(obj);
		closePopup(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}
POSTContainer.prototype.update = function(obj)
{
	var self = this;
	var popup = openPopup().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: token, QUERY: self.query_update, object: obj.post() }, function(data){
		closePopup(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}
POSTContainer.prototype.delete = function(obj)
{
	var self = this;
	var popup = openPopup().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: token, QUERY: self.query_delete, object: obj.post() }, function(data){
		self.rem(obj);
		closePopup(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}
POSTContainer.prototype.reorder = function(idarray)
{
	var self = this;
	var popup = openPopup().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: token, QUERY: self.query_reorder, object: idarray }, function(data){
		for (var i in idarray)
			self.get(idarray[i]).order = i;
		closePopup(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}