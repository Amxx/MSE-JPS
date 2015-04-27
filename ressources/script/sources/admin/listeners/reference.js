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

MSE_JPS.listeners.reference = {

	new: function()
	{
		MSE_JPS.tray.launch($('.tray.reference'), undefined, function(){ MSE_JPS.entry.Reference.prototype.setTray(); });
	},

	edit: function(referenceID)
	{
		var reference = MSE_JPS.ENV.db_references.get(referenceID);
		MSE_JPS.tray.launch($('.tray.reference'), reference, function(){ reference.setTray(); });
	},

	commit: function()
	{
		if (MSE_JPS.ENV.flags)
		{
			if (!$('#input_reference_title').val().trim())
			{
				MSE_JPS.popup.info("Title should not be empty");
			}
			else if (MSE_JPS.ENV.editionObject)
			{
				var reference = MSE_JPS.ENV.editionObject;
				reference.getTray();
				MSE_JPS.ENV.db_references.update(reference)
					.done(function(){
						reference.updateDOM();
						MSE_JPS.autocomplete.fill();
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.reference'));
					});
			}
			else
			{
				var reference = new MSE_JPS.entry.Reference();
				reference.getTray();
				MSE_JPS.ENV.db_references.insert(reference)
					.done(function(){
						reference.insertDOM();
						// MSE_JPS.ENV.db_references.reorder(MSE_JPS.tools.ordered_idarray($('section.references .sortable li')));
						MSE_JPS.autocomplete.fill();
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.reference'));
					})
			}
		}
		else
			MSE_JPS.tray.close($('.tray.reference'));
	},

	delete: function()
	{
		if (MSE_JPS.ENV.flags == MSE_JPS.ENV.FLAG_NEW)
		{
			MSE_JPS.ENV.resetFlags();
			MSE_JPS.tray.close($('.tray.reference'));
		}
		else
		{
			MSE_JPS.popup.confirm("Are you sure you want to delete this reference ?", function(confirm){
				if (confirm)
				{
					var reference = MSE_JPS.ENV.editionObject;
					MSE_JPS.ENV.db_references.delete(reference)
						.done(function(){
							var citations = MSE_JPS.ENV.db_citations.values().filter(function(a){ return a.referenceID == reference.id; });
							for (citation of citations)
								MSE_JPS.ENV.db_citations.rem(citation);
							reference.deleteDOM();
							MSE_JPS.autocomplete.fill();
							MSE_JPS.ENV.resetFlags();
							MSE_JPS.tray.close($('.tray.reference'));
						});
				}
			});
		}
	}

}