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
function Page()
{
	this.id         = null;
	this.title      = '';
	this.style      = '';
	this.bordered   = false;
	this.expandable = false;
	this.order      = 0;
}
function SQL2Page(pageSQL)
{
	this.id         = pageSQL.Page_ID;
	this.title      = pageSQL.Page_Title;
	this.style			= pageSQL.Page_Style;
	this.bordered		= parseInt(pageSQL.Page_Bordered);
	this.expandable	= parseInt(pageSQL.Page_Expandable);
	this.order			= parseInt(pageSQL.Page_Order);
}

// ================================== Tray IO ==================================
function setPageTray(obj)
{
	$('.tray.page #input_page_title'     ).val (           obj ? obj.title      : 'new page');
	$('.tray.page #input_page_style'     ).val (           obj ? obj.style      : ''        );
	$('.tray.page #input_page_expendable').prop('checked', obj ? obj.expandable : false     );
	$('.tray.page #input_page_bordered'  ).prop('checked', obj ? obj.bordered   : false     );
}
function getPageTray(obj)
{
	obj.title      = $('.tray.page #input_page_title'     ).val();
	obj.style      = $('.tray.page #input_page_style'     ).val();
	obj.expandable = $('.tray.page #input_page_expendable').prop('checked');
	obj.bordered   = $('.tray.page #input_page_bordered'  ).prop('checked');
}

// ============================== Page - Buttons ===============================
function pressNewPage()
{
	launchTray($('.tray.page'), undefined, setPageTray);
}
function pressEditPage(pageID)
{
	launchTray($('.tray.page'), ENV.db_pages.at(pageID), setPageTray);
}
function pressCommitPage()
{
	if (ENV.flags)
	{
		if (ENV.editionObject)
			updatePage(ENV.editionObject);
		else
			newPage()
		resetFlags();
	}
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
				if (!(ENV.flags & FLAG_NEW))
					deletePage(ENV.editionObject);
				resetFlags();
				closeTray($('.tray.page'));
			}
		});
	}
}
function pressExpandPage(pageID)
{
	if (ENV.currentPage != pageID)
		setArticleSection(pageID);
}

// ============================== Page - Methods ===============================
function newPage()
{
	var pageOBJ = new Page();
	getPageTray(pageOBJ);
	// Remote push
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "insert_page", object: pageOBJ }, function(data){
		// record id
		pageOBJ.id = data.id;
		// Local push + build
		newPageDOM(pageOBJ, false); // back
		ENV.db_pages.insert(pageOBJ);
		// Close info
		closePopup(info);
		// Reorder
		reorderPages();
		// Trigger reorder
		setArticleSection(pageOBJ.id);
	}, 'json');
}
function updatePage(pageOBJ)
{
	getPageTray(pageOBJ);
	// Remote update
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "update_page", object: pageOBJ }, function(data){
		// Local update
		updatePageDOM(pageOBJ);
		// Close info
		closePopup(info);
	}, 'json');;
}
function deletePage(pageOBJ)
{
	// Slide
	if (ENV.currentPage == pageOBJ.id)
		setArticleSection();
	// Remote delete
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "drop_page", object: pageOBJ }, function(data){
		// Local delete
		var articles = ENV.db_articles.values().filter(a => a.pageID == pageOBJ.id);
		for (article of articles)
			deleteArticle(article);
		deletePageDOM(pageOBJ);
		ENV.db_pages.remove(pageOBJ.id);
		// Close info
		closePopup(info);
	}, 'json');
}
function reorderPages()
{
	// Get order
	var order = $('section.pages .sortable li').toArray().map( e => parseInt($(e).attr('id').substring(5)) );
	// Remote update
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "reorder_page", array: order }, function(data){
		// Close info
		closePopup(info);
	}, 'json');
}

// ================================= Page DOM ==================================
function newPageDOM(pageOBJ, front)
{
	var block = $('<li/>')
			.attr('id', 'page_'+pageOBJ.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ pressEditPage(pageOBJ.id); })
				.text(pageOBJ.title)
			)
			.append($('<a/>')
				.addClass('pointer')
				.click(function(){ pressExpandPage(pageOBJ.id); })
				.text('\u25B6')
			);
	if (front)
		$('section.pages .sortable').prepend(block);
	else
		$('section.pages .sortable').append(block);
}
function updatePageDOM(pageOBJ)
{
	$('section.pages .sortable li')
		.filter(function(){ return $(this).attr('id') == 'page_'+pageOBJ.id; })
		.find('a.title')
		.text(pageOBJ.title);
}
function deletePageDOM(pageOBJ)
{
	$('section.pages .sortable li')
		.filter(function(){ return $(this).attr('id') == 'page_'+pageOBJ.id; })
		.remove();
}



