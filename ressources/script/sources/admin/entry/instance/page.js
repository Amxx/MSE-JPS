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
MSE_JPS.entry.Page = function()
{
	MSE_JPS.entry.Entry.apply(this);
	this.id         = null;
	this.title      = '';
	this.style      = '';
	this.bordered   = false;
	this.expandable = false;
	this.order      = 0;
}
MSE_JPS.entry.Page.prototype = new MSE_JPS.entry.Entry();
MSE_JPS.entry.Page.prototype = new MSE_JPS.entry.Page();

// ================================== Parsing ==================================
MSE_JPS.entry.Page.prototype.parse = function(sql)
{
	this.id         = sql.Page_ID;
	this.title      = sql.Page_Title;
	this.style			= sql.Page_Style;
	this.bordered		= parseInt(sql.Page_Bordered);
	this.expandable	= parseInt(sql.Page_Expandable);
	this.order			= parseInt(sql.Page_Order);
}

// =================================== Tray ====================================
MSE_JPS.entry.Page.prototype.setTray = function()
{
	var self = this;
	$('#input_page_title'     ).val(self.title);
	$('#input_page_style'     ).val(self.style);
	$('#input_page_expendable').prop('checked', self.expandable);
	$('#input_page_bordered'  ).prop('checked', self.bordered);
}
MSE_JPS.entry.Page.prototype.getTray = function()
{
	var self = this;
	self.title      = $('#input_page_title'     ).val();
	self.style      = $('#input_page_style'     ).val();
	self.expandable = $('#input_page_expendable').prop('checked');
	self.bordered   = $('#input_page_bordered'  ).prop('checked');
}

// ==================================== DOM ====================================
MSE_JPS.entry.Page.prototype.insertDOM = function(front)
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
				.click(function(){ MSE_JPS.listeners.page.edit(self.id); })
				.text(self.title)
			)
			.append($('<a/>')
				.addClass('pointer')
				.click(function(){ MSE_JPS.tools.viewPage(self.id); })
				.text('\u25B6')
			);
	if (front)
		$('section.pages .sortable').prepend(block);
	else
		$('section.pages .sortable').append(block);
}
MSE_JPS.entry.Page.prototype.updateDOM = function()
{
	var self = this;
	$('section.pages .sortable li')
		.filter(function(){ return $(this).attr('id') == 'page_'+self.id; })
		.find('a.title')
		.text(self.title);
}
MSE_JPS.entry.Page.prototype.deleteDOM = function()
{
	var self = this;
	$('section.pages .sortable li')
		.filter(function(){ return $(this).attr('id') == 'page_'+self.id; })
		.remove();
}
