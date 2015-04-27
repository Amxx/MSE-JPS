<?php
/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.1.0-0 : 27/04/2015                        *
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
		$this->title    = $input['Social_Title'];
		$this->img      = $input['Social_Img'];
		$this->url      = $input['Social_Url'];
		$this->showtext = $input['Social_ShowText'];
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
