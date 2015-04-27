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
 *                                 Container                                  *
 ******************************************************************************/

MSE_JPS.container.Container = function()
{
	this.data = new Object();
}

// ---------------------------------- Methods ----------------------------------
MSE_JPS.container.Container.prototype.get = function(objID)
{
	return this.data[objID];
}
MSE_JPS.container.Container.prototype.set = function(obj)
{
	return this.data[obj.id] = obj;
}
MSE_JPS.container.Container.prototype.rem = function(obj)
{
	delete this.data[obj.id];
}
MSE_JPS.container.Container.prototype.size = function()
{
	return Object.keys(this.data).length;
}
MSE_JPS.container.Container.prototype.values = function()
{
	var self = this;
	return Object
		.keys(this.data)
		.map(function(key){ return self.get(key); });
}
MSE_JPS.container.Container.prototype.orderedValues = function()
{
	return this.values().sort(function(a,b){ return a.order > b.order; });
}