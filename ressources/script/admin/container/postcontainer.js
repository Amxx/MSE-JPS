/******************************************************************************
 *                               POST Container                               *
 ******************************************************************************/
function POSTContainer(params)
{
	Container.apply(this);
	this.target       = params.target;
	this.allocator    = params.allocator;
	this.query_select = params.query_select;
	this.query_insert = params.query_insert;
	this.query_update = params.query_update;
	this.query_delete = params.query_delete;
}
POSTContainer.prototype = new Container();
POSTContainer.prototype.select = function()
{
	var instance = this;
	return $.post(instance.target, { QUERY: instance.query_select }, function(data){
		if (data.values) // Sanity
		for (entry of data.values)
		{
			var obj = new instance.allocator();
			obj.parse(entry);
			instance.set(obj);
		}
	}, 'json');
}
POSTContainer.prototype.insert = function(obj)
{
	var instance = this;
	return $.post(instance.target, { QUERY: instance.query_insert, object: obj.post() }, function(data){
		obj.id = data.id;
		instance.set(obj);
	}, 'json');
}
POSTContainer.prototype.update = function(obj)
{
	var instance = this;
	return $.post(instance.target, { QUERY: instance.query_update, object: obj.post() }, function(data){
	}, 'json');
}
POSTContainer.prototype.delete = function(obj)
{
	var instance = this;
	return $.post(instance.target, { QUERY: instance.query_drop, object: obj.post() }, function(data){
		instance.rem(obj);
	}, 'json');
}