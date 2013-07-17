<?php
header('Content-type: text/javascript');
require('functions.php');

// Set your CSV feed
$feed = 'https://docs.google.com/spreadsheet/pub?key=0Aqqh1cRUSxC-dGlSTzR2TUlKTzV1UDZhdElhU1pHcXc&single=true&gid=0&output=csv';

// Arrays we'll use later
$keys = array();
$newArray = array();

// Do it
$data = csvToArray($feed, ',');

// Set number of elements (minus 1 because we shift off the first row)
$count = count($data) - 1;

//Use first row for names
$labels = array_shift($data);

foreach ($labels as $label) {
  $keys[] = $label;
}

// Add Ids, just in case we want them later
$keys[] = 'id';

for ($i = 0; $i < $count; $i++) {
  $data[$i][] = $i;
}


// Bring it all together
for ($j = 0; $j < $count; $j++) {
  $d = @array_combine($keys, $data[$j]);
  $newArray[$j] = $d;
}


$final = array(
	"children" => array(),
	"name" => "<em>The Economist</em> Sinodependency Index",
	"id" => "root",
	"data" => array(
		'$color' => '#ccc',
		'$area' => 0
	)
);
foreach ($newArray as $company){

	switch($_GET['year']){
    case 2013:
      $year = 'Weight2012_2013';
      break;
		case 2012:
			$year = 'Weight2011_2012';
			break;
		case 2010:
			$year = 'Weight2010';
			break;
		case 2009:
			$year = 'Weight2009';
			break;
	}

	if (isset($_GET['cat'])) { //this starts a big conditional that selects the version to show. Starts w/ category.
		if ($company['Industry'] == translateCat($_GET['cat'])) {
			$final['data']['$area'] += trim($company[$year]);
			$company['Company'] = trim($company['Company']);

			if ($company['Company'] == 'null' || $company[$year] == 0){
				unset($company);
			} else {
				if (!isset($final['children'][$company['Company']]['name'])) {
					$final['children'][$company['Company']] = array(
						"name" => trim($company['Company']),
						"id" => strtolower($company['Company']),
						"data" => array(
							'$area' => trim($company[$year]),
							'$color' => chooseColor($company['Industry']),
							'Weight2011_2012' => round($company['Weight2011_2012'], 2),
							'Weight2010' => round($company['Weight2010'], 2),
							'Weight2009' => round($company['Weight2009'], 2),
							'year' => $_GET['year'],
							'industry' => trim($company['Industry'])
						)
					);
				}

			}
		}
	} elseif ($_GET['group_by_sector'] == TRUE) { //code for grouping by sector...
		$final['data']['$area'] += trim($company[$year]);
		$company['Company'] = trim($company['Company']);

		if (!isset($final['children'][$company['Industry']]['name'])) {
			$final['children'][$company['Industry']] = array(
				'name' => $company['Industry'],
				'id' => strtolower($company['Industry']),
				'data' => array(
					'$area' => 0,
					'$color' => '#cccccc'
				),
				'children' => array()
			);
		}

		$final['children'][$company['Industry']]['data']['$area'] += $company[$year];

		if ($company['Company'] == 'null' || $company[$year] == 0){
			unset($company);
		} else {
			if (!isset($final['children'][$company['Industry']]['children'][$company['Company']]['name'])) {
				$final['children'][$company['Industry']]['children'][$company['Company']] = array(
					"name" => trim($company['Company']),
					"id" => strtolower($company['Company']),
					"data" => array(
						'$area' => trim($company[$year]),
						'$color' => chooseColor($company['Industry']),
						'Weight2012_2013' => round($company['Weight2012_2013'], 2),
						'Weight2011_2012' => round($company['Weight2011_2012'], 2),
						'Weight2010' => round($company['Weight2010'], 2),
						'Weight2009' => round($company['Weight2009'], 2),
						'year' => $_GET['year'],
						'industry' => trim($company['Industry'])
					)
				);
			}

		}
	} else { //code for default case (unselected sector grouping, no category)
		$final['data']['$area'] += trim($company[$year]);
		$company['Company'] = trim($company['Company']);

		if ($company['Company'] == 'null' || $company[$year] == 0){
			unset($company);
		} else {
			if (!isset($final['children'][$company['Company']]['name'])) {
				$final['children'][$company['Company']] = array(
					"name" => trim($company['Company']),
					"id" => strtolower($company['Company']),
					"data" => array(
						'$area' => trim($company[$year]),
						'$color' => chooseColor($company['Industry']),
						'Weight2011_2012' => round($company['Weight2011_2012'], 2),
						'Weight2010' => round($company['Weight2010'], 2),
						'Weight2009' => round($company['Weight2009'], 2),
						'year' => $_GET['year'],
						'industry' => trim($company['Industry'])
					)
				);
			}

		}
	} //end the big conditional that picks which version to show.
}// foreach


$final['children'] = array_values($final['children']);

if ($_GET['group_by_sector'] == TRUE) {
	foreach ($final['children'] as $key => $company) {
		$final['children'][$key]['children'] = array_values($company['children']);
	}
}

/*for ($i = 0; $i < count($final['children']); $i++) {
	for ($j = 0; $j < count($final['children'][$i]['children']); $j++) {
		$final['children'][$i]['children'][$j]['children'] = array_values($final['children'][$i]['children'][$j]['children']);
	}
}*/




//print_r($final);

// Print it out as JSON
if ($_GET['callback']) {
	header('Content-type: text/javascript');
	echo $_GET['callback']. '(' . json_encode($final) . ');';
} else {
	header('Content-type: application/json');
	echo json_encode($final);
}

?>
