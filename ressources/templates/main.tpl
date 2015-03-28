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

<!DOCTYPE html>
<html lang="fr">
	
	<head>
		<meta charset="utf-8">

		<title> {{ website.header.name }} | {{ website.current }}</title>

		<link rel="icon" type="image/png" href="ressources/img/favicon.png" />

		<link rel="stylesheet" href="ressources/style.css" type="text/css"/>
		<link rel="stylesheet" href="ressources/font/OpenSans.css" type="text/css"/>
		<link rel="stylesheet" href="ressources/libs/leaflet-0.7.3/leaflet.css" type="text/css"/>

		<script type="text/javascript" src="ressources/libs/jquery-2.1.3.js"></script> 
		<script type="text/javascript" src="ressources/libs/leaflet-0.7.3/leaflet.js"></script>

	</head>
 
	<body>

		{# Build page #}
		{{ include ('header.tpl',  {'website': website }) }}
		{{ include ('content.tpl', {'website': website }) }}
		{{ include ('aside.tpl',   {'website': website }) }}
		{{ include ('footer.tpl',  {'website': website }) }}
		
		{# Error block #}
		<div id='error' style='display: none;'></div>

		{# Initialize javascript #}
		<script type="text/javascript" src="ressources/engine.js"></script>
		<script type="text/javascript">
		$(function(){
			{% for page in website.sections.pages.list %}
			{% for article in page.articles.list %}
			{% if article.javascript %}
				{{ article.javascript | raw }}
			{% endif %}
			{% endfor %}
			{% endfor %}
		});
		</script>

	</body>
	 
</html>

