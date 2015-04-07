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
function Link()
{
	this.id      = -1;
	this.title   = '';
	this.content = '';
}

// ============================== Link - Buttons ===============================
function pressNewLink()
{
	openTray($('.tray.link'), function(){
		// Set environment
		ENV.flags     = FLAG_NEW;
		ENV.editionID = undefined;
		// Clean tray
		$('.tray.link #input_link_title'  ).val('new link');
		$('.tray.link #input_link_content').val('');
	});
}
function pressEditLink(linkID)
{
	openTray($('.tray.link'), function(){
		var linkOBJ = ENV.db_links.at(linkID);
		// Set environment
		ENV.flags     = FLAG_NULL;
		ENV.editionID = linkID;
		// Set tray
		$('.tray.link #input_link_title'  ).val(linkOBJ.title);
		$('.tray.link #input_link_content').val(linkOBJ.authors);
	});
}
function pressCommitLink()
{
	if (ENV.flags)
	{
		(ENV.editionID==undefined?newLink:updateLink)();
		resetFlags();
	}
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
				if (!(ENV.flags & FLAG_NEW))
					deleteLink();
				resetFlags();
				closeTray($('.tray.link'));
			}
		});
	}
}

// ============================== Link - Methods ===============================
function newLink()
{
	var linkOBJ = new Page();
	// Get tray data
	linkOBJ.title   = $('.tray.link #input_link_title'  ).val();
	linkOBJ.authors = $('.tray.link #input_link_content').val();

	// TMP Set id
	linkOBJ.id = ENV.db_links.size();
	// Remote push 
	// ...
	// Local push + build
	newLinkDOM(linkOBJ);
	ENV.db_links.insert(linkOBJ);
}

function updateLink()
{
	var linkOBJ = ENV.db_links.at(ENV.editionID);
	// Update Obj
	linkOBJ.title   = $('.tray.link #input_link_title'  ).val();
	linkOBJ.authors = $('.tray.link #input_link_content').val();
	// Remote update
	// ...
	// Local update
	updateLinkDOM(linkOBJ);
}
function deleteLink()
{
	var linkOBJ = ENV.db_links.at(ENV.editionID);
	// Remote delete
	// ...
	// Local delete
	deleteLinkDOM(linkOBJ);
	ENV.db_links.remove(linkOBJ.id);
}

// ================================= Link DOM ==================================
function newLinkDOM(linkOBJ)
{
	$('section.links .sortable')
		.append($('<li/>')
			.attr('id', 'link_'+linkOBJ.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ pressEditLink(linkOBJ.id); })
				.text(linkOBJ.title)
			)
		);
}
function updateLinkDOM(linkOBJ)
{
	$('section.links .sortable li')
		.filter(function(){ return $(this).attr('id') == 'link_'+linkOBJ.id; })
		.find('a.title')
		.text(linkOBJ.title);
}
function deleteLinkDOM(linkOBJ)
{
	$('section.links .sortable li')
		.filter(function(){ return $(this).attr('id') == 'link_'+linkOBJ.id; })
		.remove();
}



