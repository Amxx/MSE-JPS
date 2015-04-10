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

// ============================= Object Definition =============================
function Source()
{
	Entry.apply(this);
	this.id          = null;
	this.referenceID = null;
	this.title       = '';
	this.url         = '';
	this.order       = 0;
}
Source.prototype = new Entry();
Source.prototype = new Source();

// ================================== Parsing ==================================
Source.prototype.parse = function(sql)
{
	this.id          = sql.Source_ID;
	this.referenceID = sql.Reference_ID;
	this.title       = sql.Source_Title;
	this.url         = sql.Source_Url;
	this.order       = parseInt(sql.Source_Order);
}

// ================================== Methods ==================================
Source.prototype.descrition = function()
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
Source.prototype.insertDOM = function(front)
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
				.click(function(){ pressEditSource(self.id); })
				.text(self.descrition())
			)
			.append($('<a/>')
				.addClass('pointer')
				.click(function(){ pressDeleteSource(self.id); })
				.text('\u2716')
			);
	if (front)
		$('.tray.reference .sortable').prepend(block);
	else
		$('.tray.reference .sortable').append(block);
}
Source.prototype.updateDOM = function()
{
	var self = this;
	$('.tray.reference .sortable li')
		.filter(function(){ return $(this).attr('id') == 'source_'+self.id; })
		.find('a.title')
		.text(self.descrition());
}
Source.prototype.deleteDOM = function()
{
	var self = this;
	$('.tray.reference .sortable li')
		.filter(function(){ return $(this).attr('id') == 'source_'+self.id; })
		.remove();
}