/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                         Version 1.0.1 : 27/03/2015                         *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/
 
// =========================== Hash change listener ============================

$(window).bind('hashchange', function() {
	var hash	= window.location.hash.substring(1);
		var error	= 404;

	// Set hash if empty
	if (hash == '')
	{
		var cid = getCurrentId();
		window.location.hash = id2hash(cid);
		return;
	}
		
	// Try get page id from hash
	try
	{
		var id    = hash2id(hash);
		var title = $("#nav").find('a[id='+id+']').text();

		showPage(id);
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

});

// ============================ Hash & id operators ============================

function getCurrentId()
{
	return $('page:visible').attr('id');
}

function id2hash(id)
{
	return $('#nav').find('a[id='+id+']').text();
}

function hash2id(hash)
{
	var id    = 0;
	var found = false;

	$('#nav').find('a').each(function(){
		if (!found && $(this).text() == hash)
		{
			found = true;
			id    = $(this).attr('id');
		}
	});
	
	if (!found)
		throw -1;
	
	return id
}

// ================================== Display ==================================

function showPage(id)
{
	var cid = getCurrentId();
	if (id != cid)
	{
		$('page[id='+id +']').slideDown('slow');
		$('page[id='+cid+']').slideUp('slow');
		$(  'li[id='+id +']').addClass('current');
		$(  'li[id='+cid+']').removeClass();
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

// ================================ Page build =================================

function buildNav()
{
	$('#nav, #mininav').find('a').each(function(){
		if ($(this).attr('id'))
			$(this).attr('href','#'+$(this).text());
	});
}

function buildError()
{
	$('#error').click(function(){
		$(this).hide();

		var cid = getCurrentId();
		window.location.hash = id2hash(cid);
	});
}

// ============================== Initialisation ===============================

$(function(){
	buildNav();
	buildError();
	$(window).trigger('hashchange');
});

