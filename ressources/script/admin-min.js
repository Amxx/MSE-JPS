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

 function openPopup()
{
	var dialog = $('<dialog/>').addClass('popup').appendTo('body');

	/****************************************************************************
	 *               Provide support for non compatible browsers                *
	 *                                                                          *
	 * Compatible browsers are (as of april 2015)                               *
	 *   chrome > 37                                                            *
	 *   safari > 6.0                                                           *
	 *   opera  > 24                                                            *
	 ****************************************************************************/
	dialogPolyfill.registerDialog(dialog[0]);
	/****************************************************************************/

	dialog[0].showModal();
	return dialog;
}

function closePopup(dialog)
{
	dialog[0].close();
	dialog.remove();
}

function popup_input(text, callback, input)
{
	var p = openPopup();
	p	.append($('<h4/>'   ).text(text))
		.append($('<input/>').attr('type', 'text').attr('placeholder', input));
	p.find('input')
		.keyup(function(event){
			switch(event.which)
			{
				case 13: // ENTER
					closePopup(p);
					if (callback) callback(this.value);
					break;
				case 27:
					closePopup(p);
					break;
			}
		})
		.blur(function(){ closePopup(p); })
		.focus();
}

function popup_confirm(text, callback)
{
	var p = openPopup();
	p	.append($('<h4/>').text(text))
		.append($('<a/>' ).addClass('button').text('No'))
		.append($('<a/>' ).addClass('button').text('Yes'))

	p.find('a.button').each(function(){
		$(this).click(function(){
			closePopup(p);
			if (callback)
				callback($(this).text() == 'Yes');
		});
	});
}

function popup_information(text, callback)
{
	var p = openPopup();
	p	.css('cursor', 'pointer')
		.append($('<h4/>').text(text) )
		.click(function(){
			closePopup(p);
			if (callback)
				callback();
		});
}/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

/******************************************************************************
 *                                Environment                                 *
 ******************************************************************************/
console.info("allocating shared memory");
const FLAG_NULL = 0x0;
const FLAG_EDIT = 0x1;
const FLAG_NEW  = 0x2;

var ENV           = new Object();
ENV.flags         = FLAG_NULL;
ENV.currentPage   = undefined;
ENV.editionObject = undefined;
function resetFlags() { ENV.flags = FLAG_NULL; }

/******************************************************************************
 *                                   Setup                                    *
 ******************************************************************************/
$(function(){
	console.info("loading complete");

	//============================================================================
	console.group("building context");
	var popup = openPopup().append($('<h4/>').text('loading...'));
	//============================================================================

	//-----------------------------------------
	console.info("autocomplete intialisation");
	buildAutocomplete();

	//--------------------------------
	console.info("tab intialisation");
	$('#nav li').eq(0).addClass('current');
	$('main .tab').slice(1).hide();

	//-----------------------------------
	console.info("slider intialisation");
	$('section.articles .slider').hide();

	//------------------------------------
	console.info("sortable intialisation");
	$('section.articles .sortable').sortable({
		handle: ".handle",
		update: function(){ ENV.db_articles.reorder(ordered_idarray($(this).find('li'))); }
	});
	$('section.links    .sortable').sortable({
		handle: ".handle",
		update: function(){ ENV.db_links   .reorder(ordered_idarray($(this).find('li'))); }
	});
	$('section.pages    .sortable').sortable({
		handle: ".handle",
		update: function(){ ENV.db_pages   .reorder(ordered_idarray($(this).find('li'))); }
	});
	$('section.socials  .sortable').sortable({
		handle: ".handle",
		update: function(){ ENV.db_socials .reorder(ordered_idarray($(this).find('li'))); }
	});
	$('.tray.article    .sortable').sortable({
		handle: ".handle",
		update: function(){ ENV.db_citations.reorder(ordered_idarray($(this).find('li'))); }
	});
	$('.tray.reference  .sortable').sortable({
		handle: ".handle",
		update: function(){ ENV.db_sources.reorder(ordered_idarray($(this).find('li'))); }
	});

	//-----------------------------------
	console.info("setting environment");
	ENV.db_articles = new POSTContainer({
		target        : 'updater.php',
		allocator     : Article,
		query_select  : 'select_articles',
		query_insert  : 'insert_article',
		query_update  : 'update_article',
		query_delete  : 'delete_article',
		query_reorder : 'reorder_article'
	});
	ENV.db_citations = new POSTContainer({
		target        : 'updater.php',
		allocator     : Citation,
		query_select  : 'select_citations',
		query_insert  : 'insert_citation',
		query_delete  : 'delete_citation',
		query_reorder : 'reorder_citation'
	});
	ENV.db_links = new POSTContainer({
		target        : 'updater.php',
		allocator     : Link,
		query_select  : 'select_links',
		query_insert  : 'insert_link',
		query_update  : 'update_link',
		query_delete  : 'delete_link',
		query_reorder : 'reorder_link'
	});
	ENV.db_pages = new POSTContainer({
		target        : 'updater.php',
		allocator     : Page,
		query_select  : 'select_pages',
		query_insert  : 'insert_page',
		query_update  : 'update_page',
		query_delete  : 'delete_page',
		query_reorder : 'reorder_page'
	});
	ENV.db_references = new POSTContainer({
		target        : 'updater.php',
		allocator     : Reference,
		query_select  : 'select_references',
		query_insert  : 'insert_reference',
		query_update  : 'update_reference',
		query_delete  : 'delete_reference'
	});
	ENV.db_socials = new POSTContainer({
		target        : 'updater.php',
		allocator     : Social,
		query_select  : 'select_socials',
		query_insert  : 'insert_social',
		query_update  : 'update_social',
		query_delete  : 'delete_social',
		query_reorder : 'reorder_social'
	});
	ENV.db_sources = new POSTContainer({
		target        : 'updater.php',
		allocator     : Source,
		query_select  : 'select_sources',
		query_insert  : 'insert_source',
		query_update  : 'update_source',
		query_delete  : 'delete_source',
		query_reorder : 'reorder_source'
	});

	//-------------------------------
	console.info("reading database");
	ENV.db_articles.select();
	ENV.db_citations.select();
	ENV.db_sources.select();
	ENV.db_links.select().done(function(){
		for (value of ENV.db_links.orderedValues())
			value.insertDOM();
	});
	ENV.db_pages.select().done(function(){
		for (value of ENV.db_pages.orderedValues())
			value.insertDOM();
	});
	ENV.db_references.select().done(function(){
		fillAutocomplete();
		for (value of ENV.db_references.orderedValues())
			value.insertDOM();
	});
	ENV.db_socials.select().done(function(){
		for (value of ENV.db_socials.orderedValues())
			value.insertDOM();
	});

	//============================================================================
	closePopup(popup);
	console.groupEnd();
	//============================================================================

	console.info("Ready !");
});/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

function openTray(tray, callback)
{
	closeTray($('.tray.expanded'), function(){
		tray.find('.tab:visible').hide();
		tray.find('.tab:eq(0)'  ).show();
		tray.addClass('expanded', 300, callback);
	});
}
function closeTray(tray, callback)
{
	var lambda = function(){
		if (tray.length)
			tray.removeClass('expanded', 300, callback);
		else if (callback)
			callback();
	};
	if (ENV.flags)
		popup_confirm('This action will discard all uncommited modification. Continue ?', function(b){
			if (b) lambda();
		});
	else
		lambda();
}
function viewTrayTab(obj, num)
{
	var tab = $(obj).closest('.tray').find('.tab').eq(num);
	$(tab).siblings().filter(':visible').slideUp();
	$(tab).slideDown();
}

// ================================ Integration ================================

function launchTray(tray, object, callback)
{
	openTray(tray, function(){
		ENV.flags         = object ? FLAG_NULL : FLAG_NEW;
		ENV.editionObject = object;
		callback();
	});
}

// Tray listener
$(function(){
	$('.tray .content .followchange').bind('change input', function(){
		ENV.flags |= FLAG_EDIT;
	});
	$('.tray a.close').each(function(){
		$(this).click(function(){
			closeTray($(this).closest('.tray'), resetFlags);
		});
	});
	$(document).bind('keyup', function(e){
		if (e.keyCode == 27)
			closeTray($('.tray.expanded'), resetFlags);
	});

});/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

function buildAutocomplete()
{
	var searchField   = $('.tray.article #input_article_refsearch');
	var searchFieldID = $('.tray.article #input_article_refID'    );

	searchField.autocomplete({
			minLength: 0,
			focus: function(event, ui){
				searchField.val(ui.item.title);
				return false;
			},
			select: function(event, ui){
				searchField.val(ui.item.title);
				pressAddCitation(ui.item.value);
				// searchFieldID.val(ui.item.value);
				return false;
			}
		})
		.autocomplete("instance")._renderItem = function(ul, item){
			return $("<li>")
				.append($("<a/>")
					.append($('<span/>').addClass('title').text(item.title))
					.append($('<span/>').addClass('authors').text(item.authors))
				)
				.appendTo( ul );
		};
}

function fillAutocomplete()
{
	var array = ENV.db_references.values().map(e => ({ label: e.title+" "+e.authors, title: e.title, authors: e.authors, value: e.id }));
	$('.tray.article #input_article_refsearch').autocomplete('option', 'source', array);
}/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

function ordered_idarray(block)
{
	return block.toArray().map( e => parseInt($(e).attr('id').match(/(\d+)$/)) );
}

function viewTab(id)
{
	if (!$('#nav li').eq(id).hasClass('current'))
	{
		$('#nav li.current').removeClass('current');
		$('#nav li').eq(id).addClass('current');

		$('main .tab:visible').slideToggle();
		$('main .tab').eq(id).slideToggle();
	}
}

function viewPage(pageID)
{
	if (ENV.currentPage != pageID)
		closeTray($('.tray.expanded'), function(){
			resetFlags();

			$('section.pages .sortable .expanded').removeClass('expanded');
			if (pageID != undefined)
				$('section.pages .sortable').find('#page_'+pageID).addClass('expanded');

			var slider = $('section.articles .slider');
			// Hide
			slider.hide('slide', { direction: "left" }, function(){
				// Set env
				ENV.currentPage = pageID;
				// Cleanup
				$('section.articles .sortable li').remove();
				// Fill
				if (pageID != undefined)
				{
					var articles = ENV.db_articles.values()
						.filter(a => a.pageID == pageID)
						.sort((a,b) => a.order > b.order);
					for (article of articles)
						article.insertDOM();
					// Show
					slider.show('slide', { direction: "left" });
				}
			});
		});
}

function viewCitations(articleID)
{
	$('.tray.article .sortable li').remove();
	for (citation of ENV.db_citations.values().filter(e => e.articleID == articleID))
		citation.insertDOM();
}
function viewSources(referenceID)
{
	$('.tray.reference .sortable li').remove();
	for (source of ENV.db_sources.values().filter(e => e.referenceID == referenceID))
		source.insertDOM();
}/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

function Entry(){}

Entry.prototype.post = function(){
	var properties = {};
	for (var prop in this)
		if (typeof this[prop] !== 'function')
			properties[prop] = this[prop];
	return properties;
}/******************************************************************************
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
function Source()
{
	Entry.apply(this);
	this.id          = null;
	this.referenceID = null;
	this.title       = '';
	this.url         = '';
	this.order       = 0;
}
Source.prototype = new Entry();
Source.prototype = new Source();

// ================================== Parsing ==================================
Source.prototype.parse = function(sql)
{
	this.id          = sql.Source_ID;
	this.referenceID = sql.Reference_ID;
	this.title       = sql.Source_Title;
	this.url         = sql.Source_Url;
	this.order       = parseInt(sql.Source_Order);
}

// ================================== Methods ==================================
Source.prototype.descrition = function()
{
	var self   = this;
	var length = self.url.length;
	if (length < 63)
		var url = self.url;
	else
		var url = self.url.substring(0, 30)+'...'+self.url.substring(length-30, length);

	return '['+self.title+'] '+url;
}

// ==================================== DOM ====================================
Source.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'source_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ pressEditSource(self.id); })
				.text(self.descrition())
			)
			.append($('<a/>')
				.addClass('pointer')
				.click(function(){ pressDeleteSource(self.id); })
				.text('\u2716')
			);
	if (front)
		$('.tray.reference .sortable').prepend(block);
	else
		$('.tray.reference .sortable').append(block);
}
Source.prototype.updateDOM = function()
{
	var self = this;
	$('.tray.reference .sortable li')
		.filter(function(){ return $(this).attr('id') == 'source_'+self.id; })
		.find('a.title')
		.text(self.descrition());
}
Source.prototype.deleteDOM = function()
{
	var self = this;
	$('.tray.reference .sortable li')
		.filter(function(){ return $(this).attr('id') == 'source_'+self.id; })
		.remove();
}/******************************************************************************
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
			.append($('<span/>')
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
function Link()
{
	Entry.apply(this);
	this.id      = null;
	this.title   = '';
	this.content = '';
	this.order   = 0;
}
Link.prototype = new Entry();
Link.prototype = new Link();

// ================================== Parsing ==================================
Link.prototype.parse = function(sql)
{
	this.id      = sql.Link_ID;
	this.title   = sql.Link_Title;
	this.content = sql.Link_Content;
	this.order   = parseInt(sql.Link_Order);
}

// =================================== Tray ====================================
Link.prototype.setTray = function()
{
	var self = this;
	$('#input_link_title'  ).val(self.title);
	$('#input_link_content').val(self.content);
}
Link.prototype.getTray = function()
{
	var self = this;
	self.title   = $('#input_link_title'  ).val();
	self.content = $('#input_link_content').val();
}

// ==================================== DOM ====================================
Link.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'link_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ pressEditLink(self.id); })
				.text(self.title)
			);
	if (front)
		$('section.links .sortable').prepend(block);
	else
		$('section.links .sortable').append(block);
}
Link.prototype.updateDOM = function()
{
	var self = this;
	$('section.links .sortable li')
		.filter(function(){ return $(this).attr('id') == 'link_'+self.id; })
		.find('a.title')
		.text(self.title);
}
Link.prototype.deleteDOM = function()
{
	var self = this;
	$('section.links .sortable li')
		.filter(function(){ return $(this).attr('id') == 'link_'+self.id; })
		.remove();
}/******************************************************************************
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
}/******************************************************************************
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
}/******************************************************************************
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
function Page()
{
	Entry.apply(this);
	this.id         = null;
	this.title      = '';
	this.style      = '';
	this.bordered   = false;
	this.expandable = false;
	this.order      = 0;
}
Page.prototype = new Entry();
Page.prototype = new Page();

// ================================== Parsing ==================================
Page.prototype.parse = function(sql)
{
	this.id         = sql.Page_ID;
	this.title      = sql.Page_Title;
	this.style			= sql.Page_Style;
	this.bordered		= parseInt(sql.Page_Bordered);
	this.expandable	= parseInt(sql.Page_Expandable);
	this.order			= parseInt(sql.Page_Order);
}

// =================================== Tray ====================================
Page.prototype.setTray = function()
{
	var self = this;
	$('#input_page_title'     ).val(self.title);
	$('#input_page_style'     ).val(self.style);
	$('#input_page_expendable').prop('checked', self.expandable);
	$('#input_page_bordered'  ).prop('checked', self.bordered);
}
Page.prototype.getTray = function()
{
	var self = this;
	self.title      = $('#input_page_title'     ).val();
	self.style      = $('#input_page_style'     ).val();
	self.expandable = $('#input_page_expendable').prop('checked');
	self.bordered   = $('#input_page_bordered'  ).prop('checked');
}

// ==================================== DOM ====================================
Page.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'page_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ pressEditPage(self.id); })
				.text(self.title)
			)
			.append($('<a/>')
				.addClass('pointer')
				.click(function(){ viewPage(self.id); })
				.text('\u25B6')
			);
	if (front)
		$('section.pages .sortable').prepend(block);
	else
		$('section.pages .sortable').append(block);
}
Page.prototype.updateDOM = function()
{
	var self = this;
	$('section.pages .sortable li')
		.filter(function(){ return $(this).attr('id') == 'page_'+self.id; })
		.find('a.title')
		.text(self.title);
}
Page.prototype.deleteDOM = function()
{
	var self = this;
	$('section.pages .sortable li')
		.filter(function(){ return $(this).attr('id') == 'page_'+self.id; })
		.remove();
}
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
}/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

/******************************************************************************
 *                               POST Container                               *
 ******************************************************************************/
function POSTContainer(params)
{
	Container.apply(this);
	for (var prop in params)
		this[prop] = params[prop];
	/*
	this.target       = params.target;
	this.allocator    = params.allocator;
	this.query_select = params.query_select;
	this.query_insert = params.query_insert;
	this.query_update = params.query_update;
	this.query_delete = params.query_delete;
	*/
}
POSTContainer.prototype = new Container();
POSTContainer.prototype.select = function()
{
	var self = this;
	var popup = openPopup().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { QUERY: self.query_select }, function(data){
		if (data.values) // Sanity
		for (entry of data.values)
		{
			var obj = new self.allocator();
			obj.parse(entry);
			self.set(obj);
		}
		closePopup(popup);
	}, 'json');
}
POSTContainer.prototype.insert = function(obj)
{
	var self = this;
	var popup = openPopup().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { QUERY: self.query_insert, object: obj.post() }, function(data){
		obj.id = data.id;
		self.set(obj);
		closePopup(popup);
	}, 'json');
}
POSTContainer.prototype.update = function(obj)
{
	var self = this;
	var popup = openPopup().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { QUERY: self.query_update, object: obj.post() }, function(data){
		closePopup(popup);
	}, 'json');
}
POSTContainer.prototype.delete = function(obj)
{
	var self = this;
	var popup = openPopup().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { QUERY: self.query_delete, object: obj.post() }, function(data){
		self.rem(obj);
		closePopup(popup);
	}, 'json');
}
POSTContainer.prototype.reorder = function(idarray)
{
	var self = this;
	var popup = openPopup().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { QUERY: self.query_reorder, object: idarray }, function(data){
		for (var i in idarray)
			self.get(idarray[i]).order = i;
		closePopup(popup);
	}, 'json');
}/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

/******************************************************************************
 *                                 Container                                  *
 ******************************************************************************/
function Container()
{
	this.data = new Object();
}
// ---------------------------------- Methods ----------------------------------
Container.prototype.get = function(objID)
{
	return this.data[objID];
}
Container.prototype.set = function(obj)
{
	return this.data[obj.id] = obj;
}
Container.prototype.rem = function(obj)
{
	delete this.data[obj.id];
}
Container.prototype.size = function()
{
	return Object.keys(this.data).length;
}
Container.prototype.values = function()
{
	return Object
		.keys(this.data)
		.map(key => this.data[key]);
}
Container.prototype.orderedValues = function()
{
	return this.values().sort((a,b) => a.order > b.order);
}/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

function pressAddSource()
{
	var p = openPopup();
	p	.append($('<h4/>'   ).text('New Link'))
		.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Title'))
		.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Url'  ))
		.append($('<a/>').addClass('button').text('Cancel').click(function(){
			closePopup(p);
		}))
		.append($('<a/>').addClass('button').text('Ok').click(function(){
			title = p.find('input').eq(0).val().trim();
			url   = p.find('input').eq(1).val().trim();
			if (title && url)
			{
				var source = new Source();
				source.title       = title;
				source.url         = url;
				source.referenceID = ENV.editionObject.id;
				ENV.db_sources.insert(source)
					.done(function(){
						source.insertDOM();
						ENV.db_sources.reorder(ordered_idarray($('.tray.reference .sortable li')));
						closePopup(p);
					})
			}
		}));
}

function pressEditSource(sourceID)
{
	var source = ENV.db_sources.get(sourceID);

	var p = openPopup();
	p	.append($('<h4/>'   ).text('New Link'))
		.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Title').val(source.title))
		.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Url'  ).val(source.url))
		.append($('<a/>').addClass('button').text('Cancel').click(function(){
			closePopup(p);
		}))
		.append($('<a/>').addClass('button').text('Ok').click(function(){
			title = p.find('input').eq(0).val().trim();
			url   = p.find('input').eq(1).val().trim();
			if (title && url)
			{
				source.title       = title;
				source.url         = url;
				ENV.db_sources.update(source)
					.done(function(){
						source.updateDOM();
						closePopup(p);
					})
			}
		}));



}

function pressDeleteSource(sourceID)
{
	popup_confirm("Are you sure you want to delete this source ?", function(confirm){
		var source = ENV.db_sources.get(sourceID);
		ENV.db_sources.delete(source)
			.done(function(){
				source.deleteDOM();
			});
	});
}/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

function pressAddCitation(referenceID)
{
	var citation = new Citation();
	citation.articleID   = ENV.editionObject.id;
	citation.referenceID = referenceID;
	ENV.db_citations.insert(citation)
		.done(function(){
			citation.insertDOM();
			ENV.db_citations.reorder(ordered_idarray($('.tray.article    .sortable li')));
		})
}

function pressDeleteCitation(citationID)
{
	popup_confirm("Are you sure you want to delete this citation ?", function(confirm){
		var citation = ENV.db_citations.get(citationID);
		ENV.db_citations.delete(citation)
			.done(function(){
				citation.deleteDOM();
			});
	});
}/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

function pressNewLink()
{
	launchTray($('.tray.link'), undefined, function(){ Link.prototype.setTray(); });
}
function pressEditLink(linkID)
{
	var link = ENV.db_links.get(linkID);
	launchTray($('.tray.link'), link, function(){ link.setTray(); });
}
function pressCommitLink()
{
	if (ENV.flags)
	{
		if (!$('#input_link_title').val().trim())
		{
			popup_information("Title should not be empty");
		}
		else if (ENV.editionObject)
		{
			var link = ENV.editionObject;
			link.getTray();
			ENV.db_links.update(link)
				.done(function(){
					link.updateDOM();
					resetFlags();
					closeTray($('.tray.link'));
				});
		}
		else
		{
			var link = new Link();
			link.getTray();
			ENV.db_links.insert(link)
				.done(function(){
					link.insertDOM();
					ENV.db_links.reorder(ordered_idarray($('section.links .sortable li')));
					resetFlags();
					closeTray($('.tray.link'));
				})
		}
	}
	else
		closeTray($('.tray.link'));
}
function pressDeleteLink()
{
	if (ENV.flags == FLAG_NEW)
	{
		resetFlags();
		closeTray($('.tray.link'));
	}
	else
	{
		popup_confirm("Are you sure you want to delete this link ?", function(confirm){
			if (confirm)
			{
				var link = ENV.editionObject;
				ENV.db_links.delete(link)
					.done(function(){
						link.deleteDOM();
						resetFlags();
						closeTray($('.tray.link'));
					});
			}
		});
	}
}/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

function pressNewReference()
{
	launchTray($('.tray.reference'), undefined, function(){ Reference.prototype.setTray(); });
}
function pressEditReference(referenceID)
{
	var reference = ENV.db_references.get(referenceID);
	launchTray($('.tray.reference'), reference, function(){ reference.setTray(); });
}
function pressCommitReference()
{
	if (ENV.flags)
	{
		if (!$('#input_reference_title').val().trim())
		{
			popup_information("Title should not be empty");
		}
		else if (ENV.editionObject)
		{
			var reference = ENV.editionObject;
			reference.getTray();
			ENV.db_references.update(reference)
				.done(function(){
					reference.updateDOM();
					fillAutocomplete();
					resetFlags();
					closeTray($('.tray.reference'));
				});
		}
		else
		{
			var reference = new Reference();
			reference.getTray();
			ENV.db_references.insert(reference)
				.done(function(){
					reference.insertDOM();
					ENV.db_references.reorder(ordered_idarray($('section.references .sortable li')));
					fillAutocomplete();
					resetFlags();
					closeTray($('.tray.reference'));
				})
		}
	}
	else
		closeTray($('.tray.reference'));
}
function pressDeleteReference()
{
	if (ENV.flags == FLAG_NEW)
	{
		resetFlags();
		closeTray($('.tray.reference'));
	}
	else
	{
		popup_confirm("Are you sure you want to delete this reference ?", function(confirm){
			if (confirm)
			{
				var reference = ENV.editionObject;
				ENV.db_references.delete(reference)
					.done(function(){
						var citations = ENV.db_citations.values().filter(a => a.referenceID == reference.id);
						for (citation of citations)
							ENV.db_citations.rem(citation);
						reference.deleteDOM();
						fillAutocomplete();
						resetFlags();
						closeTray($('.tray.reference'));
					});
			}
		});
	}
}/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

function pressNewArticle()
{
	launchTray($('.tray.article'), undefined, function(){ Article.prototype.setTray(); });
}
function pressEditArticle(articleID)
{
	var article = ENV.db_articles.get(articleID);
	launchTray($('.tray.article'), article, function(){ article.setTray(); });
}
function pressCommitArticle()
{
	if (ENV.flags)
	{
		if (!$('#input_article_title').val().trim())
		{
			popup_information("Title should not be empty");
		}
		else if (ENV.editionObject)
		{
			var article = ENV.editionObject;
			article.getTray();
			ENV.db_articles.update(article)
				.done(function(){
					article.updateDOM();
					resetFlags();
					closeTray($('.tray.article'));
				});
		}
		else
		{
			var article = new Article();
			article.getTray();
			article.pageID = ENV.currentPage;
			ENV.db_articles.insert(article)
				.done(function(){
					article.insertDOM();
					ENV.db_articles.reorder(ordered_idarray($('section.articles .sortable li')));
					resetFlags();
					closeTray($('.tray.article'));
				})
		}
	}
	else
		closeTray($('.tray.article'));
}
function pressDeleteArticle()
{
	if (ENV.flags == FLAG_NEW)
	{
		resetFlags();
		closeTray($('.tray.article'));
	}
	else
	{
		popup_confirm("Are you sure you want to delete this article ?", function(confirm){
			if (confirm)
			{
				var article = ENV.editionObject;
				ENV.db_articles.delete(article)
					.done(function(){
						var citations = ENV.db_citations.values().filter(a => a.articleID == article.id);
						for (citation of citations)
							ENV.db_citations.rem(citation);
						article.deleteDOM();
						resetFlags();
						closeTray($('.tray.article'));
					});
			}
		});
	}
}
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

function pressNewPage()
{
	launchTray($('.tray.page'), undefined, function(){ Page.prototype.setTray(); });
}
function pressEditPage(pageID)
{
	var page = ENV.db_pages.get(pageID);
	launchTray($('.tray.page'), page, function(){ page.setTray(); });
}
function pressCommitPage()
{
	if (ENV.flags)
	{
		if (!$('#input_page_title').val().trim())
		{
			popup_information("Title should not be empty");
		}
		else if (ENV.editionObject)
		{
			var page = ENV.editionObject;
			page.getTray();
			ENV.db_pages.update(page)
				.done(function(){
					page.updateDOM();
					resetFlags();
					closeTray($('.tray.page'));
				});
		}
		else
		{
			var page = new Page();
			page.getTray();
			ENV.db_pages.insert(page)
				.done(function(){
					page.insertDOM();
					ENV.db_pages.reorder(ordered_idarray($('section.pages .sortable li')));
					resetFlags();
					closeTray($('.tray.page'));
					viewPage(page.id);
				})
		}
	}
	else
		closeTray($('.tray.page'));
}
function pressDeletePage()
{
	if (ENV.flags == FLAG_NEW)
	{
		resetFlags();
		closeTray($('.tray.page'));
	}
	else
	{
		popup_confirm("Are you sure you want to delete this page ?", function(confirm){
			if (confirm)
			{
				var page = ENV.editionObject;
				ENV.db_pages.delete(page)
					.done(function(){
						if (ENV.currentPage == page.id)
							viewPage();
						var articles = ENV.db_articles.values().filter(a => a.pageID == page.id);
						for (article of articles)
							ENV.db_articles.rem(article);
						page.deleteDOM();
						resetFlags();
						closeTray($('.tray.page'));
					});
			}
		});
	}
}/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

function pressNewSocial()
{
	launchTray($('.tray.social'), undefined, function(){ Social.prototype.setTray(); });
}
function pressEditSocial(socialID)
{
	var social = ENV.db_socials.get(socialID);
	launchTray($('.tray.social'), social, function(){ social.setTray(); });
}
function pressCommitSocial()
{
	if (ENV.flags)
	{
		if (!$('#input_social_title').val().trim())
		{
			popup_information("Title should not be empty");
		}
		else if (ENV.editionObject)
		{
			var social = ENV.editionObject;
			social.getTray();
			ENV.db_socials.update(social)
				.done(function(){
					social.updateDOM();
					resetFlags();
					closeTray($('.tray.social'));
				});
		}
		else
		{
			var social = new Social();
			social.getTray();
			ENV.db_socials.insert(social)
				.done(function(){
					social.insertDOM();
					ENV.db_socials.reorder(ordered_idarray($('section.socials .sortable li')));
					resetFlags();
					closeTray($('.tray.social'));
				})
		}
	}
	else
		closeTray($('.tray.social'));
}
function pressDeleteSocial()
{
	if (ENV.flags == FLAG_NEW)
	{
		resetFlags();
		closeTray($('.tray.social'));
	}
	else
	{
		popup_confirm("Are you sure you want to delete this social link ?", function(confirm){
			if (confirm)
			{
				var social = ENV.editionObject;
				ENV.db_socials.delete(social)
					.done(function(){
						social.deleteDOM();
						resetFlags();
						closeTray($('.tray.social'));
					});
			}
		});
	}
}