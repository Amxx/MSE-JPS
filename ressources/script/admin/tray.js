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
 
function openTray(tray, callback)
{
	closeTray($('.tray.expanded'), function(){					
		tray.addClass('expanded');
		if (callback)
			callback();

	});
}

function closeTray(tray, callback)
{
	var lambda = function(){
		tray.removeClass('expanded');
		if (callback)
			callback();
	};
	if (ENV.flags & ~FLAG_NEW)
		popup_confirm('This action will discard all uncommited modification. Continue ?', function(b){
			if (b)
				lambda();
		});	
	else
		lambda();
}





function launchTray(tray, object, callback)
{
	openTray(tray, function(){
		ENV.flags         = object ? FLAG_NULL : FLAG_NEW;
		ENV.editionObject = object;
		callback(object);
	});
}





function viewTab(obj, num)
{
	var tab = $(obj).closest('.tray').find('.tab').eq(num);
	$(tab).siblings().filter(':visible').slideUp();
	$(tab).slideDown();
}





// Tray listener
$(function(){
	$('.tray .content *').bind('change input', function(){
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