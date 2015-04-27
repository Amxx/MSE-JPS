/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.1.0-0 : 27/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

var MSE_JPS = MSE_JPS || {};

MSE_JPS.tray = {

	open: function(tray, callback)
	{
		MSE_JPS.tray.close($('.tray.expanded'), function(){
			tray.find('.tab:visible').hide();
			tray.find('.tab:eq(0)'  ).show();
			tray.addClass('expanded', 300, callback);
		});
	},
	close: function(tray, callback)
	{
		var lambda = function(){
			if (tray.length)
				tray.removeClass('expanded', 300, callback);
			else if (callback)
				callback();
		};
		if (MSE_JPS.ENV.flags)
			MSE_JPS.popup.confirm('This action will discard all uncommited modification. Continue ?', function(b){
				if (b) lambda();
			});
		else
			lambda();
	},
	viewTab: function(obj, num)
	{
		var tab = $(obj).closest('.tray').find('.tab').eq(num);
		$(tab).siblings().filter(':visible').slideUp();
		$(tab).slideDown();
	},

	// ================================ Integration ================================

	launch: function(tray, object, callback)
	{
		MSE_JPS.tray.open(tray, function(){
			MSE_JPS.ENV.flags         = object ? MSE_JPS.ENV.FLAG_NULL : MSE_JPS.ENV.FLAG_NEW;
			MSE_JPS.ENV.editionObject = object;
			callback();
		});
	}
}


// Tray listener
$(function(){
	$('.tray .content .followchange').bind('change input', function(){
		MSE_JPS.ENV.flags |= MSE_JPS.ENV.FLAG_EDIT;
	});
	$('.tray a.close').each(function(){
		$(this).click(function(){
			MSE_JPS.tray.close($(this).closest('.tray'), MSE_JPS.ENV.resetFlags);
		});
	});
	$(document).bind('keyup', function(e){
		if (e.keyCode == 27)
			MSE_JPS.tray.close($('.tray.expanded'), MSE_JPS.ENV.resetFlags);
	});

});