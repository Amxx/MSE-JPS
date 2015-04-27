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
MSE_JPS.entry.Link = function()
{
	MSE_JPS.entry.Entry.apply(this);
	this.id      = null;
	this.title   = '';
	this.content = '';
	this.order   = 0;
}
MSE_JPS.entry.Link.prototype = new MSE_JPS.entry.Entry();
MSE_JPS.entry.Link.prototype = new MSE_JPS.entry.Link();

// ================================== Parsing ==================================
MSE_JPS.entry.Link.prototype.parse = function(sql)
{
	this.id      = sql.Link_ID;
	this.title   = sql.Link_Title;
	this.content = sql.Link_Content;
	this.order   = parseInt(sql.Link_Order);
}

// =================================== Tray ====================================
MSE_JPS.entry.Link.prototype.setTray = function()
{
	var self = this;
	$('#input_link_title'  ).val(self.title);
	$('#input_link_content').val(self.content);
}
MSE_JPS.entry.Link.prototype.getTray = function()
{
	var self = this;
	self.title   = $('#input_link_title'  ).val();
	self.content = $('#input_link_content').val();
}

// ==================================== DOM ====================================
MSE_JPS.entry.Link.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'link_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ MSE_JPS.listeners.link.edit(self.id); })
				.text(self.title)
			);
	if (front)
		$('section.links .sortable').prepend(block);
	else
		$('section.links .sortable').append(block);
}
MSE_JPS.entry.Link.prototype.updateDOM = function()
{
	var self = this;
	$('section.links .sortable li')
		.filter(function(){ return $(this).attr('id') == 'link_'+self.id; })
		.find('a.title')
		.text(self.title);
}
MSE_JPS.entry.Link.prototype.deleteDOM = function()
{
	var self = this;
	$('section.links .sortable li')
		.filter(function(){ return $(this).attr('id') == 'link_'+self.id; })
		.remove();
}