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

class Entry {
	private $id;
	public function __construct($id)
	{
		if (is_null($id)) throw new Exception();
		$this->id = $id;
	}
	public function id()
	{
		return $this->id;
	}
}

?>