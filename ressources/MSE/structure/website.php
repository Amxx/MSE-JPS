<?php
/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 1.2.0-2 : 07/04/2015                        *
 *                                                                            *
 *                      Developped by Hadrien Croubois :                      *
 *                         hadrien.croubois@gmail.com                         *
 *                                                                            *
 ******************************************************************************/

include_once 'page.php';
include_once 'link.php';
include_once 'social.php';

class Header
{
	function __construct()
	{
		$this->name    = 'Hadrien Croubois';
		$this->picture = 'ressources/img/croubois.jpg';
	}
}

class WebSite
{
	function __construct()
	{
		$this->header   = new Header();
		$this->pages    = new Pages();
		$this->links    = new Links();
		$this->socials  = new Socials();
		$this->current  = null;
	}
	function readDB($socket)
	{
		# ==========================================================================
		$query_results = $socket->query(
			"SELECT
				`{$GLOBALS['prefix']}pages`.Page_ID,
				`{$GLOBALS['prefix']}pages`.Page_Title,
				`{$GLOBALS['prefix']}pages`.Page_Style,
				`{$GLOBALS['prefix']}pages`.Page_Bordered,
				`{$GLOBALS['prefix']}pages`.Page_Expandable,
				`{$GLOBALS['prefix']}pages`.Page_Default,
				`{$GLOBALS['prefix']}articles`.Article_ID,
				`{$GLOBALS['prefix']}articles`.Article_Title,
				`{$GLOBALS['prefix']}articles`.Article_Text,
				`{$GLOBALS['prefix']}articles`.Article_Javascript,
				`{$GLOBALS['prefix']}articles`.Article_Archived,
				`{$GLOBALS['prefix']}references`.Reference_ID,
				`{$GLOBALS['prefix']}references`.Reference_Title,
				`{$GLOBALS['prefix']}references`.Reference_Authors,
				`{$GLOBALS['prefix']}references`.Reference_Ref,
				`{$GLOBALS['prefix']}references`.Reference_Abstract,
				`{$GLOBALS['prefix']}references`.Reference_Bibtex,
				`{$GLOBALS['prefix']}sources`.Source_ID,
				`{$GLOBALS['prefix']}sources`.Source_Title,
				`{$GLOBALS['prefix']}sources`.Source_Url
			FROM `{$GLOBALS['prefix']}pages`
			LEFT OUTER JOIN `{$GLOBALS['prefix']}articles`   ON `{$GLOBALS['prefix']}pages`.Page_ID           = `{$GLOBALS['prefix']}articles`.Page_ID
			LEFT OUTER JOIN `{$GLOBALS['prefix']}citations`  ON `{$GLOBALS['prefix']}articles`.Article_ID     = `{$GLOBALS['prefix']}citations`.Article_ID
			LEFT OUTER JOIN `{$GLOBALS['prefix']}references` ON `{$GLOBALS['prefix']}citations`.Reference_ID  = `{$GLOBALS['prefix']}references`.Reference_ID
			LEFT OUTER JOIN `{$GLOBALS['prefix']}sources`    ON `{$GLOBALS['prefix']}references`.Reference_ID = `{$GLOBALS['prefix']}sources`.Reference_ID
			ORDER BY
				{$GLOBALS['prefix']}pages.Page_Order         ASC,
				{$GLOBALS['prefix']}articles.Article_Order   ASC,
				{$GLOBALS['prefix']}citations.Citation_Order ASC,
				{$GLOBALS['prefix']}sources.Source_Order     ASC"
		);
		while ($line = $query_results->fetch()) $this->pages->parse($line);
		$query_results->closeCursor();

		# ==========================================================================
		$query_results = $socket->query(
			"SELECT * FROM `{$GLOBALS['prefix']}socials` ORDER BY `{$GLOBALS['prefix']}socials`.Social_Order ASC"
		);
		while ($line = $query_results->fetch()) $this->socials->parse($line);
		$query_results->closeCursor();

		# ==========================================================================
		$query_results = $socket->query(
			"SELECT * FROM `{$GLOBALS['prefix']}links` ORDER BY `{$GLOBALS['prefix']}links`.Link_Order ASC"
		);
		while ($line = $query_results->fetch()) $this->links->parse($line);
		$query_results->closeCursor();
	}

	function setEnv()
	{
		foreach ($this->pages->list as $page)
			if ((isset($_GET['page']) && $_GET['page'] == $page->title) || (is_null($this->current) && $page->default))
				$this->current = $page->id();
	}

}

?>