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
	this.id         = -1;
	this.pageID			=	-1;
	this.title      = '';
	this.text       = '';
	this.javascript = '';
	this.archived   = false;
	// this.citations  = new Map();
}

// ============================= Article - Buttons =============================
function pressNewArticle()
{
	openTray($('.tray.article'), function(){
		// Set environment
		ENV.flags     = FLAG_NEW;
		ENV.editionID = undefined;
		// Clean tray
		$('.tray.article #input_article_title'     ).val('new article');
		$('.tray.article #input_article_text'      ).val('');
		$('.tray.article #input_article_javascript').val('');
		$('.tray.article #input_article_archived'  ).prop('checked', false);
	});
}
function pressEditArticle(articleID)
{
	openTray($('.tray.article'), function(){
		var articleOBJ = ENV.db_pages.at(ENV.pageID).articles.at(articleID);
		// Set environment
		ENV.flags     = FLAG_NULL;
		ENV.editionID = articleID;
		// Set tray
		$('.tray.article #input_article_title'     ).val(articleOBJ.title);
		$('.tray.article #input_article_text'      ).val(articleOBJ.text);
		$('.tray.article #input_article_javascript').val(articleOBJ.javascript);
		$('.tray.article #input_article_archived'  ).prop('checked', articleOBJ.archived);
	});
}
function pressCommitArticle()
{
	if (ENV.flags)
	{
		(ENV.editionID==undefined?newArticle:updateArticle)();
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
					deleteArticle();
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
	// Get tray data
	articleOBJ.title      = $('.tray.article #input_article_title'     ).val();
	articleOBJ.text       = $('.tray.article #input_article_text'      ).val();
	articleOBJ.javascript = $('.tray.article #input_article_javascript').val();
	articleOBJ.archived   = $('.tray.article #input_article_archived'  ).prop('checked');
	articleOBJ.pageID     = ENV.pageID;

	// TMP Set id
	articleOBJ.id    = ENV.db_pages.at(ENV.pageID).articles.size();
	// Remote push 
	// ...
	// Local push + build
	newArticleDOM(articleOBJ, true);
	ENV.db_pages.at(ENV.pageID).articles.insert(articleOBJ);
}

function updateArticle()
{
	var articleOBJ = ENV.db_pages.at(ENV.pageID).articles.at(ENV.editionID);
	// Update Obj
	articleOBJ.title      = $('.tray.article #input_article_title'     ).val();
	articleOBJ.text       = $('.tray.article #input_article_text'      ).val();
	articleOBJ.javascript = $('.tray.article #input_article_javascript').val();
	articleOBJ.archived   = $('.tray.article #input_article_archived'  ).prop('checked');
	// Remote update
	// ...
	// Local update
	updateArticleDOM(articleOBJ);
}
function deleteArticle()
{
	var articleOBJ = ENV.db_pages.at(ENV.pageID).articles.at(ENV.editionID);
	// Remote delete
	// ...
	// Local delete
	deleteArticleDOM(articleOBJ);
	ENV.db_pages.at(ENV.pageID).articles.remove(articleOBJ.id);
}

// ================================ Article DOM ================================
function newArticleDOM(articleOBJ, front)
{
	var block = $('<li/>')
			.attr('id', 'article_'+ENV.pageID+'_'+articleOBJ.id)
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
		.filter(function(){ return $(this).attr('id') == 'article_'+ENV.pageID+'_'+articleOBJ.id; })
		.find('a.title')
		.text(articleOBJ.title);
}
function deleteArticleDOM(articleOBJ)
{
	$('section.articles .sortable li')
		.filter(function(){ return $(this).attr('id') == 'article_'+ENV.pageID+'_'+articleOBJ.id; })
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
		ENV.pageID = pageID;
		// Cleanup
		$('section.articles .sortable li').remove();
		if (pageID != undefined)
		{
			// Fill
			for (articleOBJ of ENV.db_pages.at(ENV.pageID).articles.orderedValues())
				newArticleDOM(articleOBJ);
			// Show
			slider.show('slide', { direction: "left" });
		}
	});
}
