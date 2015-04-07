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
 
// =========================== Hash change listener ============================

$(window).bind('hashchange', function() {
	hashHandler(true);
});

function hashHandler(smooth)
{
	var hash	= window.location.hash.substring(1);

	// Set hash if empty
	if (hash == '') hash = id2hash(getCurrentId());
	
	// Try get page id from hash
	try
	{
		var id = hash2id(hash); // triger exception if hash unfound
		showPage(id, smooth);
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
				$('#section-'+id ).packery();
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
	popup_information(errorText(error), function(){
		window.location.hash = id2hash(getCurrentId());
	});
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
		element.closest('section').packery();
	else
		$('section').packery();
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

// ============================== Initialisation ===============================

$(function(){
	buildNav();
	hashHandler(false);
});

