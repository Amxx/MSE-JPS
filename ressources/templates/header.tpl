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

<header>
	<div id='name'> {{ website.header.name }} </div>
	<img id='picture' src='{{ website.header.picture }}'/>
	<div id='nav'>
		{% for page in website.sections.pages.list %}
			<li id={{ page.id }} {% if page.title == website.current %} class='current' {% endif %}>
				<a id={{ page.id }} href='?page={{ page.title }}'>{{ page.title }}</a>
			</li>
		{% endfor %}
	</div>
</header>