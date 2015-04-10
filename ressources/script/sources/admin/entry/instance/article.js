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
function Article()
{
	Entry.apply(this);
	this.id         = null;
	this.pageID     = null;
	this.title      = '';
	this.text       = '';
	this.javascript = '';
	this.archived   = false;
	this.order      = 0;
}
Article.prototype = new Entry();
Article.prototype = new Article();

// ================================== Parsing ==================================
Article.prototype.parse = function(sql)
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
Article.prototype.setTray = function()
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
		viewCitations(self.id);
	}
}
Article.prototype.getTray = function()
{
	var self = this;
	self.title      = $('#input_article_title'     ).val();
	self.text       = $('#input_article_text'      ).val();
	self.javascript = $('#input_article_javascript').val();
	self.archived   = $('#input_article_archived'  ).prop('checked');
}

// ==================================== DOM ====================================
Article.prototype.insertDOM = function(front)
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
				.click(function(){ pressEditArticle(self.id); })
				.text(self.title)
			);
	if (front)
		$('section.articles .sortable').prepend(block);
	else
		$('section.articles .sortable').append(block);
}
Article.prototype.updateDOM = function()
{
	var self = this;
	$('section.articles .sortable li')
		.filter(function(){ return $(this).attr('id') == 'article_'+self.id; })
		.find('a.title')
		.text(self.title);
}
Article.prototype.deleteDOM = function()
{
	var self = this;
	$('section.articles .sortable li')
		.filter(function(){ return $(this).attr('id') == 'article_'+self.id; })
		.remove();
}