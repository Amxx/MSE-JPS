<?php
/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                         Version 1.0.1 : 27/03/2015                         *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

include_once 'config/config.php';

include_once 'ressources/libs/MSE/connection.php';
include_once 'ressources/libs/MSE/container/catalog.php';
include_once 'ressources/libs/MSE/structure/website.php';
require_once 'ressources/libs/Twig/Autoloader.php';

# Connect to DB
$sqlsocket = new Connection();
$sqlsocket->open($host, $user, $psswd);

# Build website
$website = new WebSite();
$website->readDB($sqlsocket);
$website->setEnv();

# Make environment
Twig_Autoloader::register();

$loader = new Twig_Loader_Filesystem('ressources/templates');
$twig   = new Twig_Environment($loader, array(
	// 'cache' => 'buffer', // local gives error, write permission ?
));

# Load template
$template = $twig->loadTemplate('main.tpl');
echo $template->render(array('website' => $website));

?>