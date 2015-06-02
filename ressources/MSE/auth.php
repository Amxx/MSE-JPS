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

class auth
{
	static function init_token()
	{
		$_SESSION['token'] = md5(uniqid(mt_rand(), true));
	}
	static function get_token()
	{
		return $_SESSION['token'];
	}
	static function check_token($token)
	{
		return $_SESSION['token'] == $token;
	}
}

?>