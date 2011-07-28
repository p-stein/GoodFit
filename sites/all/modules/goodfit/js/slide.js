(function ($) {



$(document).ready(function() {
	SetupSliders();
});

function SetupSliders() {
	var sliderCount = 0;
	$(".slider").each(function() {
		sliderCount++;
		var ID = "slider" + sliderCount;
		var textID = "sliderText" + sliderCount;

		$(this).addClass(textID);
		$(this).after('<div id="' + ID + '" class="sliderWidget"></div>');
		SetupSlider("#" + ID, $(this).attr("min"), $(this).attr("max"), 1, "." + textID);
		SetSliderValue("#" + ID, "#" + textID);
	});

}

function SetupSlider(sliderId, minimumValue, maximumValue, inStepsOf, inputControlClass){		
	$(sliderId).slider({			
		min: minimumValue,
		max: maximumValue,
		step: inStepsOf,
		slide: function(event, ui) {
			$(inputControlClass).val(ui.value);
		}
	});	
//	$(inputControlClass).numeric()
	$(inputControlClass).val($(sliderId).slider("value"));		
}

function SetSliderValue(sliderId, textBoxControl) {
	var amount = textBoxControl.value;
	var minimum = $(sliderId).slider("min")
	var maximum = $(sliderId).slider("max")
	
	if (amount > minimum || amount < maximum){
		$(sliderId).slider('option', 'value', amount);
	}		
}	



})(jQuery);
