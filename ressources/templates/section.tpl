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

<section>
	{% for page in website.sections.pages.list %}
		<page id={{ page.id }} {% if page.title != website.current %} style="display: none;" {% endif %}>
			{% for article in page.articles.list %}
				{{ include('article.tpl', {'article': article}) }}
			{% endfor %}
		</page>
	{% endfor %}
</section>