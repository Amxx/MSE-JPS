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

include_once 'page.php';

class Sections
{
	public function __construct()
	{
		$this->pages = new Catalog();
	}
	public function parse($input)
	{
		try {
			$page = new Page($input);
			$this->pages->insert($page);
			$page->parse($input);
		} catch(Exception $e) {}
	}
}

?>