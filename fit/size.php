<?php

include "sizehead.htm";

if(isset($_SERVER['QUERY_STRING']))
  parse_str($_SERVER['QUERY_STRING']);
// Step one: Load the variables needed.
include "lookup.php";
include "sizevars.php";
include "fitvars.php";


//default values...
if(empty($m_waist)) $m_waist = 31;
if(empty($m_hh)) $m_hh = 31.4;
if(empty($m_hips)) $m_hips = 33;
if(empty($m_thigh)) $m_thigh = 12;
if(empty($m_calf)) $m_calf = 8;
if(empty($m_crotch)) $m_crotch = 10;
if(empty($m_inseam)) $m_inseam = 28;
if(empty($m_outseam)) $m_outseam = 33;
if(empty($style)) $style = $colnames[1];

include "sizediffs.php";
include "sizecharter.php";



echo "<form><select name='style'>";

foreach ($colnames as $namee){
echo "<option value='",$namee,"'";
if(strcmp($namee,$style)==0) echo 'selected="selected"';
echo ">",$namee,"</option>\n";
}
echo "\n</select><table>";
echo "\n<tr><td>waist: 	 <td><input type='text' size='25' name='m_waist', value=",$m_waist,">";
echo "\n<tr><td>high hips: <td><input type='text' size='25' name='m_hh', value=",$m_hh,">";
echo "\n<tr><td>hips: 	 <td><input type='text' size='25' name='m_hips', value=",$m_hips,">";
echo "\n<tr><td>thigh: 	 <td><input type='text' size='25' name='m_thigh', value=",$m_thigh,">";
echo "\n<tr><td>calf: 	 <td><input type='text' size='25' name='m_calf', value=",$m_calf,">";
echo "\n<tr><td>crotch: 	 <td><input type='text' size='25' name='m_crotch', value=",$m_crotch,">";
echo "\n<tr><td>inseam: 	 <td><input type='text' size='25' name='m_inseam', value=",$m_inseam,">";
echo "\n<tr><td>outseam: 	 <td><input type='text' size='25' name='m_outseam', value=",$m_outseam,">";

echo "\n\n</table><br><input type='submit' value='Test' /></form>\n\n";


include "sizebutt.htm";

?>
