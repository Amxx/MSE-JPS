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

// ================================ Containers =================================
function Container()
{
	this.order = new Array();
	this.assoc = new Map();

	this.at = function(objID)
	{
		return this.assoc.get(objID);
	}
	this.insert = function(obj)
	{
		this.order.push(obj.id);
		this.assoc.set(obj.id, obj);
	}
	this.remove = function(obj)
	{
		this.order.slice(this.indexOf(obj), 1)
		this.assoc.delete(obj.id);
	}
	this.indexOf = function(obj)
	{
		return this.order.findIndex(function(id){ return id == obj.id; });
	}
	this.size = function()
	{
		return this.assoc.size;
	}
	this.values = function()
	{
		return this.assoc.values();		
	}
	this.orderedValues = function()
	{
		var container = this;
		return this.order.map(function(i){ return container.assoc.get(i); });
	}
}

// ================================ Environment ================================
const FLAG_NULL = 0x0;
const FLAG_EDIT = 0x1;
const FLAG_NEW  = 0x2;

var ENV = new Object();
ENV.flags         = 0x0;
ENV.editionID     = undefined;
ENV.pageID        = undefined;
ENV.db_pages      = new Container();
ENV.db_references = new Container();
ENV.db_links      = new Container();
ENV.db_socials    = new Container();

function resetFlags() { ENV.flags  = 0x0; }

// ================================== Objects ==================================
$.getScript('ressources/script/admin/obj_page.js'     );
$.getScript('ressources/script/admin/obj_article.js'  );
$.getScript('ressources/script/admin/obj_reference.js');
$.getScript('ressources/script/admin/obj_link.js'     );
$.getScript('ressources/script/admin/obj_social.js'   );

// =================================== Tray ====================================
$.getScript('ressources/script/admin/tray.js');

// ==================================== Tab ====================================
function changeTab(id)
{
	$('#nav li.current').removeClass('current');
	$('#nav li').eq(id).addClass('current');
	
	$('main .tab:visible').slideToggle();
	$('main .tab').eq(id).slideToggle();
}

// ============================== Initialization ===============================
function initTab()
{
	$('#nav li').eq(0).addClass('current');
	$('main .tab').slice(1).hide();
}
function initSection()
{
	$('section.articles .slider').hide();
}
function initSortable()
{
	$('section.pages .sortable').sortable({
		handle: ".handle",
		update: function(){
			console.log('update page');
			console.log(idArray($(this)));
		}
	});
	$('section.links .sortable').sortable({
		handle: ".handle",
		update: function(){
			console.log('update link');
			console.log(idArray($(this)));
		}
	});
	$('section.socials .sortable').sortable({
		handle: ".handle",
		update: function(){
			console.log('update social');
			console.log(idArray($(this)));
		}
	});
}



function idArray(obj)
{
	return ids = obj.find('li').map(function(){ return $(this).attr('id'); }).toArray();
}





$(function(){
	// Initialisation
	initTab();
	initSection();
	initSortable();
});










			

