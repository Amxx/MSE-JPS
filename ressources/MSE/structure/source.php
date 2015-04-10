<?php
/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 2.0.0-0 : 10/04/2015                        *
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
		$this->title       = $input['Source_Title'];
		$this->url         = $input['Source_Url'];
	}
}

?>