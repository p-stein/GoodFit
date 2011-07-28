<?php

$di = array(false=>"tight",true=>"loose");
$li = array(false=>"above",true=>"below");
$us = .2;

// simple version for demo: If petites exist, recommend them for inseams shorter than 29 inches. 
$pets = -1;
if(array_key_exists("petites_0",$sizes[$style])) if($m_inseam<=29) $pets = 0;

//For whatever reason I cannot get waistmix to work. Frustrating as fuck.
$m_wb = $m_waist;//$m_waist*$idealfit[$style]["waistmix"][0] + $m_hips*$idealfit[$style]["waistmix"][1];
$m_knee = $m_calf;



foreach($fitweights as $bod =>$w)
{
  foreach($idealfit[$style][$bod."_fitbounds"] as $aa => $bb)
    $t_{$bod}[$aa]=($us*($bb-1)+1)*${"m_".$othername[$bod]};
  foreach($t_{$bod} as $aa => $bb)
    $td_{$bod}[$aa]=$bb-$t_{$bod}["ideal"];
  foreach($sizes[$style] as $siznam => $siz)
  {
    if((strncmp($siznam,"pet",3))==$pets)
    {
        ${"d_".$bod}[$siznam] = ($siz[$othername[$bod]]-$t_{$bod}["ideal"]);

} } }

$allscores = array();
$grouper = array();
foreach($fitweights as $bod =>$w)
{
  $grouper[$bod] = array();
  $score_{$bod} = array_merge(${"d_".$bod},$td_{$bod});
  asort($score_{$bod}); 
  //echo "<br>",$bod," ",$w," ","d_".$bod," ",nl2br(print_r($score))," ","<br>";
  $ingroup = 0;
  $groupscore = $fitscore[$idealfit[$style][$bod."_fitlabels"][$ingroup]]*$w;
  foreach($score_{$bod} as $a => $b)
  {
    if(is_int($a))
    {
      $ingroup = $a+1;
      $groupscore = $fitscore[$idealfit[$style][$bod."_fitlabels"][$ingroup]]*$w;
    }
    else	
    {
      if(strcmp($a,"ideal")) //obvious hack because php's comparisons are annoying and I'm half asleep at the moment.
      {
        //echo "<br>",$a," ",$bod," ",$m_wb," ",$sizes[$style][$a][$bod]," ",$b," : ",$fitdesc[$idealfit[$style][$bod."_fitlabels"][$ingroup]];
        $allscores[$a] = $allscores[$a] + $groupscore;
        $allscores[$a] = $allscores[$a] + ${"a_".$bod}[$a]*$w;
        $grouper[$bod][$a] = $ingroup;
} } } }


$score = $allscores;

asort($score);
$rsizes = array_keys($score);
//echo nl2br(print_r($rsizes,true)),"<br><br>\n\n";


?>
