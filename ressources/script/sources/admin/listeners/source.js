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

function pressAddSource()
{
	var p = openPopup();
	p	.append($('<h4/>'   ).text('New Link'))
		.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Title'))
		.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Url'  ))
		.append($('<a/>').addClass('button').text('Cancel').click(function(){
			closePopup(p);
		}))
		.append($('<a/>').addClass('button').text('Ok').click(function(){
			title = p.find('input').eq(0).val().trim();
			url   = p.find('input').eq(1).val().trim();
			if (title && url)
			{
				var source = new Source();
				source.title       = title;
				source.url         = url;
				source.referenceID = ENV.editionObject.id;
				ENV.db_sources.insert(source)
					.done(function(){
						source.insertDOM();
						ENV.db_sources.reorder(ordered_idarray($('.tray.reference .sortable li')));
						closePopup(p);
					})
			}
		}));
}

function pressEditSource(sourceID)
{
	var source = ENV.db_sources.get(sourceID);

	var p = openPopup();
	p	.append($('<h4/>'   ).text('New Link'))
		.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Title').val(source.title))
		.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Url'  ).val(source.url))
		.append($('<a/>').addClass('button').text('Cancel').click(function(){
			closePopup(p);
		}))
		.append($('<a/>').addClass('button').text('Ok').click(function(){
			title = p.find('input').eq(0).val().trim();
			url   = p.find('input').eq(1).val().trim();
			if (title && url)
			{
				source.title       = title;
				source.url         = url;
				ENV.db_sources.update(source)
					.done(function(){
						source.updateDOM();
						closePopup(p);
					})
			}
		}));



}

function pressDeleteSource(sourceID)
{
	popup_confirm("Are you sure you want to delete this source ?", function(confirm){
		var source = ENV.db_sources.get(sourceID);
		ENV.db_sources.delete(source)
			.done(function(){
				source.deleteDOM();
			});
	});
}