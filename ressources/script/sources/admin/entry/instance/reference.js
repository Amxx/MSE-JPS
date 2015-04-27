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
MSE_JPS.entry.Reference = function()
{
	MSE_JPS.entry.Entry.apply(this);
	this.id        = null;
	this.title     = '';
	this.authors   = '';
	this.reference = '';
	this.abstract  = '';
	this.bibtex    = '';
}
MSE_JPS.entry.Reference.prototype = new MSE_JPS.entry.Entry();
MSE_JPS.entry.Reference.prototype = new MSE_JPS.entry.Reference();

// ================================== Parsing ==================================
MSE_JPS.entry.Reference.prototype.parse = function(sql)
{
	this.id        = sql.Reference_ID;
	this.title     = sql.Reference_Title;
	this.authors   = sql.Reference_Authors;
	this.reference = sql.Reference_Ref;
	this.abstract  = sql.Reference_Abstract;
	this.bibtex    = sql.Reference_Bibtex;
}

// =================================== Tray ====================================
MSE_JPS.entry.Reference.prototype.setTray = function()
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
		MSE_JPS.tools.viewSources(self.id);
	}
}
MSE_JPS.entry.Reference.prototype.getTray = function()
{
	var self = this;
	self.title     = $('#input_reference_title'    ).val();
	self.authors   = $('#input_reference_authors'  ).val();
	self.reference = $('#input_reference_reference').val();
	self.abstract  = $('#input_reference_abstract' ).val();
	self.bibtex    = $('#input_reference_bibtex'   ).val();
}

// ==================================== DOM ====================================
MSE_JPS.entry.Reference.prototype.insertDOM = function(front)
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
				.click(function(){ MSE_JPS.listeners.reference.edit(self.id); })
				.text(self.title)
			);
	if (front)
		$('section.references .sortable').prepend(block);
	else
		$('section.references .sortable').append(block);
}
MSE_JPS.entry.Reference.prototype.updateDOM = function()
{
	var self = this;
	$('section.references .sortable li')
		.filter(function(){ return $(this).attr('id') == 'reference_'+self.id; })
		.find('a.title')
		.text(self.title);
}
MSE_JPS.entry.Reference.prototype.deleteDOM = function()
{
	var self = this;
	$('section.references .sortable li')
		.filter(function(){ return $(this).attr('id') == 'reference_'+self.id; })
		.remove();
}