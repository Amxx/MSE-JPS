<?php
/******************************************************************************
 *                                  MSE-JPS                                   *
 *                 Mini Site Engine - Javascript / PHP / SQL                  *
 *                                                                            *
 *                        Version 1.1.0-5 : 30/03/2015                        *
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
	function readDB($socket, $prefix)
	{
		# ==========================================================================
		$query_results = $socket->query(
			"SELECT
				`{$prefix}pages`.Page_ID,
				`{$prefix}pages`.Page_Title,
				`{$prefix}pages`.Page_Block,
				`{$prefix}pages`.Page_Order,
				`{$prefix}pages`.Page_Default,
				`{$prefix}articles`.Article_ID,
				`{$prefix}articles`.Article_Title,
				`{$prefix}articles`.Article_Text,
				`{$prefix}articles`.Article_Javascript,
				`{$prefix}articles`.Article_Archived,
				`{$prefix}references`.Reference_ID,
				`{$prefix}references`.Reference_Title,
				`{$prefix}references`.Reference_Authors,
				`{$prefix}references`.Reference_Ref,
				`{$prefix}references`.Reference_Abstract,
				`{$prefix}references`.Reference_Bibtex,
				`{$prefix}referencesources`.Referencesource_ID,
				`{$prefix}referencesources`.Referencesource_Name,
				`{$prefix}referencesources`.Referencesource_Url
			FROM `{$prefix}pages`
			LEFT OUTER JOIN `{$prefix}articles`         ON `{$prefix}pages`.Page_ID           = `{$prefix}articles`.Page_ID
			LEFT OUTER JOIN `{$prefix}citations`        ON `{$prefix}articles`.Article_ID     = `{$prefix}citations`.Article_ID
			LEFT OUTER JOIN `{$prefix}references`       ON `{$prefix}citations`.Reference_ID  = `{$prefix}references`.Reference_ID
			LEFT OUTER JOIN `{$prefix}referencesources` ON `{$prefix}references`.Reference_ID = `{$prefix}referencesources`.Reference_ID
			ORDER BY
				{$prefix}pages.Page_Order IS NULL,
				{$prefix}pages.Page_Order ASC,
				{$prefix}articles.Article_Timestamp DESC,
				{$prefix}citations.Citation_Order IS NULL,
				{$prefix}citations.Citation_Order ASC"
		);
		while ($line = $query_results->fetch()) $this->page->parse($line);
		$query_results->closeCursor();

		# ==========================================================================
		$query_results = $socket->query(
			"SELECT * FROM `{$prefix}socials` ORDER BY `{$prefix}socials`.Social_Timestamp ASC"
		);
		while ($line = $query_results->fetch()) $this->socials->parse($line);
		$query_results->closeCursor();

		# ==========================================================================
		$query_results = $socket->query(
			"SELECT * FROM `{$prefix}links` ORDER BY `{$prefix}links`.Link_Timestamp ASC"
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