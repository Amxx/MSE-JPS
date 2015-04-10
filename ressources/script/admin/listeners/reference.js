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

function pressNewReference()
{
	launchTray($('.tray.reference'), undefined, function(){ Reference.prototype.setTray(); });
}
function pressEditReference(referenceID)
{
	var reference = ENV.db_references.get(referenceID);
	launchTray($('.tray.reference'), reference, function(){ reference.setTray(); });
}
function pressCommitReference()
{
	if (ENV.flags)
	{
		if (!$('.tray.reference #input_reference_title').val().trim())
		{
			popup_information("Title should not be empty");
		}
		else if (ENV.editionObject)
		{
			var reference = ENV.editionObject;
			reference.getTray();
			ENV.db_references.update(reference)
				.done(function(){
					reference.updateDOM();
					fillAutocomplete();
					resetFlags();
					closeTray($('.tray.reference'));
				});
		}
		else
		{
			var reference = new Reference();
			reference.getTray();
			ENV.db_references.insert(reference)
				.done(function(){
					reference.insertDOM();
					ENV.db_references.reorder(ordered_idarray($('section.references .sortable li')));
					fillAutocomplete();
					resetFlags();
					closeTray($('.tray.reference'));
				})
		}
	}
	else
		closeTray($('.tray.reference'));
}
function pressDeleteReference()
{
	if (ENV.flags == FLAG_NEW)
	{
		resetFlags();
		closeTray($('.tray.reference'));
	}
	else
	{
		popup_confirm("Are you sure you want to delete this reference ?", function(confirm){
			if (confirm)
			{
				var reference = ENV.editionObject;
				ENV.db_references.delete(reference)
					.done(function(){
						var citations = ENV.db_citations.values().filter(a => a.referenceID == reference.id);
						for (citation of citations)
							ENV.db_citations.rem(citation);
						reference.deleteDOM();
						fillAutocomplete();
						resetFlags();
						closeTray($('.tray.reference'));
					});
			}
		});
	}
}