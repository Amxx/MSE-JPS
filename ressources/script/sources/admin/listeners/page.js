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
MSE_JPS.listeners = MSE_JPS.listeners || {};

MSE_JPS.listeners.page = {

	new: function()
	{
		MSE_JPS.tray.launch($('.tray.page'), undefined, function(){ MSE_JPS.entry.Page.prototype.setTray(); });
	},

	edit: function(pageID)
	{
		var page = MSE_JPS.ENV.db_pages.get(pageID);
		MSE_JPS.tray.launch($('.tray.page'), page, function(){ page.setTray(); });
	},

	commit: function()
	{
		if (MSE_JPS.ENV.flags)
		{
			if (!$('#input_page_title').val().trim())
			{
				MSE_JPS.popup.info("Title should not be empty");
			}
			else if (MSE_JPS.ENV.editionObject)
			{
				var page = MSE_JPS.ENV.editionObject;
				page.getTray();
				MSE_JPS.ENV.db_pages.update(page)
					.done(function(){
						page.updateDOM();
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.page'));
					});
			}
			else
			{
				var page = new MSE_JPS.entry.Page();
				page.getTray();
				MSE_JPS.ENV.db_pages.insert(page)
					.done(function(){
						page.insertDOM();
						MSE_JPS.ENV.db_pages.reorder(MSE_JPS.tools.ordered_idarray($('section.pages .sortable li')));
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.page'));
						MSE_JPS.tools.viewPage(page.id);
					})
			}
		}
		else
			MSE_JPS.tray.close($('.tray.page'));
	},

	delete: function()
	{
		if (MSE_JPS.ENV.flags == MSE_JPS.ENV.FLAG_NEW)
		{
			MSE_JPS.ENV.resetFlags();
			MSE_JPS.tray.close($('.tray.page'));
		}
		else
		{
			MSE_JPS.popup.confirm("Are you sure you want to delete this page ?", function(confirm){
				if (confirm)
				{
					var page = MSE_JPS.ENV.editionObject;
					MSE_JPS.ENV.db_pages.delete(page)
						.done(function(){
							if (MSE_JPS.ENV.currentPage == page.id)
								MSE_JPS.tools.viewPage();
							var articles = MSE_JPS.ENV.db_articles.values().filter(function(a){ return a.pageID == page.id; });
							for (article of articles)
								MSE_JPS.ENV.db_articles.rem(article);
							page.deleteDOM();
							MSE_JPS.ENV.resetFlags();
							MSE_JPS.tray.close($('.tray.page'));
						});
				}
			});
		}
	}

}