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

class Source extends Entry
{
	public function __construct($input)
	{
		parent::__construct($input['Source_ID']);
		$this->referenceID = $input['Reference_ID'];
		$this->name        = $input['Source_Name'];
		$this->url         = $input['Source_Url'];
	}
}

?>