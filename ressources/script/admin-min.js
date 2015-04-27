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
MSE_JPS.container = MSE_JPS.container || {};

/******************************************************************************
 *                                 Container                                  *
 ******************************************************************************/

MSE_JPS.container.Container = function()
{
	this.data = new Object();
}

// ---------------------------------- Methods ----------------------------------
MSE_JPS.container.Container.prototype.get = function(objID)
{
	return this.data[objID];
}
MSE_JPS.container.Container.prototype.set = function(obj)
{
	return this.data[obj.id] = obj;
}
MSE_JPS.container.Container.prototype.rem = function(obj)
{
	delete this.data[obj.id];
}
MSE_JPS.container.Container.prototype.size = function()
{
	return Object.keys(this.data).length;
}
MSE_JPS.container.Container.prototype.values = function()
{
	var self = this;
	return Object
		.keys(this.data)
		.map(function(key){ return self.get(key); });
}
MSE_JPS.container.Container.prototype.orderedValues = function()
{
	return this.values().sort(function(a,b){ return a.order > b.order; });
}/******************************************************************************
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
MSE_JPS.container = MSE_JPS.container || {};

/******************************************************************************
 *                               POST Container                               *
 ******************************************************************************/

MSE_JPS.container.POSTContainer = function(params)
{
	MSE_JPS.container.Container.apply(this);
	for (var prop in params)
		this[prop] = params[prop];
}

// ---------------------------------- Methods ----------------------------------
MSE_JPS.container.POSTContainer.prototype = new MSE_JPS.container.Container();
MSE_JPS.container.POSTContainer.prototype.select = function()
{
	var self = this;
	var popup = MSE_JPS.popup.open().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: MSE_JPS.token, QUERY: self.query_select }, function(data){
		if (data.values) // Sanity
		for (entry of data.values)
		{
			var obj = new self.allocator();
			obj.parse(entry);
			self.set(obj);
		}
		MSE_JPS.popup.close(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}
MSE_JPS.container.POSTContainer.prototype.insert = function(obj)
{
	var self = this;
	var popup = MSE_JPS.popup.open().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: MSE_JPS.token, QUERY: self.query_insert, object: obj.post() }, function(data){
		obj.id = data.id;
		self.set(obj);
		MSE_JPS.popup.close(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}
MSE_JPS.container.POSTContainer.prototype.update = function(obj)
{
	var self = this;
	var popup = MSE_JPS.popup.open().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: MSE_JPS.token, QUERY: self.query_update, object: obj.post() }, function(data){
		MSE_JPS.popup.close(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}
MSE_JPS.container.POSTContainer.prototype.delete = function(obj)
{
	var self = this;
	var popup = MSE_JPS.popup.open().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: MSE_JPS.token, QUERY: self.query_delete, object: obj.post() }, function(data){
		self.rem(obj);
		MSE_JPS.popup.close(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}
MSE_JPS.container.POSTContainer.prototype.reorder = function(idarray)
{
	var self = this;
	var popup = MSE_JPS.popup.open().append($('<h4/>').text('synchronisation ...'));
	return $.post(self.target, { TOKEN: MSE_JPS.token, QUERY: self.query_reorder, object: idarray }, function(data){
		for (var i in idarray)
			self.get(idarray[i]).order = i;
		MSE_JPS.popup.close(popup);
	}, 'json').fail(function(){ popup.find('h4').text('ERROR: request failed !'); });
}/******************************************************************************
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
MSE_JPS.entry = MSE_JPS.entry || {};

/******************************************************************************
 *                                 Container                                  *
 ******************************************************************************/

MSE_JPS.entry.Entry = function(){}

MSE_JPS.entry.Entry.prototype.post = function(){
	var properties = {};
	for (var prop in this)
		if (typeof this[prop] !== 'function')
			properties[prop] = this[prop];
	return properties;
}/******************************************************************************
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
MSE_JPS.entry = MSE_JPS.entry || {};

// ============================= Object Definition =============================
MSE_JPS.entry.Source = function()
{
	MSE_JPS.entry.Entry.apply(this);
	this.id          = null;
	this.referenceID = null;
	this.title       = '';
	this.url         = '';
	this.order       = 0;
}
MSE_JPS.entry.Source.prototype = new MSE_JPS.entry.Entry();
MSE_JPS.entry.Source.prototype = new MSE_JPS.entry.Source();

// ================================== Parsing ==================================
MSE_JPS.entry.Source.prototype.parse = function(sql)
{
	this.id          = sql.Source_ID;
	this.referenceID = sql.Reference_ID;
	this.title       = sql.Source_Title;
	this.url         = sql.Source_Url;
	this.order       = parseInt(sql.Source_Order);
}

// ================================== Methods ==================================
MSE_JPS.entry.Source.prototype.descrition = function()
{
	var self   = this;
	var length = self.url.length;
	if (length < 63)
		var url = self.url;
	else
		var url = self.url.substring(0, 30)+'...'+self.url.substring(length-30, length);

	return '['+self.title+'] '+url;
}

// ==================================== DOM ====================================
MSE_JPS.entry.Source.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'source_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ MSE_JPS.listeners.source.edit(self.id); })
				.text(self.descrition())
			)
			.append($('<a/>')
				.addClass('pointer')
				.click(function(){ MSE_JPS.listeners.source.delete(self.id); })
				.text('\u2716')
			);
	if (front)
		$('.tray.reference .sortable').prepend(block);
	else
		$('.tray.reference .sortable').append(block);
}
MSE_JPS.entry.Source.prototype.updateDOM = function()
{
	var self = this;
	$('.tray.reference .sortable li')
		.filter(function(){ return $(this).attr('id') == 'source_'+self.id; })
		.find('a.title')
		.text(self.descrition());
}
MSE_JPS.entry.Source.prototype.deleteDOM = function()
{
	var self = this;
	$('.tray.reference .sortable li')
		.filter(function(){ return $(this).attr('id') == 'source_'+self.id; })
		.remove();
}/******************************************************************************
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
MSE_JPS.entry = MSE_JPS.entry || {};

// ============================= Object Definition =============================
MSE_JPS.entry.Citation = function()
{
	MSE_JPS.entry.Entry.apply(this);
	this.id
	this.articleID   = null;
	this.referenceID = null;
	this.order       = 0;
}
MSE_JPS.entry.Citation.prototype = new MSE_JPS.entry.Entry();
MSE_JPS.entry.Citation.prototype = new MSE_JPS.entry.Citation();

// ================================== Parsing ==================================
MSE_JPS.entry.Citation.prototype.parse = function(sql)
{
	this.id          = sql.Citation_ID;
	this.articleID   = sql.Article_ID;
	this.referenceID = sql.Reference_ID;
	this.order       = parseInt(sql.Citation_Order);
}

// ==================================== DOM ====================================
MSE_JPS.entry.Citation.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'citation_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<span/>')
				.addClass('title')
				.text(MSE_JPS.ENV.db_references.get(self.referenceID).title)
			)
			.append($('<a/>')
				.addClass('pointer')
				.click(function(){ MSE_JPS.listeners.citation.delete(self.id); })
				.text('\u2716')
			);
	if (front)
		$('.tray.article .sortable').prepend(block);
	else
		$('.tray.article .sortable').append(block);
}
MSE_JPS.entry.Citation.prototype.deleteDOM = function()
{
	var self = this;
	$('.tray.article .sortable li')
		.filter(function(){ return $(this).attr('id') == 'citation_'+self.id; })
		.remove();
}
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
MSE_JPS.entry = MSE_JPS.entry || {};

// ============================= Object Definition =============================
MSE_JPS.entry.Link = function()
{
	MSE_JPS.entry.Entry.apply(this);
	this.id      = null;
	this.title   = '';
	this.content = '';
	this.order   = 0;
}
MSE_JPS.entry.Link.prototype = new MSE_JPS.entry.Entry();
MSE_JPS.entry.Link.prototype = new MSE_JPS.entry.Link();

// ================================== Parsing ==================================
MSE_JPS.entry.Link.prototype.parse = function(sql)
{
	this.id      = sql.Link_ID;
	this.title   = sql.Link_Title;
	this.content = sql.Link_Content;
	this.order   = parseInt(sql.Link_Order);
}

// =================================== Tray ====================================
MSE_JPS.entry.Link.prototype.setTray = function()
{
	var self = this;
	$('#input_link_title'  ).val(self.title);
	$('#input_link_content').val(self.content);
}
MSE_JPS.entry.Link.prototype.getTray = function()
{
	var self = this;
	self.title   = $('#input_link_title'  ).val();
	self.content = $('#input_link_content').val();
}

// ==================================== DOM ====================================
MSE_JPS.entry.Link.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'link_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ MSE_JPS.listeners.link.edit(self.id); })
				.text(self.title)
			);
	if (front)
		$('section.links .sortable').prepend(block);
	else
		$('section.links .sortable').append(block);
}
MSE_JPS.entry.Link.prototype.updateDOM = function()
{
	var self = this;
	$('section.links .sortable li')
		.filter(function(){ return $(this).attr('id') == 'link_'+self.id; })
		.find('a.title')
		.text(self.title);
}
MSE_JPS.entry.Link.prototype.deleteDOM = function()
{
	var self = this;
	$('section.links .sortable li')
		.filter(function(){ return $(this).attr('id') == 'link_'+self.id; })
		.remove();
}/******************************************************************************
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
MSE_JPS.entry = MSE_JPS.entry || {};

// ============================= Object Definition =============================
MSE_JPS.entry.Reference = function()
{
	MSE_JPS.entry.Entry.apply(this);
	this.id        = null;
	this.title     = '';
	this.authors   = '';
	this.reference = '';
	this.abstract  = '';
	this.bibtex    = '';
}
MSE_JPS.entry.Reference.prototype = new MSE_JPS.entry.Entry();
MSE_JPS.entry.Reference.prototype = new MSE_JPS.entry.Reference();

// ================================== Parsing ==================================
MSE_JPS.entry.Reference.prototype.parse = function(sql)
{
	this.id        = sql.Reference_ID;
	this.title     = sql.Reference_Title;
	this.authors   = sql.Reference_Authors;
	this.reference = sql.Reference_Ref;
	this.abstract  = sql.Reference_Abstract;
	this.bibtex    = sql.Reference_Bibtex;
}

// =================================== Tray ====================================
MSE_JPS.entry.Reference.prototype.setTray = function()
{
	var self = this;
	$('#input_reference_title'    ).val(self.title);
	$('#input_reference_authors'  ).val(self.authors);
	$('#input_reference_reference').val(self.reference);
	$('#input_reference_abstract' ).val(self.abstract);
	$('#input_reference_bibtex'   ).val(self.bibtex);

	if (self.id == null)
	{
		$('.tray.reference .menu li').eq(3).hide();
	}
	else
	{
		$('.tray.reference .menu li').eq(3).show();
		MSE_JPS.tools.viewSources(self.id);
	}
}
MSE_JPS.entry.Reference.prototype.getTray = function()
{
	var self = this;
	self.title     = $('#input_reference_title'    ).val();
	self.authors   = $('#input_reference_authors'  ).val();
	self.reference = $('#input_reference_reference').val();
	self.abstract  = $('#input_reference_abstract' ).val();
	self.bibtex    = $('#input_reference_bibtex'   ).val();
}

// ==================================== DOM ====================================
MSE_JPS.entry.Reference.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'reference_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ MSE_JPS.listeners.reference.edit(self.id); })
				.text(self.title)
			);
	if (front)
		$('section.references .sortable').prepend(block);
	else
		$('section.references .sortable').append(block);
}
MSE_JPS.entry.Reference.prototype.updateDOM = function()
{
	var self = this;
	$('section.references .sortable li')
		.filter(function(){ return $(this).attr('id') == 'reference_'+self.id; })
		.find('a.title')
		.text(self.title);
}
MSE_JPS.entry.Reference.prototype.deleteDOM = function()
{
	var self = this;
	$('section.references .sortable li')
		.filter(function(){ return $(this).attr('id') == 'reference_'+self.id; })
		.remove();
}/******************************************************************************
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
MSE_JPS.entry = MSE_JPS.entry || {};

// ============================= Object Definition =============================
MSE_JPS.entry.Article = function()
{
	MSE_JPS.entry.Entry.apply(this);
	this.id         = null;
	this.pageID     = null;
	this.title      = '';
	this.text       = '';
	this.javascript = '';
	this.archived   = false;
	this.order      = 0;
}
MSE_JPS.entry.Article.prototype = new MSE_JPS.entry.Entry();
MSE_JPS.entry.Article.prototype = new MSE_JPS.entry.Article();

// ================================== Parsing ==================================
MSE_JPS.entry.Article.prototype.parse = function(sql)
{
	this.id         = sql.Article_ID;
	this.pageID     = sql.Page_ID;
	this.title      = sql.Article_Title;
	this.text       = sql.Article_Text;
	this.javascript = sql.Article_Javascript;
	this.archived   = parseInt(sql.Article_Archived);
	this.order      = parseInt(sql.Article_Order);
}

// =================================== Tray ====================================
MSE_JPS.entry.Article.prototype.setTray = function()
{
	var self = this;
	$('#input_article_title'     ).val(self.title);
	$('#input_article_text'      ).val(self.text);
	$('#input_article_javascript').val(self.javascript);
	$('#input_article_archived'  ).prop('checked', self.archived);

	if (self.id == null)
	{
		$('.tray.article .menu li').eq(2).hide();
	}
	else
	{
		$('.tray.article .menu li').eq(2).show();
		$('#input_article_refsearch' ).val('');
		MSE_JPS.tools.viewCitations(self.id);
	}
}
MSE_JPS.entry.Article.prototype.getTray = function()
{
	var self = this;
	self.title      = $('#input_article_title'     ).val();
	self.text       = $('#input_article_text'      ).val();
	self.javascript = $('#input_article_javascript').val();
	self.archived   = $('#input_article_archived'  ).prop('checked');
}

// ==================================== DOM ====================================
MSE_JPS.entry.Article.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'article_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ MSE_JPS.listeners.article.edit(self.id); })
				.text(self.title)
			);
	if (front)
		$('section.articles .sortable').prepend(block);
	else
		$('section.articles .sortable').append(block);
}
MSE_JPS.entry.Article.prototype.updateDOM = function()
{
	var self = this;
	$('section.articles .sortable li')
		.filter(function(){ return $(this).attr('id') == 'article_'+self.id; })
		.find('a.title')
		.text(self.title);
}
MSE_JPS.entry.Article.prototype.deleteDOM = function()
{
	var self = this;
	$('section.articles .sortable li')
		.filter(function(){ return $(this).attr('id') == 'article_'+self.id; })
		.remove();
}/******************************************************************************
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
MSE_JPS.entry = MSE_JPS.entry || {};

// ============================= Object Definition =============================
MSE_JPS.entry.Page = function()
{
	MSE_JPS.entry.Entry.apply(this);
	this.id         = null;
	this.title      = '';
	this.style      = '';
	this.bordered   = false;
	this.expandable = false;
	this.order      = 0;
}
MSE_JPS.entry.Page.prototype = new MSE_JPS.entry.Entry();
MSE_JPS.entry.Page.prototype = new MSE_JPS.entry.Page();

// ================================== Parsing ==================================
MSE_JPS.entry.Page.prototype.parse = function(sql)
{
	this.id         = sql.Page_ID;
	this.title      = sql.Page_Title;
	this.style			= sql.Page_Style;
	this.bordered		= parseInt(sql.Page_Bordered);
	this.expandable	= parseInt(sql.Page_Expandable);
	this.order			= parseInt(sql.Page_Order);
}

// =================================== Tray ====================================
MSE_JPS.entry.Page.prototype.setTray = function()
{
	var self = this;
	$('#input_page_title'     ).val(self.title);
	$('#input_page_style'     ).val(self.style);
	$('#input_page_expendable').prop('checked', self.expandable);
	$('#input_page_bordered'  ).prop('checked', self.bordered);
}
MSE_JPS.entry.Page.prototype.getTray = function()
{
	var self = this;
	self.title      = $('#input_page_title'     ).val();
	self.style      = $('#input_page_style'     ).val();
	self.expandable = $('#input_page_expendable').prop('checked');
	self.bordered   = $('#input_page_bordered'  ).prop('checked');
}

// ==================================== DOM ====================================
MSE_JPS.entry.Page.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'page_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ MSE_JPS.listeners.page.edit(self.id); })
				.text(self.title)
			)
			.append($('<a/>')
				.addClass('pointer')
				.click(function(){ MSE_JPS.tools.viewPage(self.id); })
				.text('\u25B6')
			);
	if (front)
		$('section.pages .sortable').prepend(block);
	else
		$('section.pages .sortable').append(block);
}
MSE_JPS.entry.Page.prototype.updateDOM = function()
{
	var self = this;
	$('section.pages .sortable li')
		.filter(function(){ return $(this).attr('id') == 'page_'+self.id; })
		.find('a.title')
		.text(self.title);
}
MSE_JPS.entry.Page.prototype.deleteDOM = function()
{
	var self = this;
	$('section.pages .sortable li')
		.filter(function(){ return $(this).attr('id') == 'page_'+self.id; })
		.remove();
}
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
MSE_JPS.entry = MSE_JPS.entry || {};

// ============================= Object Definition =============================
MSE_JPS.entry.Social = function()
{
	MSE_JPS.entry.Entry.apply(this);
	this.id       = null;
	this.title    = '';
	this.img      = '';
	this.url      = '';
	this.showtext = true;
	this.order    = 0;
}
MSE_JPS.entry.Social.prototype = new MSE_JPS.entry.Entry();
MSE_JPS.entry.Social.prototype = new MSE_JPS.entry.Social();

// ================================== Parsing ==================================
MSE_JPS.entry.Social.prototype.parse = function(sql)
{
	this.id       = sql.Social_ID;
	this.title    = sql.Social_Title;
	this.img      = sql.Social_Img;
	this.url      = sql.Social_Url;
	this.showtext = parseInt(sql.Social_ShowText);
	this.order    = parseInt(sql.Social_Order);
}

// =================================== Tray ====================================
MSE_JPS.entry.Social.prototype.setTray = function()
{
	var self = this;
	$('#input_social_title'   ).val(self.title);
	$('#input_social_img'     ).val(self.img);
	$('#input_social_url'     ).val(self.url);
	$('#input_social_showtext').prop('checked', self.showtext);
}
MSE_JPS.entry.Social.prototype.getTray = function()
{
	var self = this;
	self.title    = $('#input_social_title'   ).val();
	self.img      = $('#input_social_img'     ).val();
	self.url      = $('#input_social_url'     ).val();
	self.showtext = $('#input_social_showtext').prop('checked');
}

// ==================================== DOM ====================================
MSE_JPS.entry.Social.prototype.insertDOM = function(front)
{
	var self = this;
	var block = $('<li/>')
			.attr('id', 'social_'+self.id)
			.append($('<span/>')
				.addClass('handle')
				.text('\u2195')
			)
			.append($('<a/>')
				.addClass('title')
				.click(function(){ MSE_JPS.listeners.social.edit(self.id); })
				.text(self.title)
			);
	if (front)
		$('section.socials .sortable').prepend(block);
	else
		$('section.socials .sortable').append(block);
}
MSE_JPS.entry.Social.prototype.updateDOM = function()
{
	var self = this;
	$('section.socials .sortable li')
		.filter(function(){ return $(this).attr('id') == 'social_'+self.id; })
		.find('a.title')
		.text(self.title);
}
MSE_JPS.entry.Social.prototype.deleteDOM = function()
{
	var self = this;
	$('section.socials .sortable li')
		.filter(function(){ return $(this).attr('id') == 'social_'+self.id; })
		.remove();
}/******************************************************************************
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
MSE_JPS.listeners = MSE_JPS.listeners || {};

MSE_JPS.listeners.source = {

	add: function()
	{
		var p = MSE_JPS.popup.open();
		p	.append($('<h4/>'   ).text('New Link'))
			.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Title'))
			.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Url'  ))
			.append($('<a/>').addClass('button').text('Cancel').click(function(){
				MSE_JPS.popup.close(p);
			}))
			.append($('<a/>').addClass('button').text('Ok').click(function(){
				title = p.find('input').eq(0).val().trim();
				url   = p.find('input').eq(1).val().trim();
				if (title && url)
				{
					var source = new MSE_JPS.entry.Source();
					source.title       = title;
					source.url         = url;
					source.referenceID = MSE_JPS.ENV.editionObject.id;
					MSE_JPS.ENV.db_sources.insert(source)
						.done(function(){
							source.insertDOM();
							MSE_JPS.ENV.db_sources.reorder(MSE_JPS.tools.ordered_idarray($('.tray.reference .sortable li')));
							MSE_JPS.popup.close(p);
						})
				}
			}));
	},

	edit: function(sourceID)
	{
		var source = MSE_JPS.ENV.db_sources.get(sourceID);
		var p = MSE_JPS.popup.open();
		p	.append($('<h4/>'   ).text('New Link'))
			.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Title').val(source.title))
			.append($('<input/>').addClass('block').attr('type', 'text').attr('placeholder', 'Url'  ).val(source.url))
			.append($('<a/>').addClass('button').text('Cancel').click(function(){
				MSE_JPS.popup.close(p);
			}))
			.append($('<a/>').addClass('button').text('Ok').click(function(){
				title = p.find('input').eq(0).val().trim();
				url   = p.find('input').eq(1).val().trim();
				if (title && url)
				{
					source.title       = title;
					source.url         = url;
					MSE_JPS.ENV.db_sources.update(source)
						.done(function(){
							source.updateDOM();
							MSE_JPS.popup.close(p);
						})
				}
			}));
	},

	delete: function(sourceID)
	{
		MSE_JPS.popup.confirm("Are you sure you want to delete this source ?", function(confirm){
			if (confirm)
			{
				var source = MSE_JPS.ENV.db_sources.get(sourceID);
				MSE_JPS.ENV.db_sources.delete(source)
					.done(function(){
						source.deleteDOM();
					});
			}
		});
	}

}/******************************************************************************
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
MSE_JPS.listeners = MSE_JPS.listeners || {};

MSE_JPS.listeners.citation = {

	add: function(referenceID)
	{
		var citation = new MSE_JPS.entry.Citation();
		citation.articleID   = MSE_JPS.ENV.editionObject.id;
		citation.referenceID = referenceID;
		MSE_JPS.ENV.db_citations.insert(citation)
			.done(function(){
				citation.insertDOM();
				MSE_JPS.ENV.db_citations.reorder(MSE_JPS.tools.ordered_idarray($('.tray.article .sortable li')));
			})
	},

	delete: function(citationID)
	{
		MSE_JPS.popup.confirm("Are you sure you want to delete this citation ?", function(confirm){
			var citation = MSE_JPS.ENV.db_citations.get(citationID);
			MSE_JPS.ENV.db_citations.delete(citation)
				.done(function(){
					citation.deleteDOM();
				});
		});
	}

}/******************************************************************************
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
MSE_JPS.listeners = MSE_JPS.listeners || {};

MSE_JPS.listeners.link = {

	new: function()
	{
		MSE_JPS.tray.launch($('.tray.link'), undefined, function(){ MSE_JPS.entry.Link.prototype.setTray(); });
	},

	edit: function(linkID)
	{
		var link = MSE_JPS.ENV.db_links.get(linkID);
		MSE_JPS.tray.launch($('.tray.link'), link, function(){ link.setTray(); });
	},

	commit: function()
	{
		if (MSE_JPS.ENV.flags)
		{
			if (!$('#input_link_title').val().trim())
			{
				MSE_JPS.popup.info("Title should not be empty");
			}
			else if (MSE_JPS.ENV.editionObject)
			{
				var link = MSE_JPS.ENV.editionObject;
				link.getTray();
				MSE_JPS.ENV.db_links.update(link)
					.done(function(){
						link.updateDOM();
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.link'));
					});
			}
			else
			{
				var link = new MSE_JPS.entry.Link();
				link.getTray();
				MSE_JPS.ENV.db_links.insert(link)
					.done(function(){
						link.insertDOM();
						MSE_JPS.ENV.db_links.reorder(MSE_JPS.tools.ordered_idarray($('section.links .sortable li')));
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.link'));
					})
			}
		}
		else
			MSE_JPS.tray.close($('.tray.link'));
	},

	delete: function()
	{
		if (MSE_JPS.ENV.flags == MSE_JPS.ENV.FLAG_NEW)
		{
			MSE_JPS.ENV.resetFlags();
			MSE_JPS.tray.close($('.tray.link'));
		}
		else
		{
			MSE_JPS.popup.confirm("Are you sure you want to delete this link ?", function(confirm){
				if (confirm)
				{
					var link = MSE_JPS.ENV.editionObject;
					MSE_JPS.ENV.db_links.delete(link)
						.done(function(){
							link.deleteDOM();
							MSE_JPS.ENV.resetFlags();
							MSE_JPS.tray.close($('.tray.link'));
						});
				}
			});
		}
	}


}/******************************************************************************
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
MSE_JPS.listeners = MSE_JPS.listeners || {};

MSE_JPS.listeners.reference = {

	new: function()
	{
		MSE_JPS.tray.launch($('.tray.reference'), undefined, function(){ MSE_JPS.entry.Reference.prototype.setTray(); });
	},

	edit: function(referenceID)
	{
		var reference = MSE_JPS.ENV.db_references.get(referenceID);
		MSE_JPS.tray.launch($('.tray.reference'), reference, function(){ reference.setTray(); });
	},

	commit: function()
	{
		if (MSE_JPS.ENV.flags)
		{
			if (!$('#input_reference_title').val().trim())
			{
				MSE_JPS.popup.info("Title should not be empty");
			}
			else if (MSE_JPS.ENV.editionObject)
			{
				var reference = MSE_JPS.ENV.editionObject;
				reference.getTray();
				MSE_JPS.ENV.db_references.update(reference)
					.done(function(){
						reference.updateDOM();
						MSE_JPS.autocomplete.fill();
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.reference'));
					});
			}
			else
			{
				var reference = new MSE_JPS.entry.Reference();
				reference.getTray();
				MSE_JPS.ENV.db_references.insert(reference)
					.done(function(){
						reference.insertDOM();
						// MSE_JPS.ENV.db_references.reorder(MSE_JPS.tools.ordered_idarray($('section.references .sortable li')));
						MSE_JPS.autocomplete.fill();
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.reference'));
					})
			}
		}
		else
			MSE_JPS.tray.close($('.tray.reference'));
	},

	delete: function()
	{
		if (MSE_JPS.ENV.flags == MSE_JPS.ENV.FLAG_NEW)
		{
			MSE_JPS.ENV.resetFlags();
			MSE_JPS.tray.close($('.tray.reference'));
		}
		else
		{
			MSE_JPS.popup.confirm("Are you sure you want to delete this reference ?", function(confirm){
				if (confirm)
				{
					var reference = MSE_JPS.ENV.editionObject;
					MSE_JPS.ENV.db_references.delete(reference)
						.done(function(){
							var citations = MSE_JPS.ENV.db_citations.values().filter(function(a){ return a.referenceID == reference.id; });
							for (citation of citations)
								MSE_JPS.ENV.db_citations.rem(citation);
							reference.deleteDOM();
							MSE_JPS.autocomplete.fill();
							MSE_JPS.ENV.resetFlags();
							MSE_JPS.tray.close($('.tray.reference'));
						});
				}
			});
		}
	}

}/******************************************************************************
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
MSE_JPS.listeners = MSE_JPS.listeners || {};

MSE_JPS.listeners.article = {

	new: function()
	{
		MSE_JPS.tray.launch($('.tray.article'), undefined, function(){ MSE_JPS.entry.Article.prototype.setTray(); });
	},

	edit: function(articleID)
	{
		var article = MSE_JPS.ENV.db_articles.get(articleID);
		MSE_JPS.tray.launch($('.tray.article'), article, function(){ article.setTray(); });
	},

	commit: function()
	{
		if (MSE_JPS.ENV.flags)
		{
			if (!$('#input_article_title').val().trim())
			{
				MSE_JPS.popup.info("Title should not be empty");
			}
			else if (MSE_JPS.ENV.editionObject)
			{
				var article = MSE_JPS.ENV.editionObject;
				article.getTray();
				MSE_JPS.ENV.db_articles.update(article)
					.done(function(){
						article.updateDOM();
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.article'));
					});
			}
			else
			{
				var article = new MSE_JPS.entry.Article();
				article.getTray();
				article.pageID = MSE_JPS.ENV.currentPage;
				MSE_JPS.ENV.db_articles.insert(article)
					.done(function(){
						article.insertDOM();
						MSE_JPS.ENV.db_articles.reorder(MSE_JPS.tools.ordered_idarray($('section.articles .sortable li')));
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.article'));
					})
			}
		}
		else
			MSE_JPS.tray.close($('.tray.article'));
	},

	delete: function()
	{
		if (MSE_JPS.ENV.flags == MSE_JPS.ENV.FLAG_NEW)
		{
			MSE_JPS.ENV.resetFlags();
			MSE_JPS.tray.close($('.tray.article'));
		}
		else
		{
			MSE_JPS.popup.confirm("Are you sure you want to delete this article ?", function(confirm){
				if (confirm)
				{
					var article = MSE_JPS.ENV.editionObject;
					MSE_JPS.ENV.db_articles.delete(article)
						.done(function(){
							var citations = MSE_JPS.ENV.db_citations.values().filter(function(a){ return a.articleID == article.id; });
							for (citation of citations)
								MSE_JPS.ENV.db_citations.rem(citation);
							article.deleteDOM();
							MSE_JPS.ENV.resetFlags();
							MSE_JPS.tray.close($('.tray.article'));
						});
				}
			});
		}
	}


}
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
MSE_JPS.listeners = MSE_JPS.listeners || {};

MSE_JPS.listeners.page = {

	new: function()
	{
		MSE_JPS.tray.launch($('.tray.page'), undefined, function(){ MSE_JPS.entry.Page.prototype.setTray(); });
	},

	edit: function(pageID)
	{
		var page = MSE_JPS.ENV.db_pages.get(pageID);
		MSE_JPS.tray.launch($('.tray.page'), page, function(){ page.setTray(); });
	},

	commit: function()
	{
		if (MSE_JPS.ENV.flags)
		{
			if (!$('#input_page_title').val().trim())
			{
				MSE_JPS.popup.info("Title should not be empty");
			}
			else if (MSE_JPS.ENV.editionObject)
			{
				var page = MSE_JPS.ENV.editionObject;
				page.getTray();
				MSE_JPS.ENV.db_pages.update(page)
					.done(function(){
						page.updateDOM();
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.page'));
					});
			}
			else
			{
				var page = new MSE_JPS.entry.Page();
				page.getTray();
				MSE_JPS.ENV.db_pages.insert(page)
					.done(function(){
						page.insertDOM();
						MSE_JPS.ENV.db_pages.reorder(MSE_JPS.tools.ordered_idarray($('section.pages .sortable li')));
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.page'));
						MSE_JPS.tools.viewPage(page.id);
					})
			}
		}
		else
			MSE_JPS.tray.close($('.tray.page'));
	},

	delete: function()
	{
		if (MSE_JPS.ENV.flags == MSE_JPS.ENV.FLAG_NEW)
		{
			MSE_JPS.ENV.resetFlags();
			MSE_JPS.tray.close($('.tray.page'));
		}
		else
		{
			MSE_JPS.popup.confirm("Are you sure you want to delete this page ?", function(confirm){
				if (confirm)
				{
					var page = MSE_JPS.ENV.editionObject;
					MSE_JPS.ENV.db_pages.delete(page)
						.done(function(){
							if (MSE_JPS.ENV.currentPage == page.id)
								MSE_JPS.tools.viewPage();
							var articles = MSE_JPS.ENV.db_articles.values().filter(function(a){ return a.pageID == page.id; });
							for (article of articles)
								MSE_JPS.ENV.db_articles.rem(article);
							page.deleteDOM();
							MSE_JPS.ENV.resetFlags();
							MSE_JPS.tray.close($('.tray.page'));
						});
				}
			});
		}
	}

}/******************************************************************************
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
MSE_JPS.listeners = MSE_JPS.listeners || {};

MSE_JPS.listeners.social = {

	new : function()
	{
		MSE_JPS.tray.launch($('.tray.social'), undefined, function(){ MSE_JPS.entry.Social.prototype.setTray(); });
	},

	edit: function(socialID)
	{
		var social = MSE_JPS.ENV.db_socials.get(socialID);
		MSE_JPS.tray.launch($('.tray.social'), social, function(){ social.setTray(); });
	},

	commit: function()
	{
		if (MSE_JPS.ENV.flags)
		{
			if (!$('#input_social_title').val().trim())
			{
				MSE_JPS.popup.info("Title should not be empty");
			}
			else if (MSE_JPS.ENV.editionObject)
			{
				var social = MSE_JPS.ENV.editionObject;
				social.getTray();
				MSE_JPS.ENV.db_socials.update(social)
					.done(function(){
						social.updateDOM();
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.social'));
					});
			}
			else
			{
				var social = new MSE_JPS.entry.Social();
				social.getTray();
				MSE_JPS.ENV.db_socials.insert(social)
					.done(function(){
						social.insertDOM();
						MSE_JPS.ENV.db_socials.reorder(MSE_JPS.tools.ordered_idarray($('section.socials .sortable li')));
						MSE_JPS.ENV.resetFlags();
						MSE_JPS.tray.close($('.tray.social'));
					})
			}
		}
		else
			MSE_JPS.tray.close($('.tray.social'));
	},

	delete: function()
	{
		if (MSE_JPS.ENV.flags == MSE_JPS.ENV.FLAG_NEW)
		{
			MSE_JPS.ENV.resetFlags();
			MSE_JPS.tray.close($('.tray.social'));
		}
		else
		{
			MSE_JPS.popup.confirm("Are you sure you want to delete this social link ?", function(confirm){
				if (confirm)
				{
					var social = MSE_JPS.ENV.editionObject;
					MSE_JPS.ENV.db_socials.delete(social)
						.done(function(){
							social.deleteDOM();
							MSE_JPS.ENV.resetFlags();
							MSE_JPS.tray.close($('.tray.social'));
						});
				}
			});
		}
	}


}/******************************************************************************
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

MSE_JPS.autocomplete = {
	build: function()
	{
		var searchField   = $('.tray.article #input_article_refsearch');
		var searchFieldID = $('.tray.article #input_article_refID'    );

		searchField.autocomplete({
			minLength: 0,
			focus: function(event, ui){
				// searchField.val(ui.item.title);
				return false;
			},
			select: function(event, ui){
				// searchField.val(ui.item.title);
				searchField.val('');
				MSE_JPS.listeners.citation.add(ui.item.value);
				return false;
			}
		})
		.autocomplete("instance")._renderItem = function(ul, item){
			return $("<li>")
				.append($("<a/>")
					.append($('<span/>').addClass('title').text(item.title))
					.append($('<span/>').addClass('authors').text(item.authors))
				)
				.appendTo( ul );
		};
	},

	fill: function()
	{
		var array = MSE_JPS.ENV.db_references.values().map(function(e){
			return ({ label: e.title+" "+e.authors, title: e.title, authors: e.authors, value: e.id });
		});
		$('.tray.article #input_article_refsearch').autocomplete('option', 'source', array);
	}

}/******************************************************************************
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

/******************************************************************************
 *                                Environment                                 *
 ******************************************************************************/
console.info("allocating shared memory");

MSE_JPS.ENV = {

	FLAG_NULL:     0x0,
	FLAG_EDIT:     0x1,
	FLAG_NEW:      0x2,

	flags:         MSE_JPS.FLAG_NULL,
	currentPage:   undefined,
	editionObject: undefined,

	resetFlags: function() { MSE_JPS.ENV.flags = MSE_JPS.FLAG_NULL; }
}

/******************************************************************************
 *                                   Setup                                    *
 ******************************************************************************/
$(function(){
	console.info("loading complete");

	//============================================================================
	console.group("building context");
	var popup = MSE_JPS.popup.open().append($('<h4/>').text('loading...'));
	//============================================================================

	//-----------------------------------------
	console.info("autocomplete intialisation");
	MSE_JPS.autocomplete.build();

	//--------------------------------
	console.info("tab intialisation");
	$('#nav li').eq(0).addClass('current');
	$('main .tab').slice(1).hide();

	//-----------------------------------
	console.info("slider intialisation");
	$('section.articles .slider').hide();

	//------------------------------------
	console.info("sortable intialisation");
	$('section.articles .sortable').sortable({
		handle: ".handle",
		update: function(){ MSE_JPS.ENV.db_articles .reorder(MSE_JPS.tools.ordered_idarray($(this).find('li'))); }
	});
	$('section.links    .sortable').sortable({
		handle: ".handle",
		update: function(){ MSE_JPS.ENV.db_links    .reorder(MSE_JPS.tools.ordered_idarray($(this).find('li'))); }
	});
	$('section.pages    .sortable').sortable({
		handle: ".handle",
		update: function(){ MSE_JPS.ENV.db_pages    .reorder(MSE_JPS.tools.ordered_idarray($(this).find('li'))); }
	});
	$('section.socials  .sortable').sortable({
		handle: ".handle",
		update: function(){ MSE_JPS.ENV.db_socials  .reorder(MSE_JPS.tools.ordered_idarray($(this).find('li'))); }
	});
	$('.tray.article    .sortable').sortable({
		handle: ".handle",
		update: function(){ MSE_JPS.ENV.db_citations.reorder(MSE_JPS.tools.ordered_idarray($(this).find('li'))); }
	});
	$('.tray.reference  .sortable').sortable({
		handle: ".handle",
		update: function(){ MSE_JPS.ENV.db_sources  .reorder(MSE_JPS.tools.ordered_idarray($(this).find('li'))); }
	});

	//-----------------------------------
	console.info("setting environment");
	MSE_JPS.ENV.db_articles = new MSE_JPS.container.POSTContainer({
		target        : '../ressources/MSE/updater.php',
		allocator     : MSE_JPS.entry.Article,
		query_select  : 'select_articles',
		query_insert  : 'insert_article',
		query_update  : 'update_article',
		query_delete  : 'delete_article',
		query_reorder : 'reorder_article'
	});
	MSE_JPS.ENV.db_citations = new MSE_JPS.container.POSTContainer({
		target        : '../ressources/MSE/updater.php',
		allocator     : MSE_JPS.entry.Citation,
		query_select  : 'select_citations',
		query_insert  : 'insert_citation',
		query_delete  : 'delete_citation',
		query_reorder : 'reorder_citation'
	});
	MSE_JPS.ENV.db_links = new MSE_JPS.container.POSTContainer({
		target        : '../ressources/MSE/updater.php',
		allocator     : MSE_JPS.entry.Link,
		query_select  : 'select_links',
		query_insert  : 'insert_link',
		query_update  : 'update_link',
		query_delete  : 'delete_link',
		query_reorder : 'reorder_link'
	});
	MSE_JPS.ENV.db_pages = new MSE_JPS.container.POSTContainer({
		target        : '../ressources/MSE/updater.php',
		allocator     : MSE_JPS.entry.Page,
		query_select  : 'select_pages',
		query_insert  : 'insert_page',
		query_update  : 'update_page',
		query_delete  : 'delete_page',
		query_reorder : 'reorder_page'
	});
	MSE_JPS.ENV.db_references = new MSE_JPS.container.POSTContainer({
		target        : '../ressources/MSE/updater.php',
		allocator     : MSE_JPS.entry.Reference,
		query_select  : 'select_references',
		query_insert  : 'insert_reference',
		query_update  : 'update_reference',
		query_delete  : 'delete_reference'
	});
	MSE_JPS.ENV.db_socials = new MSE_JPS.container.POSTContainer({
		target        : '../ressources/MSE/updater.php',
		allocator     : MSE_JPS.entry.Social,
		query_select  : 'select_socials',
		query_insert  : 'insert_social',
		query_update  : 'update_social',
		query_delete  : 'delete_social',
		query_reorder : 'reorder_social'
	});
	MSE_JPS.ENV.db_sources = new MSE_JPS.container.POSTContainer({
		target        : '../ressources/MSE/updater.php',
		allocator     : MSE_JPS.entry.Source,
		query_select  : 'select_sources',
		query_insert  : 'insert_source',
		query_update  : 'update_source',
		query_delete  : 'delete_source',
		query_reorder : 'reorder_source'
	});

	//-------------------------------
	console.info("reading database");
	MSE_JPS.ENV.db_articles.select();
	MSE_JPS.ENV.db_citations.select();
	MSE_JPS.ENV.db_sources.select();
	MSE_JPS.ENV.db_links.select().done(function(){
		for (value of MSE_JPS.ENV.db_links.orderedValues())
			value.insertDOM();
	});
	MSE_JPS.ENV.db_pages.select().done(function(){
		for (value of MSE_JPS.ENV.db_pages.orderedValues())
			value.insertDOM();
	});
	MSE_JPS.ENV.db_references.select().done(function(){
		MSE_JPS.autocomplete.fill();
		for (value of MSE_JPS.ENV.db_references.orderedValues())
			value.insertDOM();
	});
	MSE_JPS.ENV.db_socials.select().done(function(){
		for (value of MSE_JPS.ENV.db_socials.orderedValues())
			value.insertDOM();
	});

	//============================================================================
	MSE_JPS.popup.close(popup);
	console.groupEnd();
	//============================================================================

	console.info("Ready !");
});



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

MSE_JPS.tools = {

	ordered_idarray: function(block)
	{
		return block.toArray().map(function(e){ return parseInt($(e).attr('id').match(/(\d+)$/)); });
	},

	viewTab: function(id)
	{
		if (!$('#nav li').eq(id).hasClass('current'))
		{
			$('#nav li.current').removeClass('current');
			$('#nav li').eq(id).addClass('current');

			$('main .tab:visible').slideToggle();
			$('main .tab').eq(id).slideToggle();
		}
	},

	viewPage: function(pageID)
	{
		if (MSE_JPS.ENV.currentPage != pageID)
			MSE_JPS.tray.close($('.tray.expanded'), function(){
				MSE_JPS.ENV.resetFlags();

				$('section.pages .sortable .expanded').removeClass('expanded');
				if (pageID != undefined)
					$('section.pages .sortable').find('#page_'+pageID).addClass('expanded');

				var slider = $('section.articles .slider');
				// Hide
				slider.hide('slide', { direction: "left" }, function(){
					// Set env
					MSE_JPS.ENV.currentPage = pageID;
					// Cleanup
					$('section.articles .sortable li').remove();
					// Fill
					if (pageID != undefined)
					{
						var articles = MSE_JPS.ENV.db_articles.values()
							.filter(function(a){ return a.pageID == pageID; })
							.sort(function(a,b){ return a.order > b.order; });
						for (article of articles)
							article.insertDOM();
						// Show
						slider.show('slide', { direction: "left" });
					}
				});
			});
	},

	viewCitations: function(articleID)
	{
		$('.tray.article .sortable li').remove();
		for (citation of MSE_JPS.ENV.db_citations.values().filter(function(e){ return e.articleID == articleID; }))
			citation.insertDOM();
	},

	viewSources: function(referenceID)
	{
		$('.tray.reference .sortable li').remove();
		for (source of MSE_JPS.ENV.db_sources.values().filter(function(e){ return e.referenceID == referenceID; }))
			source.insertDOM();
	}

}/******************************************************************************
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

});/******************************************************************************
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