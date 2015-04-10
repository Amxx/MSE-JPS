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
}