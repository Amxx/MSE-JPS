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
function Social()
{
	this.id    = null;
	this.title = '';
	this.img   = '';
	this.url   = '';
	this.order = 0;
}
function SQL2Social(socialSQL)
{
	this.id    = socialSQL.Social_ID;
	this.title = socialSQL.Social_Title;
	this.img   = socialSQL.Social_Img;
	this.url   = socialSQL.Social_Url;
	this.order = socialSQL.Social_Order;
}

// ================================== Tray IO ==================================
function setSocialTray(obj)
{
	$('.tray.social #input_social_title').val (obj ? obj.title : 'new social link');
	$('.tray.social #input_social_img'  ).val (obj ? obj.img   : ''               );
	$('.tray.social #input_social_url'  ).val (obj ? obj.url   : ''               );
}
function getSocialTray(obj)
{
	obj.title = $('.tray.social #input_social_title').val();
	obj.img   = $('.tray.social #input_social_img'  ).val();
	obj.url   = $('.tray.social #input_social_url'  ).val();
}

// ============================= Social - Buttons ==============================
function pressNewSocial()
{
	launchTray($('.tray.social'), undefined, setSocialTray);
}
function pressEditSocial(socialID)
{
	launchTray($('.tray.social'), ENV.db_socials.at(socialID), setSocialTray);
}
function pressCommitSocial()
{
	if (ENV.flags)
	{
		if (ENV.editionObject)
			updateSocial(ENV.editionObject);
		else
			newSocial();
		resetFlags();
	}
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
				if (!(ENV.flags & FLAG_NEW))
					deleteSocial(ENV.editionObject);
				resetFlags();
				closeTray($('.tray.social'));
			}
		});
	}
}

// ============================= Social - Methods ==============================
function newSocial()
{
	var socialOBJ = new Page();
	getSocialTray(socialOBJ);
	// Remote push 
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "insert_social", object: socialOBJ }, function(data){
		socialOBJ.id = data.id;
		// Local push + build
		newSocialDOM(socialOBJ);
		ENV.db_socials.insert(socialOBJ);
		// Close info
		closePopup(info);
		// Reorder
		reorderSocial();
	}, 'json');	
}

function updateSocial(socialOBJ)
{
	getSocialTray(socialOBJ);
	// Remote update
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "update_social", object: socialOBJ }, function(data){
		// Local update
		updateSocialDOM(socialOBJ);
		// Close info
		closePopup(info);
	}, 'json');
}
function deleteSocial(socialOBJ)
{
	// Remote delete
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "drop_social", object: socialOBJ }, function(data){
		// Local delete
		deleteSocialDOM(socialOBJ);
		ENV.db_socials.remove(socialOBJ.id);
		// Close info
		closePopup(info);
	}, 'json');
}
function reorderSocial()
{
	// Get order
	var order = $('section.socials .sortable li').toArray().map( e => parseInt($(e).attr('id').substring(7)) );
	// Remote update
	var info = openPopup().append($('<h4/>').text('Synchronisation ...'));
	$.post(UPDATER, { QUERY: "reorder_social", array: order }, function(data){
		// Close info
		closePopup(info);
	}, 'json');
}

// ================================ Social DOM =================================
function newSocialDOM(socialOBJ)
{
	$('section.socials .sortable')
		.append($('<li/>')
			.attr('id', 'social_'+socialOBJ.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ pressEditSocial(socialOBJ.id); })
				.text(socialOBJ.title)
			)
		);
}
function updateSocialDOM(socialOBJ)
{
	$('section.socials .sortable li')
		.filter(function(){ return $(this).attr('id') == 'social_'+socialOBJ.id; })
		.find('a.title')
		.text(socialOBJ.title);
}
function deleteSocialDOM(socialOBJ)
{
	$('section.socials .sortable li')
		.filter(function(){ return $(this).attr('id') == 'social_'+socialOBJ.id; })
		.remove();
}



