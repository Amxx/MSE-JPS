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
MSE_JPS.entry.Social = function()
{
	MSE_JPS.entry.Entry.apply(this);
	this.id       = null;
	this.title    = '';
	this.img      = '';
	this.url      = '';
	this.showtext = true;
	this.order    = 0;
}
MSE_JPS.entry.Social.prototype = new MSE_JPS.entry.Entry();
MSE_JPS.entry.Social.prototype = new MSE_JPS.entry.Social();

// ================================== Parsing ==================================
MSE_JPS.entry.Social.prototype.parse = function(sql)
{
	this.id       = sql.Social_ID;
	this.title    = sql.Social_Title;
	this.img      = sql.Social_Img;
	this.url      = sql.Social_Url;
	this.showtext = parseInt(sql.Social_ShowText);
	this.order    = parseInt(sql.Social_Order);
}

// =================================== Tray ====================================
MSE_JPS.entry.Social.prototype.setTray = function()
{
	var self = this;
	$('#input_social_title'   ).val(self.title);
	$('#input_social_img'     ).val(self.img);
	$('#input_social_url'     ).val(self.url);
	$('#input_social_showtext').prop('checked', self.showtext);
}
MSE_JPS.entry.Social.prototype.getTray = function()
{
	var self = this;
	self.title    = $('#input_social_title'   ).val();
	self.img      = $('#input_social_img'     ).val();
	self.url      = $('#input_social_url'     ).val();
	self.showtext = $('#input_social_showtext').prop('checked');
}

// ==================================== DOM ====================================
MSE_JPS.entry.Social.prototype.insertDOM = function(front)
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
				.click(function(){ MSE_JPS.listeners.social.edit(self.id); })
				.text(self.title)
			);
	if (front)
		$('section.socials .sortable').prepend(block);
	else
		$('section.socials .sortable').append(block);
}
MSE_JPS.entry.Social.prototype.updateDOM = function()
{
	var self = this;
	$('section.socials .sortable li')
		.filter(function(){ return $(this).attr('id') == 'social_'+self.id; })
		.find('a.title')
		.text(self.title);
}
MSE_JPS.entry.Social.prototype.deleteDOM = function()
{
	var self = this;
	$('section.socials .sortable li')
		.filter(function(){ return $(this).attr('id') == 'social_'+self.id; })
		.remove();
}