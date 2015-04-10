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
function Citation()
{
	Entry.apply(this);
	this.id
	this.articleID   = null;
	this.referenceID = null;
	this.order       = 0;
}
Citation.prototype = new Entry();
Citation.prototype = new Citation();

// ================================== Parsing ==================================
Citation.prototype.parse = function(sql)
{
	this.id          = sql.Citation_ID;
	this.articleID   = sql.Article_ID;
	this.referenceID = sql.Reference_ID;
	this.order       = parseInt(sql.Citation_Order);
}

// ==================================== DOM ====================================
Citation.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'citation_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<sapn/>')
				.addClass('title')
				.text(ENV.db_references.get(self.referenceID).title)
			)
			.append($('<a/>')
				.addClass('pointer')
				.click(function(){ pressDeleteCitation(self.id); })
				.text('\u2716')
			);
	if (front)
		$('.tray.article .sortable').prepend(block);
	else
		$('.tray.article .sortable').append(block);
}
Citation.prototype.deleteDOM = function()
{
	var self = this;
	$('.tray.article .sortable li')
		.filter(function(){ return $(this).attr('id') == 'citation_'+self.id; })
		.remove();
}
