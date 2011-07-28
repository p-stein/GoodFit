

  <head>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">
      google.load("visualization", "1", {packages:["corechart"]});
      google.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = new google.visualization.DataTable();

        data.addColumn("string", "jeanstype");
<?php

	foreach($oldlocals as $a => $b)
 		echo 'data.addColumn("number", "',$a,'");',"\n";
        echo "data.addRows(", count($colnames),");\n";

	//foreach($colnames as $inn => $namm) //legacy version.
	$inn = 1;
	foreach($sortedweights as $namm => $totalweight)
	{
        	echo "data.setValue(";
		echo $inn-1; //legacy...
		echo ",0, '",$namm,"')\n";
		$iii = 1;
		foreach($oldlocals as $a => $b)
		{
       			echo "data.setValue(",$inn-1,",",$iii,",",$b[$namm],")\n";
			$iii++;
		}
		$inn++;
	}
?>
        var chart = new google.visualization.ColumnChart(document.getElementById("chart_div"));
        chart.draw(data, {width: "90%", height: 500, title: "Recommendations and score breakdown",isStacked:1,
                          hAxis: {slantedText:0, slantedTextAngle:90,maxalternation:5,textStyle: {fontSize:10,},title: "Jean Styles"},
			  vAxis: {textPosition:"none",title: "Scores"}
                         });
      }
    </script>
  </head>

  <body>
    <div id="chart_div"></div>
  </body>
