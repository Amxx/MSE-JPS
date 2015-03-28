{##############################################################################
 #                                  MSE-JPS                                   #
 #                 Mini Site Engine - Javascript / PHP / SQL                  #
 #                                                                            #
 #                         Version 1.0.1 : 27/03/2015                         #
 #                                                                            #
 #                      Developped by Hadrien Croubois :                      #
 #                         hadrien.croubois@gmail.com                         #
 #                                                                            #
 ##############################################################################}

<article>
<h2 class='bordered {% if article.archived %} label-purple {% else %} label-blue {% endif %}'>
	<a href='#' onclick='$("#article-{{ article.id }}").slideToggle("slow", function () { $(this).trigger("launch") }); return false;'>
		{{ article.title}}
	</a>
</h2>

<div id='article-{{ article.id }}' class='content' {% if article.archived %} style='display: none;' {% endif %} >

	{{ article.text | raw }}

	{% for reference in article.citations.list %}

		<div class='bibtitle'>
			{{ reference.title}}
		</div>
		<div class='bibauthor'>
			{{ reference.authors}}
		</div>
		<div class='bibref'>
			{{ reference.ref}}

			{% for source in reference.sources.list %}
			<a href={{ source.url }} target='_blank'>[{{ source.name }}]</a>
			{% endfor %}

			{% if reference.bibtex or reference.abstract %}
				<a href='#' onclick='$("#bibtray-{{ reference.id }}").slideToggle("slow", function () { $(this).trigger("launch") }); return false;'>
				[{% if reference.bibtex %}Bibtex{% endif %}
				{% if reference.bibtex and reference.abstract%}/{% endif %}
				{% if reference.abstract %}Abstract{% endif %}]
				</a>
			{% endif %}
		</div>

		{% if reference.bibtex or reference.abstract %}
			<div class='bibtray' id='bibtray-{{ reference.id }}' style='display: none;'>
				{% if reference.abstract %}
					<div class='bibabstract {% if reference.bibtex %}cohexist_left{% endif %}'>{{ reference.abstract }}</div>
				{% endif %}
				{% if reference.bibtex %}
					<div class='bibtex {% if reference.abstract %}cohexist_right{% endif %}'>{{ reference.bibtex | raw }}</div>
				{% endif %}
			</div>
		{% endif %}

	{% endfor %}

</div>
</article>