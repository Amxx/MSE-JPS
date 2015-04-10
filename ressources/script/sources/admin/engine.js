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

/******************************************************************************
 *                                Dependencies                                *
 ******************************************************************************/
// $.ajaxSetup({async: false});
// $.getScript('../ressources/script/admin/container/container.js'     );
// $.getScript('../ressources/script/admin/container/postcontainer.js' );
// $.getScript('../ressources/script/admin/entry/entry.js'             );
// $.getScript('../ressources/script/admin/entry/instance/article.js'  );
// $.getScript('../ressources/script/admin/entry/instance/citation.js' );
// $.getScript('../ressources/script/admin/entry/instance/link.js'     );
// $.getScript('../ressources/script/admin/entry/instance/page.js'     );
// $.getScript('../ressources/script/admin/entry/instance/reference.js');
// $.getScript('../ressources/script/admin/entry/instance/social.js'   );
// $.getScript('../ressources/script/admin/listeners/article.js'       );
// $.getScript('../ressources/script/admin/listeners/citation.js'			);
// $.getScript('../ressources/script/admin/listeners/link.js'          );
// $.getScript('../ressources/script/admin/listeners/page.js'          );
// $.getScript('../ressources/script/admin/listeners/reference.js'     );
// $.getScript('../ressources/script/admin/listeners/social.js'        );
// $.getScript('../ressources/script/admin/autocomplete.js'            );
// $.getScript('../ressources/script/admin/tray.js'                    );
// $.getScript('../ressources/script/admin/tools.js'                   );
// $.ajaxSetup({async: true});

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
		update: function(){ ENV.db_citations   .reorder(ordered_idarray($(this).find('li'))); }
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

	//-------------------------------
	console.info("reading database");
	ENV.db_articles.select();
	ENV.db_citations.select();
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
});