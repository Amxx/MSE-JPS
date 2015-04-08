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
	this.id      = null;
	this.title   = '';
	this.content = '';
	this.order   = 0;
}
function SQL2Link(linkSQL)
{
	this.id      = linkSQL.Link_ID;
	this.title   = linkSQL.Link_Title;
	this.content = linkSQL.Link_Content;
	this.order   = parseInt(linkSQL.Link_Order);
}

// ================================== Tray IO ==================================
function setLinkTray(obj)
{
	$('.tray.link #input_link_title'  ).val (obj ? obj.title   : 'new link');
	$('.tray.link #input_link_content').val (obj ? obj.content : ''        );
}
function getLinkTray(obj)
{
	obj.title   = $('.tray.link #input_link_title'  ).val();
	obj.content = $('.tray.link #input_link_content').val();
}

// ============================== Link - Buttons ===============================
function pressNewLink()
{
	launchTray($('.tray.link'), undefined, setLinkTray);
}
function pressEditLink(linkID)
{
	launchTray($('.tray.link'), ENV.db_links.at(linkID), setLinkTray);
}
function pressCommitLink()
{
	if (ENV.flags)
	{
		if (ENV.editionObject)
			updateLink(ENV.editionObject);
		else
			newLink()
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
					deleteLink(ENV.editionObject);
				resetFlags();
				closeTray($('.tray.link'));
			}
		});
	}
}

// ============================== Link - Methods ===============================
function newLink()
{
	var linkOBJ = new Link();
	getLinkTray(linkOBJ);
	// Remote push 
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "insert_link", object: linkOBJ }, function(data){
		linkOBJ.id = data.id;
		// Local push + build
		newLinkDOM(linkOBJ);
		ENV.db_links.insert(linkOBJ);
		// Close info
		closePopup(info);
		// Reorder
		reorderLink();
	}, 'json');
}
function updateLink(linkOBJ)
{
	getLinkTray(linkOBJ);
	// Remote update
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "update_link", object: linkOBJ }, function(data){
		// Local update
		updateLinkDOM(linkOBJ);
		// Close info
		closePopup(info);
	}, 'json');
}
function deleteLink(linkOBJ)
{
	// Remote delete
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "drop_link", object: linkOBJ }, function(data){
		// Local delete
		deleteLinkDOM(linkOBJ);
		ENV.db_links.remove(linkOBJ.id);
		// Close info
		closePopup(info);
	}, 'json');
}
function reorderLink()
{
	// Get order
	var order = $('section.links .sortable li').toArray().map( e => parseInt($(e).attr('id').substring(5)) );
	// Remote update
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "reorder_link", array: order }, function(data){
		// Close info
		closePopup(info);
	}, 'json');
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



