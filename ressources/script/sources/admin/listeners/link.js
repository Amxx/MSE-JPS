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

function pressNewLink()
{
	launchTray($('.tray.link'), undefined, function(){ Link.prototype.setTray(); });
}
function pressEditLink(linkID)
{
	var link = ENV.db_links.get(linkID);
	launchTray($('.tray.link'), link, function(){ link.setTray(); });
}
function pressCommitLink()
{
	if (ENV.flags)
	{
		if (!$('#input_link_title').val().trim())
		{
			popup_information("Title should not be empty");
		}
		else if (ENV.editionObject)
		{
			var link = ENV.editionObject;
			link.getTray();
			ENV.db_links.update(link)
				.done(function(){
					link.updateDOM();
					resetFlags();
					closeTray($('.tray.link'));
				});
		}
		else
		{
			var link = new Link();
			link.getTray();
			ENV.db_links.insert(link)
				.done(function(){
					link.insertDOM();
					ENV.db_links.reorder(ordered_idarray($('section.links .sortable li')));
					resetFlags();
					closeTray($('.tray.link'));
				})
		}
	}
	else
		closeTray($('.tray.link'));
}
function pressDeleteLink()
{
	if (ENV.flags == FLAG_NEW)
	{
		resetFlags();
		closeTray($('.tray.link'));
	}
	else
	{
		popup_confirm("Are you sure you want to delete this link ?", function(confirm){
			if (confirm)
			{
				var link = ENV.editionObject;
				ENV.db_links.delete(link)
					.done(function(){
						link.deleteDOM();
						resetFlags();
						closeTray($('.tray.link'));
					});
			}
		});
	}
}