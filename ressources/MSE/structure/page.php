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
include_once 'article.php';

class Page extends Entry
{
	public function __construct($input)
	{
		parent::__construct($input['Page_ID']);
		$this->title      = $input['Page_Title'];
		$this->style      = $input['Page_Style'];
		$this->bordered   = $input['Page_Bordered'];
		$this->expandable = $input['Page_Expandable'];
		$this->default    = $input['Page_Default'];
		$this->articles   = new Catalog();
	}
	public function parse($input)
	{
		try {
			$article = new Article($input);
			$this->articles->insert($article);
			$article->parse($input);
		} catch(Exception $e) {}
	}
}
class Pages extends Catalog
{
	public function parse($input)
	{
		try {
			$page = new Page($input);
			$this->insert($page);
			$page->parse($input);
		} catch(Exception $e) {}
	}
}

?>