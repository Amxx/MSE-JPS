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

 function openPopup()
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
}

function closePopup(dialog)
{
	dialog[0].close();
	dialog.remove();
}

function popup_input(text, callback, input)
{
	var p = openPopup();
	p	.append($('<h4/>'   ).text(text))
		.append($('<input/>').attr('type', 'text').attr('placeholder', input));
	p.find('input')
		.keyup(function(event){
			switch(event.which)
			{
				case 13: // ENTER
					closePopup(p);
					if (callback) callback(this.value);
					break;
				case 27:
					closePopup(p);
					break;
			}
		})
		.blur(function(){ closePopup(p); })
		.focus();
}

function popup_confirm(text, callback)
{
	var p = openPopup();
	p	.append($('<h4/>').text(text))
		.append($('<a/>' ).addClass('button').text('No'))
		.append($('<a/>' ).addClass('button').text('Yes'))

	p.find('a.button').each(function(){
		$(this).click(function(){
			closePopup(p);
			if (callback)
				callback($(this).text() == 'Yes');
		});
	});
}

function popup_information(text, callback)
{
	var p = openPopup();
	p	.css('cursor', 'pointer')
		.append($('<h4/>').text(text) )
		.click(function(){
			closePopup(p);
			if (callback)
				callback();
		});
}