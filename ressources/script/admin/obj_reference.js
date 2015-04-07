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

// ============================= Object Definition =============================
function Reference()
{
	this.id        = -1;
	this.title     = '';
	this.authors   = '';
	this.reference = '';
	this.abstract  = '';
	this.bibtex    = '';
	// this.links      = new Map();
}

// ============================ Reference - Buttons ============================
function pressNewReference()
{
	openTray($('.tray.reference'), function(){
		// Set environment
		ENV.flags     = FLAG_NEW;
		ENV.editionID = undefined;
		// Clean tray
		$('.tray.reference #input_reference_title'    ).val('new reference');
		$('.tray.reference #input_reference_author'   ).val('');
		$('.tray.reference #input_reference_reference').val('');
		$('.tray.reference #input_reference_abstract' ).val('');
		$('.tray.reference #input_reference_bibtex'   ).val('');
	});
}
function pressEditReference(referenceID)
{
	openTray($('.tray.reference'), function(){
		var referenceOBJ = ENV.db_references.at(referenceID);
		// Set environment
		ENV.flags     = FLAG_NULL;
		ENV.editionID = referenceID;
		// Set tray
		$('.tray.reference #input_reference_title'    ).val(referenceOBJ.title);
		$('.tray.reference #input_reference_author'   ).val(referenceOBJ.authors);
		$('.tray.reference #input_reference_reference').val(referenceOBJ.reference);
		$('.tray.reference #input_reference_abstract' ).val(referenceOBJ.abstract);
		$('.tray.reference #input_reference_bibtex'   ).val(referenceOBJ.bibtex);
	});
}
function pressCommitReference()
{
	if (ENV.flags)
	{
		(ENV.editionID==undefined?newReference:updateReference)();
		resetFlags();
	}
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
				if (!(ENV.flags & FLAG_NEW))
					deleteReference();
				resetFlags();
				closeTray($('.tray.reference'));
			}
		});
	}
}

// ============================ Reference - Methods ============================
function newReference()
{
	var referenceOBJ = new Page();
	// Get tray data
	referenceOBJ.title     = $('.tray.reference #input_reference_title'    ).val();
	referenceOBJ.authors   = $('.tray.reference #input_reference_author'   ).val();
	referenceOBJ.reference = $('.tray.reference #input_reference_reference').val();
	referenceOBJ.abstract  = $('.tray.reference #input_reference_abstract' ).val();
	referenceOBJ.bibtex    = $('.tray.reference #input_reference_bibtex'   ).val();

	// TMP Set id
	referenceOBJ.id = ENV.db_references.size();
	// Remote push 
	// ...
	// Local push + build
	newReferenceDOM(referenceOBJ);
	ENV.db_references.insert(referenceOBJ);
}

function updateReference()
{
	var referenceOBJ = ENV.db_references.at(ENV.editionID);
	// Update Obj
	referenceOBJ.title     = $('.tray.reference #input_reference_title'    ).val();
	referenceOBJ.authors   = $('.tray.reference #input_reference_author'   ).val();
	referenceOBJ.reference = $('.tray.reference #input_reference_reference').val();
	referenceOBJ.abstract  = $('.tray.reference #input_reference_abstract' ).val();
	referenceOBJ.bibtex    = $('.tray.reference #input_reference_bibtex'   ).val();
	// Remote update
	// ...
	// Local update
	updateReferenceDOM(referenceOBJ);
}
function deleteReference()
{
	var referenceOBJ = ENV.db_references.at(ENV.editionID);
	// Remote delete
	// ...
	// Local delete
	deleteReferenceDOM(referenceOBJ);
	ENV.db_references.remove(referenceOBJ.id);
}

// =============================== Reference DOM ===============================
function newReferenceDOM(referenceOBJ)
{
	$('section.references .sortable')
		.append($('<li/>')
			.attr('id', 'reference_'+referenceOBJ.id)
			// .append($('<span/>')
			// 	.addClass('handle')
			// 	.text('\u2195')
			// )
			.append($('<a/>')
				.addClass('title')
				.click(function(){ pressEditReference(referenceOBJ.id); })
				.text(referenceOBJ.title)
			)
		);
}
function updateReferenceDOM(referenceOBJ)
{
	$('section.references .sortable li')
		.filter(function(){ return $(this).attr('id') == 'reference_'+referenceOBJ.id; })
		.find('a.title')
		.text(referenceOBJ.title);
}
function deleteReferenceDOM(referenceOBJ)
{
	$('section.references .sortable li')
		.filter(function(){ return $(this).attr('id') == 'reference_'+referenceOBJ.id; })
		.remove();
}



