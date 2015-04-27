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

MSE_JPS.listeners.article = {

	new: function()
	{
		MSE_JPS.tray.launch($('.tray.article'), undefined, function(){ MSE_JPS.entry.Article.prototype.setTray(); });
	},

	edit: function(articleID)
	{
		var article = MSE_JPS.ENV.db_articles.get(articleID);
		MSE_JPS.tray.launch($('.tray.article'), article, function(){ article.setTray(); });
	},

	commit: function()
	{
		if (MSE_JPS.ENV.flags)
		{
			if (!$('#input_article_title').val().trim())
			{
				MSE_JPS.popup.info("Title should not be empty");
			}
			else if (MSE_JPS.ENV.editionObject)
			{
				var article = MSE_JPS.ENV.editionObject;
				article.getTray();
				MSE_JPS.ENV.db_articles.update(article)
					.done(function(){
						article.updateDOM();
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.article'));
					});
			}
			else
			{
				var article = new MSE_JPS.entry.Article();
				article.getTray();
				article.pageID = MSE_JPS.ENV.currentPage;
				MSE_JPS.ENV.db_articles.insert(article)
					.done(function(){
						article.insertDOM();
						MSE_JPS.ENV.db_articles.reorder(MSE_JPS.tools.ordered_idarray($('section.articles .sortable li')));
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.article'));
					})
			}
		}
		else
			MSE_JPS.tray.close($('.tray.article'));
	},

	delete: function()
	{
		if (MSE_JPS.ENV.flags == MSE_JPS.ENV.FLAG_NEW)
		{
			MSE_JPS.ENV.resetFlags();
			MSE_JPS.tray.close($('.tray.article'));
		}
		else
		{
			MSE_JPS.popup.confirm("Are you sure you want to delete this article ?", function(confirm){
				if (confirm)
				{
					var article = MSE_JPS.ENV.editionObject;
					MSE_JPS.ENV.db_articles.delete(article)
						.done(function(){
							var citations = MSE_JPS.ENV.db_citations.values().filter(function(a){ return a.articleID == article.id; });
							for (citation of citations)
								MSE_JPS.ENV.db_citations.rem(citation);
							article.deleteDOM();
							MSE_JPS.ENV.resetFlags();
							MSE_JPS.tray.close($('.tray.article'));
						});
				}
			});
		}
	}


}
