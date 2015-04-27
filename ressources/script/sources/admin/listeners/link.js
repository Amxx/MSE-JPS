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

MSE_JPS.listeners.link = {

	new: function()
	{
		MSE_JPS.tray.launch($('.tray.link'), undefined, function(){ MSE_JPS.entry.Link.prototype.setTray(); });
	},

	edit: function(linkID)
	{
		var link = MSE_JPS.ENV.db_links.get(linkID);
		MSE_JPS.tray.launch($('.tray.link'), link, function(){ link.setTray(); });
	},

	commit: function()
	{
		if (MSE_JPS.ENV.flags)
		{
			if (!$('#input_link_title').val().trim())
			{
				MSE_JPS.popup.info("Title should not be empty");
			}
			else if (MSE_JPS.ENV.editionObject)
			{
				var link = MSE_JPS.ENV.editionObject;
				link.getTray();
				MSE_JPS.ENV.db_links.update(link)
					.done(function(){
						link.updateDOM();
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.link'));
					});
			}
			else
			{
				var link = new MSE_JPS.entry.Link();
				link.getTray();
				MSE_JPS.ENV.db_links.insert(link)
					.done(function(){
						link.insertDOM();
						MSE_JPS.ENV.db_links.reorder(MSE_JPS.tools.ordered_idarray($('section.links .sortable li')));
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.link'));
					})
			}
		}
		else
			MSE_JPS.tray.close($('.tray.link'));
	},

	delete: function()
	{
		if (MSE_JPS.ENV.flags == MSE_JPS.ENV.FLAG_NEW)
		{
			MSE_JPS.ENV.resetFlags();
			MSE_JPS.tray.close($('.tray.link'));
		}
		else
		{
			MSE_JPS.popup.confirm("Are you sure you want to delete this link ?", function(confirm){
				if (confirm)
				{
					var link = MSE_JPS.ENV.editionObject;
					MSE_JPS.ENV.db_links.delete(link)
						.done(function(){
							link.deleteDOM();
							MSE_JPS.ENV.resetFlags();
							MSE_JPS.tray.close($('.tray.link'));
						});
				}
			});
		}
	}


}