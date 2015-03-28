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
 ******************************************************************************
 * Copyright Hadrien Croubois (27/03/2015)                                    *
 * hadrien.croubois@gmail.com                                                 *
 *                                                                            *
 * This software is a computer program whose purpose is to generate           *
 * minilalistic dynamic website generation.                                   *
 *                                                                            *
 * This software is governed by the CeCILL-B license under French law and     *
 * abiding by the rules of distribution of free software. You can use, modify *
 * and/ or redistribute the software under the terms of the CeCILL-B license  *
 * as circulated by CEA, CNRS and INRIA at the following URL                  *
 * "http://www.cecill.info".                                                  *
 *                                                                            *
 * As a counterpart to the access to the source code and rights to copy,      *
 * modify and redistribute granted by the license, users are provided only    *
 * with a limited warranty and the software's author, the holder of the       *
 * economic rights, and the successive licensors have only limited liability. *
 *                                                                            *
 * In this respect, the user's attention is drawn to the risks associated     *
 * with loading, using, modifying and/or developing or reproducing the        *
 * software by the user in light of its specific status of free software,     *
 * that may mean that it is complicated to manipulate, and that also          *
 * therefore means that it is reserved for developers and experienced         *
 * professionals having in-depth computer knowledge. Users are therefore      *
 * encouraged to load and test the software's suitability as regards their    *
 * requirements in conditions enabling the security of their systems and/or   *
 * data to be ensured and, more generally, to use and operate it in the same  *
 * conditions as regards security.                                            *
 *                                                                            *
 * The fact that you are presently reading this means that you have had       *
 * knowledge of the CeCILL-B license and that you accept its terms.           *
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