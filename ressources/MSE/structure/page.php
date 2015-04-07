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

include_once 'section.php';

class Page
{
	public function __construct()
	{
		$this->sections = new Catalog();
	}
	public function parse($input)
	{
		try {
			$section = new Section($input);
			$this->sections->insert($section);
			$section->parse($input);
		} catch(Exception $e) {}
	}
}

?>