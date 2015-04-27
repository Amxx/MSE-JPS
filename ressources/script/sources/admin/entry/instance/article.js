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
MSE_JPS.entry.Article = function()
{
	MSE_JPS.entry.Entry.apply(this);
	this.id         = null;
	this.pageID     = null;
	this.title      = '';
	this.text       = '';
	this.javascript = '';
	this.archived   = false;
	this.order      = 0;
}
MSE_JPS.entry.Article.prototype = new MSE_JPS.entry.Entry();
MSE_JPS.entry.Article.prototype = new MSE_JPS.entry.Article();

// ================================== Parsing ==================================
MSE_JPS.entry.Article.prototype.parse = function(sql)
{
	this.id         = sql.Article_ID;
	this.pageID     = sql.Page_ID;
	this.title      = sql.Article_Title;
	this.text       = sql.Article_Text;
	this.javascript = sql.Article_Javascript;
	this.archived   = parseInt(sql.Article_Archived);
	this.order      = parseInt(sql.Article_Order);
}

// =================================== Tray ====================================
MSE_JPS.entry.Article.prototype.setTray = function()
{
	var self = this;
	$('#input_article_title'     ).val(self.title);
	$('#input_article_text'      ).val(self.text);
	$('#input_article_javascript').val(self.javascript);
	$('#input_article_archived'  ).prop('checked', self.archived);

	if (self.id == null)
	{
		$('.tray.article .menu li').eq(2).hide();
	}
	else
	{
		$('.tray.article .menu li').eq(2).show();
		$('#input_article_refsearch' ).val('');
		MSE_JPS.tools.viewCitations(self.id);
	}
}
MSE_JPS.entry.Article.prototype.getTray = function()
{
	var self = this;
	self.title      = $('#input_article_title'     ).val();
	self.text       = $('#input_article_text'      ).val();
	self.javascript = $('#input_article_javascript').val();
	self.archived   = $('#input_article_archived'  ).prop('checked');
}

// ==================================== DOM ====================================
MSE_JPS.entry.Article.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'article_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ MSE_JPS.listeners.article.edit(self.id); })
				.text(self.title)
			);
	if (front)
		$('section.articles .sortable').prepend(block);
	else
		$('section.articles .sortable').append(block);
}
MSE_JPS.entry.Article.prototype.updateDOM = function()
{
	var self = this;
	$('section.articles .sortable li')
		.filter(function(){ return $(this).attr('id') == 'article_'+self.id; })
		.find('a.title')
		.text(self.title);
}
MSE_JPS.entry.Article.prototype.deleteDOM = function()
{
	var self = this;
	$('section.articles .sortable li')
		.filter(function(){ return $(this).attr('id') == 'article_'+self.id; })
		.remove();
}