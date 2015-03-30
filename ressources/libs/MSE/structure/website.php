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
		$this->page     = new Page();
		$this->links    = new Links();
		$this->socials  = new Socials();
		$this->current  = null;
	}
	function readDB($socket)
	{
		# ==========================================================================
		$query_results = $socket->query(
			'SELECT
				`pages`.Page_ID,
				`pages`.Page_Title,
				`pages`.Page_Block,
				`pages`.Page_Order,
				`pages`.Page_Default,
				`articles`.Article_ID,
				`articles`.Article_Title,
				`articles`.Article_Text,
				`articles`.Article_Javascript,
				`articles`.Article_Archived,
				`references`.Reference_ID,
				`references`.Reference_Title,
				`references`.Reference_Authors,
				`references`.Reference_Ref,
				`references`.Reference_Abstract,
				`references`.Reference_Bibtex,
				`referencesources`.Referencesource_ID,
				`referencesources`.Referencesource_Name,
				`referencesources`.Referencesource_Url
			FROM `pages`
			LEFT OUTER JOIN `articles`         ON `pages`.Page_ID           = `articles`.Page_ID
			LEFT OUTER JOIN `citations`        ON `articles`.Article_ID     = `citations`.Article_ID
			LEFT OUTER JOIN `references`       ON `citations`.Reference_ID  = `references`.Reference_ID
			LEFT OUTER JOIN `referencesources` ON `references`.Reference_ID = `referencesources`.Reference_ID
			ORDER BY
				pages.Page_Order IS NULL,
				pages.Page_Order ASC,
				articles.Article_Timestamp DESC,
				citations.Citation_Order IS NULL,
				citations.Citation_Order ASC'
		);
		while ($line = $query_results->fetch()) $this->page->parse($line);
		$query_results->closeCursor();

		# ==========================================================================
		$query_results = $socket->query(
			'SELECT * FROM `socials` ORDER BY `socials`.Social_Timestamp ASC'
		);
		while ($line = $query_results->fetch()) $this->socials->parse($line);
		$query_results->closeCursor();

		# ==========================================================================
		$query_results = $socket->query(
			'SELECT * FROM `links` ORDER BY `links`.Link_Timestamp ASC'
		);
		while ($line = $query_results->fetch()) $this->links->parse($line);
		$query_results->closeCursor();
	}

	function setEnv()
	{
		foreach ($this->page->sections->list as $section)
			if ((isset($_GET['page']) && $_GET['page'] == $section->title) || (is_null($this->current) && $section->default))
			$this->current = $section->id();
	}

}

?>