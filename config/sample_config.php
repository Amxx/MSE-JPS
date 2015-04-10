<?php

$name    = 'Website title';
$picture = 'profile_img.png';

/******************************************************************************
 *                           MSE Database settings                            *
 ******************************************************************************/
$host   = 'mysql:host=hostname;dbname=dbname;charset=utf8';
$user   = 'user';
$psswd  = 'password';
$prefix = 'MSE_';

/******************************************************************************
 *                               Piwik settings                               *
 ******************************************************************************/
$modules['piwik'] = array(
	// 'url'           => 'domain/path/to/piwik',
	// 'id'            => piwik_id,
	// 'cookieDomain'  => '*.domain', // Leave commented - for expert user
	// 'outlinkDomain' => array('*.domain', '*.otherdomain') // Leave commented - for expert user
);

?>
