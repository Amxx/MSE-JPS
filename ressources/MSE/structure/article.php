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
include_once 'reference.php';

class Article extends Entry
{
	public function __construct($input)
	{
		parent::__construct($input['Article_ID']);
		$this->pageID     = $input['Page_ID'];
		$this->title      = $input['Article_Title'];
		$this->text       = $input['Article_Text'];
		$this->javascript = $input['Article_Javascript'];
		$this->archived   = $input['Article_Archived'];
		$this->citations  = new Catalog();
	}
	public function parse($input)
	{
		try {
			$citation = new Reference($input);
			$this->citations->insert($citation);
			$citation->parse($input);
		} catch(Exception $e) {}
	}
}

?>