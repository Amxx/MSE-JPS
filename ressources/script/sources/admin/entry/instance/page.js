/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 1.2.0-1 : 06/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

// ============================= Object Definition =============================
function Page()
{
	Entry.apply(this);
	this.id         = null;
	this.title      = '';
	this.style      = '';
	this.bordered   = false;
	this.expandable = false;
	this.order      = 0;
}
Page.prototype = new Entry();
Page.prototype = new Page();

// ================================== Parsing ==================================
Page.prototype.parse = function(sql)
{
	this.id         = sql.Page_ID;
	this.title      = sql.Page_Title;
	this.style			= sql.Page_Style;
	this.bordered		= parseInt(sql.Page_Bordered);
	this.expandable	= parseInt(sql.Page_Expandable);
	this.order			= parseInt(sql.Page_Order);
}

// =================================== Tray ====================================
Page.prototype.setTray = function()
{
	var self = this;
	$('.tray.page #input_page_title'     ).val(self.title);
	$('.tray.page #input_page_style'     ).val(self.style);
	$('.tray.page #input_page_expendable').prop('checked', self.expandable);
	$('.tray.page #input_page_bordered'  ).prop('checked', self.bordered);
}
Page.prototype.getTray = function()
{
	var self = this;
	self.title      = $('.tray.page #input_page_title'     ).val();
	self.style      = $('.tray.page #input_page_style'     ).val();
	self.expandable = $('.tray.page #input_page_expendable').prop('checked');
	self.bordered   = $('.tray.page #input_page_bordered'  ).prop('checked');
}

// ==================================== DOM ====================================
Page.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'page_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ pressEditPage(self.id); })
				.text(self.title)
			)
			.append($('<a/>')
				.addClass('pointer')
				.click(function(){ viewPage(self.id); })
				.text('\u25B6')
			);
	if (front)
		$('section.pages .sortable').prepend(block);
	else
		$('section.pages .sortable').append(block);
}
Page.prototype.updateDOM = function()
{
	var self = this;
	$('section.pages .sortable li')
		.filter(function(){ return $(this).attr('id') == 'page_'+self.id; })
		.find('a.title')
		.text(self.title);
}
Page.prototype.deleteDOM = function()
{
	var self = this;
	$('section.pages .sortable li')
		.filter(function(){ return $(this).attr('id') == 'page_'+self.id; })
		.remove();
}
