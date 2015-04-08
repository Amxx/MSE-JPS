<?php

include_once '../config/config.php';
include_once '../ressources/MSE/connection.php';


/******************************************************************************
 *                          S Q L   R e q u e s t s                            *
 ******************************************************************************/
// -----------------------------------------------------------------------------
$QUERY_STR['select_all_pages'						] = "SELECT * FROM `{$GLOBALS['prefix']}pages";
$QUERY_STR['insert_page'								] = "INSERT   INTO `{$GLOBALS['prefix']}pages` (`Page_Title`, `Page_Style`, `Page_Bordered`, `Page_Expandable`) VALUES (:title, :style, :bordered, :expandable)";
$QUERY_STR['update_page'								] = "UPDATE        `{$GLOBALS['prefix']}pages` SET `Page_Title` = :title, `Page_Style` = :style, `Page_Bordered` = :bordered, `Page_Expandable` = :expandable WHERE `Page_ID` = :id";
$QUERY_STR['drop_page'									] = "DELETE   FROM `{$GLOBALS['prefix']}pages` WHERE `Page_ID` = :id";
$QUERY_STR['reorder_page'								] = "UPDATE        `{$GLOBALS['prefix']}pages` SET `Page_Order` = :order WHERE `Page_ID` = :id";
// -----------------------------------------------------------------------------
$QUERY_STR['select_all_articles'				] = "SELECT * FROM `{$GLOBALS['prefix']}articles";
$QUERY_STR['insert_article'							] = "INSERT   INTO `{$GLOBALS['prefix']}articles` (`Page_ID`, `Article_Title`, `Article_Text`, `Article_Javascript`, `Article_Archived`) VALUES (:pid, :title, :text, :javascript, :archived)";
$QUERY_STR['update_article'							] = "UPDATE        `{$GLOBALS['prefix']}articles` SET `Page_ID` = :pid, `Article_Title` = :title, `Article_Text` = :text, `Article_Javascript` = :javascript, `Article_Archived` = :archived WHERE `Article_ID` = :id";
$QUERY_STR['drop_article'								] = "DELETE   FROM `{$GLOBALS['prefix']}articles` WHERE `Article_ID` = :id";
$QUERY_STR['reorder_article'						] = "UPDATE        `{$GLOBALS['prefix']}articles` SET `Article_Order` = :order WHERE `Article_ID` = :id";
// -----------------------------------------------------------------------------
$QUERY_STR['select_all_references'			] = "SELECT * FROM `{$GLOBALS['prefix']}references`";
$QUERY_STR['insert_reference'						] = "INSERT   INTO `{$GLOBALS['prefix']}references` (`Reference_Title`, `Reference_Authors`, `Reference_Ref`, `Reference_Abstract`, `Reference_Bibtex`) VALUES (:title, :authors, :ref, :abstract, :bibtex)";
$QUERY_STR['update_reference'						] = "UPDATE        `{$GLOBALS['prefix']}references` SET `Reference_Title` = :title, `Reference_Authors` = :authors, `Reference_Ref` = :ref, `Reference_Abstract` = :abstract, `Reference_Bibtex` = :bibtex WHERE `Reference_ID` = :id";
$QUERY_STR['drop_reference'							] = "DELETE   FROM `{$GLOBALS['prefix']}references` WHERE `Reference_ID` = :id";
// -----------------------------------------------------------------------------
$QUERY_STR['select_all_links'						] = "SELECT * FROM `{$GLOBALS['prefix']}links`";
$QUERY_STR['insert_link'								] = "INSERT   INTO `{$GLOBALS['prefix']}links` (`Link_Title`, `Link_Content`) VALUES (:title, :content)";
$QUERY_STR['update_link'								] = "UPDATE        `{$GLOBALS['prefix']}links` SET `Link_Title` = :title, `Link_Content` = :content WHERE `Link_ID` = :id";
$QUERY_STR['drop_link'									] = "DELETE   FROM `{$GLOBALS['prefix']}links` WHERE `Link_ID` = :id";
$QUERY_STR['reorder_link'								] = "UPDATE        `{$GLOBALS['prefix']}links` SET `Link_Order` = :order WHERE `Link_ID` = :id";
// -----------------------------------------------------------------------------
$QUERY_STR['select_all_socials'					] = "SELECT * FROM `{$GLOBALS['prefix']}socials`";
$QUERY_STR['insert_social'							] = "INSERT   INTO `{$GLOBALS['prefix']}socials` (`Social_Title`, `Social_Img`, `Social_Url`) VALUES (:title, :img, :url)";
$QUERY_STR['update_social'							] = "UPDATE        `{$GLOBALS['prefix']}socials` SET `Social_Title` = :title, `Social_Img` = :img, `Social_Url` = :url WHERE `Social_ID` = :id";
$QUERY_STR['drop_social'								] = "DELETE   FROM `{$GLOBALS['prefix']}socials` WHERE `Social_ID` = :id";
$QUERY_STR['reorder_social'							] = "UPDATE        `{$GLOBALS['prefix']}socials` SET `Social_Order` = :order WHERE `Social_ID` = :id";


// -----------------------------------------------------------------------------
$QUERY_STR['select_all_citations'				] = "SELECT * FROM `{$GLOBALS['prefix']}citations`";
$QUERY_STR['select_all_referencesources'] = "SELECT * FROM `{$GLOBALS['prefix']}referencesources`";
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
		case "get_all":
		{
			$result['pages'							] = $sqlsocket->query($QUERY_STR['select_all_pages'						])->fetchAll(PDO::FETCH_ASSOC);
			$result['articles'					] = $sqlsocket->query($QUERY_STR['select_all_articles'				])->fetchAll(PDO::FETCH_ASSOC);
			$result['references'				] = $sqlsocket->query($QUERY_STR['select_all_references'			])->fetchAll(PDO::FETCH_ASSOC);
			$result['citations'					] = $sqlsocket->query($QUERY_STR['select_all_citations'				])->fetchAll(PDO::FETCH_ASSOC);
			$result['links'							] = $sqlsocket->query($QUERY_STR['select_all_links'						])->fetchAll(PDO::FETCH_ASSOC);
			$result['referencesources'	] = $sqlsocket->query($QUERY_STR['select_all_referencesources'])->fetchAll(PDO::FETCH_ASSOC);
			$result['socials'						] = $sqlsocket->query($QUERY_STR['select_all_socials'					])->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// ================================ P a g e ================================
		// Insert ------------------------------------------------------------------
		case "insert_page":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["insert_page"]);
			$stmt->execute(array(
				':title'			=> $_POST['object']['title'			],
				':style'			=> $_POST['object']['style'			],
				':bordered'		=> $_POST['object']['bordered'	] === 'true',
				':expandable'	=> $_POST['object']['expandable'] === 'true'
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
				':id'					=> $_POST['object']['id'				],
				':title'			=> $_POST['object']['title'			],
				':style'			=> $_POST['object']['style'			],
				':bordered'		=> $_POST['object']['bordered'	] === 'true',
				':expandable'	=> $_POST['object']['expandable'] === 'true'
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Drop --------------------------------------------------------------------
		case "drop_page":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["drop_page"]);
			$stmt->execute(array(
				':id'					=> $_POST['object']['id'				]
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Reorder -----------------------------------------------------------------
		case "reorder_page":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["reorder_page"]);
			foreach($_POST['array'] as $order => $id)
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
				':pid'				=> $_POST['object']['pageID'		],
				':title'			=> $_POST['object']['title'			],
				':text'				=> $_POST['object']['text'			],
				':javascript'	=> $_POST['object']['javascript'],
				':archived'		=> $_POST['object']['archived'	] === 'true'
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$result['id']  = $sqlsocket->lastInsertId();
			break;
		}
		// Update ------------------------------------------------------------------
		case "update_article":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["update_article"]);
			$stmt->execute(array(
				':id'					=> $_POST['object']['id'				],
				':pid'				=> $_POST['object']['pageID'		],
				':title'			=> $_POST['object']['title'			],
				':text'				=> $_POST['object']['text'			],
				':javascript'	=> $_POST['object']['javascript'],
				':archived'		=> $_POST['object']['archived'	] === 'true'
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Drop --------------------------------------------------------------------
		case "drop_article":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["drop_article"]);
			$stmt->execute(array(
				':id'					=> $_POST['object']['id'				]
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Reorder -----------------------------------------------------------------
		case "reorder_article":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["reorder_article"]);
			foreach($_POST['array'] as $order => $id)
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
				':title'			=> $_POST['object']['title'			],
				':authors'		=> $_POST['object']['authors'		],
				':ref'				=> $_POST['object']['reference'	],
				':abstract'		=> $_POST['object']['abstract'	],
				':bibtex'			=> $_POST['object']['bibtex'		]
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
				':id'					=> $_POST['object']['id'				],
				':title'			=> $_POST['object']['title'			],
				':authors'		=> $_POST['object']['authors'		],
				':ref'				=> $_POST['object']['reference'	],
				':abstract'		=> $_POST['object']['abstract'	],
				':bibtex'			=> $_POST['object']['bibtex'		]
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Drop --------------------------------------------------------------------
		case "drop_reference":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["drop_reference"]);
			$stmt->execute(array(
				':id'					=> $_POST['object']['id'				]
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
				':title'			=> $_POST['object']['title'			],
				':content'		=> $_POST['object']['content'		]
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
				':id'					=> $_POST['object']['id'				],
				':title'			=> $_POST['object']['title'			],
				':content'		=> $_POST['object']['content'		]
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Drop --------------------------------------------------------------------
		case "drop_link":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["drop_link"]);
			$stmt->execute(array(
				':id'					=> $_POST['object']['id'				]
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Reorder -----------------------------------------------------------------
		case "reorder_link":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["reorder_link"]);
			foreach($_POST['array'] as $order => $id)
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
				':title'			=> $_POST['object']['title'			],
				':img'				=> $_POST['object']['img'				],
				':url'				=> $_POST['object']['url'				]
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
				':id'					=> $_POST['object']['id'				],
				':title'			=> $_POST['object']['title'			],
				':img'				=> $_POST['object']['img'				],
				':url'				=> $_POST['object']['url'				]
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Drop --------------------------------------------------------------------
		case "drop_social":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["drop_social"]);
			$stmt->execute(array(
				':id'					=> $_POST['object']['id'				]
			));
			$result['sql'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			break;
		}
		// Reorder -----------------------------------------------------------------
		case "reorder_social":
		{
			$stmt = $sqlsocket->prepare($QUERY_STR["reorder_social"]);
			foreach($_POST['array'] as $order => $id)
			{
				$stmt->execute(array(':id' => $id, ':order' => $order));
				$result['sql'][] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			}
			break;
		}


	}


echo json_encode($result);

?>