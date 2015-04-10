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

function Entry(){}

Entry.prototype.post = function(){
	var properties = {};
	for (var prop in this)
		if (typeof this[prop] !== 'function')
			properties[prop] = this[prop];
	return properties;
}