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

class Social extends Entry
{
	public function __construct($input)
	{
		parent::__construct($input['Social_ID']);
		$this->title = $input['Social_Title'];
		$this->img   = $input['Social_Img'];
		$this->url   = $input['Social_Url'];
	}
}
class Socials extends Catalog
{
	public function parse($input)
	{
		try {
			$social = new Social($input);
			$this->insert($social);
		} catch(Exception $e) {}
	}
}

?>
