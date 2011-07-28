Drupal.behaviors.cck_slider = function(context) {
  var settings = new Array();
  var iter = 0;
  for (var i in Drupal.settings.cck_slider) {
    settings[iter] = Drupal.settings.cck_slider[i];
	iter++;
  }
  $(".cck-slider-widget", context).each(function(index) {    
  	$(this).parent(".cck-slider-widget-wrapper").children(".cck-slider-widget").children(".ui-slider-handle").text(5);
    // Set the minimum text
    $(this).siblings(".cck-slider-min", context).html(settings[index]['min']);
	// Set the maximum text
	$(this).siblings(".cck-slider-max", context).html(settings[index]['max']);
	// Set the textfield to the default or current value
    $(this).parent(".cck-slider-widget-wrapper", context).siblings(".form-item", context).children(".cck-slider-field", context).val(parseInt(settings[index]['default']));
	
	// Hide the textfield
	$(this).parent(".cck-slider-widget-wrapper", context).siblings(".form-item", context).children(".cck-slider-field", context).hide();  
	// Create the slider
    $(this).slider({
      value: parseInt(settings[index]['default']),
      min: parseInt(settings[index]['min']),
      max: parseInt(settings[index]['max']),
      step: parseInt(settings[index]['increment_size']),
      slide: function( event, ui ) {
	    // Update the textfield with the new value
	    $(this).parent(".cck-slider-widget-wrapper", context).siblings(".form-item", context).children(".cck-slider-field", context).val(ui.value);
		// Update the slider handle to show the new current value
		$(this).children(".ui-slider-handle", context).html(ui.value);
	  }
    });
	// Set the text above the slider
	$(this).children(".ui-slider-handle", context).html(parseInt(settings[index]['default']));
  });
}