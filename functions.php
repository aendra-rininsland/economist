<?php
/**
 * Various functions called by fetch_sinoindex_json.php
 */


/**
 * Converts CSV into associative array.
 * @param string $file
 *   A CSV file path.
 *
 * @param string $delimiter
 *   A whatever delimiter denotes fields.
 *
 * @return array
 *   An array of CSV data.
 */

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


/**
 * Translates one a string to a text label.
 *
 * @param string $cat
 *   A kitty cat, meow meow!
 *
 * @return string
 *   A text label.
 */

function translateCat ($cat) {
  switch($cat){
    case "cat_basic_materials":
      return 'Basic Materials';
      break;
    case "cat_communications":
      return 'Communications';
      break;
    case "cat_consumer_cyclical":
      return 'Consumer, Cyclical';
      break;
    case "cat_consumer_noncyclical":
      return 'Consumer, Non-Cyclical';
      break;
    case "cat_energy":
      return 'Energy';
      break;
    case "cat_financial":
      return 'Financial';
      break;
    case "cat_industrial":
      return 'Industrial';
      break;
    case "cat_technology":
      return 'Technology';
      break;
    case "cat_utilities":
      return 'Utilities';
      break;

  }
}

/**
 * Chooses a color based on cat for an industry.
 *
 * @param $industry
 *   Text label from translateCat().
 *
 * @return string
 *   Hex color code.
 */

function chooseColor($industry){
  switch($industry){
    case "Basic Materials":
      $ir = 143;
      $ig = 188;
      $ib = 143;
      break;
    case "Communications":
      $ir = 233;
      $ig = 150;
      $ib = 122;
      break;
    case "Consumer, Cyclical": //steelblue
      $ir = 70;
      $ig = 130;
      $ib = 180;
      break;
    case "Consumer, Non-Cyclical": //skyblue
      $ir = 135;
      $ig = 206;
      $ib = 235;
      break;
    case "Energy": //seagreen
      $ir = 46;
      $ig = 139;
      $ib = 87;
      break;
    case "Financial":
      $ir = 222;
      $ig = 184;
      $ib = 135;
      break;
    case "Industrial":
      $ir = 240;
      $ig = 128;
      $ib = 128;
      break;
    case "Technology":
      $ir = 189;
      $ig = 183;
      $ib = 107;
      break;
    case "Utilities":
      $ir = 0;
      $ig = 139;
      $ib = 139;
      break;

  }
  $r = str_pad(dechex(mt_rand(($ir >= 10 ? $ir-10 : $ir),($ir <= 245 ? $ir + 10 : $ir))), 2, 0, STR_PAD_LEFT); // generate the red component
  $g = str_pad(dechex(mt_rand(($ig >= 10 ? $ig-10 : $ig),($ig <= 245 ? $ig + 10 : $ig))), 2, 0, STR_PAD_LEFT); // generate the green component
  $b = str_pad(dechex(mt_rand(($ib >= 10 ? $ib-10 : $ib),($ib <= 245 ? $ib + 10 : $ib))), 2, 0, STR_PAD_LEFT); // generate the blue component
  $rgb = $r.$g.$b;
  /*if($r == $g && $g == $b){
    $rgb = substr($rgb,0,3); // shorter version
  }*/
  return '#'.$rgb;
}

/**
 * Picks a random grey color.
 *
 * @return string
 *   A random grey hex color value.
 */

function randGrey(){
  //base colour is #A39480
  $r = dechex(mt_rand(153,163)); // generate the red  components
  $g = dechex(mt_rand(138,158)); // generate the green components
  $b = dechex(mt_rand(118,138)); // generate the blue component
  $rgb = $r.$g.$b;
  return '#'.$rgb;
}

