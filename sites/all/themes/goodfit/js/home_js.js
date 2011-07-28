(function ($) {

$(document).ready(function() {

	$('#try_goodfit').hover( function() {
					$("#try_goodfit section").animate({ top: '50px'}, { queue: false, complete: function() { 
//						$("#big_up_arrow").fadeIn();
					} });
				},
				function() {
//					$("#big_up_arrow").fadeOut();
					$("#try_goodfit section").animate({ top: '0px'}, { queue: false, complete: function() {
					} });
				}
	);

});

})(jQuery);


