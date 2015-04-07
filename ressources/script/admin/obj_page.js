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
	this.id         = -1;
	this.title      = '';
	this.style      = '';
	this.bordered   = false;
	this.expandable = false;
	this.articles   = new Container();
}

// ============================== Page - Buttons ===============================
function pressNewPage()
{
	openTray($('.tray.page'), function(){
		// Set environment
		ENV.flags     = FLAG_NEW;
		ENV.editionID = undefined;
		// Clean tray
		$('.tray.page #input_page_title'     ).val('new page');
		$('.tray.page #input_page_style'     ).val('');
		$('.tray.page #input_page_expendable').prop('checked', false);
		$('.tray.page #input_page_bordered'  ).prop('checked', false);
	});
}
function pressEditPage(pageID)
{
	openTray($('.tray.page'), function(){
		var pageOBJ = ENV.db_pages.at(pageID);
		// Set environment
		ENV.flags     = FLAG_NULL;
		ENV.editionID = pageID;
		// Set tray
		$('.tray.page #input_page_title'     ).val(pageOBJ.title);
		$('.tray.page #input_page_style'     ).val(pageOBJ.style);
		$('.tray.page #input_page_expendable').prop('checked', pageOBJ.expandable);
		$('.tray.page #input_page_bordered'  ).prop('checked', pageOBJ.bordered);
	});
}
function pressCommitPage()
{
	if (ENV.flags)
	{
		(ENV.editionID==undefined?newPage:updatePage)();
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
					deletePage();
				resetFlags();
				closeTray($('.tray.page'));
			}
		});
	}
}
function pressExpandPage(pageID)
{
	if (ENV.pageID != pageID)
		setArticleSection(pageID);
}

// ============================== Page - Methods ===============================
function newPage()
{
	var pageOBJ = new Page();
	// Get tray data
	pageOBJ.title      = $('.tray.page #input_page_title'     ).val();
	pageOBJ.style      = $('.tray.page #input_page_style'     ).val();
	pageOBJ.expandable = $('.tray.page #input_page_expendable').prop('checked');
	pageOBJ.bordered   = $('.tray.page #input_page_bordered'  ).prop('checked');

	// TMP Set id
	pageOBJ.id = ENV.db_pages.size();
	// Remote push 
	// ...
	// Local push + build
	newPageDOM(pageOBJ);
	ENV.db_pages.insert(pageOBJ);

	// Slide
	setArticleSection(pageOBJ.id);
}

function updatePage()
{
	var pageOBJ = ENV.db_pages.at(ENV.editionID);
	// Update Obj
	pageOBJ.title      = $('.tray.page #input_page_title'     ).val();
	pageOBJ.style      = $('.tray.page #input_page_style'     ).val();
	pageOBJ.expandable = $('.tray.page #input_page_expendable').prop('checked');
	pageOBJ.bordered   = $('.tray.page #input_page_bordered'  ).prop('checked');
	// Remote update
	// ...
	// Local update
	updatePageDOM(pageOBJ);
}
function deletePage()
{
	var pageOBJ = ENV.db_pages.at(ENV.editionID);
	// Slide
	if (ENV.pageID == pageOBJ.id)
		setArticleSection();

	// Remote delete
	// ...
	// Local delete
	deletePageDOM(pageOBJ);
	ENV.db_pages.remove(pageOBJ.id);
}

// ================================= Page DOM ==================================
function newPageDOM(pageOBJ)
{
	$('section.pages .sortable')
		.append($('<li/>')
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
			)
		);
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



