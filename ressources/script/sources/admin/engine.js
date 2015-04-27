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

/******************************************************************************
 *                                Environment                                 *
 ******************************************************************************/
console.info("allocating shared memory");

MSE_JPS.ENV = {

	FLAG_NULL:     0x0,
	FLAG_EDIT:     0x1,
	FLAG_NEW:      0x2,

	flags:         MSE_JPS.FLAG_NULL,
	currentPage:   undefined,
	editionObject: undefined,

	resetFlags: function() { MSE_JPS.ENV.flags = MSE_JPS.FLAG_NULL; }
}

/******************************************************************************
 *                                   Setup                                    *
 ******************************************************************************/
$(function(){
	console.info("loading complete");

	//============================================================================
	console.group("building context");
	var popup = MSE_JPS.popup.open().append($('<h4/>').text('loading...'));
	//============================================================================

	//-----------------------------------------
	console.info("autocomplete intialisation");
	MSE_JPS.autocomplete.build();

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
		update: function(){ MSE_JPS.ENV.db_articles .reorder(MSE_JPS.tools.ordered_idarray($(this).find('li'))); }
	});
	$('section.links    .sortable').sortable({
		handle: ".handle",
		update: function(){ MSE_JPS.ENV.db_links    .reorder(MSE_JPS.tools.ordered_idarray($(this).find('li'))); }
	});
	$('section.pages    .sortable').sortable({
		handle: ".handle",
		update: function(){ MSE_JPS.ENV.db_pages    .reorder(MSE_JPS.tools.ordered_idarray($(this).find('li'))); }
	});
	$('section.socials  .sortable').sortable({
		handle: ".handle",
		update: function(){ MSE_JPS.ENV.db_socials  .reorder(MSE_JPS.tools.ordered_idarray($(this).find('li'))); }
	});
	$('.tray.article    .sortable').sortable({
		handle: ".handle",
		update: function(){ MSE_JPS.ENV.db_citations.reorder(MSE_JPS.tools.ordered_idarray($(this).find('li'))); }
	});
	$('.tray.reference  .sortable').sortable({
		handle: ".handle",
		update: function(){ MSE_JPS.ENV.db_sources  .reorder(MSE_JPS.tools.ordered_idarray($(this).find('li'))); }
	});

	//-----------------------------------
	console.info("setting environment");
	MSE_JPS.ENV.db_articles = new MSE_JPS.container.POSTContainer({
		target        : '../ressources/MSE/updater.php',
		allocator     : MSE_JPS.entry.Article,
		query_select  : 'select_articles',
		query_insert  : 'insert_article',
		query_update  : 'update_article',
		query_delete  : 'delete_article',
		query_reorder : 'reorder_article'
	});
	MSE_JPS.ENV.db_citations = new MSE_JPS.container.POSTContainer({
		target        : '../ressources/MSE/updater.php',
		allocator     : MSE_JPS.entry.Citation,
		query_select  : 'select_citations',
		query_insert  : 'insert_citation',
		query_delete  : 'delete_citation',
		query_reorder : 'reorder_citation'
	});
	MSE_JPS.ENV.db_links = new MSE_JPS.container.POSTContainer({
		target        : '../ressources/MSE/updater.php',
		allocator     : MSE_JPS.entry.Link,
		query_select  : 'select_links',
		query_insert  : 'insert_link',
		query_update  : 'update_link',
		query_delete  : 'delete_link',
		query_reorder : 'reorder_link'
	});
	MSE_JPS.ENV.db_pages = new MSE_JPS.container.POSTContainer({
		target        : '../ressources/MSE/updater.php',
		allocator     : MSE_JPS.entry.Page,
		query_select  : 'select_pages',
		query_insert  : 'insert_page',
		query_update  : 'update_page',
		query_delete  : 'delete_page',
		query_reorder : 'reorder_page'
	});
	MSE_JPS.ENV.db_references = new MSE_JPS.container.POSTContainer({
		target        : '../ressources/MSE/updater.php',
		allocator     : MSE_JPS.entry.Reference,
		query_select  : 'select_references',
		query_insert  : 'insert_reference',
		query_update  : 'update_reference',
		query_delete  : 'delete_reference'
	});
	MSE_JPS.ENV.db_socials = new MSE_JPS.container.POSTContainer({
		target        : '../ressources/MSE/updater.php',
		allocator     : MSE_JPS.entry.Social,
		query_select  : 'select_socials',
		query_insert  : 'insert_social',
		query_update  : 'update_social',
		query_delete  : 'delete_social',
		query_reorder : 'reorder_social'
	});
	MSE_JPS.ENV.db_sources = new MSE_JPS.container.POSTContainer({
		target        : '../ressources/MSE/updater.php',
		allocator     : MSE_JPS.entry.Source,
		query_select  : 'select_sources',
		query_insert  : 'insert_source',
		query_update  : 'update_source',
		query_delete  : 'delete_source',
		query_reorder : 'reorder_source'
	});

	//-------------------------------
	console.info("reading database");
	MSE_JPS.ENV.db_articles.select();
	MSE_JPS.ENV.db_citations.select();
	MSE_JPS.ENV.db_sources.select();
	MSE_JPS.ENV.db_links.select().done(function(){
		for (value of MSE_JPS.ENV.db_links.orderedValues())
			value.insertDOM();
	});
	MSE_JPS.ENV.db_pages.select().done(function(){
		for (value of MSE_JPS.ENV.db_pages.orderedValues())
			value.insertDOM();
	});
	MSE_JPS.ENV.db_references.select().done(function(){
		MSE_JPS.autocomplete.fill();
		for (value of MSE_JPS.ENV.db_references.orderedValues())
			value.insertDOM();
	});
	MSE_JPS.ENV.db_socials.select().done(function(){
		for (value of MSE_JPS.ENV.db_socials.orderedValues())
			value.insertDOM();
	});

	//============================================================================
	MSE_JPS.popup.close(popup);
	console.groupEnd();
	//============================================================================

	console.info("Ready !");
});



