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
	this.id       = null;
	this.title    = '';
	this.img      = '';
	this.url      = '';
	this.showtext = true;
	this.order    = 0;
}
Social.prototype = new Entry();
Social.prototype = new Social();

// ================================== Parsing ==================================
Social.prototype.parse = function(sql)
{
	this.id       = sql.Social_ID;
	this.title    = sql.Social_Title;
	this.img      = sql.Social_Img;
	this.url      = sql.Social_Url;
	this.showtext = parseInt(sql.Social_ShowText);
	this.order    = parseInt(sql.Social_Order);
}

// =================================== Tray ====================================
Social.prototype.setTray = function()
{
	var self = this;
	$('#input_social_title'   ).val(self.title);
	$('#input_social_img'     ).val(self.img);
	$('#input_social_url'     ).val(self.url);
	$('#input_social_showtext').prop('checked', self.showtext);
}
Social.prototype.getTray = function()
{
	var self = this;
	self.title    = $('#input_social_title'   ).val();
	self.img      = $('#input_social_img'     ).val();
	self.url      = $('#input_social_url'     ).val();
	self.showtext = $('#input_social_showtext').prop('checked');
}

// ==================================== DOM ====================================
Social.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'social_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ pressEditSocial(self.id); })
				.text(self.title)
			);
	if (front)
		$('section.socials .sortable').prepend(block);
	else
		$('section.socials .sortable').append(block);
}
Social.prototype.updateDOM = function()
{
	var self = this;
	$('section.socials .sortable li')
		.filter(function(){ return $(this).attr('id') == 'social_'+self.id; })
		.find('a.title')
		.text(self.title);
}
Social.prototype.deleteDOM = function()
{
	var self = this;
	$('section.socials .sortable li')
		.filter(function(){ return $(this).attr('id') == 'social_'+self.id; })
		.remove();
}