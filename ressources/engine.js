/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 1.0.1-2 : 28/03/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/
 
// =========================== Hash change listener ============================

$(window).bind('hashchange', function() {
	hashHandler(true);
});

function hashHandler(smooth)
{
	var hash	= window.location.hash.substring(1);
	var error	= 404;

	// Set hash if empty
	if (hash == '')
	{
		window.location.hash = getCurrentHash();
		return;
	}
		
	// Try get page id from hash
	try
	{
		var id    = hash2id(hash);
		var title = $('#nav-a-'+id).text();

		showPage(id, smooth);
		showError();
		updateTitle(title);
	}
	// Error
	catch(err)
	{
		if (new RegExp("[0-9]{3}error").test(hash))
			error = parseInt(hash.substring(0,3));
		
		showError(error);
		updateTitle(errorText(error));
	}
}

// ============================ Hash & id operators ============================

function getCurrentId()
{
	return parseInt($('section').filter(visibleFilter).attr('id').substring(8));
}

function id2hash(id)
{
	return $('#nav-a-'+id).text();
}

function hash2id(hash)
{
	var id    = 0;
	var found = false;

	$('#nav').find('a').each(function(){
		if (!found && $(this).text() == hash)
		{
 			found = true;
 			id    = parseInt($(this).attr('id').substring(6));
 		}
	});
	
	if (!found)
		throw -1;
	
	return id
}

// ================================== Display ==================================

function showPage(id, smooth)
{
	var cid = getCurrentId();
	if (id != cid)
	{
		if (smooth)
		{
			$('#section-'+id ).slideDown('slow');
			$('#section-'+cid).slideUp('slow');
		}
		else
		{
			$('#section-'+id ).show();
			$('#section-'+cid).hide();
		}
		$('#nav-li-' +id ).addClass('current');
		$('#nav-li-' +cid).removeClass();
	}
}

function showError(error)
{
	if (error)
		$('#error').text(errorText(error)).show();
	else
		$('#error').hide();
}

function updateTitle(text)
{
	document.title = $('#name').text()+' | '+text;
}

function slideTop()
{
	$('html, body').animate({scrollTop:0}, '120');
}

// =================================== Tools ===================================

function errorText(error)
{
	switch (error) {
		case 400:	return '400 Bad Request';
		case 401:	return '401 Unauthorized';
		case 403:	return '403 Forbidden';
		case 404:	return '404 Not Found';
		case 502: return '502 Bad Gateway';
		default:	return 'Undocumented error ('+error+')';
	}
}

function visibleFilter(){
	return $(this).css('display') != 'none';
}

// ================================ Page build =================================

function buildNav()
{
	$('#nav, #mininav').find('a').each(function(){
		if ($(this).attr('id'))
		{
			$(this).attr('href', '#');
			$(this).click(function(){
				window.location.hash = $(this).text();
				return false;
			});
		}
	});
}

function buildError()
{
	$('#error').click(function(){
		$(this).hide();
		window.location.hash = id2hash(getCurrentId());
	});
}

// ============================== Initialisation ===============================

$(function(){
	buildNav();
	buildError();
	// $(window).trigger('hashchange');
	hashHandler(false);
});

