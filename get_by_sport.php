<?php
header('Content-type: text/javascript');

function randColor(){
	$r = dechex(mt_rand(100,200)); // generate the red component
	$g = dechex(mt_rand(100,200)); // generate the green component
	$b = dechex(mt_rand(100,200)); // generate the blue component
	$rgb = $r.$g.$b;
	if($r == $g && $g == $b){
		$rgb = substr($rgb,0,3); // shorter version
	}
	return '#'.$rgb;
}

function randGrey(){
	//base colour is #A39480
	$r = dechex(mt_rand(153,163)); // generate the red  components
	$g = dechex(mt_rand(138,158)); // generate the green components	
	$b = dechex(mt_rand(118,138)); // generate the blue component
	$rgb = $r.$g.$b;
	return '#'.$rgb;
}

function find_color($country, $cd){

	foreach ($cd as $data) {
		if ($data['name'] == $country) return $data['colour'];
	}
	
}
 
if (empty($_GET['sheet'])) {$gid = 0;} else {$gid = $_GET['sheet'];}
 
// Set your CSV feed
$feed = 'https://docs.google.com/spreadsheet/pub?key=0Aqqh1cRUSxC-dGlqV1RYeUkyUmFYalpDZHVPV2VHZmc&single=true&gid=' . $gid . '&output=csv';
$feed_country_data = 'https://docs.google.com/spreadsheet/pub?key=0Aqqh1cRUSxC-dGlqV1RYeUkyUmFYalpDZHVPV2VHZmc&single=true&gid=3&output=csv';

// Arrays we'll use later
$keys = array();
$newArray = array();

$keys_cd = array();
$cd_array = array();
 
// Function to convert CSV into associative array
function csvToArray($file, $delimiter) { 
  if (($handle = fopen($file, 'r')) !== FALSE) { 
    $i = 0; 
    while (($lineArray = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) { 
      for ($j = 0; $j < count($lineArray); $j++) { 
        $arr[$i][$j] = $lineArray[$j]; 
      } 
      $i++; 
    } 
    fclose($handle); 
  } 
  return $arr; 
} 
 
// Do it
$data = csvToArray($feed, ',');
$data_cd = csvToArray($feed_country_data, ',');
 
// Set number of elements (minus 1 because we shift off the first row)
$count = count($data) - 1;
$count_cd = count($data_cd) - 1;
 
//Use first row for names  
$labels = array_shift($data);  
$labels_cd = array_shift($data_cd);  
 
foreach ($labels as $label) {
  $keys[] = $label;
}

foreach ($labels_cd as $label) {
  $keys_cd[] = $label;
}
 
// Add Ids, just in case we want them later
$keys[] = 'id';
$keys_cd[] = 'id';
 
for ($i = 0; $i < $count; $i++) {
  $data[$i][] = $i;
}

for ($i = 0; $i < $count_cd; $i++) {
  $data_cd[$i][] = $i;
}
 
// Bring it all together
for ($j = 0; $j < $count; $j++) {
  $d = @array_combine($keys, $data[$j]);
  $newArray[$j] = $d;
}

for ($j = 0; $j < $count_cd; $j++) {
  $d = @array_combine($keys_cd, $data_cd[$j]);
  $cd_array[$j] = $d;
}

$final = array(
	"children" => array(),
	"name" => "The Economist Medal Map - London 2012",
	"id" => "root",
	"data" => array(
		'$color' => '#ccc',
		'$area' => 0	
	)	
);
foreach ($newArray as $event){
	if ($event['Medal'] == 'Bronze') {
		$size = 5;
	} else if ($event['Medal'] == 'Silver') {
		$size = 10;
	} else if ($event['Medal'] == 'Gold') {
		$size = 15;
		if (isset($event['Country']) && isset($event['Name'])) {
			if ($event['Country'] == 'null') {
				$country = '(To be decided on ' . $event['Date'] . ')';	
			} else {
				$country = $event['Country'];
			}
			$recipients = $event['Name'];
		}
	}
	$final['data']['$area'] += $size;
	$event['Country'] = trim($event['Country']);
	$event['Discipline'] = trim($event['Discipline']);
	$event['Event'] = trim($event['Event']);		
	$event['Medal'] = trim($event['Medal']);
		
	
	if ($event['Medal'] == 'Gold') {
		if ($event['Name'] == 'null') 
			$colour = '#9e7e00';
		else 
			$colour = '#ffcc00';
	} elseif ($event['Medal'] == 'Silver') {
		if ($event['Name'] == 'null') 
			$colour = '#6b6b6b';	
		else 
			$colour = '#cccccc';
	} elseif ($event['Medal'] == 'Bronze') {
		if ($event['Name'] == 'null') 
			$colour = '#33281e';	
		else 
			$colour = '#8C7853';
	}
	
	if ($event['Name'] == 'null') {
		$event['Name'] = '(To be awarded on ' . $event['Date'] . ')';
		$pcolor = randGrey();
		$mcolor = $colour;
	} else {
		$pcolor = find_color($event['Country'], $cd_array);
		$mcolor = $pcolor;
	}	
	
/*	if (!isset($final['children'][$event['Country']]['name'])) {
		$final['children'][$event['Country']] = array(
			"name" => $event['Country'],
			"id" => strtolower($event['Country']),
			"data" => array(
				'$area' => 0,
				'$color' => randColor()
			)
		);
	}
	
	$final['children'][$event['Country']]['data']['$area'] += 10;*/
	
	if (!isset($final['children'][$event['Discipline']])) {
		$final['children'][$event['Discipline']] = array(
			"name" => $event['Discipline'],
			"id" => preg_replace('#(\'|\s)#', '', strtolower($event['Country'] . '_' . $event['Discipline'])),
			"data" => array(
				'$area' => 0,
				'$color' => '#ccc'
			),
			"children" => array()
			);
	}
		$final['children'][$event['Discipline']]['data']['$area'] += $size;	
	
	if (!isset($final['children'][$event['Discipline']]['children'][$event['Event']])) {
			$final['children'][$event['Discipline']]['children'][$event['Event']] = array(
					"name" => ucwords($event['Event']),
					"id" => preg_replace('#(\'|\s)#', '', strtolower($event['Country'] . '_' . $event['Discipline'] . '_' . $event['Event'])),
					"data" => array(
						'$area' => 0,
						'$color' => $pcolor,						
					),
					"children" => array()
				);
				if (isset($country) && isset($recipients)){
					$final['children'][$event['Discipline']]['children'][$event['Event']]['data']['country'] = $country;
					$final['children'][$event['Discipline']]['children'][$event['Event']]['data']['recipients'] = $recipients;					
				}
	}
	
	$final['children'][$event['Discipline']]['children'][$event['Event']]['data']['$area'] += $size;
	
	$final['children'][$event['Discipline']]['children'][$event['Event']]['children'][] = array(
			'children' => array(),	
			"name" => $event['Medal'],
			"id" => $event['id'],
			"data" => array(
				'$area' => $size,
				'$color' => $mcolor,//$colour,
				'recipients' => $event['Name'],
				'country' => $event['Country']				
			),		
		);

}// foreach


$final['children'] = array_values($final['children']);

foreach ($final['children'] as $key => $country) {
	$final['children'][$key]['children'] = array_values($country['children']);		
}

for ($i = 0; $i < count($final['children']); $i++) {
	for ($j = 0; $j < count($final['children'][$i]['children']); $j++) {
		$final['children'][$i]['children'][$j]['children'] = array_values($final['children'][$i]['children'][$j]['children']);
	}
}




//print_r($final);
 
// Print it out as JSON
// Print it out as JSON
if ($_GET['callback']) {
	header('Content-type: text/javascript');
	echo $_GET['callback']. '(' . json_encode($final) . ');';
} else {
	header('Content-type: application/json');
	echo json_encode($final);
}

 
?>
