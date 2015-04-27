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

MSE_JPS.listeners.source = {

	add: function()
	{
		var p = MSE_JPS.popup.open();
		p	.append($('<h4/>'   ).text('New Link'))
			.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Title'))
			.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Url'  ))
			.append($('<a/>').addClass('button').text('Cancel').click(function(){
				MSE_JPS.popup.close(p);
			}))
			.append($('<a/>').addClass('button').text('Ok').click(function(){
				title = p.find('input').eq(0).val().trim();
				url   = p.find('input').eq(1).val().trim();
				if (title && url)
				{
					var source = new MSE_JPS.entry.Source();
					source.title       = title;
					source.url         = url;
					source.referenceID = MSE_JPS.ENV.editionObject.id;
					MSE_JPS.ENV.db_sources.insert(source)
						.done(function(){
							source.insertDOM();
							MSE_JPS.ENV.db_sources.reorder(MSE_JPS.tools.ordered_idarray($('.tray.reference .sortable li')));
							MSE_JPS.popup.close(p);
						})
				}
			}));
	},

	edit: function(sourceID)
	{
		var source = MSE_JPS.ENV.db_sources.get(sourceID);
		var p = MSE_JPS.popup.open();
		p	.append($('<h4/>'   ).text('New Link'))
			.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Title').val(source.title))
			.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Url'  ).val(source.url))
			.append($('<a/>').addClass('button').text('Cancel').click(function(){
				MSE_JPS.popup.close(p);
			}))
			.append($('<a/>').addClass('button').text('Ok').click(function(){
				title = p.find('input').eq(0).val().trim();
				url   = p.find('input').eq(1).val().trim();
				if (title && url)
				{
					source.title       = title;
					source.url         = url;
					MSE_JPS.ENV.db_sources.update(source)
						.done(function(){
							source.updateDOM();
							MSE_JPS.popup.close(p);
						})
				}
			}));
	},

	delete: function(sourceID)
	{
		MSE_JPS.popup.confirm("Are you sure you want to delete this source ?", function(confirm){
			if (confirm)
			{
				var source = MSE_JPS.ENV.db_sources.get(sourceID);
				MSE_JPS.ENV.db_sources.delete(source)
					.done(function(){
						source.deleteDOM();
					});
			}
		});
	}

}