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

function pressNewSocial()
{
	launchTray($('.tray.social'), undefined, function(){ Social.prototype.setTray(); });
}
function pressEditSocial(socialID)
{
	var social = ENV.db_socials.get(socialID);
	launchTray($('.tray.social'), social, function(){ social.setTray(); });
}
function pressCommitSocial()
{
	if (ENV.flags)
	{
		if (!$('#input_social_title').val().trim())
		{
			popup_information("Title should not be empty");
		}
		else if (ENV.editionObject)
		{
			var social = ENV.editionObject;
			social.getTray();
			ENV.db_socials.update(social)
				.done(function(){
					social.updateDOM();
					resetFlags();
					closeTray($('.tray.social'));
				});
		}
		else
		{
			var social = new Social();
			social.getTray();
			ENV.db_socials.insert(social)
				.done(function(){
					social.insertDOM();
					ENV.db_socials.reorder(ordered_idarray($('section.socials .sortable li')));
					resetFlags();
					closeTray($('.tray.social'));
				})
		}
	}
	else
		closeTray($('.tray.social'));
}
function pressDeleteSocial()
{
	if (ENV.flags == FLAG_NEW)
	{
		resetFlags();
		closeTray($('.tray.social'));
	}
	else
	{
		popup_confirm("Are you sure you want to delete this social link ?", function(confirm){
			if (confirm)
			{
				var social = ENV.editionObject;
				ENV.db_socials.delete(social)
					.done(function(){
						social.deleteDOM();
						resetFlags();
						closeTray($('.tray.social'));
					});
			}
		});
	}
}