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
		if (pageID != undefined)
		{
			// Fill
			for (articleOBJ of ENV.db_articles.orderedValues())
				if (articleOBJ.pageID == pageID)
					articleOBJ.insertDOM();
			// Show
			slider.show('slide', { direction: "left" });
		}
	});
}
