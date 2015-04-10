<?php

include_once '../config/config.php';
include_once '../ressources/MSE/connection.php';


/******************************************************************************
 *                          S Q L   R e q u e s t s                            *
 ******************************************************************************/
// -----------------------------------------------------------------------------
$QUERY_STR['select_pages'     ] = "SELECT * FROM `{$GLOBALS['prefix']}pages";
$QUERY_STR['insert_page'      ] = "INSERT   INTO `{$GLOBALS['prefix']}pages` (`Page_Title`, `Page_Style`, `Page_Bordered`, `Page_Expandable`) VALUES (:title, :style, :bordered, :expandable)";
$QUERY_STR['update_page'      ] = "UPDATE        `{$GLOBALS['prefix']}pages` SET `Page_Title` = :title, `Page_Style` = :style, `Page_Bordered` = :bordered, `Page_Expandable` = :expandable WHERE `Page_ID` = :id";
$QUERY_STR['delete_page'      ] = "DELETE   FROM `{$GLOBALS['prefix']}pages` WHERE `Page_ID` = :id";
$QUERY_STR['reorder_page'     ] = "UPDATE        `{$GLOBALS['prefix']}pages` SET `Page_Order` = :order WHERE `Page_ID` = :id";
// -----------------------------------------------------------------------------
$QUERY_STR['select_articles'  ] = "SELECT * FROM `{$GLOBALS['prefix']}articles";
$QUERY_STR['insert_article'   ] = "INSERT   INTO `{$GLOBALS['prefix']}articles` (`Page_ID`, `Article_Title`, `Article_Text`, `Article_Javascript`, `Article_Archived`) VALUES (:pid, :title, :text, :javascript, :archived)";
$QUERY_STR['update_article'   ] = "UPDATE        `{$GLOBALS['prefix']}articles` SET `Page_ID` = :pid, `Article_Title` = :title, `Article_Text` = :text, `Article_Javascript` = :javascript, `Article_Archived` = :archived WHERE `Article_ID` = :id";
$QUERY_STR['delete_article'   ] = "DELETE   FROM `{$GLOBALS['prefix']}articles` WHERE `Article_ID` = :id";
$QUERY_STR['reorder_article'  ] = "UPDATE        `{$GLOBALS['prefix']}articles` SET `Article_Order` = :order WHERE `Article_ID` = :id";
// -----------------------------------------------------------------------------
$QUERY_STR['select_references'] = "SELECT * FROM `{$GLOBALS['prefix']}references`";
$QUERY_STR['insert_reference' ] = "INSERT   INTO `{$GLOBALS['prefix']}references` (`Reference_Title`, `Reference_Authors`, `Reference_Ref`, `Reference_Abstract`, `Reference_Bibtex`) VALUES (:title, :authors, :ref, :abstract, :bibtex)";
$QUERY_STR['update_reference' ] = "UPDATE        `{$GLOBALS['prefix']}references` SET `Reference_Title` = :title, `Reference_Authors` = :authors, `Reference_Ref` = :ref, `Reference_Abstract` = :abstract, `Reference_Bibtex` = :bibtex WHERE `Reference_ID` = :id";
$QUERY_STR['delete_reference' ] = "DELETE   FROM `{$GLOBALS['prefix']}references` WHERE `Reference_ID` = :id";
// -----------------------------------------------------------------------------
$QUERY_STR['select_links'     ] = "SELECT * FROM `{$GLOBALS['prefix']}links`";
$QUERY_STR['insert_link'      ] = "INSERT   INTO `{$GLOBALS['prefix']}links` (`Link_Title`, `Link_Content`) VALUES (:title, :content)";
$QUERY_STR['update_link'      ] = "UPDATE        `{$GLOBALS['prefix']}links` SET `Link_Title` = :title, `Link_Content` = :content WHERE `Link_ID` = :id";
$QUERY_STR['delete_link'      ] = "DELETE   FROM `{$GLOBALS['prefix']}links` WHERE `Link_ID` = :id";
$QUERY_STR['reorder_link'     ] = "UPDATE        `{$GLOBALS['prefix']}links` SET `Link_Order` = :order WHERE `Link_ID` = :id";
// -----------------------------------------------------------------------------
$QUERY_STR['select_socials'   ] = "SELECT * FROM `{$GLOBALS['prefix']}socials`";
$QUERY_STR['insert_social'    ] = "INSERT   INTO `{$GLOBALS['prefix']}socials` (`Social_Title`, `Social_Img`, `Social_Url`, `Social_ShowText`) VALUES (:title, :img, :url, :showtext)";
$QUERY_STR['update_social'    ] = "UPDATE        `{$GLOBALS['prefix']}socials` SET `Social_Title` = :title, `Social_Img` = :img, `Social_Url` = :url, `Social_ShowText` = :showtext WHERE `Social_ID` = :id";
$QUERY_STR['delete_social'    ] = "DELETE   FROM `{$GLOBALS['prefix']}socials` WHERE `Social_ID` = :id";
$QUERY_STR['reorder_social'   ] = "UPDATE        `{$GLOBALS['prefix']}socials` SET `Social_Order` = :order WHERE `Social_ID` = :id";
// -----------------------------------------------------------------------------
$QUERY_STR['select_citations' ] = "SELECT * FROM `{$GLOBALS['prefix']}citations`";
$QUERY_STR['insert_citation'  ] = "INSERT   INTO `{$GLOBALS['prefix']}citations` (`Article_ID`, `Reference_ID`) VALUES (:articleID, :referenceID)";
$QUERY_STR['delete_citation'  ] = "DELETE   FROM `{$GLOBALS['prefix']}citations` WHERE `Citation_ID` = :id";
$QUERY_STR['reorder_citation' ] = "UPDATE        `{$GLOBALS['prefix']}citations` SET `Citation_Order` = :order WHERE `Citation_ID` = :id";
// -----------------------------------------------------------------------------
$QUERY_STR['select_sources'   ] = "SELECT * FROM `{$GLOBALS['prefix']}sources`";
// -----------------------------------------------------------------------------

/******************************************************************************
 *                            S Q L   S o c k e t                             *
 ******************************************************************************/
$sqlsocket = new Connection();
$sqlsocket->open($host, $user, $psswd);
$result = array();


/******************************************************************************
 *                            P r o c e s s i n g                             *
 ******************************************************************************/
if (isset($_POST['QUERY']))
	switch($_POST['QUERY'])
	{
		// ============================= G e t   A l l =============================
		case "select_pages":
			$result['values'] = $sqlsocket->query($QUERY_STR['select_pages'])->fetchAll(PDO::FETCH_ASSOC);
			break;
		case "select_articles":
			$result['values'] = $sqlsocket->query($QUERY_STR['select_articles'])->fetchAll(PDO::FETCH_ASSOC);
			break;
		case "select_references":
			$result['values'] = $sqlsocket->query($QUERY_STR['select_references'])->fetchAll(PDO::FETCH_ASSOC);
			break;
		case "select_citations":
			$result['values'] = $sqlsocket->query($QUERY_STR['select_citations'])->fetchAll(PDO::FETCH_ASSOC);
			break;
		case "select_links":
			$result['values'] = $sqlsocket->query($QUERY_STR['select_links'])->fetchAll(PDO::FETCH_ASSOC);
			break;
		case "select_socials":
			$result['values'] = $sqlsocket->query($QUERY_STR['select_socials'])->fetchAll(PDO::FETCH_ASSOC);
			break;
		case "select_sources":
			$result['values'] = $sqlsocket->query($QUERY_STR['select_sources'])->fetchAll(PDO::FETCH_ASSOC);
			break;
		// ================================ P a g e ================================
		// Insert ------------------------------------------------------------------
		case "insert_page":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["insert_page"]);
			$stmt->execute(array(
				':title'      => $_POST['object']['title'     ],
				':style'      => $_POST['object']['style'     ],
				':bordered'   => $_POST['object']['bordered'  ] === 'true',
				':expandable' => $_POST['object']['expandable'] === 'true'
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$result['id']  = $sqlsocket->lastInsertId();
			break;
		}
		// Update ------------------------------------------------------------------
		case "update_page":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["update_page"]);
			$stmt->execute(array(
				':id'         => $_POST['object']['id'        ],
				':title'      => $_POST['object']['title'     ],
				':style'      => $_POST['object']['style'     ],
				':bordered'   => $_POST['object']['bordered'  ] === 'true',
				':expandable'	=> $_POST['object']['expandable'] === 'true'
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Drop --------------------------------------------------------------------
		case "delete_page":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["delete_page"]);
			$stmt->execute(array(
				':id' => $_POST['object']['id']
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Reorder -----------------------------------------------------------------
		case "reorder_page":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["reorder_page"]);
			foreach($_POST['object'] as $order => $id)
			{
				$stmt->execute(array(':id' => $id, ':order' => $order));
				$result['sql'][] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			}
			break;
		}
		// ============================= A r t i c l e =============================
		// Insert ------------------------------------------------------------------
		case "insert_article":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["insert_article"]);
			$stmt->execute(array(
				':pid'        => $_POST['object']['pageID'    ],
				':title'      => $_POST['object']['title'     ],
				':text'       => $_POST['object']['text'      ],
				':javascript' => $_POST['object']['javascript'],
				':archived'   => $_POST['object']['archived'  ] === 'true'
			));
			$result['obj'] = $_POST['object'];
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$result['id']  = $sqlsocket->lastInsertId();
			break;
		}
		// Update ------------------------------------------------------------------
		case "update_article":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["update_article"]);
			$stmt->execute(array(
				':id'         => $_POST['object']['id'        ],
				':pid'        => $_POST['object']['pageID'    ],
				':title'      => $_POST['object']['title'     ],
				':text'       => $_POST['object']['text'      ],
				':javascript' => $_POST['object']['javascript'],
				':archived'   => $_POST['object']['archived'  ] === 'true'
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Drop --------------------------------------------------------------------
		case "delete_article":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["delete_article"]);
			$stmt->execute(array(
				':id' => $_POST['object']['id']
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Reorder -----------------------------------------------------------------
		case "reorder_article":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["reorder_article"]);
			foreach($_POST['object'] as $order => $id)
			{
				$stmt->execute(array(':id' => $id, ':order' => $order));
				$result['sql'][] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			}
			break;
		}
		// =========================== R e f e r e n c e ===========================
		// Insert ------------------------------------------------------------------
		case "insert_reference":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["insert_reference"]);
			$stmt->execute(array(
				':title'    => $_POST['object']['title'    ],
				':authors'  => $_POST['object']['authors'  ],
				':ref'      => $_POST['object']['reference'],
				':abstract' => $_POST['object']['abstract' ],
				':bibtex'   => $_POST['object']['bibtex'   ]
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$result['id']  = $sqlsocket->lastInsertId();
			break;
		}
		// Update ------------------------------------------------------------------
		case "update_reference":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["update_reference"]);
			$stmt->execute(array(
				':id'        => $_POST['object']['id'      ],
				':title'     => $_POST['object']['title'   ],
				':authors'  => $_POST['object']['authors'  ],
				':ref'      => $_POST['object']['reference'],
				':abstract' => $_POST['object']['abstract' ],
				':bibtex'   => $_POST['object']['bibtex'   ]
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Drop --------------------------------------------------------------------
		case "delete_reference":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["delete_reference"]);
			$stmt->execute(array(
				':id' => $_POST['object']['id']
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// ================================ L i n k ================================
		// Insert ------------------------------------------------------------------
		case "insert_link":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["insert_link"]);
			$stmt->execute(array(
				':title'   => $_POST['object']['title'  ],
				':content' => $_POST['object']['content']
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$result['id']  = $sqlsocket->lastInsertId();
			break;
		}
		// Update ------------------------------------------------------------------
		case "update_link":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["update_link"]);
			$stmt->execute(array(
				':id'      => $_POST['object']['id'     ],
				':title'   => $_POST['object']['title'  ],
				':content' => $_POST['object']['content']
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Drop --------------------------------------------------------------------
		case "delete_link":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["delete_link"]);
			$stmt->execute(array(
				':id' => $_POST['object']['id']
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Reorder -----------------------------------------------------------------
		case "reorder_link":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["reorder_link"]);
			foreach($_POST['object'] as $order => $id)
			{
				$stmt->execute(array(':id' => $id, ':order' => $order));
				$result['sql'][] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			}
			break;
		}
		// ============================== S o c i a l ==============================
		// Insert ------------------------------------------------------------------
		case "insert_social":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["insert_social"]);
			$stmt->execute(array(
				':title'    => $_POST['object']['title'   ],
				':img'      => $_POST['object']['img'     ],
				':url'      => $_POST['object']['url'     ],
				':showtext' => $_POST['object']['showtext']
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$result['id']  = $sqlsocket->lastInsertId();
			break;
		}
		// Update ------------------------------------------------------------------
		case "update_social":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["update_social"]);
			$stmt->execute(array(
				':id'       => $_POST['object']['id'      ],
				':title'    => $_POST['object']['title'   ],
				':img'      => $_POST['object']['img'     ],
				':url'      => $_POST['object']['url'     ],
				':showtext' => $_POST['object']['showtext']
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Drop --------------------------------------------------------------------
		case "delete_social":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["delete_social"]);
			$stmt->execute(array(
				':id' => $_POST['object']['id']
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Reorder -----------------------------------------------------------------
		case "reorder_social":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["reorder_social"]);
			foreach($_POST['object'] as $order => $id)
			{
				$stmt->execute(array(':id' => $id, ':order' => $order));
				$result['sql'][] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			}
			break;
		}
		// ============================ C i t a t i o n ============================
		// Insert ------------------------------------------------------------------
		case "insert_citation":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["insert_citation"]);
			$stmt->execute(array(
				':articleID'   => $_POST['object']['articleID'  ],
				':referenceID' => $_POST['object']['referenceID']
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$result['id']  = $sqlsocket->lastInsertId();
			break;
		}
		// Drop --------------------------------------------------------------------
		case "delete_citation":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["delete_citation"]);
			$stmt->execute(array(
				':id' => $_POST['object']['id']
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Reorder -----------------------------------------------------------------
		case "reorder_citation":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["reorder_citation"]);
			foreach($_POST['object'] as $order => $id)
			{
				$stmt->execute(array(':id' => $id, ':order' => $order));
				$result['sql'][] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			}
			break;
		}


	}


echo json_encode($result);

?>