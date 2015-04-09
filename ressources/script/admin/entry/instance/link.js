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
function Link()
{
	Entry.apply(this);
	this.id      = null;
	this.title   = '';
	this.content = '';
	this.order   = 0;
}
Link.prototype = new Entry();

// ================================== Parsing ==================================
Link.prototype.parse = function(sql)
{
	this.id      = sql.Link_ID;
	this.title   = sql.Link_Title;
	this.content = sql.Link_Content;
	this.order   = parseInt(sql.Link_Order);
}

// ==================================== DOM ====================================
Link.prototype.insertDOM = function(front)
{
	var instance = this;
	var block = $('<li/>')
			.attr('id', 'link_'+instance.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				// .click(function(){ pressEditPage(pageOBJ.id); })
				.text(instance.title)
			);
	if (front)
		$('section.links .sortable').prepend(block);
	else
		$('section.links .sortable').append(block);
}
Link.prototype.updateDOM = function()
{
	var instance = this;
	$('section.links .sortable li')
		.filter(function(){ return $(this).attr('id') == 'link_'+instance.id; })
		.find('a.title')
		.text(instance.title);
}
Link.prototype.deleteDOM = function()
{
	var instance = this;
	$('section.links .sortable li')
		.filter(function(){ return $(this).attr('id') == 'link_'+instance.id; })
		.remove();
}