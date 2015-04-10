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
function Link()
{
	Entry.apply(this);
	this.id      = null;
	this.title   = '';
	this.content = '';
	this.order   = 0;
}
Link.prototype = new Entry();
Link.prototype = new Link();

// ================================== Parsing ==================================
Link.prototype.parse = function(sql)
{
	this.id      = sql.Link_ID;
	this.title   = sql.Link_Title;
	this.content = sql.Link_Content;
	this.order   = parseInt(sql.Link_Order);
}

// =================================== Tray ====================================
Link.prototype.setTray = function()
{
	var self = this;
	$('#input_link_title'  ).val(self.title);
	$('#input_link_content').val(self.content);
}
Link.prototype.getTray = function()
{
	var self = this;
	self.title   = $('#input_link_title'  ).val();
	self.content = $('#input_link_content').val();
}

// ==================================== DOM ====================================
Link.prototype.insertDOM = function(front)
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
				.click(function(){ pressEditLink(self.id); })
				.text(self.title)
			);
	if (front)
		$('section.links .sortable').prepend(block);
	else
		$('section.links .sortable').append(block);
}
Link.prototype.updateDOM = function()
{
	var self = this;
	$('section.links .sortable li')
		.filter(function(){ return $(this).attr('id') == 'link_'+self.id; })
		.find('a.title')
		.text(self.title);
}
Link.prototype.deleteDOM = function()
{
	var self = this;
	$('section.links .sortable li')
		.filter(function(){ return $(this).attr('id') == 'link_'+self.id; })
		.remove();
}