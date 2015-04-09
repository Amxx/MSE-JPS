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
function Reference()
{
	Entry.apply(this);
	this.id        = null;
	this.title     = '';
	this.authors   = '';
	this.reference = '';
	this.abstract  = '';
	this.bibtex    = '';
}
Reference.prototype = new Entry();

// ================================== Parsing ==================================
Reference.prototype.parse = function(sql)
{
	this.id        = sql.Reference_ID;
	this.title     = sql.Reference_Title;
	this.authors   = sql.Reference_Authors;
	this.reference = sql.Reference_Ref;
	this.abstract  = sql.Reference_Abstract;
	this.bibtex    = sql.Reference_Bibtex;
}

// ==================================== DOM ====================================
Reference.prototype.insertDOM = function(front)
{
	var instance = this;
	var block = $('<li/>')
			.attr('id', 'reference_'+instance.id)
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
		$('section.references .sortable').prepend(block);
	else
		$('section.references .sortable').append(block);
}
Reference.prototype.updateDOM = function()
{
	var instance = this;
	$('section.references .sortable li')
		.filter(function(){ return $(this).attr('id') == 'reference_'+instance.id; })
		.find('a.title')
		.text(instance.title);
}
Reference.prototype.deleteDOM = function()
{
	var instance = this;
	$('section.references .sortable li')
		.filter(function(){ return $(this).attr('id') == 'reference_'+instance.id; })
		.remove();
}