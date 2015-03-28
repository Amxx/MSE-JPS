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

<aside>
	{% for link in website.links.list %}
		<article>
			<h2 class='bordered label-orange'> {{ link.title }} </h2>
			{{ link.content | raw }}
		</article>
	{% endfor %}

	<div id='copyright'>
		Powered by <a href='#' target='_blank'>MSE-JSP</a><br/>
		Developped by Hadrien Croubois
	</div>
</aside>