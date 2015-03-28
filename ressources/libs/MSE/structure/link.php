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

include_once 'entry.php';

class Link extends Entry
{
	public function __construct($input)
	{
		parent::__construct($input['Link_ID']);
		$this->title   = $input['Link_Title'];
		$this->content = $input['Link_Content'];
	}
}
class Links extends Catalog
{
	public function parse($input)
	{
		try {
			$link = new Link($input);
			$this->insert($link);
		} catch(Exception $e) {}
	}
}

?>
