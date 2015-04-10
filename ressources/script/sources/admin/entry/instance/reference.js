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
Reference.prototype = new Reference();

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

// =================================== Tray ====================================
Reference.prototype.setTray = function()
{
	var self = this;
	$('#input_reference_title'    ).val(self.title);
	$('#input_reference_authors'  ).val(self.authors);
	$('#input_reference_reference').val(self.reference);
	$('#input_reference_abstract' ).val(self.abstract);
	$('#input_reference_bibtex'   ).val(self.bibtex);

	if (self.id == null)
	{
		$('.tray.reference .menu li').eq(3).hide();
	}
	else
	{
		$('.tray.reference .menu li').eq(3).show();
		viewSources(self.id);
	}
}
Reference.prototype.getTray = function()
{
	var self = this;
	self.title     = $('#input_reference_title'    ).val();
	self.authors   = $('#input_reference_authors'  ).val();
	self.reference = $('#input_reference_reference').val();
	self.abstract  = $('#input_reference_abstract' ).val();
	self.bibtex    = $('#input_reference_bibtex'   ).val();
}

// ==================================== DOM ====================================
Reference.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'reference_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ pressEditReference(self.id); })
				.text(self.title)
			);
	if (front)
		$('section.references .sortable').prepend(block);
	else
		$('section.references .sortable').append(block);
}
Reference.prototype.updateDOM = function()
{
	var self = this;
	$('section.references .sortable li')
		.filter(function(){ return $(this).attr('id') == 'reference_'+self.id; })
		.find('a.title')
		.text(self.title);
}
Reference.prototype.deleteDOM = function()
{
	var self = this;
	$('section.references .sortable li')
		.filter(function(){ return $(this).attr('id') == 'reference_'+self.id; })
		.remove();
}