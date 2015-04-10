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

function pressNewArticle()
{
	launchTray($('.tray.article'), undefined, function(){ Article.prototype.setTray(); });
}
function pressEditArticle(articleID)
{
	var article = ENV.db_articles.get(articleID);
	launchTray($('.tray.article'), article, function(){ article.setTray(); });
}
function pressCommitArticle()
{
	if (ENV.flags)
	{
		if (!$('#input_article_title').val().trim())
		{
			popup_information("Title should not be empty");
		}
		else if (ENV.editionObject)
		{
			var article = ENV.editionObject;
			article.getTray();
			ENV.db_articles.update(article)
				.done(function(){
					article.updateDOM();
					resetFlags();
					closeTray($('.tray.article'));
				});
		}
		else
		{
			var article = new Article();
			article.getTray();
			article.pageID = ENV.currentPage;
			ENV.db_articles.insert(article)
				.done(function(){
					article.insertDOM();
					ENV.db_articles.reorder(ordered_idarray($('section.articles .sortable li')));
					resetFlags();
					closeTray($('.tray.article'));
				})
		}
	}
	else
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
				var article = ENV.editionObject;
				ENV.db_articles.delete(article)
					.done(function(){
						var citations = ENV.db_citations.values().filter(a => a.articleID == article.id);
						for (citation of citations)
							ENV.db_citations.rem(citation);
						article.deleteDOM();
						resetFlags();
						closeTray($('.tray.article'));
					});
			}
		});
	}
}
