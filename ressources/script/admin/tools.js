function ordered_idarray(block)
{
	return block.toArray().map( e => parseInt($(e).attr('id').match(/(\d+)$/)) );
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
						.filter(a => a.pageID == pageID)
						.sort((a,b) => a.order > b.order);
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
	console.log('viewCitations '+articleID);

	$('.tray.article .sortable li').remove();
	for (citation of ENV.db_citations.values().filter(e => e.articleID == articleID))
		citation.insertDOM();
}