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