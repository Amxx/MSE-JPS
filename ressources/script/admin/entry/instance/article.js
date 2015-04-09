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

// ==================================== DOM ====================================
Article.prototype.insertDOM = function(front)
{
	var instance = this;
	var block = $('<li/>')
			.attr('id', 'article_'+instance.id)
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
		$('section.articles .sortable').prepend(block);
	else
		$('section.articles .sortable').append(block);
}
Article.prototype.updateDOM = function()
{
	var instance = this;
	$('section.articles .sortable li')
		.filter(function(){ return $(this).attr('id') == 'article_'+instance.id; })
		.find('a.title')
		.text(instance.title);
}
Article.prototype.deleteDOM = function()
{
	var instance = this;
	$('section.articles .sortable li')
		.filter(function(){ return $(this).attr('id') == 'article_'+instance.id; })
		.remove();
}