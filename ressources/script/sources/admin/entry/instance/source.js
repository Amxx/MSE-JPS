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

// ============================= Object Definition =============================
MSE_JPS.entry.Source = function()
{
	MSE_JPS.entry.Entry.apply(this);
	this.id          = null;
	this.referenceID = null;
	this.title       = '';
	this.url         = '';
	this.order       = 0;
}
MSE_JPS.entry.Source.prototype = new MSE_JPS.entry.Entry();
MSE_JPS.entry.Source.prototype = new MSE_JPS.entry.Source();

// ================================== Parsing ==================================
MSE_JPS.entry.Source.prototype.parse = function(sql)
{
	this.id          = sql.Source_ID;
	this.referenceID = sql.Reference_ID;
	this.title       = sql.Source_Title;
	this.url         = sql.Source_Url;
	this.order       = parseInt(sql.Source_Order);
}

// ================================== Methods ==================================
MSE_JPS.entry.Source.prototype.descrition = function()
{
	var self   = this;
	var length = self.url.length;
	if (length < 63)
		var url = self.url;
	else
		var url = self.url.substring(0, 30)+'...'+self.url.substring(length-30, length);

	return '['+self.title+'] '+url;
}

// ==================================== DOM ====================================
MSE_JPS.entry.Source.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'source_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ MSE_JPS.listeners.source.edit(self.id); })
				.text(self.descrition())
			)
			.append($('<a/>')
				.addClass('pointer')
				.click(function(){ MSE_JPS.listeners.source.delete(self.id); })
				.text('\u2716')
			);
	if (front)
		$('.tray.reference .sortable').prepend(block);
	else
		$('.tray.reference .sortable').append(block);
}
MSE_JPS.entry.Source.prototype.updateDOM = function()
{
	var self = this;
	$('.tray.reference .sortable li')
		.filter(function(){ return $(this).attr('id') == 'source_'+self.id; })
		.find('a.title')
		.text(self.descrition());
}
MSE_JPS.entry.Source.prototype.deleteDOM = function()
{
	var self = this;
	$('.tray.reference .sortable li')
		.filter(function(){ return $(this).attr('id') == 'source_'+self.id; })
		.remove();
}