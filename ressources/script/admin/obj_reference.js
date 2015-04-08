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
	this.id        = null;
	this.title     = '';
	this.authors   = '';
	this.reference = '';
	this.abstract  = '';
	this.bibtex    = '';
}
function SQL2Reference(referenceSQL)
{
	this.id        = referenceSQL.Reference_ID;
	this.title     = referenceSQL.Reference_Title;
	this.authors   = referenceSQL.Reference_Authors;
	this.reference = referenceSQL.Reference_Ref;
	this.abstract  = referenceSQL.Reference_Abstract;
	this.bibtex    = referenceSQL.Reference_Bibtex;
}

// ================================== Tray IO ==================================
function setReferenceTray(obj)
{
	$('.tray.reference #input_reference_title'    ).val(obj? obj.title     : 'new reference');
	$('.tray.reference #input_reference_authors'  ).val(obj? obj.authors   : ''             );
	$('.tray.reference #input_reference_reference').val(obj? obj.reference : ''             );
	$('.tray.reference #input_reference_abstract' ).val(obj? obj.abstract  : ''             );
	$('.tray.reference #input_reference_bibtex'   ).val(obj? obj.bibtex    : ''             );
}
function getReferenceTray(obj)
{
	obj.title     = $('.tray.reference #input_reference_title'    ).val();
	obj.authors   = $('.tray.reference #input_reference_authors'  ).val();
	obj.reference = $('.tray.reference #input_reference_reference').val();
	obj.abstract  = $('.tray.reference #input_reference_abstract' ).val();
	obj.bibtex    = $('.tray.reference #input_reference_bibtex'   ).val();
}

// ============================ Reference - Buttons ============================
function pressNewReference()
{
	launchTray($('.tray.reference'), undefined, setReferenceTray);
}
function pressEditReference(referenceID)
{
	launchTray($('.tray.reference'), ENV.db_references.at(referenceID), setReferenceTray);
}
function pressCommitReference()
{
	if (ENV.flags)
	{
		if (ENV.editionObject)
			updateReference(ENV.editionObject);
		else
			newReference()
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
					deleteReference(ENV.editionObject);
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
	getReferenceTray(referenceOBJ);

	// Remote push
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "insert_reference", object: referenceOBJ }, function(data){
		// Local push + build
		newReferenceDOM(referenceOBJ, false); // back
		ENV.db_references.insert(referenceOBJ);
		// Close info
		closePopup(info);
	}, 'json');
}

function updateReference(referenceOBJ)
{
	getReferenceTray(referenceOBJ);
	
	// Remote update
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "update_reference", object: referenceOBJ }, function(data){
		// Local update
		updateReferenceDOM(referenceOBJ);
		// Close info
		closePopup(info);
	}, 'json');
}
function deleteReference(referenceOBJ)
{
	// Remote delete
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "drop_reference", object: referenceOBJ }, function(data){
		// Local delete
		deleteReferenceDOM(referenceOBJ);
		ENV.db_references.remove(referenceOBJ.id);
		// Close info
		closePopup(info);
	}, 'json');
}

// =============================== Reference DOM ===============================
function newReferenceDOM(referenceOBJ, front)
{
	var block = $('<li/>')
			.attr('id', 'reference_'+referenceOBJ.id)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ pressEditReference(referenceOBJ.id); })
				.text(referenceOBJ.title)
			);
	if (front)
		$('section.references .sortable').prepend(block);
	else
		$('section.references .sortable').append(block);
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



