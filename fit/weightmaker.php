<?php

// Step one: Load the variables needed.
include "lookup.php";

parse_str($_SERVER['QUERY_STRING']);

// Step two: Run the code to make the weights.
include "weighter.php";

// Step three: Make the google charts chart
include "charter.php";

//step four: check boxes for new testing.
echo "\n<form>";

foreach($rownames as $namee){
echo '<div style="float:left;clear:none;width:200px"><input type="checkbox" name="';
echo "listofinputs[]";
echo '" value="';
echo $namee;
echo '"';

if(in_array($namee,$listofinputs))
{
echo " checked ";
}
echo ' /> '; 
echo $namee;
echo "</div>\n";
}

echo "\n";
echo '<div style="clear:both"><br><br></div><input type="submit" value="Test" /><br><br></form>';

echo "\n";

?>
