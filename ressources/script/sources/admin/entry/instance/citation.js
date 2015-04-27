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
MSE_JPS.entry.Citation = function()
{
	MSE_JPS.entry.Entry.apply(this);
	this.id
	this.articleID   = null;
	this.referenceID = null;
	this.order       = 0;
}
MSE_JPS.entry.Citation.prototype = new MSE_JPS.entry.Entry();
MSE_JPS.entry.Citation.prototype = new MSE_JPS.entry.Citation();

// ================================== Parsing ==================================
MSE_JPS.entry.Citation.prototype.parse = function(sql)
{
	this.id          = sql.Citation_ID;
	this.articleID   = sql.Article_ID;
	this.referenceID = sql.Reference_ID;
	this.order       = parseInt(sql.Citation_Order);
}

// ==================================== DOM ====================================
MSE_JPS.entry.Citation.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'citation_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<span/>')
				.addClass('title')
				.text(MSE_JPS.ENV.db_references.get(self.referenceID).title)
			)
			.append($('<a/>')
				.addClass('pointer')
				.click(function(){ MSE_JPS.listeners.citation.delete(self.id); })
				.text('\u2716')
			);
	if (front)
		$('.tray.article .sortable').prepend(block);
	else
		$('.tray.article .sortable').append(block);
}
MSE_JPS.entry.Citation.prototype.deleteDOM = function()
{
	var self = this;
	$('.tray.article .sortable li')
		.filter(function(){ return $(this).attr('id') == 'citation_'+self.id; })
		.remove();
}
