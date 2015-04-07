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
	this.id    = -1;
	this.title = '';
	this.img   = '';
	this.url   = '';
}

// ============================= Social - Buttons ==============================
function pressNewSocial()
{
	openTray($('.tray.social'), function(){
		// Set environment
		ENV.flags     = FLAG_NEW;
		ENV.editionID = undefined;
		// Clean tray
		$('.tray.social #input_social_title').val('new social');
		$('.tray.social #input_social_img'  ).val('');
		$('.tray.social #input_social_url'  ).val('');
	});
}
function pressEditSocial(socialID)
{
	openTray($('.tray.social'), function(){
		var socialOBJ = ENV.db_socials.at(socialID);
		// Set environment
		ENV.flags     = FLAG_NULL;
		ENV.editionID = socialID;
		// Set tray
		$('.tray.social #input_social_title').val(socialOBJ.title);
		$('.tray.social #input_social_img'  ).val(socialOBJ.img);
		$('.tray.social #input_social_url'  ).val(socialOBJ.url);
	});
}
function pressCommitSocial()
{
	if (ENV.flags)
	{
		(ENV.editionID==undefined?newSocial:updateSocial)();
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
					deleteSocial();
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
	// Get tray data
	socialOBJ.title = $('.tray.social #input_social_title').val();
	socialOBJ.img   = $('.tray.social #input_social_img'  ).val();
	socialOBJ.url   = $('.tray.social #input_social_url'  ).val();

	// TMP Set id
	socialOBJ.id = ENV.db_socials.size();
	// Remote push 
	// ...
	// Local push + build
	newSocialDOM(socialOBJ);
	ENV.db_socials.insert(socialOBJ);
}

function updateSocial()
{
	var socialOBJ = ENV.db_socials.at(ENV.editionID);
	// Update Obj
	socialOBJ.title = $('.tray.social #input_social_title').val();
	socialOBJ.img   = $('.tray.social #input_social_img'  ).val();
	socialOBJ.url   = $('.tray.social #input_social_url'  ).val();
	// Remote update
	// ...
	// Local update
	updateSocialDOM(socialOBJ);
}
function deleteSocial()
{
	var socialOBJ = ENV.db_socials.at(ENV.editionID);
	// Remote delete
	// ...
	// Local delete
	deleteSocialDOM(socialOBJ);
	ENV.db_socials.remove(socialOBJ.id);
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



