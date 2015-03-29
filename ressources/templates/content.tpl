{##############################################################################
 #                                  MSE-JPS                                   #
 #                 Mini Site Engine - Javascript / PHP / SQL                  #
 #                                                                            #
 #                        Version 1.0.1-2 : 28/03/2015                        #
 #                                                                            #
 #                      Developped by Hadrien Croubois :                      #
 #                         hadrien.croubois@gmail.com                         #
 #                                                                            #
 ##############################################################################}

<main>
	{% for section in website.page.sections.list %}
		<section id='section-{{section.id}}' {% if section.id != website.current %} style="display: none;" {% endif %}>
			{% for article in section.articles.list %}
				{{ include('article.tpl', {'article': article}) }}
			{% endfor %}
		</section>
	{% endfor %}
</main>