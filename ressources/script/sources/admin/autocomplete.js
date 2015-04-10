function buildAutocomplete()
{
	var searchField   = $('.tray.article #input_article_refsearch');
	var searchFieldID = $('.tray.article #input_article_refID'    );

	searchField.autocomplete({
			minLength: 0,
			focus: function(event, ui){
				searchField.val(ui.item.title);
				return false;
			},
			select: function(event, ui){
				searchField.val(ui.item.title);
				pressAddCitation(ui.item.value);
				// searchFieldID.val(ui.item.value);
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
}

function fillAutocomplete()
{
	var array = ENV.db_references.values().map(e => ({ label: e.title+" "+e.authors, title: e.title, authors: e.authors, value: e.id }));
	$('.tray.article #input_article_refsearch').autocomplete('option', 'source', array);
}