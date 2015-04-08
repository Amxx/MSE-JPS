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
function Article()
{
	this.id         = null;
	this.pageID			=	null;
	this.title      = '';
	this.text       = '';
	this.javascript = '';
	this.archived   = false;
	this.order      = 0;
	// this.citations  = new Map();
}
function SQL2Article(articleSQL)
{
	this.id         = articleSQL.Article_ID;
	this.pageID			=	articleSQL.Page_ID;
	this.title      = articleSQL.Article_Title;
	this.text       = articleSQL.Article_Text;
	this.javascript = articleSQL.Article_Javascript;
	this.archived   = parseInt(articleSQL.Article_Archived);
	this.order      = parseInt(articleSQL.Article_Order);
	// this.citations  = new Map();
}

// ================================== Tray IO ==================================
function setArticleTray(obj)
{
	$('.tray.article #input_article_title'     ).val (           obj ? obj.title      : 'new page');
	$('.tray.article #input_article_text'      ).val (           obj ? obj.text       : ''        );
	$('.tray.article #input_article_javascript').val (           obj ? obj.javascript : ''        );
	$('.tray.article #input_article_archived'  ).prop('checked', obj ? obj.archived   : false     );
}
function getArticleTray(obj)
{
	obj.title      = $('.tray.article #input_article_title'     ).val();
	obj.text       = $('.tray.article #input_article_text'      ).val();
	obj.javascript = $('.tray.article #input_article_javascript').val();
	obj.archived   = $('.tray.article #input_article_archived'  ).prop('checked');
}

// ============================= Article - Buttons =============================
function pressNewArticle()
{
	launchTray($('.tray.article'), undefined, setArticleTray);
}
function pressEditArticle(articleID)
{
	launchTray($('.tray.article'), ENV.db_articles.at(articleID), setArticleTray);
}
function pressCommitArticle()
{
	if (ENV.flags)
	{
		if (ENV.editionObject)
			updateArticle(ENV.editionObject);
		else
			newArticle();
		resetFlags();
	}
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
				if (!(ENV.flags & FLAG_NEW))
					deleteArticle(ENV.editionObject);
				resetFlags();
				closeTray($('.tray.article'));
			}
		});
	}
}

// ============================= Article - Methods =============================
function newArticle()
{
	var articleOBJ = new Article();
	getArticleTray(articleOBJ);
	// Remote push
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "insert_article", object: articleOBJ }, function(data){
		// record id
		articleOBJ.id = data.id;
		// Local push + build
		newArticleDOM(articleOBJ, true); // Front
		ENV.db_articles.insert(articleOBJ);
		// Close info
		closePopup(info);
		// Reorder
		reorderArticle();
	}, 'json');
}

function updateArticle(articleOBJ)
{
	getArticleTray(articleOBJ);
	// Remote update
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "update_article", object: articleOBJ }, function(data){
		// Local update
		updateArticleDOM(articleOBJ);
		// Close info
		closePopup(info);
	}, 'json');
}
function deleteArticle(articleOBJ)
{	
	// Remote delete
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "drop_article", object: articleOBJ }, function(data){
		// Local delete
		deleteArticleDOM(articleOBJ);
		ENV.db_articles.remove(articleOBJ.id);
		// Close info
		closePopup(info);
	}, 'json');
}
function reorderArticle()
{
	var order = $('section.articles .sortable li').toArray().map( e => parseInt($(e).attr('id').substring(8)) );
	// Remote update
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "reorder_article", array: order }, function(data){
		// Close info
		closePopup(info);		
	}, 'json');
}

// ================================ Article DOM ================================
function newArticleDOM(articleOBJ, front)
{
	var block = $('<li/>')
			.attr('id', 'article_'+articleOBJ.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ pressEditArticle(articleOBJ.id); })
				.text(articleOBJ.title)
			);
	if (front)
		$('section.articles .sortable').prepend(block);
	else
		$('section.articles .sortable').append(block);
		
}
function updateArticleDOM(articleOBJ)
{
	$('section.articles .sortable li')
		.filter(function(){ return $(this).attr('id') == 'article_'+articleOBJ.id; })
		.find('a.title')
		.text(articleOBJ.title);
}
function deleteArticleDOM(articleOBJ)
{
	$('section.articles .sortable li')
		.filter(function(){ return $(this).attr('id') == 'article_'+articleOBJ.id; })
		.remove();
}

/******************************************************************************
 *                                S l i d e r                                 *
 ******************************************************************************/
function setArticleSection(pageID)
{
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
		if (pageID != undefined)
		{
			// Fill
			for (articleOBJ of ENV.db_articles.orderedValues())
				if (articleOBJ.pageID == pageID)
					newArticleDOM(articleOBJ);
			// Show
			slider.show('slide', { direction: "left" });
		}
	});
}
