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

<footer>
	<span id='social'>
		{% for social in website.socials.list %}
			<li>
				<a href='{{social.url}}' target='_blank'>
					<img src='{{social.img}}'>
					{{social.title}}
				</a>
			</li>
		{% endfor %}
	</span>
	<span id='mininav'>
		{% for page in website.sections.pages.list %}
			<li>
				<a id={{page.id}} href='?page={{page.title}}'>{{page.title}}</a>
			</li>
		{% endfor %}
		<a class='quietest' href='#' onclick='slideTop(); return false;'>
			Page Top &#8593;
		</a>
	</span>
</footer>
