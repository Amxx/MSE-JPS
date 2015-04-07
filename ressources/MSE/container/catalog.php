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

class Catalog
{
	public function __construct()
	{
		$this->map  = array();
		$this->list = array();
	}
	public function insert(&$entry)
	{
		if (!array_key_exists($entry->id(), $this->map))
		{
			$this->map[$entry->id()] = &$entry;
			$this->list[]            = &$entry;
		}
		else $entry = $this->map[$entry->id()];
	}
}

?>