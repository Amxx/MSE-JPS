<!--
###############################################################################
#                                   MSE-JPS                                   #
#                  Mini Site Engine - Javascript / PHP / SQL                  #
#                                                                             #
#                        Version 2.3.0-3 : 17/02/2016                         #
#                                                                             #
#                      Developped by Hadrien Croubois :                       #
#                         hadrien.croubois@gmail.com                          #
#                                                                             #
###############################################################################
-->

<?php
	include_once('../ressources/MSE/auth.php');
	session_start();
	auth::init_token();
?>

<!DOCTYPE html>
<html lang="fr">

	<head>
		<meta charset="utf-8">
		<title>Administration interface</title>

		<!-- L i b   -   J q u e r y -->
		<!-- <script type="text/javascript" src="../ressources/libs/jquery-2.1.3.js"></script> -->
		<!-- <script type="text/javascript" src="../ressources/libs/jquery-ui.min.js"></script> -->
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>


		<!-- L i b   -   D i a l o g   p o l y f i l l -->
		<!-- <script src="../ressources/libs/dialog-polyfill-master/dialog-polyfill.js"></script> -->
		<!-- <link rel="stylesheet" type="text/css" href="../ressources/libs/dialog-polyfill-master/dialog-polyfill.css"/> -->
		<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/dialog-polyfill/0.4.3/dialog-polyfill.min.js"></script>
		<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/dialog-polyfill/0.4.3/dialog-polyfill.min.css"/>

		<!-- S t y l e - O p e n S a n s -->
		<link rel="stylesheet" href="../ressources/font/OpenSans.css" type="text/css"/>

		<!-- M S E J P S   -   A d m i n i s t r a t i o n -->
		<script type="text/javascript" src="../ressources/script/admin-min.js"></script>
		<link rel="stylesheet" href="../ressources/css/admin-min.css" type="text/css"/>

	</head>


	<!-- <body class='nooverflow'> -->
	<body>
		<!--
		****************************************************************************
		*                                                                          *
		****************************************************************************
		-->
		<header class='dark'>
			<span id='name'>Administration panel</span>
			<!-- <img id='picture' src='img.png' alt='Profile picture'/> -->
			<ul id='nav'>
				<!-- <li><a onClick='viewTab(0);'>Main</a></li> -->
				<!-- <li><a onClick='viewTab(1);'>Links</a></li> -->
				<li><a href='../index.php'>Return to site</a></li>
			</ul>
		</header>

		<!--
		****************************************************************************
		*                                                                          *
		****************************************************************************
		-->
		<div id='page' class='flex column wrap with-header'>
		<main class='flex column'>

			<div class='content flex row'>

				<section class='pages flex column'>
						<a class='button' onClick='MSE_JPS.listeners.page.new();'>Add Page</a>
						<ul class='sortable list'></ul>
				</section>

				<section class='articles'> <!-- flex column -->
					<div class='slider flex column'> <!-- isflex -->
						<a class='button' onClick='MSE_JPS.listeners.article.new();'>Add Article</a>
						<ul class='sortable list'></ul>
					</div>
				</section>

				<section class='references flex column'>
						<a class='button' onClick='MSE_JPS.listeners.reference.new();'>Add Reference</a>
						<ul class='sortable list'></ul>
				</section>

			</div>
			<!-- <div class='tab flex row'> -->

			<section class='links flex column'>
					<a class='button' onClick='MSE_JPS.listeners.link.new();'>Add Link</a>
					<ul class='sortable list'></ul>
			</section>

			<section class='socials flex column'>
					<a class='button' onClick='MSE_JPS.listeners.social.new();'>Add Social link</a>
					<ul class='sortable list'></ul>
			</section>

			<!-- </div> -->
		</main>
		</div>

		<!--
		****************************************************************************
		*                           P a g e   -   T r a y                          *
		****************************************************************************
		-->
		<div class='tray page'>
			<a class='close'>Close</a>
			<div class='menu'>
				<ul>
					<li><a onclick='MSE_JPS.tray.viewTab(this, 0);'>Settings</a></li>
					<li class='warning'><a onclick='MSE_JPS.listeners.page.delete();'>Delete</a></li>
					<li class='confirm'><a onclick='MSE_JPS.listeners.page.commit();'>Commit</a></li>
				</ul>
			</div>
			<div class='content'>
				<div class='tab'>
					<h3>Title :</h3>
					<input type='text' class='followchange' id='input_page_title' placeholder='Title'/>
					<h3>Articles style :</h3>
					<select class='followchange' id='input_page_style'>
						<option value=''           > Full (100%)</option>
						<option disabled           > ---        </option>
						<option value='quarter'    >25%         </option>
						<option value='third'      >33%         </option>
						<option value='half'       >50%         </option>
						<!-- <option value='twothird'   >66%         </option> -->
						<!-- <option value='treequarter'>75%         </option> -->
					</select>
					<div class='entry'>
						<span class='slider'><input type='checkbox' class='followchange' id='input_page_expendable'/><label for='input_page_expendable'></label></span>
						<h4>Expandable</h4>
						<span class='slider'><input type='checkbox' class='followchange' id='input_page_bordered'/><label for='input_page_bordered'></label></span>
						<h4>Borders</h4>
					</div>
				</div>
			</div>
		</div>
		<!--
		****************************************************************************
		*                        A r t i c l e   -   T r a y                       *
		****************************************************************************
		-->
		<div class='tray article'>
			<a class='close'>Close</a>
			<div class='menu'>
				<ul>
					<li><a onclick='MSE_JPS.tray.viewTab(this, 0);'>Content</a></li>
					<li><a onclick='MSE_JPS.tray.viewTab(this, 1);'>Javascript</a></li>
					<li><a onclick='MSE_JPS.tray.viewTab(this, 2);'>Bibliography</a></li>
					<li class='warning'><a onclick='MSE_JPS.listeners.article.delete();'>Delete</a></li>
					<li class='confirm'><a onclick='MSE_JPS.listeners.article.commit();'>Commit</a></li>
				</ul>
			</div>
			<div class='content'>
				<div class='tab'>
					<h3>Title</h3>
					<input type='text' class='followchange' id='input_article_title' placeholder='Title'/>
					<h3>Text</h3>
					<textarea class='followchange' id='input_article_text' placeholder='Content'></textarea>
					<div class='entry'>
						<span class='slider'><input type='checkbox' class='followchange' id='input_article_archived'/><label for='input_article_archived'></label></span>
						<h4>Archived</h4>
					</div>
				</div>
				<div class='tab'>
					<h3>Javascript</h3>
					<textarea class='monospace followchange' id='input_article_javascript' placeholder='Javascript code'></textarea>
				</div>
				<div class='tab'>
					<div class='flex column isflex'>
						<h3>Bibliography</h3>
						<div class='search flex row'>
							<input type='text' class='isflex ui-autocomplete-input' id='input_article_refsearch' placeholder='Search...'/>
						</div>
						<ul class='sortable list isflex'>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<!--
		****************************************************************************
		*                      R e f e r e n c e   -   T r a y                     *
		****************************************************************************
		-->
		<div class='tray reference'>
			<a class='close'>Close</a>
			<div class='menu'>
				<ul>
					<li><a onclick='MSE_JPS.tray.viewTab(this, 0);'>Content</a></li>
					<li><a onclick='MSE_JPS.tray.viewTab(this, 1);'>Abstract</a></li>
					<li><a onclick='MSE_JPS.tray.viewTab(this, 2);'>Bibtex</a></li>
					<li><a onclick='MSE_JPS.tray.viewTab(this, 3);'>Links</a></li>
					<li class='warning'><a onclick='MSE_JPS.listeners.reference.delete();'>Delete</a></li>
					<li class='confirm'><a onclick='MSE_JPS.listeners.reference.commit();'>Commit</a></li>
				</ul>
			</div>
			<div class='content'>
				<div class='tab'>
					<h3>Title</h3>
					<input type='text' class='followchange' id='input_reference_title' placeholder='Title'/>
					<h3>Authors</h3>
					<input type='text' class='followchange' id='input_reference_authors' placeholder='Authors'/>
					<h3>Reference</h3>
					<textarea class='followchange' id='input_reference_reference' placeholder='Reference'></textarea>
				</div>
				<div class='tab'>
					<h3>Abstract</h3>
					<textarea class='followchange' id='input_reference_abstract' placeholder='Abstract'></textarea>
				</div>
				<div class='tab'>
					<h3>Bibtex</h3>
					<textarea class='monospace followchange' id='input_reference_bibtex' placeholder='Bibtex entry'></textarea>
				</div>
				<div class='tab'>
					<h3>Links</h3>
					<a class='button' onclick='MSE_JPS.listeners.source.add();'>Add Link</a>
					<ul class='sortable list isflex'>
					</ul>
				</div>
			</div>
		</div>
		<!--
		****************************************************************************
		*                         L i n k s   -   T r a y                          *
		****************************************************************************
		-->
		<div class='tray link'>
			<a class='close'>Close</a>
			<div class='menu'>
				<ul>
					<li><a onclick='MSE_JPS.tray.viewTab(this, 0);'>Settings</a></li>
					<li class='warning'><a onclick='MSE_JPS.listeners.link.delete();'>Delete</a></li>
					<li class='confirm'><a onclick='MSE_JPS.listeners.link.commit();'>Commit</a></li>
				</ul>
			</div>
			<div class='content'>
				<div class='tab'>
					<h3>Title</h3>
					<input type='text' class='followchange' id='input_link_title' placeholder='Title'/>
					<h3>Content</h3>
					<textarea class='followchange' id='input_link_content' placeholder='Content'></textarea>
				</div>
			</div>
		</div>
		<!--
		****************************************************************************
		*                        S o c i a l   -   T r a y                         *
		****************************************************************************
		-->
		<div class='tray social'>
			<a class='close'>Close</a>
			<div class='menu'>
				<ul>
					<li><a onclick='MSE_JPS.tray.viewTab(this, 0);'>Settings</a></li>
					<li class='warning'><a onclick='MSE_JPS.listeners.social.delete();'>Delete</a></li>
					<li class='confirm'><a onclick='MSE_JPS.listeners.social.commit();'>Commit</a></li>
				</ul>
			</div>
			<div class='content'>
				<div class='tab'>
					<h3>Title</h3>
					<input type='text' class='followchange' id='input_social_title' placeholder='Name'/>
					<h3>Image</h3>
					<input type='text' class='followchange' id='input_social_img' placeholder='Image url'/>
					<h3>Url</h3>
					<input type='text' class='followchange' id='input_social_url' placeholder='Link target'/>
					<div class='entry'>
						<span class='slider'><input type='checkbox' class='followchange' id='input_social_showtext'/><label for='input_social_showtext'></label></span>
						<h4>Verbose link</h4>
					</div>
 				</div>
			</div>
		</div>

		<!--
		****************************************************************************
		*                       S e c u r i t y   T o k e n                        *
		****************************************************************************
		-->
		<script defer type="text/javascript">
			var MSE_JPS = MSE_JPS || {};
			MSE_JPS.token = '<?php echo auth::get_token(); ?>';
		</script>


	</body>
</html>
