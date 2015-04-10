/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-2 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

function ordered_idarray(block)
{
	return block.toArray().map(function(e){ return parseInt($(e).attr('id').match(/(\d+)$/)); });
}

function viewTab(id)
{
	if (!$('#nav li').eq(id).hasClass('current'))
	{
		$('#nav li.current').removeClass('current');
		$('#nav li').eq(id).addClass('current');

		$('main .tab:visible').slideToggle();
		$('main .tab').eq(id).slideToggle();
	}
}

function viewPage(pageID)
{
	if (ENV.currentPage != pageID)
		closeTray($('.tray.expanded'), function(){
			resetFlags();

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
				// Fill
				if (pageID != undefined)
				{
					var articles = ENV.db_articles.values()
						.filter(function(a){ return a.pageID == pageID; })
						.sort(function(a,b){ return a.order > b.order; });
					for (article of articles)
						article.insertDOM();
					// Show
					slider.show('slide', { direction: "left" });
				}
			});
		});
}

function viewCitations(articleID)
{
	$('.tray.article .sortable li').remove();
	for (citation of ENV.db_citations.values().filter(function(e){ return e.articleID == articleID; }))
		citation.insertDOM();
}
function viewSources(referenceID)
{
	$('.tray.reference .sortable li').remove();
	for (source of ENV.db_sources.values().filter(function(e){ return e.referenceID == referenceID; }))
		source.insertDOM();
}