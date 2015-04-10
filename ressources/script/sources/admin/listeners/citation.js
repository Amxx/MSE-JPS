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

function pressAddCitation(referenceID)
{
	var citation = new Citation();
	citation.articleID   = ENV.editionObject.id;
	citation.referenceID = referenceID;
	ENV.db_citations.insert(citation)
		.done(function(){
			citation.insertDOM();
			ENV.db_citations.reorder(ordered_idarray($('.tray.article    .sortable li')));
		})
}

function pressDeleteCitation(citationID)
{
	popup_confirm("Are you sure you want to delete this citation ?", function(confirm){
		var citation = ENV.db_citations.get(citationID);
		ENV.db_citations.delete(citation)
			.done(function(){
				citation.deleteDOM();
			});
	});
}