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

MSE_JPS.listeners.social = {

	new : function()
	{
		MSE_JPS.tray.launch($('.tray.social'), undefined, function(){ MSE_JPS.entry.Social.prototype.setTray(); });
	},

	edit: function(socialID)
	{
		var social = MSE_JPS.ENV.db_socials.get(socialID);
		MSE_JPS.tray.launch($('.tray.social'), social, function(){ social.setTray(); });
	},

	commit: function()
	{
		if (MSE_JPS.ENV.flags)
		{
			if (!$('#input_social_title').val().trim())
			{
				MSE_JPS.popup.info("Title should not be empty");
			}
			else if (MSE_JPS.ENV.editionObject)
			{
				var social = MSE_JPS.ENV.editionObject;
				social.getTray();
				MSE_JPS.ENV.db_socials.update(social)
					.done(function(){
						social.updateDOM();
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.social'));
					});
			}
			else
			{
				var social = new MSE_JPS.entry.Social();
				social.getTray();
				MSE_JPS.ENV.db_socials.insert(social)
					.done(function(){
						social.insertDOM();
						MSE_JPS.ENV.db_socials.reorder(MSE_JPS.tools.ordered_idarray($('section.socials .sortable li')));
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.social'));
					})
			}
		}
		else
			MSE_JPS.tray.close($('.tray.social'));
	},

	delete: function()
	{
		if (MSE_JPS.ENV.flags == MSE_JPS.ENV.FLAG_NEW)
		{
			MSE_JPS.ENV.resetFlags();
			MSE_JPS.tray.close($('.tray.social'));
		}
		else
		{
			MSE_JPS.popup.confirm("Are you sure you want to delete this social link ?", function(confirm){
				if (confirm)
				{
					var social = MSE_JPS.ENV.editionObject;
					MSE_JPS.ENV.db_socials.delete(social)
						.done(function(){
							social.deleteDOM();
							MSE_JPS.ENV.resetFlags();
							MSE_JPS.tray.close($('.tray.social'));
						});
				}
			});
		}
	}


}