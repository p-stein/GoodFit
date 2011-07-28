<link rel="stylesheet" href="/modal/styles/nyroModal.css" type="text/css" media="screen" />
<script type="text/javascript" src="/modal/js/jquery.nyroModal.custom.js"></script>
<!--[if IE 6]>
	<script type="text/javascript" src="/modal/js/jquery.nyroModal-ie6.min.js"></script>
<![endif]-->

<script type="text/javascript">
(function ($) {
	$(document).ready(function() {
		$('A#launchDemo').nyroModal( { bgColor: 'transparent', sizes: { width: 800, w: 800, minW: 800, minWidth: 800, initW: 800, initH: 600, h: 600, initHeight: 600, minHeight: 600, minH: 600} });
		$('iframe').attr('allowtransparency', 'true');
	});

	// All your code here
})(jQuery);
</script>

<a href="node/add/fit-survey" id="launchDemo" target="_blank">Launch GoodFit</a>
