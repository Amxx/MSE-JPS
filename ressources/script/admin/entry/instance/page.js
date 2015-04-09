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

// ==================================== DOM ====================================
Page.prototype.insertDOM = function(front)
{
	var instance = this;
	var block = $('<li/>')
			.attr('id', 'page_'+instance.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				// .click(function(){ pressEditPage(instance.id); })
				.text(instance.title)
			)
			.append($('<a/>')
				.addClass('pointer')
				.click(function(){ viewPage(instance.id); })
				.text('\u25B6')
			);
	if (front)
		$('section.pages .sortable').prepend(block);
	else
		$('section.pages .sortable').append(block);
}
Page.prototype.updateDOM = function()
{
	var instance = this;
	$('section.pages .sortable li')
		.filter(function(){ return $(this).attr('id') == 'page_'+instance.id; })
		.find('a.title')
		.text(instance.title);
}
Page.prototype.deleteDOM = function()
{
	var instance = this;
	$('section.pages .sortable li')
		.filter(function(){ return $(this).attr('id') == 'page_'+instance.id; })
		.remove();
}
