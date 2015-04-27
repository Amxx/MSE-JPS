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

MSE_JPS.listeners.citation = {

	add: function(referenceID)
	{
		var citation = new MSE_JPS.entry.Citation();
		citation.articleID   = MSE_JPS.ENV.editionObject.id;
		citation.referenceID = referenceID;
		MSE_JPS.ENV.db_citations.insert(citation)
			.done(function(){
				citation.insertDOM();
				MSE_JPS.ENV.db_citations.reorder(MSE_JPS.tools.ordered_idarray($('.tray.article .sortable li')));
			})
	},

	delete: function(citationID)
	{
		MSE_JPS.popup.confirm("Are you sure you want to delete this citation ?", function(confirm){
			var citation = MSE_JPS.ENV.db_citations.get(citationID);
			MSE_JPS.ENV.db_citations.delete(citation)
				.done(function(){
					citation.deleteDOM();
				});
		});
	}

}