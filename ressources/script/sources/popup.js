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
MSE_JPS.popup = MSE_JPS.popup || {};
/******************************************************************************
 *                       P o p u p   n a m e s p a c e                        *
 ******************************************************************************/
(function(){
	this.open = function()
	{
		var dialog = $('<dialog/>').addClass('popup').appendTo('body');

		/****************************************************************************
		 *               Provide support for non compatible browsers                *
		 *                                                                          *
		 * Compatible browsers are (as of april 2015)                               *
		 *   chrome > 37                                                            *
		 *   safari > 6.0                                                           *
		 *   opera  > 24                                                            *
		 ****************************************************************************/
		dialogPolyfill.registerDialog(dialog[0]);
		/****************************************************************************/

		dialog[0].showModal();
		return dialog;
	};
	this.close = function(dialog)
	{
		dialog[0].close();
		dialog.remove();
	};
	this.input = function(text, callback, input)
	{
		var p = MSE_JPS.popup.open();
		p	.append($('<h4/>'   ).text(text))
			.append($('<input/>').attr('type', 'text').attr('placeholder', input));
		p.find('input')
			.keyup(function(event){
				switch(event.which)
				{
					case 13: // ENTER
						MSE_JPS.popup.close(p);
						if (callback) callback(this.value);
						break;
					case 27:
						MSE_JPS.popup.close(p);
						break;
				}
			})
			.blur(function(){ MSE_JPS.popup.close(p); })
			.focus();
	};
	this.confirm = function(text, callback)
	{
		var p = MSE_JPS.popup.open();
		p	.append($('<h4/>').text(text))
			.append($('<a/>' ).addClass('button').text('No'))
			.append($('<a/>' ).addClass('button').text('Yes'))
		p.find('a.button').each(function(){
			$(this).click(function(){
				MSE_JPS.popup.close(p);
				if (callback)
					callback($(this).text() == 'Yes');
			});
		});
	};
	this.info = function(text, callback)
	{
		var p = MSE_JPS.popup.open();
		p	.css('cursor', 'pointer')
			.append($('<h4/>').text(text) )
			.click(function(){
				MSE_JPS.popup.close(p);
				if (callback)
					callback();
			});
	};
}).apply(MSE_JPS.popup);