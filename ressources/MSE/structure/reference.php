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
include_once 'referencesource.php';

class Reference extends Entry
{
	public function __construct($input)
	{
		parent::__construct($input['Reference_ID']);
		$this->articleID = $input['Article_ID'];
		$this->title     = $input['Reference_Title'];
		$this->authors   = $input['Reference_Authors'];
		$this->ref       = $input['Reference_Ref'];
		$this->abstract  = $input['Reference_Abstract'];
		$this->bibtex    = $input['Reference_Bibtex'];
		$this->sources   = new Catalog();
	}
	public function parse($input)
	{
		try {
			$source = new ReferenceSource($input);
			$this->sources->insert($source);
		} catch(Exception $e) {}
	}
}

?>