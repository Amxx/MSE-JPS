/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

function openTray(tray, callback)
{
	closeTray($('.tray.expanded'), function(){
		tray.find('.tab:visible').hide();
		tray.find('.tab:eq(0)'  ).show();
		tray.addClass('expanded', 300, callback);
	});
}
function closeTray(tray, callback)
{
	var lambda = function(){
		if (tray.length)
			tray.removeClass('expanded', 300, callback);
		else if (callback)
			callback();
	};
	if (ENV.flags)
		popup_confirm('This action will discard all uncommited modification. Continue ?', function(b){
			if (b) lambda();
		});
	else
		lambda();
}
function viewTrayTab(obj, num)
{
	var tab = $(obj).closest('.tray').find('.tab').eq(num);
	$(tab).siblings().filter(':visible').slideUp();
	$(tab).slideDown();
}

// ================================ Integration ================================

function launchTray(tray, object, callback)
{
	openTray(tray, function(){
		ENV.flags         = object ? FLAG_NULL : FLAG_NEW;
		ENV.editionObject = object;
		callback();
	});
}

// Tray listener
$(function(){
	$('.tray .content .followchange').bind('change input', function(){
		ENV.flags |= FLAG_EDIT;
	});
	$('.tray a.close').each(function(){
		$(this).click(function(){
			closeTray($(this).closest('.tray'), resetFlags);
		});
	});
	$(document).bind('keyup', function(e){
		if (e.keyCode == 27)
			closeTray($('.tray.expanded'), resetFlags);
	});

});