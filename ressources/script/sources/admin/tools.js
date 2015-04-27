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

MSE_JPS.tools = {

	ordered_idarray: function(block)
	{
		return block.toArray().map(function(e){ return parseInt($(e).attr('id').match(/(\d+)$/)); });
	},

	viewTab: function(id)
	{
		if (!$('#nav li').eq(id).hasClass('current'))
		{
			$('#nav li.current').removeClass('current');
			$('#nav li').eq(id).addClass('current');

			$('main .tab:visible').slideToggle();
			$('main .tab').eq(id).slideToggle();
		}
	},

	viewPage: function(pageID)
	{
		if (MSE_JPS.ENV.currentPage != pageID)
			MSE_JPS.tray.close($('.tray.expanded'), function(){
				MSE_JPS.ENV.resetFlags();

				$('section.pages .sortable .expanded').removeClass('expanded');
				if (pageID != undefined)
					$('section.pages .sortable').find('#page_'+pageID).addClass('expanded');

				var slider = $('section.articles .slider');
				// Hide
				slider.hide('slide', { direction: "left" }, function(){
					// Set env
					MSE_JPS.ENV.currentPage = pageID;
					// Cleanup
					$('section.articles .sortable li').remove();
					// Fill
					if (pageID != undefined)
					{
						var articles = MSE_JPS.ENV.db_articles.values()
							.filter(function(a){ return a.pageID == pageID; })
							.sort(function(a,b){ return a.order > b.order; });
						for (article of articles)
							article.insertDOM();
						// Show
						slider.show('slide', { direction: "left" });
					}
				});
			});
	},

	viewCitations: function(articleID)
	{
		$('.tray.article .sortable li').remove();
		for (citation of MSE_JPS.ENV.db_citations.values().filter(function(e){ return e.articleID == articleID; }))
			citation.insertDOM();
	},

	viewSources: function(referenceID)
	{
		$('.tray.reference .sortable li').remove();
		for (source of MSE_JPS.ENV.db_sources.values().filter(function(e){ return e.referenceID == referenceID; }))
			source.insertDOM();
	}

}