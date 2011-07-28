<?php


// Step one: Load the variables needed.
include "fit/lookup.php";



global $user;
$result = db_query("SELECT * from node n where n.uid = $user->uid AND n.type = 'fit_survey' AND status = 1 ORDER BY nid desc limit 1");
$record = $result->fetchAssoc();

$nid = $record['nid'];

$last_survey = node_load($nid);

$survey = array();


if (1==1 || $user->uid == 1) {


$fields = field_info_instances('node', 'fit_survey');

$listofinputs = array();


foreach ($fields AS $field => $field_def) {

	$info = field_info_field($field);
	$values = array();

	if (array_key_exists('settings', $info) && array_key_exists('allowed_values', $info['settings']))
		$values = $info['settings']['allowed_values'];

	$field_val = field_get_items('node', $last_survey, $field);
	$field_val = $field_val[0]['value'];


	if ($field_val !== null) {
global $user;

		$value_text = "";
		if (array_key_exists($field_val, $values)) {

			$survey[$field]['key'] = $field_val;

			$value_text = $values[$field_val];
			$value_text = preg_replace('/[^_]*_/', '', $value_text, 1);
			$survey[$field]['label'] = $value_text;
		}
	}

}


foreach ($survey AS $field => $data) {
	if (strpos($data['label'], '_') !== false)
		array_push($listofinputs, $data['label']);
}


// Step two: Run the code to make the weights.
include "fit/weighter.php";

if ($_GET['q'] == "node/89") {
include "fit/charter.php";
}

$newID = array(

1 	=> 1,		// slim straight
2 	=> 13,	// slim straight grey
3 	=> 14,
4 	=> 15,
5 	=> 16,
6 	=> 17,
7 	=> 18,
8 	=> 19,
9 	=> 20,
10	=> 21,
11	=> 22,
12	=> 23,
13	=> 25,
14	=> 26,
15	=> 27,
16	=> 28,

);

$final_id_order = array();

foreach ($sortedweights AS $name => $weight) {
	$old_key = array_search($name, $colnames); 
	$new_key = $newID[$old_key];
	array_push($final_id_order, $new_key);
}

$_SESSION['product_order'] = $final_id_order;



}
