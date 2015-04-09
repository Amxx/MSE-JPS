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
$.getScript('../ressources/script/admin/container/container.js'     );
$.getScript('../ressources/script/admin/container/postcontainer.js' );
$.getScript('../ressources/script/admin/entry/entry.js'             );
$.getScript('../ressources/script/admin/entry/instance/article.js'  );
$.getScript('../ressources/script/admin/entry/instance/link.js'     );
$.getScript('../ressources/script/admin/entry/instance/page.js'     );
$.getScript('../ressources/script/admin/entry/instance/reference.js');
$.getScript('../ressources/script/admin/entry/instance/social.js'   );
$.getScript('../ressources/script/admin/tools.js'                   );
// $.ajaxSetup({async: true});

/******************************************************************************
 *                                Environment                                 *
 ******************************************************************************/
console.info("allocating sharred memory");
const FLAG_NULL = 0x0;
const FLAG_EDIT = 0x1;
const FLAG_NEW = 0x2;

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
	
	//--------------------------------
	console.info("tab intialisation");
	$('#nav li').eq(0).addClass('current');
	$('main .tab').slice(1).hide();

	//-----------------------------------
	console.info("slider intialisation");
	$('section.articles .slider').hide();

	//-------------------------------------
	console.info("sortable intialisation");
	$('section.pages    .sortable').sortable({ handle: ".handle", update: function(){ reorderPages();   } });
	$('section.articles .sortable').sortable({ handle: ".handle", update: function(){ reorderArticle(); } });
	$('section.links    .sortable').sortable({ handle: ".handle", update: function(){ reorderLink();    } });
	$('section.socials  .sortable').sortable({ handle: ".handle", update: function(){ reorderSocial();  }	});

	//-----------------------------------
	console.info("setting environment");
	ENV.db_articles = new POSTContainer({
		target       : 'updater.php',
		allocator    : Article,
		query_select : 'select_articles',
		query_insert : 'insert_article',
		query_update : 'update_article',
		query_delete : 'delete_article'
	});
	ENV.db_links = new POSTContainer({
		target       : 'updater.php',
		allocator    : Link,
		query_select : 'select_links',
		query_insert : 'insert_link',
		query_update : 'update_link',
		query_delete : 'delete_link'
	});
	ENV.db_pages = new POSTContainer({
		target       : 'updater.php',
		allocator    : Page,
		query_select : 'select_pages',
		query_insert : 'insert_page',
		query_update : 'update_page',
		query_delete : 'delete_page'
	});
	ENV.db_references = new POSTContainer({
		target       : 'updater.php',
		allocator    : Reference,
		query_select : 'select_references',
		query_insert : 'insert_reference',
		query_update : 'update_reference',
		query_delete : 'delete_reference'
	});
	ENV.db_socials = new POSTContainer({
		target       : 'updater.php',
		allocator    : Social,
		query_select : 'select_socials',
		query_insert : 'insert_social',
		query_update : 'update_social',
		query_delete : 'delete_social'
	});

	//-------------------------------
	console.info("reading database");
	ENV.db_articles     .select(); //.done(function(){ for (value of ENV.db_articles  .values()) value.insertDOM(); });
	ENV.db_links        .select().done(function(){ for (value of ENV.db_links     .values()) value.insertDOM(); });
	ENV.db_pages        .select().done(function(){ for (value of ENV.db_pages     .values()) value.insertDOM(); });
	ENV.db_references   .select().done(function(){ for (value of ENV.db_references.values()) value.insertDOM(); });
	ENV.db_socials      .select().done(function(){ for (value of ENV.db_socials   .values()) value.insertDOM(); });

	//============================================================================
	closePopup(popup);
	console.groupEnd();
	//============================================================================

	console.info("Ready !");
});