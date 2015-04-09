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
function Social()
{
	Entry.apply(this);
	this.id    = null;
	this.title = '';
	this.img   = '';
	this.url   = '';
	this.order = 0;
}
Social.prototype = new Entry();

// ================================== Parsing ==================================
Social.prototype.parse = function(sql)
{
	this.id    = sql.Social_ID;
	this.title = sql.Social_Title;
	this.img   = sql.Social_Img;
	this.url   = sql.Social_Url;
	this.order = parseInt(sql.Social_Order);
}

// ==================================== DOM ====================================
Social.prototype.insertDOM = function(front)
{
	var instance = this;
	var block = $('<li/>')
			.attr('id', 'social_'+instance.id)
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
		$('section.socials .sortable').prepend(block);
	else
		$('section.socials .sortable').append(block);
}
Social.prototype.updateDOM = function()
{
	var instance = this;
	$('section.socials .sortable li')
		.filter(function(){ return $(this).attr('id') == 'social_'+instance.id; })
		.find('a.title')
		.text(instance.title);
}
Social.prototype.deleteDOM = function()
{
	var instance = this;
	$('section.socials .sortable li')
		.filter(function(){ return $(this).attr('id') == 'social_'+instance.id; })
		.remove();
}