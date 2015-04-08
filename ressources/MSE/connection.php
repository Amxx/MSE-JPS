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

class Connection
{
	private $socket;
	public function open($host, $user, $psswd)
	{
		try                  { $this->socket = new PDO($host, $user, $psswd);       }
		catch (Exception $e) { die('Could not open SQL connection: '.$e->getMessage()); }
	}
	public function close()
	{
		$this->socket = null;
	}
	public function query($query)
	{
		if (!is_null($this->socket)) return $this->socket->query($query);
	}
	public function prepare($query)
	{
		if (!is_null($this->socket)) return $this->socket->prepare($query);
	}
	public function lastInsertId()
	{
		if (!is_null($this->socket)) return $this->socket->lastInsertId();
	}
}

?>