/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 1.1.0-1 : 29/03/2015                        *
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

	// Set hash if empty
	if (hash == '')
	{
		window.location.hash = id2hash(getCurrentId());
		return;
	}
	
	// Try get page id from hash
	try
	{
		var id = hash2id(hash); // triger exception if hash unfound
		showPage(id, smooth);
		showError();
		updateTitle(id2hash(id));
	}
	catch(err)
	{
		var error	= 404; // default error
		if (new RegExp("[0-9]{3}error").test(hash))
			error = parseInt(hash.substring(0,3));	
		showError(error);
		updateTitle(errorText(error));
	}
}

// ============================ Hash & id operators ============================

function getCurrentId()
{
	return parseInt($('section').filter(function(){ return $(this).css('display') != 'none'; }).attr('id').substring(8));
}

function id2hash(id)
{
	return $('#nav-a-'+id).text();
}

function hash2id(hash)
{
	return parseInt($('#nav').find('a').filter(function(){ return $(this).text() == hash; }).attr('id').substring(6));
}

// ================================== Display ==================================

function showPage(id, smooth)
{
	var cid = getCurrentId();
	if (id != cid)
	{
		if (smooth)
		{
			$('#section-'+cid).slideUp("slow");
			$('#section-'+id ).slideDown("slow", function(){
				// Sanity
				$('#section-'+id ).masonry();
			});
		}
		else
		{
			$('#section-'+id ).show();
			$('#section-'+cid).hide();
		}
		$('#section-'+id ).show();
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

function retile(element)
{
	if (element)
		element.closest('section').masonry();
	else
		$('section').masonry();
}

function toggleBlock(e)
{
	$(e).closest('.block').toggleClass('expanded');
	retile($(e));
}

function toggleBib(e)
{
	$(e).closest('.bibentry').find('.bibtray').toggle();
	retile($(e));
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
	$('#nav, #mininav')
		.find('a')
		.filter(function(){ return $(this).attr('id'); })
		.each(function(){
			$(this).attr('href', '#');
			$(this).click(function(){
				window.location.hash = $(this).text();
				return false;
			});
		});
}

function buildError()
{
	$('#error')
		.click(function(){
			$(this).hide();
			window.location.hash = id2hash(getCurrentId());
		});
}

// ============================== Initialisation ===============================

$(function(){
	buildNav();
	buildError();
	hashHandler(false);
});

