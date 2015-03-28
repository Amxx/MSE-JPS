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

<header>
	<div id='name'> {{website.header.name}} </div>
	<img id='picture' src='{{website.header.picture}}' alt='Profile picture'/>
	<ul id='nav'>
		{% for page in website.page.sections.list %}
			<li id='nav-li-{{page.id}}' {% if page.title == website.current %} class='current' {% endif %}>
				<a id='nav-a-{{page.id}}' href='?page={{page.title}}'>{{ page.title }}</a>
			</li>
		{% endfor %}
	</ul>
</header>