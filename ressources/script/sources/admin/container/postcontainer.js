/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.1.0-0 : 27/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

var MSE_JPS = MSE_JPS || {};
MSE_JPS.container = MSE_JPS.container || {};

/******************************************************************************
 *                               POST Container                               *
 ******************************************************************************/

MSE_JPS.container.POSTContainer = function(params)
{
	MSE_JPS.container.Container.apply(this);
	for (var prop in params)
		this[prop] = params[prop];
}

// ---------------------------------- Methods ----------------------------------
MSE_JPS.container.POSTContainer.prototype = new MSE_JPS.container.Container();
MSE_JPS.container.POSTContainer.prototype.select = function()
{
	var self = this;
	var popup = MSE_JPS.popup.open().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: MSE_JPS.token, QUERY: self.query_select }, function(data){
		if (data.values) // Sanity
		for (entry of data.values)
		{
			var obj = new self.allocator();
			obj.parse(entry);
			self.set(obj);
		}
		MSE_JPS.popup.close(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}
MSE_JPS.container.POSTContainer.prototype.insert = function(obj)
{
	var self = this;
	var popup = MSE_JPS.popup.open().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: MSE_JPS.token, QUERY: self.query_insert, object: obj.post() }, function(data){
		obj.id = data.id;
		self.set(obj);
		MSE_JPS.popup.close(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}
MSE_JPS.container.POSTContainer.prototype.update = function(obj)
{
	var self = this;
	var popup = MSE_JPS.popup.open().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: MSE_JPS.token, QUERY: self.query_update, object: obj.post() }, function(data){
		MSE_JPS.popup.close(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}
MSE_JPS.container.POSTContainer.prototype.delete = function(obj)
{
	var self = this;
	var popup = MSE_JPS.popup.open().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: MSE_JPS.token, QUERY: self.query_delete, object: obj.post() }, function(data){
		self.rem(obj);
		MSE_JPS.popup.close(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}
MSE_JPS.container.POSTContainer.prototype.reorder = function(idarray)
{
	var self = this;
	var popup = MSE_JPS.popup.open().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: MSE_JPS.token, QUERY: self.query_reorder, object: idarray }, function(data){
		for (var i in idarray)
			self.get(idarray[i]).order = i;
		MSE_JPS.popup.close(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}