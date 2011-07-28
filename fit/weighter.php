<?php

$totalweights = array(  "Slim Straight" => 0,  "Slim Straight Grey" => 0,  "Skinny" => 0,  "Skinny black" => 0,  "Super-low skinny" => 0,  "Skinny crop" => 0,  "Skinny crop colored" => 0,  "Straight" => 0,  "Relaxed" => 0,  "High-waisted trouser cut" => 0,  "Boyfriend cut" => 0,  "Boyfriend cut Chinos" => 0,  "Boot cut" => 0,  "Low riding Boot Cut" => 0,  "Flare" => 0,  "High waisted flare" => 0);
$localweights = $totalweights;$oldlocals = array();

$prf = 'xx';$tw = 0;
foreach ($listofinputs as $current){
	//echo $current,"\n\n<br><br>";
	if(strcmp(substr($current,0,2),$prf)){
		if($tw>0){
		foreach($localweights as $ind => $wei){
			$localweights[$ind]=$wei/$tw;
			$totalweights[$ind]= $totalweights[$ind]+$localweights[$ind];
			//echo $localweights[$ind];}
		$oldlocals = $oldlocals+array($prf => $localweights);
		
		$tw=1;
		$localweights=$lookup[$current];}
		
	};
	$prf=substr($current,0,2);
	//echo $prf,"\n\n<br><br>";
	$tw = $tw+1;
	foreach($lookup[$current] as $ind => $wei){
		$localweights[$ind]=$localweights[$ind]+$wei;
		}
}
}
if($tw>0){
	foreach($localweights as $ind => $wei){
		$localweights[$ind]=$wei/$tw;
		$totalweights[$ind]=$totalweights[$ind]+$localweights[$ind];
		//echo $totalweights[$ind]; echo " ";}
		}
		$oldlocals = $oldlocals+array($prf => $localweights);
	}

	$sortedweights = $totalweights;
	arsort($sortedweights);
/*
foreach($sortedweights as $a => $b)
	echo $a," => ",$b,"<br><br>";
*/

?>
