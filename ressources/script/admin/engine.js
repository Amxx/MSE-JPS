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
// ================================== Config ===================================
const UPDATER = 'updater.php'

// ================================ Containers =================================
function Container()
{
	this.data = new Object();
	this.at     = function(objID)	{ return this.data[objID];							}
	this.insert = function(obj)		{ return this.data[obj.id] = obj;				}
	this.remove = function(obj)		{ delete this.data[obj.id];							}
	this.size		= function()			{ return Object.keys(this.data).length;	}
	this.values	= function()
	{
		return Object
			.keys(this.data)
			.map(key => this.data[key]);
	}
	this.orderedValues = function()
	{
		return Object
			.keys(this.data)
			.sort((a, b) => this.data[a].order > this.data[b].order)
			.map(key => this.data[key]);
	}
	this.revOrderedValues = function()
	{
		return Object
			.keys(this.data)
			.sort((a, b) => this.data[a].order < this.data[b].order)
			.map(key => this.data[key]);
	}
}

// ================================ Environment ================================
const FLAG_NULL = 0x0;
const FLAG_EDIT = 0x1;
const FLAG_NEW  = 0x2;

var ENV = new Object();
ENV.flags         = 0x0;
ENV.currentPage   = undefined;
ENV.editionObject = undefined;
ENV.db_pages      = new Container();
ENV.db_articles   = new Container();
ENV.db_references = new Container();
ENV.db_links      = new Container();
ENV.db_socials    = new Container();

function resetFlags() { ENV.flags  = 0x0; }

// ================================== Objects ==================================
$.getScript('../ressources/script/admin/obj_page.js'     );
$.getScript('../ressources/script/admin/obj_article.js'  );
$.getScript('../ressources/script/admin/obj_reference.js');
$.getScript('../ressources/script/admin/obj_link.js'     );
$.getScript('../ressources/script/admin/obj_social.js'   );

// =================================== Tray ====================================
$.getScript('../ressources/script/admin/tray.js');

// ==================================== Tab ====================================
function changeTab(id)
{
	if (!$('#nav li').eq(id).hasClass('current'))
	{
		$('#nav li.current').removeClass('current');
		$('#nav li').eq(id).addClass('current');
	
		$('main .tab:visible').slideToggle();
		$('main .tab').eq(id).slideToggle();
	}
}

// ============================== Initialization ===============================
function initTab()
{
	$('#nav li').eq(0).addClass('current');
	$('main .tab').slice(1).hide();
}
function initSection()
{
	$('section.articles .slider').hide();
}
function initSortable()
{
	$('section.pages .sortable').sortable({
		handle: ".handle",
		update: function(){ reorderPages();	}
	});
	$('section.articles .sortable').sortable({
		handle: ".handle",
		update: function(){ reorderArticle(); }
	});
	$('section.links .sortable').sortable({
		handle: ".handle",
		update: function(){ reorderLink(); }
	});
	$('section.socials .sortable').sortable({
		handle: ".handle",
		update: function(){ reorderSocial(); }
	});
}
function initContent()
{
	$.post(UPDATER, { QUERY: "get_all" }, function(data) {	
		// -------------------------- Filling containers ---------------------------
		for (pageSQL      of data.pages     ) ENV.db_pages.insert			(new SQL2Page     (pageSQL     ));
		for (articleSQL   of data.articles  ) ENV.db_articles.insert	(new SQL2Article  (articleSQL  ));
		for (referenceSQL of data.references) ENV.db_references.insert(new SQL2Reference(referenceSQL));
		for (linkSQL      of data.links     ) ENV.db_links.insert     (new SQL2Link     (linkSQL     ));
		for (socialSQL    of data.socials   ) ENV.db_socials.insert   (new SQL2Social   (socialSQL   ));

		// ------------------------------- Build DOM -------------------------------
		for (pageOBJ      of ENV.db_pages.orderedValues()     ) newPageDOM     (pageOBJ     );
		for (referenceOBJ of ENV.db_references.orderedValues()) newReferenceDOM(referenceOBJ);
		for (linkOBJ      of ENV.db_links.orderedValues()     ) newLinkDOM     (linkOBJ     );
		for (socialOBJ    of ENV.db_socials.orderedValues()   ) newSocialDOM   (socialOBJ   );
		// -------------------------------------------------------------------------
	}, 'json')
	.fail(function(){
		alert('Error in POST request');
	})
}

// ================================== RUNNING ==================================
$(function(){
	// info popup
	var info = openPopup().append($('<h4/>').text('loading'));
	// Initialisation
	initTab();
	initSection();
	initContent();
	initSortable();
	// close popup
	closePopup(info);
});










			

