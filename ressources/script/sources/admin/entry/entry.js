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
MSE_JPS.entry = MSE_JPS.entry || {};

/******************************************************************************
 *                                 Container                                  *
 ******************************************************************************/

MSE_JPS.entry.Entry = function(){}

MSE_JPS.entry.Entry.prototype.post = function(){
	var properties = {};
	for (var prop in this)
		if (typeof this[prop] !== 'function')
			properties[prop] = this[prop];
	return properties;
}