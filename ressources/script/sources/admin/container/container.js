/******************************************************************************
 *                                 Container                                  *
 ******************************************************************************/
function Container()
{
	this.data = new Object();
}
// ---------------------------------- Methods ----------------------------------
Container.prototype.get = function(objID)
{
	return this.data[objID];
}
Container.prototype.set = function(obj)
{
	return this.data[obj.id] = obj;
}
Container.prototype.rem = function(obj)
{
	delete this.data[obj.id];
}
Container.prototype.size = function()
{
	return Object.keys(this.data).length;
}
Container.prototype.values = function()
{
	return Object
		.keys(this.data)
		.map(key => this.data[key]);
}
Container.prototype.orderedValues = function()
{
	return this.values().sort((a,b) => a.order > b.order);
}