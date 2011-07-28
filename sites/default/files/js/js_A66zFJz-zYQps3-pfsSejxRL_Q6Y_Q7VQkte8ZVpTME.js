(function ($) {
$(document).ready(function() {
	var timeout			= Drupal.settings.megamenu.timeout;
	var sizewait		=  Drupal.settings.megamenu.sizewait;
	var hoverwait		=  Drupal.settings.megamenu.hoverwait;
	var hovertimer		= null;
	var sizetimer		= null;
	var closetimer		= null;
	var hoverParent		= null;
	var hoverBin		= null;
	var hoverSlots		= null;
	var megaSlots		= null;
	var megaParents		= null;
	var hideOffset		= -9000;
	var megaParents = $('.megamenu-menu').find('.megamenu-parent');
	var megaParentTitles = $('.megamenu-menu').find('.megamenu-parent-title');
	var megaBins = $('.megamenu-menu').find('.megamenu-bin');
	var oldParentIdx = -1;
	var hoverParentIdx = -2;
	megaBins.css('top', hideOffset);
  var activeParent	 		= megaParents.index($(megaParents).has('.active'));
  if(activeParent != -1)
  {
    megaParents.eq(activeParent).addClass('active');
  }
  
	function megamenu_open(){
		megamenu_canceltimer();

		if ($(this).hasClass('megamenu-parent-title')) {
			hoverParentIdx = megaParentTitles.index($(this));
		}
		else if ($(this).hasClass('megamenu-bin')) {
			hoverParentIdx = megaParents.index($(this).parents('.megamenu-parent'));
		}
    
		hoverParent = megaParents.eq(hoverParentIdx);

		if (hoverParentIdx != oldParentIdx) {
			megamenu_close();
			megamenu_hovertimer();
		} else {
			megamenu_display();
		}
	}

	function megamenu_display() {
		if (hoverParent) {
			// If the display doesn't have hover yet - trigger event
			if (!hoverParent.hasClass('hovering')) {
				hoverParent.trigger('megamenu_open');
			}
			hoverParent.addClass('hovering');
			hoverBin = hoverParent.find('.megamenu-bin');
			/* display position */
			hoverBin.css('top', 'auto');
		/* display position end */
		}
	}

	function megamenu_close(){
		if (hoverParent) {
			oldParentIdx = $('.megamenu-parent').index(hoverParent);
		}
		for ( var i=0 ; i < megaParents.length ; i++ ) {
			megaParents.trigger('megamenu_close');
			megaParents.eq(i).removeClass('hovering');
		}
		if(hoverBin) hoverBin.css('top', hideOffset);
	}

	function megamenu_closeAll(){
		if(hoverBin) hoverBin.css('top', hideOffset);
		for ( var i=0 ; i < megaParents.length ; i++ ) {
			megaParents.trigger('megamenu_close');
			megaParents.eq(i).removeClass('hovering');
		}
		oldParentIdx = -1;
	}

	function megamenu_stopPropagation(event){
		event.stopPropagation();
	}

	function megamenu_timer(){
		megamenu_canceltimer();
		megamenu_cancelhovertimer();
		closetimer = window.setTimeout(megamenu_closeAll, timeout);
	}

	function megamenu_canceltimer(){
		if (closetimer) {
			window.clearTimeout(closetimer);
			closetimer = null;
		}
	}

	function megamenu_hovertimer(){
		megamenu_cancelhovertimer();
		hovertimer = window.setTimeout(megamenu_display, hoverwait);
	}

	function megamenu_cancelhovertimer(){
		if (hovertimer) {
			window.clearTimeout(hovertimer);
			hovertimer = null;
		}
	}

	function megamenu_sizetimer(){
		/* waits to resize on initial call to accomodate browser draw */
		sizetimer = window.setTimeout(megamenu_sizer, sizewait);
	}

	function megamenu_sizer(){

		for ( var k=0 ; k < megaBins.length ; k++ ) {

			/* resets to bin sizes and position before sizing */
			megaBins.eq(k).css('left', 0 + 'px');
			megaBins.eq(k).css('width', 0 + 'px');

			var megaSlots = megaBins.eq(k).find('.megamenu-slot');

			/* auto bin width start */

			var i = 0;

			if(megaBins.eq(k).hasClass('megamenu-slots-columnar')) {
				var slotTotalWidth = 0;
				for ( i=0 ; i < megaSlots.length ; i++ ) {

					slotTotalWidth += megaSlots.eq(i).outerWidth(true);

					if (slotTotalWidth > $(window).width()) {
						slotTotalWidth = 0;
						for (var j=0 ; j < i ; j++) {
							slotTotalWidth += megaSlots.eq(i).outerWidth(true);
						}
						break;
					}
				}
				megaBins.eq(k).css( 'width' , slotTotalWidth);
				megaBins.eq(k).width(slotTotalWidth);
			}
			else {
				/* set bin width for vertical slots */
				megaBins.eq(k).css( 'width' , megaSlots.eq(0).outerWidth(true) );
			}
			/* auto bin width end */

			/* off-page shift start */ 
			var edgeOverlap = ($(window).width() - (megaBins.eq(k).offset().left + megaBins.eq(k).outerWidth(true)));

			if (edgeOverlap < 0) {
				megaBins.eq(k).css('left',(edgeOverlap) + 'px');
			}
		/* off-page shift end */
	
		}
	}

	// Open Mega Menu Function - bound
	function megamenu_open_progress() {
		if ($(this).find('ul.megamenu-bin').get(0)) {
			$(this).find('h2').addClass('megamenu-active');
		}
	}
	function megamenu_close_progress() {
		$(this).find('h2').removeClass('megamenu-active');
	}

	$('.megamenu-parent').bind('megamenu_open', megamenu_open_progress);
	$('.megamenu-parent').bind('megamenu_close', megamenu_close_progress);

	$('.megamenu-parent-title').bind('mouseover', megamenu_open);
	$('.megamenu-parent-title').bind('mouseout', megamenu_timer);

	$('.megamenu-bin').bind('mouseover', megamenu_open);
	$('.megamenu-bin').bind('mouseout', megamenu_timer);

	$("body").bind('click', megamenu_closeAll);
	$(".megamenu-menu").bind('click', megamenu_stopPropagation);

	$(window).bind('resize', megamenu_sizer);
	megamenu_sizetimer();
});
})(jQuery);;

(function ($) {
  Drupal.Panels = {};

  Drupal.Panels.autoAttach = function() {
    if ($.browser.msie) {
      // If IE, attach a hover event so we can see our admin links.
      $("div.panel-pane").hover(
        function() {
          $('div.panel-hide', this).addClass("panel-hide-hover"); return true;
        },
        function() {
          $('div.panel-hide', this).removeClass("panel-hide-hover"); return true;
        }
      );
      $("div.admin-links").hover(
        function() {
          $(this).addClass("admin-links-hover"); return true;
        },
        function(){
          $(this).removeClass("admin-links-hover"); return true;
        }
      );
    }
  };

  $(Drupal.Panels.autoAttach);
})(jQuery);
;
// $Id: toolbar_hide.js,v 1.1.2.4 2010/11/13 21:30:07 joshthegeek Exp $

(function($){
if (Drupal.settings.toolbar_hide.default) {
  $(document).ready(function(){$('#toolbar').hide();$('body').addClass('tbr_menu_hidden');});
}
$(document).keypress(function(e) {
	var unicode=e.keyCode? e.keyCode : e.charCode;
	if (String.fromCharCode(unicode)==Drupal.settings.toolbar_hide.key){
	  $('#toolbar').slideToggle('fast');
	  $('body').toggleClass('tbr_menu_hidden');
	}
});
})(jQuery);
;
(function ($) {
  Drupal.viewsSlideshow = Drupal.viewsSlideshow || {};

  /**
   * Views Slideshow Controls
   */
  Drupal.viewsSlideshowControls = Drupal.viewsSlideshowControls || {};

  /**
   * Implement the play hook for controls.
   */
  Drupal.viewsSlideshowControls.play = function (options) {
    // Route the control call to the correct control type.
    // Need to use try catch so we don't have to check to make sure every part
    // of the object is defined.
    try {
      if (typeof Drupal.settings.viewsSlideshowControls[options.slideshowID].top.type != "undefined" && typeof Drupal[Drupal.settings.viewsSlideshowControls[options.slideshowID].top.type].play == 'function') {
        Drupal[Drupal.settings.viewsSlideshowControls[options.slideshowID].top.type].play(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }

    try {
      if (typeof Drupal.settings.viewsSlideshowControls[options.slideshowID].bottom.type != "undefined" && typeof Drupal[Drupal.settings.viewsSlideshowControls[options.slideshowID].bottom.type].play == 'function') {
        Drupal[Drupal.settings.viewsSlideshowControls[options.slideshowID].bottom.type].play(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }
  };

  /**
   * Implement the pause hook for controls.
   */
  Drupal.viewsSlideshowControls.pause = function (options) {
    // Route the control call to the correct control type.
    // Need to use try catch so we don't have to check to make sure every part
    // of the object is defined.
    try {
      if (typeof Drupal.settings.viewsSlideshowControls[options.slideshowID].top.type != "undefined" && typeof Drupal[Drupal.settings.viewsSlideshowControls[options.slideshowID].top.type].pause == 'function') {
        Drupal[Drupal.settings.viewsSlideshowControls[options.slideshowID].top.type].pause(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }

    try {
      if (typeof Drupal.settings.viewsSlideshowControls[options.slideshowID].bottom.type != "undefined" && typeof Drupal[Drupal.settings.viewsSlideshowControls[options.slideshowID].bottom.type].pause == 'function') {
        Drupal[Drupal.settings.viewsSlideshowControls[options.slideshowID].bottom.type].pause(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }
  };


  /**
   * Views Slideshow Text Controls
   */

  // Add views slieshow api calls for views slideshow text controls.
  Drupal.behaviors.viewsSlideshowControlsText = {
    attach: function (context) {

      // Process previous link
      $('.views_slideshow_controls_text_previous:not(.views-slideshow-controls-text-previous-processed)', context).addClass('views-slideshow-controls-text-previous-processed').each(function() {
        var uniqueID = $(this).attr('id').replace('views_slideshow_controls_text_previous_', '');
        $(this).click(function() {
          Drupal.viewsSlideshow.action({ "action": 'previousSlide', "slideshowID": uniqueID });
          return false;
        });
      });

      // Process next link
      $('.views_slideshow_controls_text_next:not(.views-slideshow-controls-text-next-processed)', context).addClass('views-slideshow-controls-text-next-processed').each(function() {
        var uniqueID = $(this).attr('id').replace('views_slideshow_controls_text_next_', '');
        $(this).click(function() {
          Drupal.viewsSlideshow.action({ "action": 'nextSlide', "slideshowID": uniqueID });
          return false;
        });
      });

      // Process pause link
      $('.views_slideshow_controls_text_pause:not(.views-slideshow-controls-text-pause-processed)', context).addClass('views-slideshow-controls-text-pause-processed').each(function() {
        var uniqueID = $(this).attr('id').replace('views_slideshow_controls_text_pause_', '');
        $(this).click(function() {
          if (Drupal.settings.viewsSlideshow[uniqueID].paused) {
            Drupal.viewsSlideshow.action({ "action": 'play', "slideshowID": uniqueID });
          }
          else {
            Drupal.viewsSlideshow.action({ "action": 'pause', "slideshowID": uniqueID });
          }
          return false;
        });
      });
    }
  };

  Drupal.viewsSlideshowControlsText = Drupal.viewsSlideshowControlsText || {};

  /**
   * Implement the pause hook for text controls.
   */
  Drupal.viewsSlideshowControlsText.pause = function (options) {
    var pauseText = Drupal.theme.prototype['viewsSlideshowControlsPause'] ? Drupal.theme('viewsSlideshowControlsPause') : '';
    $('#views_slideshow_controls_text_pause_' + options.slideshowID + ' a').text(pauseText);
  };

  /**
   * Implement the play hook for text controls.
   */
  Drupal.viewsSlideshowControlsText.play = function (options) {
    var playText = Drupal.theme.prototype['viewsSlideshowControlsPlay'] ? Drupal.theme('viewsSlideshowControlsPlay') : '';
    $('#views_slideshow_controls_text_pause_' + options.slideshowID + ' a').text(playText);
  };

  // Theme the resume control.
  Drupal.theme.prototype.viewsSlideshowControlsPause = function () {
    return Drupal.t('Resume');
  };

  // Theme the pause control.
  Drupal.theme.prototype.viewsSlideshowControlsPlay = function () {
    return Drupal.t('Pause');
  };

  /**
   * Views Slideshow Pager
   */
  Drupal.viewsSlideshowPager = Drupal.viewsSlideshowPager || {};

  /**
   * Implement the transitionBegin hook for pagers.
   */
  Drupal.viewsSlideshowPager.transitionBegin = function (options) {
    // Route the pager call to the correct pager type.
    // Need to use try catch so we don't have to check to make sure every part
    // of the object is defined.
    try {
      if (typeof Drupal.settings.viewsSlideshowPager[options.slideshowID].top.type != "undefined" && typeof Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].top.type].transitionBegin == 'function') {
        Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].top.type].transitionBegin(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }

    try {
      if (typeof Drupal.settings.viewsSlideshowPager[options.slideshowID].bottom.type != "undefined" && typeof Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].bottom.type].transitionBegin == 'function') {
        Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].bottom.type].transitionBegin(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }
  };

  /**
   * Implement the goToSlide hook for pagers.
   */
  Drupal.viewsSlideshowPager.goToSlide = function (options) {
    // Route the pager call to the correct pager type.
    // Need to use try catch so we don't have to check to make sure every part
    // of the object is defined.
    try {
      if (typeof Drupal.settings.viewsSlideshowPager[options.slideshowID].top.type != "undefined" && typeof Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].top.type].goToSlide == 'function') {
        Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].top.type].goToSlide(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }

    try {
      if (typeof Drupal.settings.viewsSlideshowPager[options.slideshowID].bottom.type != "undefined" && typeof Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].bottom.type].goToSlide == 'function') {
        Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].bottom.type].goToSlide(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }
  };

  /**
   * Implement the previousSlide hook for pagers.
   */
  Drupal.viewsSlideshowPager.previousSlide = function (options) {
    // Route the pager call to the correct pager type.
    // Need to use try catch so we don't have to check to make sure every part
    // of the object is defined.
    try {
      if (typeof Drupal.settings.viewsSlideshowPager[options.slideshowID].top.type != "undefined" && typeof Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].top.type].previousSlide == 'function') {
        Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].top.type].previousSlide(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }

    try {
      if (typeof Drupal.settings.viewsSlideshowPager[options.slideshowID].bottom.type != "undefined" && typeof Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].bottom.type].previousSlide == 'function') {
        Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].bottom.type].previousSlide(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }
  };

  /**
   * Implement the nextSlide hook for pagers.
   */
  Drupal.viewsSlideshowPager.nextSlide = function (options) {
    // Route the pager call to the correct pager type.
    // Need to use try catch so we don't have to check to make sure every part
    // of the object is defined.
    try {
      if (typeof Drupal.settings.viewsSlideshowPager[options.slideshowID].top.type != "undefined" && typeof Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].top.type].nextSlide == 'function') {
        Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].top.type].nextSlide(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }

    try {
      if (typeof Drupal.settings.viewsSlideshowPager[options.slideshowID].bottom.type != "undefined" && typeof Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].bottom.type].nextSlide == 'function') {
        Drupal[Drupal.settings.viewsSlideshowPager[options.slideshowID].bottom.type].nextSlide(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }
  };


  /**
   * Views Slideshow Pager Fields
   */

  // Add views slieshow api calls for views slideshow pager fields.
  Drupal.behaviors.viewsSlideshowPagerFields = {
    attach: function (context) {
      // Process pause on hover.
      $('.views_slideshow_pager_field:not(.views-slideshow-pager-field-processed)', context).addClass('views-slideshow-pager-field-processed').each(function() {
        // Parse out the location and unique id from the full id.
        var pagerInfo = $(this).attr('id').split('_');
        var location = pagerInfo[2];
        pagerInfo.splice(0, 3);
        var uniqueID = pagerInfo.join('_');

        // Add the activate and pause on pager hover event to each pager item.
        if (Drupal.settings.viewsSlideshowPagerFields[uniqueID][location].activatePauseOnHover) {
          $(this).children().each(function(index, pagerItem) {
            $(pagerItem).hover(function() {
              Drupal.viewsSlideshow.action({ "action": 'goToSlide', "slideshowID": uniqueID, "slideNum": index });
              Drupal.viewsSlideshow.action({ "action": 'pause', "slideshowID": uniqueID });
            },
            function() {
              Drupal.viewsSlideshow.action({ "action": 'play', "slideshowID": uniqueID });
            });
          });
        }
        else {
          $(this).children().each(function(index, pagerItem) {
            $(pagerItem).click(function() {
              Drupal.viewsSlideshow.action({ "action": 'goToSlide', "slideshowID": uniqueID, "slideNum": index });
            });
          });
        }
      });
    }
  };

  Drupal.viewsSlideshowPagerFields = Drupal.viewsSlideshowPagerFields || {};

  /**
   * Implement the transitionBegin hook for pager fields pager.
   */
  Drupal.viewsSlideshowPagerFields.transitionBegin = function (options) {
    for (pagerLocation in Drupal.settings.viewsSlideshowPager[options.slideshowID]) {
      // Remove active class from pagers
      $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"]').removeClass('active');

      // Add active class to active pager.
      $('#views_slideshow_pager_field_item_'+ pagerLocation + '_' + options.slideshowID + '_' + options.slideNum).addClass('active');
    }

  };

  /**
   * Implement the goToSlide hook for pager fields pager.
   */
  Drupal.viewsSlideshowPagerFields.goToSlide = function (options) {
    for (pagerLocation in Drupal.settings.viewsSlideshowPager[options.slideshowID]) {
      // Remove active class from pagers
      $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"]').removeClass('active');

      // Add active class to active pager.
      $('#views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '_' + options.slideNum).addClass('active');
    }
  };

  /**
   * Implement the previousSlide hook for pager fields pager.
   */
  Drupal.viewsSlideshowPagerFields.previousSlide = function (options) {
    for (pagerLocation in Drupal.settings.viewsSlideshowPager[options.slideshowID]) {
      // Get the current active pager.
      var pagerNum = $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"].active').attr('id').replace('views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '_', '');

      // If we are on the first pager then activate the last pager.
      // Otherwise activate the previous pager.
      if (pagerNum == 0) {
        pagerNum = $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"]').length() - 1;
      }
      else {
        pagerNum--;
      }

      // Remove active class from pagers
      $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"]').removeClass('active');

      // Add active class to active pager.
      $('#views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '_' + pagerNum).addClass('active');
    }
  };

  /**
   * Implement the nextSlide hook for pager fields pager.
   */
  Drupal.viewsSlideshowPagerFields.nextSlide = function (options) {
    for (pagerLocation in Drupal.settings.viewsSlideshowPager[options.slideshowID]) {
      // Get the current active pager.
      var pagerNum = $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"].active').attr('id').replace('views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '_', '');
      var totalPagers = $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"]').length();

      // If we are on the last pager then activate the first pager.
      // Otherwise activate the next pager.
      pagerNum++;
      if (pagerNum == totalPagers) {
        pagerNum = 0;
      }

      // Remove active class from pagers
      $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"]').removeClass('active');

      // Add active class to active pager.
      $('#views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '_' + slideNum).addClass('active');
    }
  };


  /**
   * Views Slideshow Slide Counter
   */

  Drupal.viewsSlideshowSlideCounter = Drupal.viewsSlideshowSlideCounter || {};

  /**
   * Implement the transitionBegin for the slide counter.
   */
  Drupal.viewsSlideshowSlideCounter.transitionBegin = function (options) {
    $('#views_slideshow_slide_counter_' + options.slideshowID + ' .num').text(options.slideNum + 1);
  };

  /**
   * This is used as a router to process actions for the slideshow.
   */
  Drupal.viewsSlideshow.action = function (options) {
    // Set default values for our return status.
    var status = {
      'value': true,
      'text': ''
    }

    // If an action isn't specified return false.
    if (typeof options.action == 'undefined' || options.action == '') {
      status.value = false;
      status.text =  Drupal.t('There was no action specified.');
      return error;
    }

    // If we are using pause or play switch paused state accordingly.
    if (options.action == 'pause') {
      Drupal.settings.viewsSlideshow[options.slideshowID].paused = 1;
    }
    else if (options.action == 'play') {
      Drupal.settings.viewsSlideshow[options.slideshowID].paused = 0;
    }

    // We use a switch statement here mainly just to limit the type of actions
    // that are available.
    switch (options.action) {
      case "goToSlide":
      case "transitionBegin":
      case "transitionEnd":
        // The three methods above require a slide number. Checking if it is
        // defined and it is a number that is an integer.
        if (typeof options.slideNum == 'undefined' || typeof options.slideNum !== 'number' || parseInt(options.slideNum) != (options.slideNum - 0)) {
          status.value = false;
          status.text = Drupal.t('An invalid integer was specified for slideNum.');
        }
      case "pause":
      case "play":
      case "nextSlide":
      case "previousSlide":
        // Grab our list of methods.
        var methods = Drupal.settings.viewsSlideshow[options.slideshowID]['methods'];

        // if the calling method specified methods that shouldn't be called then
        // exclude calling them.
        var excludeMethodsObj = {};
        if (typeof options.excludeMethods !== 'undefined') {
          // We need to turn the excludeMethods array into an object so we can use the in
          // function.
          for (var i=0; i < excludeMethods.length; i++) {
            excludeMethodsObj[excludeMethods[i]] = '';
          }
        }

        // Call every registered method and don't call excluded ones.
        for (i = 0; i < methods[options.action].length; i++) {
          if (Drupal[methods[options.action][i]] != undefined && typeof Drupal[methods[options.action][i]][options.action] == 'function' && !(methods[options.action][i] in excludeMethodsObj)) {
            Drupal[methods[options.action][i]][options.action](options);
          }
        }
        break;

      // If it gets here it's because it's an invalid action.
      default:
        status.value = false;
        status.text = Drupal.t('An invalid action "!action" was specified.', { "!action": options.action });
    }
    return status;
  };
})(jQuery);
;
/*
 * jQuery Cycle Plugin (with Transition Definitions)
 * Examples and documentation at: http://jquery.malsup.com/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version: 2.99 (12-MAR-2011)
 * Dual licensed under the MIT and GPL licenses.
 * http://jquery.malsup.com/license.html
 * Requires: jQuery v1.3.2 or later
 */
(function($){var ver="2.99";if($.support==undefined){$.support={opacity:!($.browser.msie)};}function debug(s){$.fn.cycle.debug&&log(s);}function log(){window.console&&console.log&&console.log("[cycle] "+Array.prototype.join.call(arguments," "));}$.expr[":"].paused=function(el){return el.cyclePause;};$.fn.cycle=function(options,arg2){var o={s:this.selector,c:this.context};if(this.length===0&&options!="stop"){if(!$.isReady&&o.s){log("DOM not ready, queuing slideshow");$(function(){$(o.s,o.c).cycle(options,arg2);});return this;}log("terminating; zero elements found by selector"+($.isReady?"":" (DOM not ready)"));return this;}return this.each(function(){var opts=handleArguments(this,options,arg2);if(opts===false){return;}opts.updateActivePagerLink=opts.updateActivePagerLink||$.fn.cycle.updateActivePagerLink;if(this.cycleTimeout){clearTimeout(this.cycleTimeout);}this.cycleTimeout=this.cyclePause=0;var $cont=$(this);var $slides=opts.slideExpr?$(opts.slideExpr,this):$cont.children();var els=$slides.get();if(els.length<2){log("terminating; too few slides: "+els.length);return;}var opts2=buildOptions($cont,$slides,els,opts,o);if(opts2===false){return;}var startTime=opts2.continuous?10:getTimeout(els[opts2.currSlide],els[opts2.nextSlide],opts2,!opts2.backwards);if(startTime){startTime+=(opts2.delay||0);if(startTime<10){startTime=10;}debug("first timeout: "+startTime);this.cycleTimeout=setTimeout(function(){go(els,opts2,0,!opts.backwards);},startTime);}});};function handleArguments(cont,options,arg2){if(cont.cycleStop==undefined){cont.cycleStop=0;}if(options===undefined||options===null){options={};}if(options.constructor==String){switch(options){case"destroy":case"stop":var opts=$(cont).data("cycle.opts");if(!opts){return false;}cont.cycleStop++;if(cont.cycleTimeout){clearTimeout(cont.cycleTimeout);}cont.cycleTimeout=0;$(cont).removeData("cycle.opts");if(options=="destroy"){destroy(opts);}return false;case"toggle":cont.cyclePause=(cont.cyclePause===1)?0:1;checkInstantResume(cont.cyclePause,arg2,cont);return false;case"pause":cont.cyclePause=1;return false;case"resume":cont.cyclePause=0;checkInstantResume(false,arg2,cont);return false;case"prev":case"next":var opts=$(cont).data("cycle.opts");if(!opts){log('options not found, "prev/next" ignored');return false;}$.fn.cycle[options](opts);return false;default:options={fx:options};}return options;}else{if(options.constructor==Number){var num=options;options=$(cont).data("cycle.opts");if(!options){log("options not found, can not advance slide");return false;}if(num<0||num>=options.elements.length){log("invalid slide index: "+num);return false;}options.nextSlide=num;if(cont.cycleTimeout){clearTimeout(cont.cycleTimeout);cont.cycleTimeout=0;}if(typeof arg2=="string"){options.oneTimeFx=arg2;}go(options.elements,options,1,num>=options.currSlide);return false;}}return options;function checkInstantResume(isPaused,arg2,cont){if(!isPaused&&arg2===true){var options=$(cont).data("cycle.opts");if(!options){log("options not found, can not resume");return false;}if(cont.cycleTimeout){clearTimeout(cont.cycleTimeout);cont.cycleTimeout=0;}go(options.elements,options,1,!options.backwards);}}}function removeFilter(el,opts){if(!$.support.opacity&&opts.cleartype&&el.style.filter){try{el.style.removeAttribute("filter");}catch(smother){}}}function destroy(opts){if(opts.next){$(opts.next).unbind(opts.prevNextEvent);}if(opts.prev){$(opts.prev).unbind(opts.prevNextEvent);}if(opts.pager||opts.pagerAnchorBuilder){$.each(opts.pagerAnchors||[],function(){this.unbind().remove();});}opts.pagerAnchors=null;if(opts.destroy){opts.destroy(opts);}}function buildOptions($cont,$slides,els,options,o){var opts=$.extend({},$.fn.cycle.defaults,options||{},$.metadata?$cont.metadata():$.meta?$cont.data():{});if(opts.autostop){opts.countdown=opts.autostopCount||els.length;}var cont=$cont[0];$cont.data("cycle.opts",opts);opts.$cont=$cont;opts.stopCount=cont.cycleStop;opts.elements=els;opts.before=opts.before?[opts.before]:[];opts.after=opts.after?[opts.after]:[];if(!$.support.opacity&&opts.cleartype){opts.after.push(function(){removeFilter(this,opts);});}if(opts.continuous){opts.after.push(function(){go(els,opts,0,!opts.backwards);});}saveOriginalOpts(opts);if(!$.support.opacity&&opts.cleartype&&!opts.cleartypeNoBg){clearTypeFix($slides);}if($cont.css("position")=="static"){$cont.css("position","relative");}if(opts.width){$cont.width(opts.width);}if(opts.height&&opts.height!="auto"){$cont.height(opts.height);}if(opts.startingSlide){opts.startingSlide=parseInt(opts.startingSlide);}else{if(opts.backwards){opts.startingSlide=els.length-1;}}if(opts.random){opts.randomMap=[];for(var i=0;i<els.length;i++){opts.randomMap.push(i);}opts.randomMap.sort(function(a,b){return Math.random()-0.5;});opts.randomIndex=1;opts.startingSlide=opts.randomMap[1];}else{if(opts.startingSlide>=els.length){opts.startingSlide=0;}}opts.currSlide=opts.startingSlide||0;var first=opts.startingSlide;$slides.css({position:"absolute",top:0,left:0}).hide().each(function(i){var z;if(opts.backwards){z=first?i<=first?els.length+(i-first):first-i:els.length-i;}else{z=first?i>=first?els.length-(i-first):first-i:els.length-i;}$(this).css("z-index",z);});$(els[first]).css("opacity",1).show();removeFilter(els[first],opts);if(opts.fit&&opts.width){$slides.width(opts.width);}if(opts.fit&&opts.height&&opts.height!="auto"){$slides.height(opts.height);}var reshape=opts.containerResize&&!$cont.innerHeight();if(reshape){var maxw=0,maxh=0;for(var j=0;j<els.length;j++){var $e=$(els[j]),e=$e[0],w=$e.outerWidth(),h=$e.outerHeight();if(!w){w=e.offsetWidth||e.width||$e.attr("width");}if(!h){h=e.offsetHeight||e.height||$e.attr("height");}maxw=w>maxw?w:maxw;maxh=h>maxh?h:maxh;}if(maxw>0&&maxh>0){$cont.css({width:maxw+"px",height:maxh+"px"});}}if(opts.pause){$cont.hover(function(){this.cyclePause++;},function(){this.cyclePause--;});}if(supportMultiTransitions(opts)===false){return false;}var requeue=false;options.requeueAttempts=options.requeueAttempts||0;$slides.each(function(){var $el=$(this);this.cycleH=(opts.fit&&opts.height)?opts.height:($el.height()||this.offsetHeight||this.height||$el.attr("height")||0);this.cycleW=(opts.fit&&opts.width)?opts.width:($el.width()||this.offsetWidth||this.width||$el.attr("width")||0);if($el.is("img")){var loadingIE=($.browser.msie&&this.cycleW==28&&this.cycleH==30&&!this.complete);var loadingFF=($.browser.mozilla&&this.cycleW==34&&this.cycleH==19&&!this.complete);var loadingOp=($.browser.opera&&((this.cycleW==42&&this.cycleH==19)||(this.cycleW==37&&this.cycleH==17))&&!this.complete);var loadingOther=(this.cycleH==0&&this.cycleW==0&&!this.complete);if(loadingIE||loadingFF||loadingOp||loadingOther){if(o.s&&opts.requeueOnImageNotLoaded&&++options.requeueAttempts<100){log(options.requeueAttempts," - img slide not loaded, requeuing slideshow: ",this.src,this.cycleW,this.cycleH);setTimeout(function(){$(o.s,o.c).cycle(options);},opts.requeueTimeout);requeue=true;return false;}else{log("could not determine size of image: "+this.src,this.cycleW,this.cycleH);}}}return true;});if(requeue){return false;}opts.cssBefore=opts.cssBefore||{};opts.cssAfter=opts.cssAfter||{};opts.cssFirst=opts.cssFirst||{};opts.animIn=opts.animIn||{};opts.animOut=opts.animOut||{};$slides.not(":eq("+first+")").css(opts.cssBefore);$($slides[first]).css(opts.cssFirst);if(opts.timeout){opts.timeout=parseInt(opts.timeout);if(opts.speed.constructor==String){opts.speed=$.fx.speeds[opts.speed]||parseInt(opts.speed);}if(!opts.sync){opts.speed=opts.speed/2;}var buffer=opts.fx=="none"?0:opts.fx=="shuffle"?500:250;while((opts.timeout-opts.speed)<buffer){opts.timeout+=opts.speed;}}if(opts.easing){opts.easeIn=opts.easeOut=opts.easing;}if(!opts.speedIn){opts.speedIn=opts.speed;}if(!opts.speedOut){opts.speedOut=opts.speed;}opts.slideCount=els.length;opts.currSlide=opts.lastSlide=first;if(opts.random){if(++opts.randomIndex==els.length){opts.randomIndex=0;}opts.nextSlide=opts.randomMap[opts.randomIndex];}else{if(opts.backwards){opts.nextSlide=opts.startingSlide==0?(els.length-1):opts.startingSlide-1;}else{opts.nextSlide=opts.startingSlide>=(els.length-1)?0:opts.startingSlide+1;}}if(!opts.multiFx){var init=$.fn.cycle.transitions[opts.fx];if($.isFunction(init)){init($cont,$slides,opts);}else{if(opts.fx!="custom"&&!opts.multiFx){log("unknown transition: "+opts.fx,"; slideshow terminating");return false;}}}var e0=$slides[first];if(opts.before.length){opts.before[0].apply(e0,[e0,e0,opts,true]);}if(opts.after.length){opts.after[0].apply(e0,[e0,e0,opts,true]);}if(opts.next){$(opts.next).bind(opts.prevNextEvent,function(){return advance(opts,1);});}if(opts.prev){$(opts.prev).bind(opts.prevNextEvent,function(){return advance(opts,0);});}if(opts.pager||opts.pagerAnchorBuilder){buildPager(els,opts);}exposeAddSlide(opts,els);return opts;}function saveOriginalOpts(opts){opts.original={before:[],after:[]};opts.original.cssBefore=$.extend({},opts.cssBefore);opts.original.cssAfter=$.extend({},opts.cssAfter);opts.original.animIn=$.extend({},opts.animIn);opts.original.animOut=$.extend({},opts.animOut);$.each(opts.before,function(){opts.original.before.push(this);});$.each(opts.after,function(){opts.original.after.push(this);});}function supportMultiTransitions(opts){var i,tx,txs=$.fn.cycle.transitions;if(opts.fx.indexOf(",")>0){opts.multiFx=true;opts.fxs=opts.fx.replace(/\s*/g,"").split(",");for(i=0;i<opts.fxs.length;i++){var fx=opts.fxs[i];tx=txs[fx];if(!tx||!txs.hasOwnProperty(fx)||!$.isFunction(tx)){log("discarding unknown transition: ",fx);opts.fxs.splice(i,1);i--;}}if(!opts.fxs.length){log("No valid transitions named; slideshow terminating.");return false;}}else{if(opts.fx=="all"){opts.multiFx=true;opts.fxs=[];for(p in txs){tx=txs[p];if(txs.hasOwnProperty(p)&&$.isFunction(tx)){opts.fxs.push(p);}}}}if(opts.multiFx&&opts.randomizeEffects){var r1=Math.floor(Math.random()*20)+30;for(i=0;i<r1;i++){var r2=Math.floor(Math.random()*opts.fxs.length);opts.fxs.push(opts.fxs.splice(r2,1)[0]);}debug("randomized fx sequence: ",opts.fxs);}return true;}function exposeAddSlide(opts,els){opts.addSlide=function(newSlide,prepend){var $s=$(newSlide),s=$s[0];if(!opts.autostopCount){opts.countdown++;}els[prepend?"unshift":"push"](s);if(opts.els){opts.els[prepend?"unshift":"push"](s);}opts.slideCount=els.length;$s.css("position","absolute");$s[prepend?"prependTo":"appendTo"](opts.$cont);if(prepend){opts.currSlide++;opts.nextSlide++;}if(!$.support.opacity&&opts.cleartype&&!opts.cleartypeNoBg){clearTypeFix($s);}if(opts.fit&&opts.width){$s.width(opts.width);}if(opts.fit&&opts.height&&opts.height!="auto"){$s.height(opts.height);}s.cycleH=(opts.fit&&opts.height)?opts.height:$s.height();s.cycleW=(opts.fit&&opts.width)?opts.width:$s.width();$s.css(opts.cssBefore);if(opts.pager||opts.pagerAnchorBuilder){$.fn.cycle.createPagerAnchor(els.length-1,s,$(opts.pager),els,opts);}if($.isFunction(opts.onAddSlide)){opts.onAddSlide($s);}else{$s.hide();}};}$.fn.cycle.resetState=function(opts,fx){fx=fx||opts.fx;opts.before=[];opts.after=[];opts.cssBefore=$.extend({},opts.original.cssBefore);opts.cssAfter=$.extend({},opts.original.cssAfter);opts.animIn=$.extend({},opts.original.animIn);opts.animOut=$.extend({},opts.original.animOut);opts.fxFn=null;$.each(opts.original.before,function(){opts.before.push(this);});$.each(opts.original.after,function(){opts.after.push(this);});var init=$.fn.cycle.transitions[fx];if($.isFunction(init)){init(opts.$cont,$(opts.elements),opts);}};function go(els,opts,manual,fwd){if(manual&&opts.busy&&opts.manualTrump){debug("manualTrump in go(), stopping active transition");$(els).stop(true,true);opts.busy=0;}if(opts.busy){debug("transition active, ignoring new tx request");return;}var p=opts.$cont[0],curr=els[opts.currSlide],next=els[opts.nextSlide];if(p.cycleStop!=opts.stopCount||p.cycleTimeout===0&&!manual){return;}if(!manual&&!p.cyclePause&&!opts.bounce&&((opts.autostop&&(--opts.countdown<=0))||(opts.nowrap&&!opts.random&&opts.nextSlide<opts.currSlide))){if(opts.end){opts.end(opts);}return;}var changed=false;if((manual||!p.cyclePause)&&(opts.nextSlide!=opts.currSlide)){changed=true;var fx=opts.fx;curr.cycleH=curr.cycleH||$(curr).height();curr.cycleW=curr.cycleW||$(curr).width();next.cycleH=next.cycleH||$(next).height();next.cycleW=next.cycleW||$(next).width();if(opts.multiFx){if(opts.lastFx==undefined||++opts.lastFx>=opts.fxs.length){opts.lastFx=0;}fx=opts.fxs[opts.lastFx];opts.currFx=fx;}if(opts.oneTimeFx){fx=opts.oneTimeFx;opts.oneTimeFx=null;}$.fn.cycle.resetState(opts,fx);if(opts.before.length){$.each(opts.before,function(i,o){if(p.cycleStop!=opts.stopCount){return;}o.apply(next,[curr,next,opts,fwd]);});}var after=function(){opts.busy=0;$.each(opts.after,function(i,o){if(p.cycleStop!=opts.stopCount){return;}o.apply(next,[curr,next,opts,fwd]);});};debug("tx firing("+fx+"); currSlide: "+opts.currSlide+"; nextSlide: "+opts.nextSlide);opts.busy=1;if(opts.fxFn){opts.fxFn(curr,next,opts,after,fwd,manual&&opts.fastOnEvent);}else{if($.isFunction($.fn.cycle[opts.fx])){$.fn.cycle[opts.fx](curr,next,opts,after,fwd,manual&&opts.fastOnEvent);}else{$.fn.cycle.custom(curr,next,opts,after,fwd,manual&&opts.fastOnEvent);}}}if(changed||opts.nextSlide==opts.currSlide){opts.lastSlide=opts.currSlide;if(opts.random){opts.currSlide=opts.nextSlide;if(++opts.randomIndex==els.length){opts.randomIndex=0;}opts.nextSlide=opts.randomMap[opts.randomIndex];if(opts.nextSlide==opts.currSlide){opts.nextSlide=(opts.currSlide==opts.slideCount-1)?0:opts.currSlide+1;}}else{if(opts.backwards){var roll=(opts.nextSlide-1)<0;if(roll&&opts.bounce){opts.backwards=!opts.backwards;opts.nextSlide=1;opts.currSlide=0;}else{opts.nextSlide=roll?(els.length-1):opts.nextSlide-1;opts.currSlide=roll?0:opts.nextSlide+1;}}else{var roll=(opts.nextSlide+1)==els.length;if(roll&&opts.bounce){opts.backwards=!opts.backwards;opts.nextSlide=els.length-2;opts.currSlide=els.length-1;}else{opts.nextSlide=roll?0:opts.nextSlide+1;opts.currSlide=roll?els.length-1:opts.nextSlide-1;}}}}if(changed&&opts.pager){opts.updateActivePagerLink(opts.pager,opts.currSlide,opts.activePagerClass);}var ms=0;if(opts.timeout&&!opts.continuous){ms=getTimeout(els[opts.currSlide],els[opts.nextSlide],opts,fwd);}else{if(opts.continuous&&p.cyclePause){ms=10;}}if(ms>0){p.cycleTimeout=setTimeout(function(){go(els,opts,0,!opts.backwards);},ms);}}$.fn.cycle.updateActivePagerLink=function(pager,currSlide,clsName){$(pager).each(function(){$(this).children().removeClass(clsName).eq(currSlide).addClass(clsName);});};function getTimeout(curr,next,opts,fwd){if(opts.timeoutFn){var t=opts.timeoutFn.call(curr,curr,next,opts,fwd);while(opts.fx!="none"&&(t-opts.speed)<250){t+=opts.speed;}debug("calculated timeout: "+t+"; speed: "+opts.speed);if(t!==false){return t;}}return opts.timeout;}$.fn.cycle.next=function(opts){advance(opts,1);};$.fn.cycle.prev=function(opts){advance(opts,0);};function advance(opts,moveForward){var val=moveForward?1:-1;var els=opts.elements;var p=opts.$cont[0],timeout=p.cycleTimeout;if(timeout){clearTimeout(timeout);p.cycleTimeout=0;}if(opts.random&&val<0){opts.randomIndex--;if(--opts.randomIndex==-2){opts.randomIndex=els.length-2;}else{if(opts.randomIndex==-1){opts.randomIndex=els.length-1;}}opts.nextSlide=opts.randomMap[opts.randomIndex];}else{if(opts.random){opts.nextSlide=opts.randomMap[opts.randomIndex];}else{opts.nextSlide=opts.currSlide+val;if(opts.nextSlide<0){if(opts.nowrap){return false;}opts.nextSlide=els.length-1;}else{if(opts.nextSlide>=els.length){if(opts.nowrap){return false;}opts.nextSlide=0;}}}}var cb=opts.onPrevNextEvent||opts.prevNextClick;if($.isFunction(cb)){cb(val>0,opts.nextSlide,els[opts.nextSlide]);}go(els,opts,1,moveForward);return false;}function buildPager(els,opts){var $p=$(opts.pager);$.each(els,function(i,o){$.fn.cycle.createPagerAnchor(i,o,$p,els,opts);});opts.updateActivePagerLink(opts.pager,opts.startingSlide,opts.activePagerClass);}$.fn.cycle.createPagerAnchor=function(i,el,$p,els,opts){var a;if($.isFunction(opts.pagerAnchorBuilder)){a=opts.pagerAnchorBuilder(i,el);debug("pagerAnchorBuilder("+i+", el) returned: "+a);}else{a='<a href="#">'+(i+1)+"</a>";}if(!a){return;}var $a=$(a);if($a.parents("body").length===0){var arr=[];if($p.length>1){$p.each(function(){var $clone=$a.clone(true);$(this).append($clone);arr.push($clone[0]);});$a=$(arr);}else{$a.appendTo($p);}}opts.pagerAnchors=opts.pagerAnchors||[];opts.pagerAnchors.push($a);$a.bind(opts.pagerEvent,function(e){e.preventDefault();opts.nextSlide=i;var p=opts.$cont[0],timeout=p.cycleTimeout;if(timeout){clearTimeout(timeout);p.cycleTimeout=0;}var cb=opts.onPagerEvent||opts.pagerClick;if($.isFunction(cb)){cb(opts.nextSlide,els[opts.nextSlide]);}go(els,opts,1,opts.currSlide<i);});if(!/^click/.test(opts.pagerEvent)&&!opts.allowPagerClickBubble){$a.bind("click.cycle",function(){return false;});}if(opts.pauseOnPagerHover){$a.hover(function(){opts.$cont[0].cyclePause++;},function(){opts.$cont[0].cyclePause--;});}};$.fn.cycle.hopsFromLast=function(opts,fwd){var hops,l=opts.lastSlide,c=opts.currSlide;if(fwd){hops=c>l?c-l:opts.slideCount-l;}else{hops=c<l?l-c:l+opts.slideCount-c;}return hops;};function clearTypeFix($slides){debug("applying clearType background-color hack");function hex(s){s=parseInt(s).toString(16);return s.length<2?"0"+s:s;}function getBg(e){for(;e&&e.nodeName.toLowerCase()!="html";e=e.parentNode){var v=$.css(e,"background-color");if(v&&v.indexOf("rgb")>=0){var rgb=v.match(/\d+/g);return"#"+hex(rgb[0])+hex(rgb[1])+hex(rgb[2]);}if(v&&v!="transparent"){return v;}}return"#ffffff";}$slides.each(function(){$(this).css("background-color",getBg(this));});}$.fn.cycle.commonReset=function(curr,next,opts,w,h,rev){$(opts.elements).not(curr).hide();if(typeof opts.cssBefore.opacity=="undefined"){opts.cssBefore.opacity=1;}opts.cssBefore.display="block";if(opts.slideResize&&w!==false&&next.cycleW>0){opts.cssBefore.width=next.cycleW;}if(opts.slideResize&&h!==false&&next.cycleH>0){opts.cssBefore.height=next.cycleH;}opts.cssAfter=opts.cssAfter||{};opts.cssAfter.display="none";$(curr).css("zIndex",opts.slideCount+(rev===true?1:0));$(next).css("zIndex",opts.slideCount+(rev===true?0:1));};$.fn.cycle.custom=function(curr,next,opts,cb,fwd,speedOverride){var $l=$(curr),$n=$(next);var speedIn=opts.speedIn,speedOut=opts.speedOut,easeIn=opts.easeIn,easeOut=opts.easeOut;$n.css(opts.cssBefore);if(speedOverride){if(typeof speedOverride=="number"){speedIn=speedOut=speedOverride;}else{speedIn=speedOut=1;}easeIn=easeOut=null;}var fn=function(){$n.animate(opts.animIn,speedIn,easeIn,function(){cb();});};$l.animate(opts.animOut,speedOut,easeOut,function(){$l.css(opts.cssAfter);if(!opts.sync){fn();}});if(opts.sync){fn();}};$.fn.cycle.transitions={fade:function($cont,$slides,opts){$slides.not(":eq("+opts.currSlide+")").css("opacity",0);opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts);opts.cssBefore.opacity=0;});opts.animIn={opacity:1};opts.animOut={opacity:0};opts.cssBefore={top:0,left:0};}};$.fn.cycle.ver=function(){return ver;};$.fn.cycle.defaults={activePagerClass:"activeSlide",after:null,allowPagerClickBubble:false,animIn:null,animOut:null,autostop:0,autostopCount:0,backwards:false,before:null,cleartype:!$.support.opacity,cleartypeNoBg:false,containerResize:1,continuous:0,cssAfter:null,cssBefore:null,delay:0,easeIn:null,easeOut:null,easing:null,end:null,fastOnEvent:0,fit:0,fx:"fade",fxFn:null,height:"auto",manualTrump:true,next:null,nowrap:0,onPagerEvent:null,onPrevNextEvent:null,pager:null,pagerAnchorBuilder:null,pagerEvent:"click.cycle",pause:0,pauseOnPagerHover:0,prev:null,prevNextEvent:"click.cycle",random:0,randomizeEffects:1,requeueOnImageNotLoaded:true,requeueTimeout:250,rev:0,shuffle:null,slideExpr:null,slideResize:1,speed:1000,speedIn:null,speedOut:null,startingSlide:0,sync:1,timeout:4000,timeoutFn:null,updateActivePagerLink:null};})(jQuery);
/*
 * jQuery Cycle Plugin Transition Definitions
 * This script is a plugin for the jQuery Cycle Plugin
 * Examples and documentation at: http://malsup.com/jquery/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version:	 2.73
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($){$.fn.cycle.transitions.none=function($cont,$slides,opts){opts.fxFn=function(curr,next,opts,after){$(next).show();$(curr).hide();after();};};$.fn.cycle.transitions.fadeout=function($cont,$slides,opts){$slides.not(":eq("+opts.currSlide+")").css({display:"block",opacity:1});opts.before.push(function(curr,next,opts,w,h,rev){$(curr).css("zIndex",opts.slideCount+(!rev===true?1:0));$(next).css("zIndex",opts.slideCount+(!rev===true?0:1));});opts.animIn.opacity=1;opts.animOut.opacity=0;opts.cssBefore.opacity=1;opts.cssBefore.display="block";opts.cssAfter.zIndex=0;};$.fn.cycle.transitions.scrollUp=function($cont,$slides,opts){$cont.css("overflow","hidden");opts.before.push($.fn.cycle.commonReset);var h=$cont.height();opts.cssBefore.top=h;opts.cssBefore.left=0;opts.cssFirst.top=0;opts.animIn.top=0;opts.animOut.top=-h;};$.fn.cycle.transitions.scrollDown=function($cont,$slides,opts){$cont.css("overflow","hidden");opts.before.push($.fn.cycle.commonReset);var h=$cont.height();opts.cssFirst.top=0;opts.cssBefore.top=-h;opts.cssBefore.left=0;opts.animIn.top=0;opts.animOut.top=h;};$.fn.cycle.transitions.scrollLeft=function($cont,$slides,opts){$cont.css("overflow","hidden");opts.before.push($.fn.cycle.commonReset);var w=$cont.width();opts.cssFirst.left=0;opts.cssBefore.left=w;opts.cssBefore.top=0;opts.animIn.left=0;opts.animOut.left=0-w;};$.fn.cycle.transitions.scrollRight=function($cont,$slides,opts){$cont.css("overflow","hidden");opts.before.push($.fn.cycle.commonReset);var w=$cont.width();opts.cssFirst.left=0;opts.cssBefore.left=-w;opts.cssBefore.top=0;opts.animIn.left=0;opts.animOut.left=w;};$.fn.cycle.transitions.scrollHorz=function($cont,$slides,opts){$cont.css("overflow","hidden").width();opts.before.push(function(curr,next,opts,fwd){if(opts.rev){fwd=!fwd;}$.fn.cycle.commonReset(curr,next,opts);opts.cssBefore.left=fwd?(next.cycleW-1):(1-next.cycleW);opts.animOut.left=fwd?-curr.cycleW:curr.cycleW;});opts.cssFirst.left=0;opts.cssBefore.top=0;opts.animIn.left=0;opts.animOut.top=0;};$.fn.cycle.transitions.scrollVert=function($cont,$slides,opts){$cont.css("overflow","hidden");opts.before.push(function(curr,next,opts,fwd){if(opts.rev){fwd=!fwd;}$.fn.cycle.commonReset(curr,next,opts);opts.cssBefore.top=fwd?(1-next.cycleH):(next.cycleH-1);opts.animOut.top=fwd?curr.cycleH:-curr.cycleH;});opts.cssFirst.top=0;opts.cssBefore.left=0;opts.animIn.top=0;opts.animOut.left=0;};$.fn.cycle.transitions.slideX=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$(opts.elements).not(curr).hide();$.fn.cycle.commonReset(curr,next,opts,false,true);opts.animIn.width=next.cycleW;});opts.cssBefore.left=0;opts.cssBefore.top=0;opts.cssBefore.width=0;opts.animIn.width="show";opts.animOut.width=0;};$.fn.cycle.transitions.slideY=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$(opts.elements).not(curr).hide();$.fn.cycle.commonReset(curr,next,opts,true,false);opts.animIn.height=next.cycleH;});opts.cssBefore.left=0;opts.cssBefore.top=0;opts.cssBefore.height=0;opts.animIn.height="show";opts.animOut.height=0;};$.fn.cycle.transitions.shuffle=function($cont,$slides,opts){var i,w=$cont.css("overflow","visible").width();$slides.css({left:0,top:0});opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,true,true,true);});if(!opts.speedAdjusted){opts.speed=opts.speed/2;opts.speedAdjusted=true;}opts.random=0;opts.shuffle=opts.shuffle||{left:-w,top:15};opts.els=[];for(i=0;i<$slides.length;i++){opts.els.push($slides[i]);}for(i=0;i<opts.currSlide;i++){opts.els.push(opts.els.shift());}opts.fxFn=function(curr,next,opts,cb,fwd){if(opts.rev){fwd=!fwd;}var $el=fwd?$(curr):$(next);$(next).css(opts.cssBefore);var count=opts.slideCount;$el.animate(opts.shuffle,opts.speedIn,opts.easeIn,function(){var hops=$.fn.cycle.hopsFromLast(opts,fwd);for(var k=0;k<hops;k++){fwd?opts.els.push(opts.els.shift()):opts.els.unshift(opts.els.pop());}if(fwd){for(var i=0,len=opts.els.length;i<len;i++){$(opts.els[i]).css("z-index",len-i+count);}}else{var z=$(curr).css("z-index");$el.css("z-index",parseInt(z)+1+count);}$el.animate({left:0,top:0},opts.speedOut,opts.easeOut,function(){$(fwd?this:curr).hide();if(cb){cb();}});});};$.extend(opts.cssBefore,{display:"block",opacity:1,top:0,left:0});};$.fn.cycle.transitions.turnUp=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,true,false);opts.cssBefore.top=next.cycleH;opts.animIn.height=next.cycleH;opts.animOut.width=next.cycleW;});opts.cssFirst.top=0;opts.cssBefore.left=0;opts.cssBefore.height=0;opts.animIn.top=0;opts.animOut.height=0;};$.fn.cycle.transitions.turnDown=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,true,false);opts.animIn.height=next.cycleH;opts.animOut.top=curr.cycleH;});opts.cssFirst.top=0;opts.cssBefore.left=0;opts.cssBefore.top=0;opts.cssBefore.height=0;opts.animOut.height=0;};$.fn.cycle.transitions.turnLeft=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,false,true);opts.cssBefore.left=next.cycleW;opts.animIn.width=next.cycleW;});opts.cssBefore.top=0;opts.cssBefore.width=0;opts.animIn.left=0;opts.animOut.width=0;};$.fn.cycle.transitions.turnRight=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,false,true);opts.animIn.width=next.cycleW;opts.animOut.left=curr.cycleW;});$.extend(opts.cssBefore,{top:0,left:0,width:0});opts.animIn.left=0;opts.animOut.width=0;};$.fn.cycle.transitions.zoom=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,false,false,true);opts.cssBefore.top=next.cycleH/2;opts.cssBefore.left=next.cycleW/2;$.extend(opts.animIn,{top:0,left:0,width:next.cycleW,height:next.cycleH});$.extend(opts.animOut,{width:0,height:0,top:curr.cycleH/2,left:curr.cycleW/2});});opts.cssFirst.top=0;opts.cssFirst.left=0;opts.cssBefore.width=0;opts.cssBefore.height=0;};$.fn.cycle.transitions.fadeZoom=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,false,false);opts.cssBefore.left=next.cycleW/2;opts.cssBefore.top=next.cycleH/2;$.extend(opts.animIn,{top:0,left:0,width:next.cycleW,height:next.cycleH});});opts.cssBefore.width=0;opts.cssBefore.height=0;opts.animOut.opacity=0;};$.fn.cycle.transitions.blindX=function($cont,$slides,opts){var w=$cont.css("overflow","hidden").width();opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts);opts.animIn.width=next.cycleW;opts.animOut.left=curr.cycleW;});opts.cssBefore.left=w;opts.cssBefore.top=0;opts.animIn.left=0;opts.animOut.left=w;};$.fn.cycle.transitions.blindY=function($cont,$slides,opts){var h=$cont.css("overflow","hidden").height();opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts);opts.animIn.height=next.cycleH;opts.animOut.top=curr.cycleH;});opts.cssBefore.top=h;opts.cssBefore.left=0;opts.animIn.top=0;opts.animOut.top=h;};$.fn.cycle.transitions.blindZ=function($cont,$slides,opts){var h=$cont.css("overflow","hidden").height();var w=$cont.width();opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts);opts.animIn.height=next.cycleH;opts.animOut.top=curr.cycleH;});opts.cssBefore.top=h;opts.cssBefore.left=w;opts.animIn.top=0;opts.animIn.left=0;opts.animOut.top=h;opts.animOut.left=w;};$.fn.cycle.transitions.growX=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,false,true);opts.cssBefore.left=this.cycleW/2;opts.animIn.left=0;opts.animIn.width=this.cycleW;opts.animOut.left=0;});opts.cssBefore.top=0;opts.cssBefore.width=0;};$.fn.cycle.transitions.growY=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,true,false);opts.cssBefore.top=this.cycleH/2;opts.animIn.top=0;opts.animIn.height=this.cycleH;opts.animOut.top=0;});opts.cssBefore.height=0;opts.cssBefore.left=0;};$.fn.cycle.transitions.curtainX=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,false,true,true);opts.cssBefore.left=next.cycleW/2;opts.animIn.left=0;opts.animIn.width=this.cycleW;opts.animOut.left=curr.cycleW/2;opts.animOut.width=0;});opts.cssBefore.top=0;opts.cssBefore.width=0;};$.fn.cycle.transitions.curtainY=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,true,false,true);opts.cssBefore.top=next.cycleH/2;opts.animIn.top=0;opts.animIn.height=next.cycleH;opts.animOut.top=curr.cycleH/2;opts.animOut.height=0;});opts.cssBefore.height=0;opts.cssBefore.left=0;};$.fn.cycle.transitions.cover=function($cont,$slides,opts){var d=opts.direction||"left";var w=$cont.css("overflow","hidden").width();var h=$cont.height();opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts);if(d=="right"){opts.cssBefore.left=-w;}else{if(d=="up"){opts.cssBefore.top=h;}else{if(d=="down"){opts.cssBefore.top=-h;}else{opts.cssBefore.left=w;}}}});opts.animIn.left=0;opts.animIn.top=0;opts.cssBefore.top=0;opts.cssBefore.left=0;};$.fn.cycle.transitions.uncover=function($cont,$slides,opts){var d=opts.direction||"left";var w=$cont.css("overflow","hidden").width();var h=$cont.height();opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,true,true,true);if(d=="right"){opts.animOut.left=w;}else{if(d=="up"){opts.animOut.top=-h;}else{if(d=="down"){opts.animOut.top=h;}else{opts.animOut.left=-w;}}}});opts.animIn.left=0;opts.animIn.top=0;opts.cssBefore.top=0;opts.cssBefore.left=0;};$.fn.cycle.transitions.toss=function($cont,$slides,opts){var w=$cont.css("overflow","visible").width();var h=$cont.height();opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,true,true,true);if(!opts.animOut.left&&!opts.animOut.top){$.extend(opts.animOut,{left:w*2,top:-h/2,opacity:0});}else{opts.animOut.opacity=0;}});opts.cssBefore.left=0;opts.cssBefore.top=0;opts.animIn.left=0;};$.fn.cycle.transitions.wipe=function($cont,$slides,opts){var w=$cont.css("overflow","hidden").width();var h=$cont.height();opts.cssBefore=opts.cssBefore||{};var clip;if(opts.clip){if(/l2r/.test(opts.clip)){clip="rect(0px 0px "+h+"px 0px)";}else{if(/r2l/.test(opts.clip)){clip="rect(0px "+w+"px "+h+"px "+w+"px)";}else{if(/t2b/.test(opts.clip)){clip="rect(0px "+w+"px 0px 0px)";}else{if(/b2t/.test(opts.clip)){clip="rect("+h+"px "+w+"px "+h+"px 0px)";}else{if(/zoom/.test(opts.clip)){var top=parseInt(h/2);var left=parseInt(w/2);clip="rect("+top+"px "+left+"px "+top+"px "+left+"px)";}}}}}}opts.cssBefore.clip=opts.cssBefore.clip||clip||"rect(0px 0px 0px 0px)";var d=opts.cssBefore.clip.match(/(\d+)/g);var t=parseInt(d[0]),r=parseInt(d[1]),b=parseInt(d[2]),l=parseInt(d[3]);opts.before.push(function(curr,next,opts){if(curr==next){return;}var $curr=$(curr),$next=$(next);$.fn.cycle.commonReset(curr,next,opts,true,true,false);opts.cssAfter.display="block";var step=1,count=parseInt((opts.speedIn/13))-1;(function f(){var tt=t?t-parseInt(step*(t/count)):0;var ll=l?l-parseInt(step*(l/count)):0;var bb=b<h?b+parseInt(step*((h-b)/count||1)):h;var rr=r<w?r+parseInt(step*((w-r)/count||1)):w;$next.css({clip:"rect("+tt+"px "+rr+"px "+bb+"px "+ll+"px)"});(step++<=count)?setTimeout(f,13):$curr.css("display","none");})();});$.extend(opts.cssBefore,{display:"block",opacity:1,top:0,left:0});opts.animIn={left:0};opts.animOut={left:0};};})(jQuery);;
/*
    http://www.JSON.org/json2.js
    2011-02-23

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
;

/**
 *  @file
 *  A simple jQuery Cycle Div Slideshow Rotator.
 */

/**
 * This will set our initial behavior, by starting up each individual slideshow.
 */
(function ($) {
  Drupal.behaviors.viewsSlideshowCycle = {
    attach: function (context) {
      $('.views_slideshow_cycle_main:not(.viewsSlideshowCycle-processed)', context).addClass('viewsSlideshowCycle-processed').each(function() {
        var fullId = '#' + $(this).attr('id');
        var settings = Drupal.settings.viewsSlideshowCycle[fullId];
        settings.targetId = '#' + $(fullId + " :first").attr('id');
        settings.slideshowId = settings.targetId.replace('#views_slideshow_cycle_teaser_section_', '');
        settings.paused = false;

        settings.opts = {
          speed:settings.speed,
          timeout:settings.timeout,
          delay:settings.delay,
          sync:settings.sync,
          random:settings.random,
          nowrap:settings.nowrap,
          after:function(curr, next, opts) {
            // Need to do some special handling on first load.
            var slideNum = opts.currSlide;
            if (typeof settings.processedAfter == 'undefined' || !settings.processedAfter) {
              settings.processedAfter = 1;
              slideNum = (typeof settings.opts.startingSlide == 'undefined') ? 0 : settings.opts.startingSlide;
            }
            Drupal.viewsSlideshow.action({ "action": 'transitionEnd', "slideshowID": settings.slideshowId, "slideNum": slideNum });
          },
          before:function(curr, next, opts) {
            // Remember last slide.
            if (settings.remember_slide) {
              createCookie(settings.vss_id, opts.currSlide + 1, settings.remember_slide_days);
            }

            // Make variable height.
            if (!settings.fixed_height) {
              //get the height of the current slide
              var $ht = $(this).height();
              //set the container's height to that of the current slide
              $(this).parent().animate({height: $ht});
            }

            // Need to do some special handling on first load.
            var slideNum = opts.nextSlide;
            if (typeof settings.processedBefore == 'undefined' || !settings.processedBefore) {
              settings.processedBefore = 1;
              slideNum = (typeof settings.opts.startingSlide == 'undefined') ? 0 : settings.opts.startingSlide;
            }

            Drupal.viewsSlideshow.action({ "action": 'transitionBegin', "slideshowID": settings.slideshowId, "slideNum": slideNum });
          },
          cleartype:(settings.cleartype)? true : false,
          cleartypeNoBg:(settings.cleartypenobg)? true : false
        }

        // Set the starting slide if we are supposed to remember the slide
        if (settings.remember_slide) {
          var startSlide = readCookie(settings.vss_id);
          if (startSlide == null) {
            startSlide = 0;
          }
          settings.opts.startingSlide =  startSlide;
        }

        if (settings.effect == 'none') {
          settings.opts.speed = 1;
        }
        else {
          settings.opts.fx = settings.effect;
        }

        // Take starting item from fragment.
        var hash = location.hash;
        if (hash) {
          var hash = hash.replace('#', '');
          var aHash = hash.split(';');
          var aHashLen = aHash.length;

          // Loop through all the possible starting points.
          for (var i = 0; i < aHashLen; i++) {
            // Split the hash into two parts. One part is the slideshow id the
            // other is the slide number.
            var initialInfo = aHash[i].split(':');
            // The id in the hash should match our slideshow.
            // The slide number chosen shouldn't be larger than the number of
            // slides we have.
            if (settings.slideshowId == initialInfo[0] && settings.num_divs > initialInfo[1]) {
              settings.opts.startingSlide = parseInt(initialInfo[1]);
            }
          }
        }

        // Pause on hover.
        if (settings.pause) {
          $('#views_slideshow_cycle_teaser_section_' + settings.vss_id).hover(function() {
            Drupal.viewsSlideshow.action({ "action": 'pause', "slideshowID": settings.slideshowId });
          }, function() {
            if (!settings.paused) {
              Drupal.viewsSlideshow.action({ "action": 'play', "slideshowID": settings.slideshowId });
            }
          });
        }

        // Pause on clicking of the slide.
        if (settings.pause_on_click) {
          $('#views_slideshow_cycle_teaser_section_' + settings.vss_id).click(function() {
            settings.paused = true;
            Drupal.viewsSlideshow.action({ "action": 'pause', "slideshowID": settings.slideshowId });
          });
        }

        if (typeof JSON != 'undefined') {
          var advancedOptions = JSON.parse(settings.advanced_options);
          for (var option in advancedOptions) {
            advancedOptions[option] = $.trim(advancedOptions[option]);
            advancedOptions[option] = advancedOptions[option].replace(/\n/g, '');
            if (!isNaN(parseInt(advancedOptions[option]))) {
              advancedOptions[option] = parseInt(advancedOptions[option]);
            }
            else if (advancedOptions[option].toLowerCase() == 'true') {
              advancedOptions[option] = true;
            }
            else if (advancedOptions[option].toLowerCase() == 'false') {
              advancedOptions[option] = false;
            }

            switch(option) {

              // Standard Options
              case "activePagerClass":
              case "allowPagerClickBubble":
              case "autostop":
              case "autostopCount":
              case "backwards":
              case "bounce":
              case "cleartype":
              case "cleartypeNoBg":
              case "containerResize":
              case "continuous":
              case "delay":
              case "easeIn":
              case "easeOut":
              case "easing":
              case "fastOnEvent":
              case "fit":
              case "fx":
              case "height":
              case "manualTrump":
              case "next":
              case "nowrap":
              case "pager":
              case "pagerEvent":
              case "pause":
              case "pauseOnPagerHover":
              case "prev":
              case "prevNextEvent":
              case "random":
              case "randomizeEffects":
              case "requeueOnImageNotLoaded":
              case "requeueTimeout":
              case "rev":
              case "slideExpr":
              case "slideResize":
              case "speed":
              case "speedIn":
              case "speedOut":
              case "startingSlide":
              case "sync":
              case "timeout":
                settings.opts[option] = advancedOptions[option];
                break;

              // These process options that look like {top:50, bottom:20}
              case "animIn":
              case "animOut":
              case "cssBefore":
              case "cssAfter":
              case "shuffle":
                settings.opts[option] = eval('(' + advancedOptions[option] + ')');
                break;

              // These options have their own functions.
              case "after":
                // transition callback (scope set to element that was shown): function(currSlideElement, nextSlideElement, options, forwardFlag)
                settings.opts[option] = function(currSlideElement, nextSlideElement, options, forwardFlag) {
                  eval(advancedOptions[option]);
                }
                break;

              case "before":
                // transition callback (scope set to element to be shown):     function(currSlideElement, nextSlideElement, options, forwardFlag)
                settings.opts[option] = function(currSlideElement, nextSlideElement, options, forwardFlag) {
                  eval(advancedOptions[option]);
                }
                break;

              case "end":
                // callback invoked when the slideshow terminates (use with autostop or nowrap options): function(options)
                settings.opts[option] = function(options) {
                  eval(advancedOptions[option]);
                }
                break;

              case "fxFn":
                // function used to control the transition: function(currSlideElement, nextSlideElement, options, afterCalback, forwardFlag)
                settings.opts[option] = function(currSlideElement, nextSlideElement, options, afterCalback, forwardFlag) {
                  eval(advancedOptions[option]);
                }
                break;

              case "onPagerEvent":
                settings.opts[option] = function(zeroBasedSlideIndex, slideElement) {
                  eval(advancedOptions[option]);
                }
                break;

              case "onPrevNextEvent":
                settings.opts[option] = function(isNext, zeroBasedSlideIndex, slideElement) {
                  eval(advancedOptions[option]);
                }
                break;

              case "pagerAnchorBuilder":
                // callback fn for building anchor links:  function(index, DOMelement)
                settings.opts[option] = function(index, DOMelement) {
                  var returnVal = '';
                  eval(advancedOptions[option]);
                  return returnVal;
                }
                break;

              case "pagerClick":
                // callback fn for pager clicks:    function(zeroBasedSlideIndex, slideElement)
                settings.opts[option] = function(zeroBasedSlideIndex, slideElement) {
                  eval(advancedOptions[option]);
                }
                break;

              case "timeoutFn":
                settings.opts[option] = function(currSlideElement, nextSlideElement, options, forwardFlag) {
                  eval(advancedOptions[option]);
                }
                break;

              case "updateActivePagerLink":
                // callback fn invoked to update the active pager link (adds/removes activePagerClass style)
                settings.opts[option] = function(pager, currSlideIndex) {
                  eval(advancedOptions[option]);
                }
                break;
            }
          }
        }

        // If selected wait for the images to be loaded.
        // otherwise just load the slideshow.
        if (settings.wait_for_image_load) {
          // For IE/Chrome/Opera we if there are images then we need to make
          // sure the images are loaded before starting the slideshow.
          settings.totalImages = $(settings.targetId + ' img').length;
          if (settings.totalImages) {
            settings.loadedImages = 0;

            // Add a load event for each image.
            $(settings.targetId + ' img').each(function() {
              var $imageElement = $(this);
              $imageElement.bind('load', function () {
                Drupal.viewsSlideshowCycle.imageWait(fullId);
              });

              // Removing the source and adding it again will fire the load event.
              var imgSrc = $imageElement.attr('src');
              $imageElement.attr('src', '');
              $imageElement.attr('src', imgSrc);
            });
          }
          else {
            Drupal.viewsSlideshowCycle.load(fullId);
          }
        }
        else {
          Drupal.viewsSlideshowCycle.load(fullId);
        }
      });
    }
  };

  Drupal.viewsSlideshowCycle = Drupal.viewsSlideshowCycle || {};

  // This checks to see if all the images have been loaded.
  // If they have then it starts the slideshow.
  Drupal.viewsSlideshowCycle.imageWait = function(fullId) {
    if (++Drupal.settings.viewsSlideshowCycle[fullId].loadedImages == Drupal.settings.viewsSlideshowCycle[fullId].totalImages) {
      Drupal.viewsSlideshowCycle.load(fullId);
    }
  };

  // Start the slideshow.
  Drupal.viewsSlideshowCycle.load = function (fullId) {
    var settings = Drupal.settings.viewsSlideshowCycle[fullId];
    $(settings.targetId).cycle(settings.opts);

    // Start Paused
    if (settings.start_paused) {
      Drupal.viewsSlideshow.action({ "action": 'pause', "slideshowID": settings.slideshowId });
    }

    // Pause if hidden.
    if (settings.pause_when_hidden) {
      var checkPause = function(settings) {
        // If the slideshow is visible and it is paused then resume.
        // otherwise if the slideshow is not visible and it is not paused then
        // pause it.
        var visible = viewsSlideshowCycleIsVisible(settings.targetId, settings.pause_when_hidden_type, settings.amount_allowed_visible);
        if (visible && settings.paused) {
          Drupal.viewsSlideshow.action({ "action": 'play', "slideshowID": settings.slideshowId });
        }
        else if (!visible && !settings.paused) {
          Drupal.viewsSlideshow.action({ "action": 'pause', "slideshowID": settings.slideshowId });
        }
      }

      // Check when scrolled.
      $(window).scroll(function() {
       checkPause(settings);
      });

      // Check when the window is resized.
      $(window).resize(function() {
        checkPause(settings);
      });
    }
  };

  Drupal.viewsSlideshowCycle.pause = function (options) {
    $('#views_slideshow_cycle_teaser_section_' + options.slideshowID).cycle('pause');
  };

  Drupal.viewsSlideshowCycle.play = function (options) {
    Drupal.settings.viewsSlideshowCycle['#views_slideshow_cycle_main_' + options.slideshowID].paused = false;
    $('#views_slideshow_cycle_teaser_section_' + options.slideshowID).cycle('resume');
  };

  Drupal.viewsSlideshowCycle.previousSlide = function (options) {
    $('#views_slideshow_cycle_teaser_section_' + options.slideshowID).cycle('prev');
  };

  Drupal.viewsSlideshowCycle.nextSlide = function (options) {
    $('#views_slideshow_cycle_teaser_section_' + options.slideshowID).cycle('next');
  };

  Drupal.viewsSlideshowCycle.goToSlide = function (options) {
    $('#views_slideshow_cycle_teaser_section_' + options.slideshowID).cycle(options.slideNum);
  };

  // Verify that the value is a number.
  function IsNumeric(sText) {
    var ValidChars = "0123456789";
    var IsNumber=true;
    var Char;

    for (var i=0; i < sText.length && IsNumber == true; i++) {
      Char = sText.charAt(i);
      if (ValidChars.indexOf(Char) == -1) {
        IsNumber = false;
      }
    }
    return IsNumber;
  }

  /**
   * Cookie Handling Functions
   */
  function createCookie(name,value,days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    }
    else {
      var expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
  }

  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length,c.length);
      }
    }
    return null;
  }

  function eraseCookie(name) {
    createCookie(name,"",-1);
  }

  /**
   * Checks to see if the slide is visible enough.
   * elem = element to check.
   * type = The way to calculate how much is visible.
   * amountVisible = amount that should be visible. Either in percent or px. If
   *                it's not defined then all of the slide must be visible.
   *
   * Returns true or false
   */
  function viewsSlideshowCycleIsVisible(elem, type, amountVisible) {
    // Get the top and bottom of the window;
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var docViewLeft = $(window).scrollLeft();
    var docViewRight = docViewLeft + $(window).width();

    // Get the top, bottom, and height of the slide;
    var elemTop = $(elem).offset().top;
    var elemHeight = $(elem).height();
    var elemBottom = elemTop + elemHeight;
    var elemLeft = $(elem).offset().left;
    var elemWidth = $(elem).width();
    var elemRight = elemLeft + elemWidth;
    var elemArea = elemHeight * elemWidth;

    // Calculate what's hiding in the slide.
    var missingLeft = 0;
    var missingRight = 0;
    var missingTop = 0;
    var missingBottom = 0;

    // Find out how much of the slide is missing from the left.
    if (elemLeft < docViewLeft) {
      missingLeft = docViewLeft - elemLeft;
    }

    // Find out how much of the slide is missing from the right.
    if (elemRight > docViewRight) {
      missingRight = elemRight - docViewRight;
    }

    // Find out how much of the slide is missing from the top.
    if (elemTop < docViewTop) {
      missingTop = docViewTop - elemTop;
    }

    // Find out how much of the slide is missing from the bottom.
    if (elemBottom > docViewBottom) {
      missingBottom = elemBottom - docViewBottom;
    }

    // If there is no amountVisible defined then check to see if the whole slide
    // is visible.
    if (type == 'full') {
      return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
      && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop)
      && (elemLeft >= docViewLeft) && (elemRight <= docViewRight)
      && (elemLeft <= docViewRight) && (elemRight >= docViewLeft));
    }
    else if(type == 'vertical') {
      var verticalShowing = elemHeight - missingTop - missingBottom;

      // If user specified a percentage then find out if the current shown percent
      // is larger than the allowed percent.
      // Otherwise check to see if the amount of px shown is larger than the
      // allotted amount.
      if (amountVisible.indexOf('%')) {
        return (((verticalShowing/elemHeight)*100) >= parseInt(amountVisible));
      }
      else {
        return (verticalShowing >= parseInt(amountVisible));
      }
    }
    else if(type == 'horizontal') {
      var horizontalShowing = elemWidth - missingLeft - missingRight;

      // If user specified a percentage then find out if the current shown percent
      // is larger than the allowed percent.
      // Otherwise check to see if the amount of px shown is larger than the
      // allotted amount.
      if (amountVisible.indexOf('%')) {
        return (((horizontalShowing/elemWidth)*100) >= parseInt(amountVisible));
      }
      else {
        return (horizontalShowing >= parseInt(amountVisible));
      }
    }
    else if(type == 'area') {
      var areaShowing = (elemWidth - missingLeft - missingRight) * (elemHeight - missingTop - missingBottom);

      // If user specified a percentage then find out if the current shown percent
      // is larger than the allowed percent.
      // Otherwise check to see if the amount of px shown is larger than the
      // allotted amount.
      if (amountVisible.indexOf('%')) {
        return (((areaShowing/elemArea)*100) >= parseInt(amountVisible));
      }
      else {
        return (areaShowing >= parseInt(amountVisible));
      }
    }
  }
})(jQuery);
;

/*!
 * jQuery Form Plugin
 * version: 2.52 (07-DEC-2010)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;(function(b){function q(){if(b.fn.ajaxSubmit.debug){var a="[jquery.form] "+Array.prototype.join.call(arguments,"");if(window.console&&window.console.log)window.console.log(a);else window.opera&&window.opera.postError&&window.opera.postError(a)}}b.fn.ajaxSubmit=function(a){function f(){function t(){var o=i.attr("target"),m=i.attr("action");l.setAttribute("target",u);l.getAttribute("method")!="POST"&&l.setAttribute("method","POST");l.getAttribute("action")!=e.url&&l.setAttribute("action",e.url);e.skipEncodingOverride|| i.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"});e.timeout&&setTimeout(function(){F=true;s()},e.timeout);var v=[];try{if(e.extraData)for(var w in e.extraData)v.push(b('<input type="hidden" name="'+w+'" value="'+e.extraData[w]+'" />').appendTo(l)[0]);r.appendTo("body");r.data("form-plugin-onload",s);l.submit()}finally{l.setAttribute("action",m);o?l.setAttribute("target",o):i.removeAttr("target");b(v).remove()}}function s(){if(!G){r.removeData("form-plugin-onload");var o=true; try{if(F)throw"timeout";p=x.contentWindow?x.contentWindow.document:x.contentDocument?x.contentDocument:x.document;var m=e.dataType=="xml"||p.XMLDocument||b.isXMLDoc(p);q("isXml="+m);if(!m&&window.opera&&(p.body==null||p.body.innerHTML==""))if(--K){q("requeing onLoad callback, DOM not available");setTimeout(s,250);return}G=true;j.responseText=p.documentElement?p.documentElement.innerHTML:null;j.responseXML=p.XMLDocument?p.XMLDocument:p;j.getResponseHeader=function(L){return{"content-type":e.dataType}[L]}; var v=/(json|script)/.test(e.dataType);if(v||e.textarea){var w=p.getElementsByTagName("textarea")[0];if(w)j.responseText=w.value;else if(v){var H=p.getElementsByTagName("pre")[0],I=p.getElementsByTagName("body")[0];if(H)j.responseText=H.textContent;else if(I)j.responseText=I.innerHTML}}else if(e.dataType=="xml"&&!j.responseXML&&j.responseText!=null)j.responseXML=C(j.responseText);J=b.httpData(j,e.dataType)}catch(D){q("error caught:",D);o=false;j.error=D;b.handleError(e,j,"error",D)}if(j.aborted){q("upload aborted"); o=false}if(o){e.success.call(e.context,J,"success",j);y&&b.event.trigger("ajaxSuccess",[j,e])}y&&b.event.trigger("ajaxComplete",[j,e]);y&&!--b.active&&b.event.trigger("ajaxStop");if(e.complete)e.complete.call(e.context,j,o?"success":"error");setTimeout(function(){r.removeData("form-plugin-onload");r.remove();j.responseXML=null},100)}}function C(o,m){if(window.ActiveXObject){m=new ActiveXObject("Microsoft.XMLDOM");m.async="false";m.loadXML(o)}else m=(new DOMParser).parseFromString(o,"text/xml");return m&& m.documentElement&&m.documentElement.tagName!="parsererror"?m:null}var l=i[0];if(b(":input[name=submit],:input[id=submit]",l).length)alert('Error: Form elements must not have name or id of "submit".');else{var e=b.extend(true,{},b.ajaxSettings,a);e.context=e.context||e;var u="jqFormIO"+(new Date).getTime(),E="_"+u;window[E]=function(){var o=r.data("form-plugin-onload");if(o){o();window[E]=undefined;try{delete window[E]}catch(m){}}};var r=b('<iframe id="'+u+'" name="'+u+'" src="'+e.iframeSrc+'" onload="window[\'_\'+this.id]()" />'), x=r[0];r.css({position:"absolute",top:"-1000px",left:"-1000px"});var j={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(){this.aborted=1;r.attr("src",e.iframeSrc)}},y=e.global;y&&!b.active++&&b.event.trigger("ajaxStart");y&&b.event.trigger("ajaxSend",[j,e]);if(e.beforeSend&&e.beforeSend.call(e.context,j,e)===false)e.global&&b.active--;else if(!j.aborted){var G=false, F=0,z=l.clk;if(z){var A=z.name;if(A&&!z.disabled){e.extraData=e.extraData||{};e.extraData[A]=z.value;if(z.type=="image"){e.extraData[A+".x"]=l.clk_x;e.extraData[A+".y"]=l.clk_y}}}e.forceSync?t():setTimeout(t,10);var J,p,K=50}}}if(!this.length){q("ajaxSubmit: skipping submit process - no element selected");return this}if(typeof a=="function")a={success:a};var d=this.attr("action");if(d=typeof d==="string"?b.trim(d):"")d=(d.match(/^([^#]+)/)||[])[1];d=d||window.location.href||"";a=b.extend(true,{url:d, type:this.attr("method")||"GET",iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},a);d={};this.trigger("form-pre-serialize",[this,a,d]);if(d.veto){q("ajaxSubmit: submit vetoed via form-pre-serialize trigger");return this}if(a.beforeSerialize&&a.beforeSerialize(this,a)===false){q("ajaxSubmit: submit aborted via beforeSerialize callback");return this}var c,h,g=this.formToArray(a.semantic);if(a.data){a.extraData=a.data;for(c in a.data)if(a.data[c]instanceof Array)for(var k in a.data[c])g.push({name:c, value:a.data[c][k]});else{h=a.data[c];h=b.isFunction(h)?h():h;g.push({name:c,value:h})}}if(a.beforeSubmit&&a.beforeSubmit(g,this,a)===false){q("ajaxSubmit: submit aborted via beforeSubmit callback");return this}this.trigger("form-submit-validate",[g,this,a,d]);if(d.veto){q("ajaxSubmit: submit vetoed via form-submit-validate trigger");return this}c=b.param(g);if(a.type.toUpperCase()=="GET"){a.url+=(a.url.indexOf("?")>=0?"&":"?")+c;a.data=null}else a.data=c;var i=this,n=[];a.resetForm&&n.push(function(){i.resetForm()}); a.clearForm&&n.push(function(){i.clearForm()});if(!a.dataType&&a.target){var B=a.success||function(){};n.push(function(t){var s=a.replaceTarget?"replaceWith":"html";b(a.target)[s](t).each(B,arguments)})}else a.success&&n.push(a.success);a.success=function(t,s,C){for(var l=a.context||a,e=0,u=n.length;e<u;e++)n[e].apply(l,[t,s,C||i,i])};c=b("input:file",this).length>0;k=i.attr("enctype")=="multipart/form-data"||i.attr("encoding")=="multipart/form-data";if(a.iframe!==false&&(c||a.iframe||k))a.closeKeepAlive? b.get(a.closeKeepAlive,f):f();else b.ajax(a);this.trigger("form-submit-notify",[this,a]);return this};b.fn.ajaxForm=function(a){if(this.length===0){var f={s:this.selector,c:this.context};if(!b.isReady&&f.s){q("DOM not ready, queuing ajaxForm");b(function(){b(f.s,f.c).ajaxForm(a)});return this}q("terminating; zero elements found by selector"+(b.isReady?"":" (DOM not ready)"));return this}return this.ajaxFormUnbind().bind("submit.form-plugin",function(d){if(!d.isDefaultPrevented()){d.preventDefault(); b(this).ajaxSubmit(a)}}).bind("click.form-plugin",function(d){var c=d.target,h=b(c);if(!h.is(":submit,input:image")){c=h.closest(":submit");if(c.length==0)return;c=c[0]}var g=this;g.clk=c;if(c.type=="image")if(d.offsetX!=undefined){g.clk_x=d.offsetX;g.clk_y=d.offsetY}else if(typeof b.fn.offset=="function"){h=h.offset();g.clk_x=d.pageX-h.left;g.clk_y=d.pageY-h.top}else{g.clk_x=d.pageX-c.offsetLeft;g.clk_y=d.pageY-c.offsetTop}setTimeout(function(){g.clk=g.clk_x=g.clk_y=null},100)})};b.fn.ajaxFormUnbind= function(){return this.unbind("submit.form-plugin click.form-plugin")};b.fn.formToArray=function(a){var f=[];if(this.length===0)return f;var d=this[0],c=a?d.getElementsByTagName("*"):d.elements;if(!c)return f;var h,g,k,i,n,B;h=0;for(n=c.length;h<n;h++){g=c[h];if(k=g.name)if(a&&d.clk&&g.type=="image"){if(!g.disabled&&d.clk==g){f.push({name:k,value:b(g).val()});f.push({name:k+".x",value:d.clk_x},{name:k+".y",value:d.clk_y})}}else if((i=b.fieldValue(g,true))&&i.constructor==Array){g=0;for(B=i.length;g< B;g++)f.push({name:k,value:i[g]})}else i!==null&&typeof i!="undefined"&&f.push({name:k,value:i})}if(!a&&d.clk){a=b(d.clk);c=a[0];if((k=c.name)&&!c.disabled&&c.type=="image"){f.push({name:k,value:a.val()});f.push({name:k+".x",value:d.clk_x},{name:k+".y",value:d.clk_y})}}return f};b.fn.formSerialize=function(a){return b.param(this.formToArray(a))};b.fn.fieldSerialize=function(a){var f=[];this.each(function(){var d=this.name;if(d){var c=b.fieldValue(this,a);if(c&&c.constructor==Array)for(var h=0,g=c.length;h< g;h++)f.push({name:d,value:c[h]});else c!==null&&typeof c!="undefined"&&f.push({name:this.name,value:c})}});return b.param(f)};b.fn.fieldValue=function(a){for(var f=[],d=0,c=this.length;d<c;d++){var h=b.fieldValue(this[d],a);h===null||typeof h=="undefined"||h.constructor==Array&&!h.length||(h.constructor==Array?b.merge(f,h):f.push(h))}return f};b.fieldValue=function(a,f){var d=a.name,c=a.type,h=a.tagName.toLowerCase();if(f===undefined)f=true;if(f&&(!d||a.disabled||c=="reset"||c=="button"||(c=="checkbox"|| c=="radio")&&!a.checked||(c=="submit"||c=="image")&&a.form&&a.form.clk!=a||h=="select"&&a.selectedIndex==-1))return null;if(h=="select"){var g=a.selectedIndex;if(g<0)return null;d=[];h=a.options;var k=(c=c=="select-one")?g+1:h.length;for(g=c?g:0;g<k;g++){var i=h[g];if(i.selected){var n=i.value;n||(n=i.attributes&&i.attributes.value&&!i.attributes.value.specified?i.text:i.value);if(c)return n;d.push(n)}}return d}return b(a).val()};b.fn.clearForm=function(){return this.each(function(){b("input,select,textarea", this).clearFields()})};b.fn.clearFields=b.fn.clearInputs=function(){return this.each(function(){var a=this.type,f=this.tagName.toLowerCase();if(a=="text"||a=="password"||f=="textarea")this.value="";else if(a=="checkbox"||a=="radio")this.checked=false;else if(f=="select")this.selectedIndex=-1})};b.fn.resetForm=function(){return this.each(function(){if(typeof this.reset=="function"||typeof this.reset=="object"&&!this.reset.nodeType)this.reset()})};b.fn.enable=function(a){if(a===undefined)a=true;return this.each(function(){this.disabled= !a})};b.fn.selected=function(a){if(a===undefined)a=true;return this.each(function(){var f=this.type;if(f=="checkbox"||f=="radio")this.checked=a;else if(this.tagName.toLowerCase()=="option"){f=b(this).parent("select");a&&f[0]&&f[0].type=="select-one"&&f.find("option").selected(false);this.selected=a}})}})(jQuery);;
(function ($) {

/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);
;
(function ($) {

/**
 * Provides Ajax page updating via jQuery $.ajax (Asynchronous JavaScript and XML).
 *
 * Ajax is a method of making a request via JavaScript while viewing an HTML
 * page. The request returns an array of commands encoded in JSON, which is
 * then executed to make any changes that are necessary to the page.
 *
 * Drupal uses this file to enhance form elements with #ajax['path'] and
 * #ajax['wrapper'] properties. If set, this file will automatically be included
 * to provide Ajax capabilities.
 */

Drupal.ajax = Drupal.ajax || {};

/**
 * Attaches the Ajax behavior to each Ajax form element.
 */
Drupal.behaviors.AJAX = {
  attach: function (context, settings) {
    // Load all Ajax behaviors specified in the settings.
    for (var base in settings.ajax) {
      if (!$('#' + base + '.ajax-processed').length) {
        var element_settings = settings.ajax[base];

        if (typeof element_settings.selector == 'undefined') {
          element_settings.selector = '#' + base;
        }
        $(element_settings.selector).each(function () {
          element_settings.element = this;
          Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
        });

        $('#' + base).addClass('ajax-processed');
      }
    }

    // Bind Ajax behaviors to all items showing the class.
    $('.use-ajax:not(.ajax-processed)').addClass('ajax-processed').each(function () {
      var element_settings = {};
      // Clicked links look better with the throbber than the progress bar.
      element_settings.progress = { 'type': 'throbber' };

      // For anchor tags, these will go to the target of the anchor rather
      // than the usual location.
      if ($(this).attr('href')) {
        element_settings.url = $(this).attr('href');
        element_settings.event = 'click';
      }
      var base = $(this).attr('id');
      Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
    });

    // This class means to submit the form to the action using Ajax.
    $('.use-ajax-submit:not(.ajax-processed)').addClass('ajax-processed').each(function () {
      var element_settings = {};

      // Ajax submits specified in this manner automatically submit to the
      // normal form action.
      element_settings.url = $(this.form).attr('action');
      // Form submit button clicks need to tell the form what was clicked so
      // it gets passed in the POST request.
      element_settings.setClick = true;
      // Form buttons use the 'click' event rather than mousedown.
      element_settings.event = 'click';
      // Clicked form buttons look better with the throbber than the progress bar.
      element_settings.progress = { 'type': 'throbber' };

      var base = $(this).attr('id');
      Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
    });
  }
};

/**
 * Ajax object.
 *
 * All Ajax objects on a page are accessible through the global Drupal.ajax
 * object and are keyed by the submit button's ID. You can access them from
 * your module's JavaScript file to override properties or functions.
 *
 * For example, if your Ajax enabled button has the ID 'edit-submit', you can
 * redefine the function that is called to insert the new content like this
 * (inside a Drupal.behaviors attach block):
 * @code
 *    Drupal.behaviors.myCustomAJAXStuff = {
 *      attach: function (context, settings) {
 *        Drupal.ajax['edit-submit'].commands.insert = function (ajax, response, status) {
 *          new_content = $(response.data);
 *          $('#my-wrapper').append(new_content);
 *          alert('New content was appended to #my-wrapper');
 *        }
 *      }
 *    };
 * @endcode
 */
Drupal.ajax = function (base, element, element_settings) {
  var defaults = {
    url: 'system/ajax',
    event: 'mousedown',
    keypress: true,
    selector: '#' + base,
    effect: 'none',
    speed: 'none',
    method: 'replaceWith',
    progress: {
      type: 'throbber',
      message: Drupal.t('Please wait...')
    },
    submit: {
      'js': true
    }
  };

  $.extend(this, defaults, element_settings);

  this.element = element;
  this.element_settings = element_settings;

  // Replacing 'nojs' with 'ajax' in the URL allows for an easy method to let
  // the server detect when it needs to degrade gracefully.
  // There are five scenarios to check for:
  // 1. /nojs/
  // 2. /nojs$ - The end of a URL string.
  // 3. /nojs? - Followed by a query (with clean URLs enabled).
  //      E.g.: path/nojs?destination=foobar
  // 4. /nojs& - Followed by a query (without clean URLs enabled).
  //      E.g.: ?q=path/nojs&destination=foobar
  // 5. /nojs# - Followed by a fragment.
  //      E.g.: path/nojs#myfragment
  this.url = element_settings.url.replace(/\/nojs(\/|$|\?|&|#)/g, '/ajax$1');
  this.wrapper = '#' + element_settings.wrapper;

  // If there isn't a form, jQuery.ajax() will be used instead, allowing us to
  // bind Ajax to links as well.
  if (this.element.form) {
    this.form = $(this.element.form);
  }

  // Set the options for the ajaxSubmit function.
  // The 'this' variable will not persist inside of the options object.
  var ajax = this;
  ajax.options = {
    url: ajax.url,
    data: ajax.submit,
    beforeSerialize: function (element_settings, options) {
      return ajax.beforeSerialize(element_settings, options);
    },
    beforeSubmit: function (form_values, element_settings, options) {
      ajax.ajaxing = true;
      return ajax.beforeSubmit(form_values, element_settings, options);
    },
    beforeSend: function (xmlhttprequest, options) {
      ajax.ajaxing = true;
      return ajax.beforeSend(xmlhttprequest, options);
    },
    success: function (response, status) {
      // Sanity check for browser support (object expected).
      // When using iFrame uploads, responses must be returned as a string.
      if (typeof response == 'string') {
        response = $.parseJSON(response);
      }
      return ajax.success(response, status);
    },
    complete: function (response, status) {
      ajax.ajaxing = false;
      if (status == 'error' || status == 'parsererror') {
        return ajax.error(response, ajax.url);
      }
    },
    dataType: 'json',
    type: 'POST'
  };

  // Bind the ajaxSubmit function to the element event.
  $(ajax.element).bind(element_settings.event, function (event) {
    return ajax.eventResponse(this, event);
  });

  // If necessary, enable keyboard submission so that Ajax behaviors
  // can be triggered through keyboard input as well as e.g. a mousedown
  // action.
  if (element_settings.keypress) {
    $(element_settings.element).keypress(function (event) {
      return ajax.keypressResponse(this, event);
    });
  }
};

/**
 * Handle a key press.
 *
 * The Ajax object will, if instructed, bind to a key press response. This
 * will test to see if the key press is valid to trigger this event and
 * if it is, trigger it for us and prevent other keypresses from triggering.
 * In this case we're handling RETURN and SPACEBAR keypresses (event codes 13
 * and 32. RETURN is often used to submit a form when in a textfield, and 
 * SPACE is often used to activate an element without submitting. 
 */
Drupal.ajax.prototype.keypressResponse = function (element, event) {
  // Create a synonym for this to reduce code confusion.
  var ajax = this;

  // Detect enter key and space bar and allow the standard response for them,
  // except for form elements of type 'text' and 'textarea', where the 
  // spacebar activation causes inappropriate activation if #ajax['keypress'] is 
  // TRUE. On a text-type widget a space should always be a space.
  if (event.which == 13 || (event.which == 32 && element.type != 'text' && element.type != 'textarea')) {
    $(ajax.element_settings.element).trigger(ajax.element_settings.event);
    return false;
  }
};

/**
 * Handle an event that triggers an Ajax response.
 *
 * When an event that triggers an Ajax response happens, this method will
 * perform the actual Ajax call. It is bound to the event using
 * bind() in the constructor, and it uses the options specified on the
 * ajax object.
 */
Drupal.ajax.prototype.eventResponse = function (element, event) {
  // Create a synonym for this to reduce code confusion.
  var ajax = this;

  // Do not perform another ajax command if one is already in progress.
  if (ajax.ajaxing) {
    return false;
  }

  try {
    if (ajax.form) {
      // If setClick is set, we must set this to ensure that the button's
      // value is passed.
      if (ajax.setClick) {
        // Mark the clicked button. 'form.clk' is a special variable for
        // ajaxSubmit that tells the system which element got clicked to
        // trigger the submit. Without it there would be no 'op' or
        // equivalent.
        element.form.clk = element;
      }

      ajax.form.ajaxSubmit(ajax.options);
    }
    else {
      ajax.beforeSerialize(ajax.element, ajax.options);
      $.ajax(ajax.options);
    }
  }
  catch (e) {
    // Unset the ajax.ajaxing flag here because it won't be unset during
    // the complete response.
    ajax.ajaxing = false;
    alert("An error occurred while attempting to process " + ajax.options.url + ": " + e.message);
  }

  // For radio/checkbox, allow the default event. On IE, this means letting
  // it actually check the box.
  if (typeof element.type != 'undefined' && (element.type == 'checkbox' || element.type == 'radio')) {
    return true;
  }
  else {
    return false;
  }

};

/**
 * Handler for the form serialization.
 *
 * Runs before the beforeSend() handler (see below), and unlike that one, runs
 * before field data is collected.
 */
Drupal.ajax.prototype.beforeSerialize = function (element, options) {
  // Allow detaching behaviors to update field values before collecting them.
  // This is only needed when field values are added to the POST data, so only
  // when there is a form such that this.form.ajaxSubmit() is used instead of
  // $.ajax(). When there is no form and $.ajax() is used, beforeSerialize()
  // isn't called, but don't rely on that: explicitly check this.form.
  if (this.form) {
    var settings = this.settings || Drupal.settings;
    Drupal.detachBehaviors(this.form, settings, 'serialize');
  }

  // Prevent duplicate HTML ids in the returned markup.
  // @see drupal_html_id()
  options.data['ajax_html_ids[]'] = [];
  $('[id]').each(function () {
    options.data['ajax_html_ids[]'].push(this.id);
  });

  // Allow Drupal to return new JavaScript and CSS files to load without
  // returning the ones already loaded.
  // @see ajax_base_page_theme()
  // @see drupal_get_css()
  // @see drupal_get_js()
  options.data['ajax_page_state[theme]'] = Drupal.settings.ajaxPageState.theme;
  options.data['ajax_page_state[theme_token]'] = Drupal.settings.ajaxPageState.theme_token;
  for (var key in Drupal.settings.ajaxPageState.css) {
    options.data['ajax_page_state[css][' + key + ']'] = 1;
  }
  for (var key in Drupal.settings.ajaxPageState.js) {
    options.data['ajax_page_state[js][' + key + ']'] = 1;
  }
};

/**
 * Modify form values prior to form submission.
 */
Drupal.ajax.prototype.beforeSubmit = function (form_values, element, options) {
  // This function is left empty to make it simple to override for modules
  // that wish to add functionality here.
}

/**
 * Prepare the Ajax request before it is sent.
 */
Drupal.ajax.prototype.beforeSend = function (xmlhttprequest, options) {
  // For forms without file inputs, the jQuery Form plugin serializes the form
  // values, and then calls jQuery's $.ajax() function, which invokes this
  // handler. In this circumstance, options.extraData is never used. For forms
  // with file inputs, the jQuery Form plugin uses the browser's normal form
  // submission mechanism, but captures the response in a hidden IFRAME. In this
  // circumstance, it calls this handler first, and then appends hidden fields
  // to the form to submit the values in options.extraData. There is no simple
  // way to know which submission mechanism will be used, so we add to extraData
  // regardless, and allow it to be ignored in the former case.
  if (this.form) {
    options.extraData = options.extraData || {};

    // Let the server know when the IFRAME submission mechanism is used. The
    // server can use this information to wrap the JSON response in a TEXTAREA,
    // as per http://jquery.malsup.com/form/#file-upload.
    options.extraData.ajax_iframe_upload = '1';

    // The triggering element is about to be disabled (see below), but if it
    // contains a value (e.g., a checkbox, textfield, select, etc.), ensure that
    // value is included in the submission. As per above, submissions that use
    // $.ajax() are already serialized prior to the element being disabled, so
    // this is only needed for IFRAME submissions.
    var v = $.fieldValue(this.element);
    if (v !== null) {
      options.extraData[this.element.name] = v;
    }
  }

  // Disable the element that received the change to prevent user interface
  // interaction while the Ajax request is in progress. ajax.ajaxing prevents
  // the element from triggering a new request, but does not prevent the user
  // from changing its value.
  $(this.element).addClass('progress-disabled').attr('disabled', true);

  // Insert progressbar or throbber.
  if (this.progress.type == 'bar') {
    var progressBar = new Drupal.progressBar('ajax-progress-' + this.element.id, eval(this.progress.update_callback), this.progress.method, eval(this.progress.error_callback));
    if (this.progress.message) {
      progressBar.setProgress(-1, this.progress.message);
    }
    if (this.progress.url) {
      progressBar.startMonitoring(this.progress.url, this.progress.interval || 1500);
    }
    this.progress.element = $(progressBar.element).addClass('ajax-progress ajax-progress-bar');
    this.progress.object = progressBar;
    $(this.element).after(this.progress.element);
  }
  else if (this.progress.type == 'throbber') {
    this.progress.element = $('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>');
    if (this.progress.message) {
      $('.throbber', this.progress.element).after('<div class="message">' + this.progress.message + '</div>');
    }
    $(this.element).after(this.progress.element);
  }
};

/**
 * Handler for the form redirection completion.
 */
Drupal.ajax.prototype.success = function (response, status) {
  // Remove the progress element.
  if (this.progress.element) {
    $(this.progress.element).remove();
  }
  if (this.progress.object) {
    this.progress.object.stopMonitoring();
  }
  $(this.element).removeClass('progress-disabled').removeAttr('disabled');

  Drupal.freezeHeight();

  for (var i in response) {
    if (response[i]['command'] && this.commands[response[i]['command']]) {
      this.commands[response[i]['command']](this, response[i], status);
    }
  }

  // Reattach behaviors, if they were detached in beforeSerialize(). The
  // attachBehaviors() called on the new content from processing the response
  // commands is not sufficient, because behaviors from the entire form need
  // to be reattached.
  if (this.form) {
    var settings = this.settings || Drupal.settings;
    Drupal.attachBehaviors(this.form, settings);
  }

  Drupal.unfreezeHeight();

  // Remove any response-specific settings so they don't get used on the next
  // call by mistake.
  this.settings = null;
};

/**
 * Build an effect object which tells us how to apply the effect when adding new HTML.
 */
Drupal.ajax.prototype.getEffect = function (response) {
  var type = response.effect || this.effect;
  var speed = response.speed || this.speed;

  var effect = {};
  if (type == 'none') {
    effect.showEffect = 'show';
    effect.hideEffect = 'hide';
    effect.showSpeed = '';
  }
  else if (type == 'fade') {
    effect.showEffect = 'fadeIn';
    effect.hideEffect = 'fadeOut';
    effect.showSpeed = speed;
  }
  else {
    effect.showEffect = type + 'Toggle';
    effect.hideEffect = type + 'Toggle';
    effect.showSpeed = speed;
  }

  return effect;
};

/**
 * Handler for the form redirection error.
 */
Drupal.ajax.prototype.error = function (response, uri) {
  alert(Drupal.ajaxError(response, uri));
  // Remove the progress element.
  if (this.progress.element) {
    $(this.progress.element).remove();
  }
  if (this.progress.object) {
    this.progress.object.stopMonitoring();
  }
  // Undo hide.
  $(this.wrapper).show();
  // Re-enable the element.
  $(this.element).removeClass('progress-disabled').removeAttr('disabled');
  // Reattach behaviors, if they were detached in beforeSerialize().
  if (this.form) {
    var settings = response.settings || this.settings || Drupal.settings;
    Drupal.attachBehaviors(this.form, settings);
  }
};

/**
 * Provide a series of commands that the server can request the client perform.
 */
Drupal.ajax.prototype.commands = {
  /**
   * Command to insert new content into the DOM.
   */
  insert: function (ajax, response, status) {
    // Get information from the response. If it is not there, default to
    // our presets.
    var wrapper = response.selector ? $(response.selector) : $(ajax.wrapper);
    var method = response.method || ajax.method;
    var effect = ajax.getEffect(response);

    // We don't know what response.data contains: it might be a string of text
    // without HTML, so don't rely on jQuery correctly iterpreting
    // $(response.data) as new HTML rather than a CSS selector. Also, if
    // response.data contains top-level text nodes, they get lost with either
    // $(response.data) or $('<div></div>').replaceWith(response.data).
    var new_content_wrapped = $('<div></div>').html(response.data);
    var new_content = new_content_wrapped.contents();

    // For legacy reasons, the effects processing code assumes that new_content
    // consists of a single top-level element. Also, it has not been
    // sufficiently tested whether attachBehaviors() can be successfully called
    // with a context object that includes top-level text nodes. However, to
    // give developers full control of the HTML appearing in the page, and to
    // enable Ajax content to be inserted in places where DIV elements are not
    // allowed (e.g., within TABLE, TR, and SPAN parents), we check if the new
    // content satisfies the requirement of a single top-level element, and
    // only use the container DIV created above when it doesn't. For more
    // information, please see http://drupal.org/node/736066.
    if (new_content.length != 1 || new_content.get(0).nodeType != 1) {
      new_content = new_content_wrapped;
    }

    // If removing content from the wrapper, detach behaviors first.
    switch (method) {
      case 'html':
      case 'replaceWith':
      case 'replaceAll':
      case 'empty':
      case 'remove':
        var settings = response.settings || ajax.settings || Drupal.settings;
        Drupal.detachBehaviors(wrapper, settings);
    }

    // Add the new content to the page.
    wrapper[method](new_content);

    // Immediately hide the new content if we're using any effects.
    if (effect.showEffect != 'show') {
      new_content.hide();
    }

    // Determine which effect to use and what content will receive the
    // effect, then show the new content.
    if ($('.ajax-new-content', new_content).length > 0) {
      $('.ajax-new-content', new_content).hide();
      new_content.show();
      $('.ajax-new-content', new_content)[effect.showEffect](effect.showSpeed);
    }
    else if (effect.showEffect != 'show') {
      new_content[effect.showEffect](effect.showSpeed);
    }

    // Attach all JavaScript behaviors to the new content, if it was successfully
    // added to the page, this if statement allows #ajax['wrapper'] to be
    // optional.
    if (new_content.parents('html').length > 0) {
      // Apply any settings from the returned JSON if available.
      var settings = response.settings || ajax.settings || Drupal.settings;
      Drupal.attachBehaviors(new_content, settings);
    }
  },

  /**
   * Command to remove a chunk from the page.
   */
  remove: function (ajax, response, status) {
    var settings = response.settings || ajax.settings || Drupal.settings;
    Drupal.detachBehaviors($(response.selector), settings);
    $(response.selector).remove();
  },

  /**
   * Command to mark a chunk changed.
   */
  changed: function (ajax, response, status) {
    if (!$(response.selector).hasClass('ajax-changed')) {
      $(response.selector).addClass('ajax-changed');
      if (response.asterisk) {
        $(response.selector).find(response.asterisk).append(' <span class="ajax-changed">*</span> ');
      }
    }
  },

  /**
   * Command to provide an alert.
   */
  alert: function (ajax, response, status) {
    alert(response.text, response.title);
  },

  /**
   * Command to provide the jQuery css() function.
   */
  css: function (ajax, response, status) {
    $(response.selector).css(response.argument);
  },

  /**
   * Command to set the settings that will be used for other commands in this response.
   */
  settings: function (ajax, response, status) {
    if (response.merge) {
      $.extend(true, Drupal.settings, response.settings);
    }
    else {
      ajax.settings = response.settings;
    }
  },

  /**
   * Command to attach data using jQuery's data API.
   */
  data: function (ajax, response, status) {
    $(response.selector).data(response.name, response.value);
  },

  /**
   * Command to apply a jQuery method.
   */
  invoke: function (ajax, response, status) {
    var $element = $(response.selector);
    $element[response.method].apply($element, response.arguments);
  },

  /**
   * Command to restripe a table.
   */
  restripe: function (ajax, response, status) {
    // :even and :odd are reversed because jQuery counts from 0 and
    // we count from 1, so we're out of sync.
    // Match immediate children of the parent element to allow nesting.
    $('> tbody > tr:visible, > tr:visible', $(response.selector))
      .removeClass('odd even')
      .filter(':even').addClass('odd').end()
      .filter(':odd').addClass('even');
  }
};

})(jQuery);
;
/**
 * @file
 *
 * Implement a modal form.
 *
 * @see modal.inc for documentation.
 *
 * This javascript relies on the CTools ajax responder.
 */

(function ($) {
  // Make sure our objects are defined.
  Drupal.CTools = Drupal.CTools || {};
  Drupal.CTools.Modal = Drupal.CTools.Modal || {};

  /**
   * Display the modal
   *
   * @todo -- document the settings.
   */
  Drupal.CTools.Modal.show = function(choice) {
    var opts = {};

    if (choice && typeof choice == 'string' && Drupal.settings[choice]) {
      // This notation guarantees we are actually copying it.
      $.extend(true, opts, Drupal.settings[choice]);
    }
    else if (choice) {
      $.extend(true, opts, choice);
    }

    var defaults = {
      modalTheme: 'CToolsModalDialog',
      throbberTheme: 'CToolsModalThrobber',
      animation: 'show',
      animationSpeed: 'fast',
      modalSize: {
        type: 'scale',
        width: .8,
        height: .8,
        addWidth: 0,
        addHeight: 0,
        // How much to remove from the inner content to make space for the
        // theming.
        contentRight: 25,
        contentBottom: 45
      },
      modalOptions: {
        opacity: .55,
        background: '#fff'
      }
    };

    var settings = {};
    $.extend(true, settings, defaults, Drupal.settings.CToolsModal, opts);

    if (Drupal.CTools.Modal.currentSettings && Drupal.CTools.Modal.currentSettings != settings) {
      Drupal.CTools.Modal.modal.remove();
      Drupal.CTools.Modal.modal = null;
    }

    Drupal.CTools.Modal.currentSettings = settings;

    var resize = function(e) {
      // When creating the modal, it actually exists only in a theoretical
      // place that is not in the DOM. But once the modal exists, it is in the
      // DOM so the context must be set appropriately.
      var context = e ? document : Drupal.CTools.Modal.modal;

      if (Drupal.CTools.Modal.currentSettings.modalSize.type == 'scale') {
        var width = $(window).width() * Drupal.CTools.Modal.currentSettings.modalSize.width;
        var height = $(window).height() * Drupal.CTools.Modal.currentSettings.modalSize.height;
      }
      else {
        var width = Drupal.CTools.Modal.currentSettings.modalSize.width;
        var height = Drupal.CTools.Modal.currentSettings.modalSize.height;
      }

      // Use the additionol pixels for creating the width and height.
      $('div.ctools-modal-content', context).css({
        'width': width + Drupal.CTools.Modal.currentSettings.modalSize.addWidth + 'px',
        'height': height + Drupal.CTools.Modal.currentSettings.modalSize.addHeight + 'px'
      });
      $('div.ctools-modal-content .modal-content', context).css({
        'width': (width - Drupal.CTools.Modal.currentSettings.modalSize.contentRight) + 'px',
        'height': (height - Drupal.CTools.Modal.currentSettings.modalSize.contentBottom) + 'px'
      });
    }

    if (!Drupal.CTools.Modal.modal) {
      Drupal.CTools.Modal.modal = $(Drupal.theme(settings.modalTheme));
      if (settings.modalSize.type == 'scale') {
        $(window).bind('resize', resize);
      }
    }

    resize();

    $('span.modal-title', Drupal.CTools.Modal.modal).html(Drupal.CTools.Modal.currentSettings.loadingText);
    Drupal.CTools.Modal.modalContent(Drupal.CTools.Modal.modal, settings.modalOptions, settings.animation, settings.animationSpeed);
    $('#modalContent .modal-content').html(Drupal.theme(settings.throbberTheme));
  };

  /**
   * Hide the modal
   */
  Drupal.CTools.Modal.dismiss = function() {
    if (Drupal.CTools.Modal.modal) {
      Drupal.CTools.Modal.unmodalContent(Drupal.CTools.Modal.modal);
    }
  };

  /**
   * Provide the HTML to create the modal dialog.
   */
  Drupal.theme.prototype.CToolsModalDialog = function () {
    var html = ''
    html += '  <div id="ctools-modal">'
    html += '    <div class="ctools-modal-content">' // panels-modal-content
    html += '      <div class="modal-header">';
    html += '        <a class="close" href="#">';
    html +=            Drupal.CTools.Modal.currentSettings.closeText + Drupal.CTools.Modal.currentSettings.closeImage;
    html += '        </a>';
    html += '        <span id="modal-title" class="modal-title">&nbsp;</span>';
    html += '      </div>';
    html += '      <div id="modal-content" class="modal-content">';
    html += '      </div>';
    html += '    </div>';
    html += '  </div>';

    return html;
  }

  /**
   * Provide the HTML to create the throbber.
   */
  Drupal.theme.prototype.CToolsModalThrobber = function () {
    var html = '';
    html += '  <div id="modal-throbber">';
    html += '    <div class="modal-throbber-wrapper">';
    html +=        Drupal.CTools.Modal.currentSettings.throbber;
    html += '    </div>';
    html += '  </div>';

    return html;
  };

  /**
   * Figure out what settings string to use to display a modal.
   */
  Drupal.CTools.Modal.getSettings = function (object) {
    var match = $(object).attr('class').match(/ctools-modal-(\S+)/);
    if (match) {
      return match[1];
    }
  }

  /**
   * Click function for modals that can be cached.
   */
  Drupal.CTools.Modal.clickAjaxCacheLink = function () {
    Drupal.CTools.Modal.show(Drupal.CTools.Modal.getSettings(this));
    return Drupal.CTools.AJAX.clickAJAXCacheLink.apply(this);
  };

  /**
   * Handler to prepare the modal for the response
   */
  Drupal.CTools.Modal.clickAjaxLink = function () {
    Drupal.CTools.Modal.show(Drupal.CTools.Modal.getSettings(this));
    return false;
  };

  /**
   * Submit responder to do an AJAX submit on all modal forms.
   */
  Drupal.CTools.Modal.submitAjaxForm = function(e) {
    var url = $(this).attr('action');
    var form = $(this);

    setTimeout(function() { Drupal.CTools.AJAX.ajaxSubmit(form, url); }, 1);
    return false;
  }

  /**
   * Bind links that will open modals to the appropriate function.
   */
  Drupal.behaviors.ZZCToolsModal = {
    attach: function(context) {
      // Bind links
      // Note that doing so in this order means that the two classes can be
      // used together safely.
      /*
       * @todo remimplement the warm caching feature
      $('a.ctools-use-modal-cache:not(.ctools-use-modal-processed)', context)
        .addClass('ctools-use-modal-processed')
        .click(Drupal.CTools.Modal.clickAjaxCacheLink)
        .each(function () {
          Drupal.CTools.AJAX.warmCache.apply(this);
        });
        */

      $('a.ctools-use-modal:not(.ctools-use-modal-processed)', context)
        .addClass('ctools-use-modal-processed')
        .click(Drupal.CTools.Modal.clickAjaxLink)
        .each(function () {
          // Create a drupal ajax object
          var element_settings = {};
          if ($(this).attr('href')) {
            element_settings.url = $(this).attr('href');
            element_settings.event = 'click';
            element_settings.progress = { type: 'throbber' };
          }
          var base = $(this).attr('href');
          Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);

          // Attach the display behavior to the ajax object
        }
      );

      // Bind buttons
      $('input.ctools-use-modal:not(.ctools-use-modal-processed), button.ctools-use-modal:not(.ctools-use-modal-processed)', context)
        .addClass('ctools-use-modal-processed')
        .click(Drupal.CTools.Modal.clickAjaxLink)
        .each(function() {
          var button = this;
          var element_settings = {};

          // AJAX submits specified in this manner automatically submit to the
          // normal form action.
          element_settings.url = Drupal.CTools.Modal.findURL(this);
          element_settings.event = 'click';

          var base = $(this).attr('id');
          Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);

          // Make sure changes to settings are reflected in the URL.
          $('.' + $(button).attr('id') + '-url').change(function() {
            Drupal.ajax[base].options.url = Drupal.CTools.Modal.findURL(button);
          });
        });

      // Bind our custom event to the form submit
      $('#modal-content form:not(.ctools-use-modal-processed)', context)
        .addClass('ctools-use-modal-processed')
        .each(function() {
          var element_settings = {};

          element_settings.url = $(this).attr('action');
          element_settings.event = 'submit';
          element_settings.progress = { 'type': 'throbber' }
          var base = $(this).attr('id');

          Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
          Drupal.ajax[base].form = $(this);

          $('input[type=submit], button', this).click(function() {
            Drupal.ajax[base].element = this;
            this.form.clk = this;
          });

        });
    }
  };

  // The following are implementations of AJAX responder commands.

  /**
   * AJAX responder command to place HTML within the modal.
   */
  Drupal.CTools.Modal.modal_display = function(ajax, response, status) {
    $('#modal-title').html(response.title);
    $('#modal-content').html(response.output);
    Drupal.attachBehaviors();
  }

  /**
   * AJAX responder command to dismiss the modal.
   */
  Drupal.CTools.Modal.modal_dismiss = function(command) {
    Drupal.CTools.Modal.dismiss();
    $('link.ctools-temporary-css').remove();
  }

  /**
   * Display loading
   */
  //Drupal.CTools.AJAX.commands.modal_loading = function(command) {
  Drupal.CTools.Modal.modal_loading = function(command) {
    Drupal.CTools.Modal.modal_display({
      output: Drupal.theme(Drupal.CTools.Modal.currentSettings.throbberTheme),
      title: Drupal.CTools.Modal.currentSettings.loadingText
    });
  }

  /**
   * Find a URL for an AJAX button.
   *
   * The URL for this gadget will be composed of the values of items by
   * taking the ID of this item and adding -url and looking for that
   * class. They need to be in the form in order since we will
   * concat them all together using '/'.
   */
  Drupal.CTools.Modal.findURL = function(item) {
    var url = '';
    var url_class = '.' + $(item).attr('id') + '-url';
    $(url_class).each(
      function() {
        if (url && $(this).val()) {
          url += '/';
        }
        url += $(this).val();
      });
    return url;
  };


  /**
   * modalContent
   * @param content string to display in the content box
   * @param css obj of css attributes
   * @param animation (fadeIn, slideDown, show)
   * @param speed (valid animation speeds slow, medium, fast or # in ms)
   */
  Drupal.CTools.Modal.modalContent = function(content, css, animation, speed) {
    // If our animation isn't set, make it just show/pop
    if (!animation) {
      animation = 'show';
    }
    else {
      // If our animation isn't "fadeIn" or "slideDown" then it always is show
      if (animation != 'fadeIn' && animation != 'slideDown') {
        animation = 'show';
      }
    }

    if (!speed) {
      speed = 'fast';
    }

    // Build our base attributes and allow them to be overriden
    css = jQuery.extend({
      position: 'absolute',
      left: '0px',
      margin: '0px',
      background: '#000',
      opacity: '.55'
    }, css);

    // Add opacity handling for IE.
    css.filter = 'alpha(opacity=' + (100 * css.opacity) + ')';
    content.hide();

    // if we already ahve a modalContent, remove it
    if ( $('#modalBackdrop')) $('#modalBackdrop').remove();
    if ( $('#modalContent')) $('#modalContent').remove();

    // position code lifted from http://www.quirksmode.org/viewport/compatibility.html
    if (self.pageYOffset) { // all except Explorer
    var wt = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      var wt = document.documentElement.scrollTop;
    } else if (document.body) { // all other Explorers
      var wt = document.body.scrollTop;
    }

    // Get our dimensions

    // Get the docHeight and (ugly hack) add 50 pixels to make sure we dont have a *visible* border below our div
    var docHeight = $(document).height() + 50;
    var docWidth = $(document).width();
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    if( docHeight < winHeight ) docHeight = winHeight;

    // Create our divs
    $('body').append('<div id="modalBackdrop" style="z-index: 1000; display: none;"></div><div id="modalContent" style="z-index: 1001; position: absolute;">' + $(content).html() + '</div>');

    // Keyboard and focus event handler ensures focus stays on modal elements only
    modalEventHandler = function( event ) {
      target = null;
      if ( event ) { //Mozilla
        target = event.target;
      } else { //IE
        event = window.event;
        target = event.srcElement;
      }

      var parents = $(target).parents().get();
      for (var i in $(target).parents().get()) {
        var position = $(parents[i]).css('position');
        if (position == 'absolute' || position == 'fixed') {
          return true;
        }
      }
      if( $(target).filter('*:visible').parents('#modalContent').size()) {
        // allow the event only if target is a visible child node of #modalContent
        return true;
      }
      if ( $('#modalContent')) $('#modalContent').get(0).focus();
      return false;
    };
    $('body').bind( 'focus', modalEventHandler );
    $('body').bind( 'keypress', modalEventHandler );

    // Create our content div, get the dimensions, and hide it
    var modalContent = $('#modalContent').css('top','-1000px');
    var mdcTop = wt + ( winHeight / 2 ) - (  modalContent.outerHeight() / 2);
    var mdcLeft = ( winWidth / 2 ) - ( modalContent.outerWidth() / 2);
    $('#modalBackdrop').css(css).css('top', 0).css('height', docHeight + 'px').css('width', docWidth + 'px').show();
    modalContent.css({top: mdcTop + 'px', left: mdcLeft + 'px'}).hide()[animation](speed);

    // Bind a click for closing the modalContent
    modalContentClose = function(){close(); return false;};
    $('.close').bind('click', modalContentClose);

    // Close the open modal content and backdrop
    function close() {
      // Unbind the events
      $(window).unbind('resize',  modalContentResize);
      $('body').unbind( 'focus', modalEventHandler);
      $('body').unbind( 'keypress', modalEventHandler );
      $('.close').unbind('click', modalContentClose);
      $(document).trigger('CToolsDetachBehaviors', $('#modalContent'));

      // Set our animation parameters and use them
      if ( animation == 'fadeIn' ) animation = 'fadeOut';
      if ( animation == 'slideDown' ) animation = 'slideUp';
      if ( animation == 'show' ) animation = 'hide';

      // Close the content
      modalContent.hide()[animation](speed);

      // Remove the content
      $('#modalContent').remove();
      $('#modalBackdrop').remove();
    };

    // Move and resize the modalBackdrop and modalContent on resize of the window
     modalContentResize = function(){
      // Get our heights
      var docHeight = $(document).height();
      var docWidth = $(document).width();
      var winHeight = $(window).height();
      var winWidth = $(window).width();
      if( docHeight < winHeight ) docHeight = winHeight;

      // Get where we should move content to
      var modalContent = $('#modalContent');
      var mdcTop = ( winHeight / 2 ) - (  modalContent.outerHeight() / 2);
      var mdcLeft = ( winWidth / 2 ) - ( modalContent.outerWidth() / 2);

      // Apply the changes
      $('#modalBackdrop').css('height', docHeight + 'px').css('width', docWidth + 'px').show();
      modalContent.css('top', mdcTop + 'px').css('left', mdcLeft + 'px').show();
    };
    $(window).bind('resize', modalContentResize);

    $('#modalContent').focus();
  };

  /**
   * unmodalContent
   * @param content (The jQuery object to remove)
   * @param animation (fadeOut, slideUp, show)
   * @param speed (valid animation speeds slow, medium, fast or # in ms)
   */
  Drupal.CTools.Modal.unmodalContent = function(content, animation, speed)
  {
    // If our animation isn't set, make it just show/pop
    if (!animation) { var animation = 'show'; } else {
      // If our animation isn't "fade" then it always is show
      if (( animation != 'fadeOut' ) && ( animation != 'slideUp')) animation = 'show';
    }
    // Set a speed if we dont have one
    if ( !speed ) var speed = 'fast';

    // Unbind the events we bound
    $(window).unbind('resize', modalContentResize);
    $('body').unbind('focus', modalEventHandler);
    $('body').unbind('keypress', modalEventHandler);
    $('.close').unbind('click', modalContentClose);
    $(document).trigger('CToolsDetachBehaviors', $('#modalContent'));

    // jQuery magic loop through the instances and run the animations or removal.
    content.each(function(){
      if ( animation == 'fade' ) {
        $('#modalContent').fadeOut(speed,function(){$('#modalBackdrop').fadeOut(speed, function(){$(this).remove();});$(this).remove();});
      } else {
        if ( animation == 'slide' ) {
          $('#modalContent').slideUp(speed,function(){$('#modalBackdrop').slideUp(speed, function(){$(this).remove();});$(this).remove();});
        } else {
          $('#modalContent').remove();$('#modalBackdrop').remove();
        }
      }
    });
  };

$(function() {
  Drupal.ajax.prototype.commands.modal_display = Drupal.CTools.Modal.modal_display;
  Drupal.ajax.prototype.commands.modal_dismiss = Drupal.CTools.Modal.modal_dismiss;
});

})(jQuery);
;

// Ensure the $ alias is owned by jQuery.
(function($) {

Drupal.PanelsIPE = {
  editors: {},
  bindClickDelete: function(context) {
    $('a.pane-delete:not(.pane-delete-processed)', context)
      .addClass('pane-delete-processed')
      .click(function() {
        if (confirm('Remove this pane?')) {
          $(this).parents('div.panels-ipe-portlet-wrapper').fadeOut('medium', function() {
            $(this).empty().remove();
          });
          $(this).parents('div.panels-ipe-display-container').addClass('changed');
        }
        return false;
      });
  }
}

// A ready function should be sufficient for this, at least for now
$(function() {
  $.each(Drupal.settings.PanelsIPECacheKeys, function() {
    Drupal.PanelsIPE.editors[this] = new DrupalPanelsIPE(this, Drupal.settings.PanelsIPESettings[this]);
  });
});

Drupal.behaviors.PanelsIPE = {
  attach: function(context) {
    Drupal.PanelsIPE.bindClickDelete(context);
  }
};

/**
 * Base object (class) definition for the Panels In-Place Editor.
 *
 * A new instance of this object is instanciated for every unique IPE on a given
 * page.
 *
 * Note that this form is provisional, and we hope to replace it with a more
 * flexible, loosely-coupled model that utilizes separate controllers for the
 * discrete IPE elements. This will result in greater IPE flexibility.
 */
function DrupalPanelsIPE(cache_key, cfg) {
  var ipe = this;
  this.key = cache_key;
  this.state = {};
  this.control = $('div#panels-ipe-control-' + cache_key);
  this.initButton = $('div.panels-ipe-startedit', this.control);
  this.cfg = cfg;
  this.changed = false;
  this.sortableOptions = $.extend({
    revert: 200,
    dropOnEmpty: true, // default
    opacity: 0.75, // opacity of sortable while sorting
    // placeholder: 'draggable-placeholder',
    // forcePlaceholderSize: true,
    items: 'div.panels-ipe-portlet-wrapper',
    handle: 'div.panels-ipe-draghandle',
    tolerance: 'pointer',
    cursorAt: 'top',
    update: this.setChanged,
    scroll: true
    // containment: ipe.topParent,
  }, cfg.sortableOptions || {});

  this.initEditing = function(formdata) {
    ipe.topParent = $('div#panels-ipe-display-' + cache_key);
    ipe.backup = this.topParent.clone();

    // See http://jqueryui.com/demos/sortable/ for details on the configuration
    // parameters used here.
    ipe.changed = false;

    $('div.panels-ipe-sort-container', ipe.topParent).sortable(ipe.sortable_options);

    // Since the connectWith option only does a one-way hookup, iterate over
    // all sortable regions to connect them with one another.
    $('div.panels-ipe-sort-container', ipe.topParent)
      .sortable('option', 'connectWith', ['div.panels-ipe-sort-container']);

    $('div.panels-ipe-sort-container', ipe.topParent).bind('sortupdate', function() {
      ipe.changed = true;
    });

    $('.panels-ipe-form-container', ipe.control).append(formdata);

    $('input:submit:not(.ajax-processed)', ipe.control).addClass('ajax-processed').each(function() {
      var element_settings = {};

      element_settings.url = $(this.form).attr('action');
      element_settings.setClick = true;
      element_settings.event = 'click';
      element_settings.progress = { 'type': 'throbber' };

      var base = $(this).attr('id');
      Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
      if ($(this).attr('id') == 'panels-ipe-save') {
        Drupal.ajax[base].options.beforeSerialize = function (element_settings, options) {
          ipe.saveEditing();
          return Drupal.ajax[base].beforeSerialize(element_settings, options);
        };
      }
      if ($(this).attr('id') == 'panels-ipe-cancel') {
        Drupal.ajax[base].options.beforeSend = function () {
          return ipe.cancelEditing();
        };
      }
    });

    // Perform visual effects in a particular sequence.
    ipe.initButton.css('position', 'absolute');
    ipe.initButton.fadeOut('normal');
    $('.panels-ipe-on').show('normal');
//    $('.panels-ipe-on').fadeIn('normal');
    ipe.topParent.addClass('panels-ipe-editing');
  }

  this.endEditing = function(data) {
    $('.panels-ipe-form-container', ipe.control).empty();
    // Re-show all the IPE non-editing meta-elements
    $('div.panels-ipe-off').show('fast');

    // Re-hide all the IPE meta-elements
    $('div.panels-ipe-on').hide('fast');
    ipe.initButton.css('position', 'static');
    ipe.topParent.removeClass('panels-ipe-editing');
   $('div.panels-ipe-sort-container', ipe.topParent).sortable("destroy");
  };

  this.saveEditing = function() {
    $('div.panels-ipe-region', ipe.topParent).each(function() {
      var val = '';
      var region = $(this).attr('id').split('panels-ipe-regionid-')[1];
      $(this).find('div.panels-ipe-portlet-wrapper').each(function() {
        var id = $(this).attr('id').split('panels-ipe-paneid-')[1];
        if (id) {
          if (val) {
            val += ',';
          }
          val += id;
        }
      });
      $('input[name="panel[pane][' +  region + ']"]', ipe.control).val(val);
    });
  }

  this.cancelEditing = function() {
    if (ipe.topParent.hasClass('changed')) {
      ipe.changed = true;
    }

    if (!ipe.changed || confirm(Drupal.t('This will discard all unsaved changes. Are you sure?'))) {
      ipe.topParent.fadeOut('medium', function() {
        ipe.topParent.replaceWith(ipe.backup.clone());
        ipe.topParent = $('div#panels-ipe-display-' + ipe.key);

        // Processing of these things got lost in the cloning, but the classes remained behind.
        // @todo this isn't ideal but I can't seem to figure out how to keep an unprocessed backup
        // that will later get processed.
        $('.ctools-use-modal-processed', ipe.topParent).removeClass('ctools-use-modal-processed');
        $('.pane-delete-processed', ipe.topParent).removeClass('pane-delete-processed');
        ipe.topParent.fadeIn('medium');
        Drupal.attachBehaviors();
      });
    }
    else {
      // Cancel the submission.
      return false;
    }
  };

  this.createSortContainers = function() {
    $('div.panels-ipe-region', this.topParent).each(function() {
      $('div.panels-ipe-portlet-marker', this).parent()
        .wrapInner('<div class="panels-ipe-sort-container" />');

      // Move our gadgets outside of the sort container so that sortables
      // cannot be placed after them.
      $('div.panels-ipe-portlet-static', this).each(function() {
        $(this).appendTo($(this).parent().parent());
      });

      // Add a marker so we can drag things to empty containers.
      $('div.panels-ipe-sort-container', this).append('<div>&nbsp;</div>');
    });
  }

  this.createSortContainers();

  var element_settings = {
    url: ipe.cfg.formPath,
    event: 'click',
    keypress: false,
    // No throbber at all.
    progress: { 'type': 'none' }
  };

  Drupal.ajax['ipe-ajax'] = new Drupal.ajax('ipe-ajax', $('div.panels-ipe-startedit', this.control).get(0), element_settings);

/*
  var ajaxOptions = {
    type: "POST",
    url: ,
    data: { 'js': 1 },
    global: true,
    success: Drupal.CTools.AJAX.respond,
    error: function(xhr) {
      Drupal.CTools.AJAX.handleErrors(xhr, ipe.cfg.formPath);
    },
    dataType: 'json'
  };

  $('div.panels-ipe-startedit', this.control).click(function() {
    var $this = $(this);
    $.ajax(ajaxOptions);
  });
  */
};

$(function() {
  Drupal.ajax.prototype.commands.initIPE = function(ajax, data, status) {
    if (Drupal.PanelsIPE.editors[data.key]) {
      Drupal.PanelsIPE.editors[data.key].initEditing(data.data);
    }
  };

  Drupal.ajax.prototype.commands.unlockIPE = function(ajax, data, status) {
    if (confirm(data.message)) {
      var ajaxOptions = {
        type: "POST",
        url: data.break_path,
        data: { 'js': 1 },
        global: true,
        success: Drupal.CTools.AJAX.respond,
        error: function(xhr) {
          Drupal.CTools.AJAX.handleErrors(xhr, ipe.cfg.formPath);
        },
        dataType: 'json'
      };

      $.ajax(ajaxOptions);
    };
  };

  Drupal.ajax.prototype.commands.endIPE = function(ajax, data, status) {
    if (Drupal.PanelsIPE.editors[data.key]) {
      Drupal.PanelsIPE.editors[data.key].endEditing(data);
    }
  };


});

})(jQuery);
;

/**
 * JavaScript behaviors for the front-end display of webforms.
 */

(function ($) {

Drupal.behaviors.webform = Drupal.behaviors.webform || {};

Drupal.behaviors.webform.attach = function(context) {
  // Calendar datepicker behavior.
  Drupal.webform.datepicker(context);
};

Drupal.webform = Drupal.webform || {};

Drupal.webform.datepicker = function(context) {
  $('div.webform-datepicker').each(function() {
    var $webformDatepicker = $(this);
    var $calendar = $webformDatepicker.find('input.webform-calendar');
    var startYear = $calendar[0].className.replace(/.*webform-calendar-start-(\d+).*/, '$1');
    var endYear = $calendar[0].className.replace(/.*webform-calendar-end-(\d+).*/, '$1');
    var firstDay = $calendar[0].className.replace(/.*webform-calendar-day-(\d).*/, '$1');

    // Ensure that start comes before end for datepicker.
    if (startYear > endYear) {
      var greaterYear = startYear;
      startYear = endYear;
      endYear = greaterYear;
    }

    // Set up the jQuery datepicker element.
    $calendar.datepicker({
      dateFormat: 'yy-mm-dd',
      yearRange: startYear + ':' + endYear,
      firstDay: parseInt(firstDay),
      onSelect: function(dateText, inst) {
        var date = dateText.split('-');
        $webformDatepicker.find('select.year, input.year').val(+date[0]);
        $webformDatepicker.find('select.month').val(+date[1]);
        $webformDatepicker.find('select.day').val(+date[2]);
      },
      beforeShow: function(input, inst) {
        // Get the select list values.
        var year = $webformDatepicker.find('select.year, input.year').val();
        var month = $webformDatepicker.find('select.month').val();
        var day = $webformDatepicker.find('select.day').val();

        // If empty, default to the current year/month/day in the popup.
        var today = new Date();
        year = year ? year : today.getFullYear();
        month = month ? month : today.getMonth() + 1;
        day = day ? day : today.getDate();

        // Make sure that the default year fits in the available options.
        year = (year < startYear || year > endYear) ? startYear : year;

        // jQuery UI Datepicker will read the input field and base its date off
        // of that, even though in our case the input field is a button.
        $(input).val(year + '-' + month + '-' + day);
      }
    });

    // Prevent the calendar button from submitting the form.
    $calendar.click(function(event) {
      $(this).focus();
      event.preventDefault();
    });
  });
}

})(jQuery);;

(function($) {

/**
 * Drupal FieldGroup object.
 */
Drupal.FieldGroup = Drupal.FieldGroup || {};
Drupal.FieldGroup.Effects = Drupal.FieldGroup.Effects || {};
Drupal.FieldGroup.groupWithfocus = null;

Drupal.FieldGroup.setGroupWithfocus = function(element) {
  element.css({display: 'block'});
  Drupal.FieldGroup.groupWithfocus = element;
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processFieldset = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any fieldsets containing required fields
      $('fieldset.fieldset').each(function(i){
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $('legend span.fieldset-legend', $(this)).eq(0).append('&nbsp;').append($('.form-required').eq(0).clone());
        }
        if ($('.error', $(this)).length) {
          $('legend span.fieldset-legend', $(this)).eq(0).addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processAccordion = {
  execute: function (context, settings, type) {
    var accordions = $('div.field-group-accordion-wrapper', context).accordion({
      autoHeight: false,
      active: 0,
      collapsible: true
    });
    if (type == 'form') {
      // Add required fields mark to any element containing required fields
      $('div.accordion-item').each(function(i){
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $('h3.ui-accordion-header').eq(i).append('&nbsp;').append($('.form-required').eq(0).clone());
        }
        if ($('.error', $(this)).length) {
          $('h3.ui-accordion-header').eq(i).addClass('error');
          var activeOne = $(this).parent().accordion("activate" , i);
          $('.ui-accordion-content-active', activeOne).css({height: 'auto', width: 'auto', display: 'block'});
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processHtabs = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any element containing required fields
      $('fieldset.horizontal-tabs-pane').each(function(i){
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $(this).data('horizontalTab').link.find('strong:first').after($('.form-required').eq(0).clone()).after('&nbsp;');
        }
        if ($('.error', $(this)).length) {
          $(this).data('horizontalTab').link.parent().addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
          $(this).data('horizontalTab').focus();
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processTabs = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any fieldsets containing required fields
      $('fieldset.vertical-tabs-pane').each(function(i){
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $(this).data('verticalTab').link.find('strong:first').after($('.form-required').eq(0).clone()).after('&nbsp;');
        }
        if ($('.error', $(this)).length) {
          $(this).data('verticalTab').link.parent().addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
          $(this).data('verticalTab').focus();
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 * 
 * TODO clean this up meaning check if this is really 
 *      necessary.
 */
Drupal.FieldGroup.Effects.processDiv = {
  execute: function (context, settings, type) {

    $('div.collapsible', context).each(function() {
      var $wrapper = $(this);

      // Turn the legend into a clickable link, but retain span.field-group-format-toggler
      // for CSS positioning.
      var $toggler = $('span.field-group-format-toggler:first', $wrapper);
      var $link = $('<a class="field-group-format-title" href="#"></a>');
      $link.prepend($toggler.contents()).appendTo($toggler);
      
      // .wrapInner() does not retain bound events.
      $link.click(function () {
        var wrapper = $wrapper.get(0);
        // Don't animate multiple times.
        if (!wrapper.animating) {
          wrapper.animating = true;
          var speed = $wrapper.hasClass('speed-fast') ? 300 : 1000;
          if ($wrapper.hasClass('effect-none') && $wrapper.hasClass('speed-none')) {
            $('> .field-group-format-wrapper', wrapper).toggle();
          }
          else if ($wrapper.hasClass('effect-blind')) {
            $('> .field-group-format-wrapper', wrapper).toggle('blind', {}, speed);
          }
          else {
            $('> .field-group-format-wrapper', wrapper).toggle(speed);
          }
          wrapper.animating = false;
        }
        return false;
      });
      
    });
  }
};

/**
 * Behaviors.
 */
Drupal.behaviors.fieldGroup = {
  attach: function (context, settings) {
    if (settings.field_group == undefined) {
      return;
    }
    $('body', context).once('fieldgroup-effects', function () {
      // Execute all of them.
      $.each(Drupal.FieldGroup.Effects, function (func) {
        // We check for a wrapper function in Drupal.field_group as 
        // alternative for dynamic string function calls.
        var type = func.toLowerCase().replace("process", "");
        if (settings.field_group[type] != undefined && $.isFunction(this.execute)) {
          this.execute(context, settings, settings.field_group[type]);
        }
      });
    });
  }
};

})(jQuery);;
/*****************************************************************

typeface.js, version 0.15 | typefacejs.neocracy.org

Copyright (c) 2008 - 2009, David Chester davidchester@gmx.net 

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*****************************************************************/

(function() {

var _typeface_js = {

	faces: {},

	loadFace: function(typefaceData) {

		var familyName = typefaceData.familyName.toLowerCase();
		
		if (!this.faces[familyName]) {
			this.faces[familyName] = {};
		}
		if (!this.faces[familyName][typefaceData.cssFontWeight]) {
			this.faces[familyName][typefaceData.cssFontWeight] = {};
		}

		var face = this.faces[familyName][typefaceData.cssFontWeight][typefaceData.cssFontStyle] = typefaceData;
		face.loaded = true;
	},

	log: function(message) {
		
		if (this.quiet) {
			return;
		}
		
		message = "typeface.js: " + message;
		
		if (this.customLogFn) {
			this.customLogFn(message);

		} else if (window.console && window.console.log) {
			window.console.log(message);
		}
		
	},
	
	pixelsFromPoints: function(face, style, points, dimension) {
		var pixels = points * parseInt(style.fontSize) * 72 / (face.resolution * 100);
		if (dimension == 'horizontal' && style.fontStretchPercent) {
			pixels *= style.fontStretchPercent;
		}
		return pixels;
	},

	pointsFromPixels: function(face, style, pixels, dimension) {
		var points = pixels * face.resolution / (parseInt(style.fontSize) * 72 / 100);
		if (dimension == 'horizontal' && style.fontStretchPrecent) {
			points *= style.fontStretchPercent;
		}
		return points;
	},

	cssFontWeightMap: {
		normal: 'normal',
		bold: 'bold',
		400: 'normal',
		700: 'bold'
	},

	cssFontStretchMap: {
		'ultra-condensed': 0.55,
		'extra-condensed': 0.77,
		'condensed': 0.85,
		'semi-condensed': 0.93,
		'normal': 1,
		'semi-expanded': 1.07,
		'expanded': 1.15,
		'extra-expanded': 1.23,
		'ultra-expanded': 1.45,
		'default': 1
	},
	
	fallbackCharacter: '.',

	configure: function(args) {
		var configurableOptionNames = [ 'customLogFn',  'customClassNameRegex', 'customTypefaceElementsList', 'quiet', 'verbose', 'disableSelection' ];
		
		for (var i = 0; i < configurableOptionNames.length; i++) {
			var optionName = configurableOptionNames[i];
			if (args[optionName]) {
				if (optionName == 'customLogFn') {
					if (typeof args[optionName] != 'function') {
						throw "customLogFn is not a function";
					} else {
						this.customLogFn = args.customLogFn;
					}
				} else {
					this[optionName] = args[optionName];
				}
			}
		}
	},

	getTextExtents: function(face, style, text) {
		var extentX = 0;
		var extentY = 0;
		var horizontalAdvance;
	
		var textLength = text.length;
		for (var i = 0; i < textLength; i++) {
			var glyph = face.glyphs[text.charAt(i)] ? face.glyphs[text.charAt(i)] : face.glyphs[this.fallbackCharacter];
			var letterSpacingAdjustment = this.pointsFromPixels(face, style, style.letterSpacing);

			// if we're on the last character, go with the glyph extent if that's more than the horizontal advance
			extentX += i + 1 == textLength ? Math.max(glyph.x_max, glyph.ha) : glyph.ha;
			extentX += letterSpacingAdjustment;

			horizontalAdvance += glyph.ha + letterSpacingAdjustment;
		}
		return { 
			x: extentX, 
			y: extentY,
			ha: horizontalAdvance
			
		};
	},

	pixelsFromCssAmount: function(cssAmount, defaultValue, element) {

		var matches = undefined;

		if (cssAmount == 'normal') {
			return defaultValue;

		} else if (matches = cssAmount.match(/([\-\d+\.]+)px/)) {
			return matches[1];

		} else {
			// thanks to Dean Edwards for this very sneaky way to get IE to convert 
			// relative values to pixel values
			
			var pixelAmount;
			
			var leftInlineStyle = element.style.left;
			var leftRuntimeStyle = element.runtimeStyle.left;

			element.runtimeStyle.left = element.currentStyle.left;

			if (!cssAmount.match(/\d(px|pt)$/)) {
				element.style.left = '1em';
			} else {
				element.style.left = cssAmount || 0;
			}

			pixelAmount = element.style.pixelLeft;
		
			element.style.left = leftInlineStyle;
			element.runtimeStyle.left = leftRuntimeStyle;
			
			return pixelAmount || defaultValue;
		}
	},

	capitalizeText: function(text) {
		return text.replace(/(^|\s)[a-z]/g, function(match) { return match.toUpperCase() } ); 
	},

	getElementStyle: function(e) {
		if (window.getComputedStyle) {
			return window.getComputedStyle(e, '');
		
		} else if (e.currentStyle) {
			return e.currentStyle;
		}
	},

	getRenderedText: function(e) {

		var browserStyle = this.getElementStyle(e.parentNode);

		var inlineStyleAttribute = e.parentNode.getAttribute('style');
		if (inlineStyleAttribute && typeof(inlineStyleAttribute) == 'object') {
			inlineStyleAttribute = inlineStyleAttribute.cssText;
		}

		if (inlineStyleAttribute) {

			var inlineStyleDeclarations = inlineStyleAttribute.split(/\s*\;\s*/);

			var inlineStyle = {};
			for (var i = 0; i < inlineStyleDeclarations.length; i++) {
				var declaration = inlineStyleDeclarations[i];
				var declarationOperands = declaration.split(/\s*\:\s*/);
				inlineStyle[declarationOperands[0]] = declarationOperands[1];
			}
		}

		var style = { 
			color: browserStyle.color, 
			fontFamily: browserStyle.fontFamily.split(/\s*,\s*/)[0].replace(/(^"|^'|'$|"$)/g, '').toLowerCase(), 
			fontSize: this.pixelsFromCssAmount(browserStyle.fontSize, 12, e.parentNode),
			fontWeight: this.cssFontWeightMap[browserStyle.fontWeight],
			fontStyle: browserStyle.fontStyle ? browserStyle.fontStyle : 'normal',
			fontStretchPercent: this.cssFontStretchMap[inlineStyle && inlineStyle['font-stretch'] ? inlineStyle['font-stretch'] : 'default'],
			textDecoration: browserStyle.textDecoration,
			lineHeight: this.pixelsFromCssAmount(browserStyle.lineHeight, 'normal', e.parentNode),
			letterSpacing: this.pixelsFromCssAmount(browserStyle.letterSpacing, 0, e.parentNode),
			textTransform: browserStyle.textTransform
		};

		var face;
		if (
			this.faces[style.fontFamily]  
			&& this.faces[style.fontFamily][style.fontWeight]
		) {
			face = this.faces[style.fontFamily][style.fontWeight][style.fontStyle];
		}

		var text = e.nodeValue;
		
		if (
			e.previousSibling 
			&& e.previousSibling.nodeType == 1 
			&& e.previousSibling.tagName != 'BR' 
			&& this.getElementStyle(e.previousSibling).display.match(/inline/)
		) {
			text = text.replace(/^\s+/, ' ');
		} else {
			text = text.replace(/^\s+/, '');
		}
		
		if (
			e.nextSibling 
			&& e.nextSibling.nodeType == 1 
			&& e.nextSibling.tagName != 'BR' 
			&& this.getElementStyle(e.nextSibling).display.match(/inline/)
		) {
			text = text.replace(/\s+$/, ' ');
		} else {
			text = text.replace(/\s+$/, '');
		}
		
		text = text.replace(/\s+/g, ' ');
	
		if (style.textTransform && style.textTransform != 'none') {
			switch (style.textTransform) {
				case 'capitalize':
					text = this.capitalizeText(text);
					break;
				case 'uppercase':
					text = text.toUpperCase();
					break;
				case 'lowercase':
					text = text.toLowerCase();
					break;
			}
		}

		if (!face) {
			var excerptLength = 12;
			var textExcerpt = text.substring(0, excerptLength);
			if (text.length > excerptLength) {
				textExcerpt += '...';
			}
		
			var fontDescription = style.fontFamily;
			if (style.fontWeight != 'normal') fontDescription += ' ' + style.fontWeight;
			if (style.fontStyle != 'normal') fontDescription += ' ' + style.fontStyle;
		
			this.log("couldn't find typeface font: " + fontDescription + ' for text "' + textExcerpt + '"');
			return;
		}
	
		var words = text.split(/\b(?=\w)/);

		var containerSpan = document.createElement('span');
		containerSpan.className = 'typeface-js-vector-container';
		
		var wordsLength = words.length;
		for (var i = 0; i < wordsLength; i++) {
			var word = words[i];
			
			var vector = this.renderWord(face, style, word);
			
			if (vector) {
				containerSpan.appendChild(vector.element);

				if (!this.disableSelection) {
					var selectableSpan = document.createElement('span');
					selectableSpan.className = 'typeface-js-selected-text';

					var wordNode = document.createTextNode(word);
					selectableSpan.appendChild(wordNode);

					if (this.vectorBackend != 'vml') {
						selectableSpan.style.marginLeft = -1 * (vector.width + 1) + 'px';
					}
					selectableSpan.targetWidth = vector.width;
					//selectableSpan.style.lineHeight = 1 + 'px';

					if (this.vectorBackend == 'vml') {
						vector.element.appendChild(selectableSpan);
					} else {
						containerSpan.appendChild(selectableSpan);
					}
				}
			}
		}

		return containerSpan;
	},

	renderDocument: function(callback) { 
		
		if (!callback)
			callback = function(e) { e.style.visibility = 'visible' };

		var elements = document.getElementsByTagName('*');
		
		var elementsLength = elements.length;
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].className.match(/(^|\s)typeface-js(\s|$)/) || elements[i].tagName.match(/^(H1|H2|H3|H4|H5|H6)$/)) {
				this.replaceText(elements[i]);
				if (typeof callback == 'function') {
					callback(elements[i]);
				}
			}
		}

		if (this.vectorBackend == 'vml') {
			// lamely work around IE's quirky leaving off final dynamic shapes
			var dummyShape = document.createElement('v:shape');
			dummyShape.style.display = 'none';
			document.body.appendChild(dummyShape);
		}
	},

	replaceText: function(e) {

		var childNodes = [];
		var childNodesLength = e.childNodes.length;

		for (var i = 0; i < childNodesLength; i++) {
			this.replaceText(e.childNodes[i]);
		}

		if (e.nodeType == 3 && e.nodeValue.match(/\S/)) {
			var parentNode = e.parentNode;

			if (parentNode.className == 'typeface-js-selected-text') {
				return;
			}

			var renderedText = this.getRenderedText(e);
			
			if (
				parentNode.tagName == 'A' 
				&& this.vectorBackend == 'vml'
				&& this.getElementStyle(parentNode).display == 'inline'
			) {
				// something of a hack, use inline-block to get IE to accept clicks in whitespace regions
				parentNode.style.display = 'inline-block';
				parentNode.style.cursor = 'pointer';
			}

			if (this.getElementStyle(parentNode).display == 'inline') {
				parentNode.style.display = 'inline-block';
			}

			if (renderedText) {	
				if (parentNode.replaceChild) {
					parentNode.replaceChild(renderedText, e);
				} else {
					parentNode.insertBefore(renderedText, e);
					parentNode.removeChild(e);
				}
				if (this.vectorBackend == 'vml') {
					renderedText.innerHTML = renderedText.innerHTML;
				}

				var childNodesLength = renderedText.childNodes.length
				for (var i; i < childNodesLength; i++) {
					
					// do our best to line up selectable text with rendered text

					var e = renderedText.childNodes[i];
					if (e.hasChildNodes() && !e.targetWidth) {
						e = e.childNodes[0];
					}
					
					if (e && e.targetWidth) {
						var letterSpacingCount = e.innerHTML.length;
						var wordSpaceDelta = e.targetWidth - e.offsetWidth;
						var letterSpacing = wordSpaceDelta / (letterSpacingCount || 1);

						if (this.vectorBackend == 'vml') {
							letterSpacing = Math.ceil(letterSpacing);
						}

						e.style.letterSpacing = letterSpacing + 'px';
						e.style.width = e.targetWidth + 'px';
					}
				}
			}
		}
	},

	applyElementVerticalMetrics: function(face, style, e) {

		if (style.lineHeight == 'normal') {
			style.lineHeight = this.pixelsFromPoints(face, style, face.lineHeight);
		}

		var cssLineHeightAdjustment = style.lineHeight - this.pixelsFromPoints(face, style, face.lineHeight);

		e.style.marginTop = Math.round( cssLineHeightAdjustment / 2 ) + 'px';
		e.style.marginBottom = Math.round( cssLineHeightAdjustment / 2) + 'px';
	
	},

	vectorBackends: {

		canvas: {

			_initializeSurface: function(face, style, text) {

				var extents = this.getTextExtents(face, style, text);

				var canvas = document.createElement('canvas');
				if (this.disableSelection) {
					canvas.innerHTML = text;
				}

				canvas.height = Math.round(this.pixelsFromPoints(face, style, face.lineHeight));
				canvas.width = Math.round(this.pixelsFromPoints(face, style, extents.x, 'horizontal'));
	
				this.applyElementVerticalMetrics(face, style, canvas);

				if (extents.x > extents.ha) 
					canvas.style.marginRight = Math.round(this.pixelsFromPoints(face, style, extents.x - extents.ha, 'horizontal')) + 'px';

				var ctx = canvas.getContext('2d');

				var pointScale = this.pixelsFromPoints(face, style, 1);
				ctx.scale(pointScale * style.fontStretchPercent, -1 * pointScale);
				ctx.translate(0, -1 * face.ascender);
				ctx.fillStyle = style.color;

				return { context: ctx, canvas: canvas };
			},

			_renderGlyph: function(ctx, face, char, style) {

				var glyph = face.glyphs[char];

				if (!glyph) {
					//this.log.error("glyph not defined: " + char);
					return this.renderGlyph(ctx, face, this.fallbackCharacter, style);
				}

				if (glyph.o) {

					var outline;
					if (glyph.cached_outline) {
						outline = glyph.cached_outline;
					} else {
						outline = glyph.o.split(' ');
						glyph.cached_outline = outline;
					}

					var outlineLength = outline.length;
					for (var i = 0; i < outlineLength; ) {

						var action = outline[i++];

						switch(action) {
							case 'm':
								ctx.moveTo(outline[i++], outline[i++]);
								break;
							case 'l':
								ctx.lineTo(outline[i++], outline[i++]);
								break;

							case 'q':
								var cpx = outline[i++];
								var cpy = outline[i++];
								ctx.quadraticCurveTo(outline[i++], outline[i++], cpx, cpy);
								break;

							case 'b':
								var x = outline[i++];
								var y = outline[i++];
								ctx.bezierCurveTo(outline[i++], outline[i++], outline[i++], outline[i++], x, y);
								break;
						}
					}					
				}
				if (glyph.ha) {
					var letterSpacingPoints = 
						style.letterSpacing && style.letterSpacing != 'normal' ? 
							this.pointsFromPixels(face, style, style.letterSpacing) : 
							0;

					ctx.translate(glyph.ha + letterSpacingPoints, 0);
				}
			},

			_renderWord: function(face, style, text) {
				var surface = this.initializeSurface(face, style, text);
				var ctx = surface.context;
				var canvas = surface.canvas;
				ctx.beginPath();
				ctx.save();

				var chars = text.split('');
				var charsLength = chars.length;
				for (var i = 0; i < charsLength; i++) {
					this.renderGlyph(ctx, face, chars[i], style);
				}

				ctx.fill();

				if (style.textDecoration == 'underline') {

					ctx.beginPath();
					ctx.moveTo(0, face.underlinePosition);
					ctx.restore();
					ctx.lineTo(0, face.underlinePosition);
					ctx.strokeStyle = style.color;
					ctx.lineWidth = face.underlineThickness;
					ctx.stroke();
				}

				return { element: ctx.canvas, width: Math.floor(canvas.width) };
			
			}
		},

		vml: {

			_initializeSurface: function(face, style, text) {

				var shape = document.createElement('v:shape');

				var extents = this.getTextExtents(face, style, text);
				
				shape.style.width = shape.style.height = style.fontSize + 'px'; 
				shape.style.marginLeft = '-1px'; // this seems suspect...

				if (extents.x > extents.ha) {
					shape.style.marginRight = this.pixelsFromPoints(face, style, extents.x - extents.ha, 'horizontal') + 'px';
				}

				this.applyElementVerticalMetrics(face, style, shape);

				var resolutionScale = face.resolution * 100 / 72;
				shape.coordsize = (resolutionScale / style.fontStretchPercent) + "," + resolutionScale;
				
				shape.coordorigin = '0,' + face.ascender;
				shape.style.flip = 'y';

				shape.fillColor = style.color;
				shape.stroked = false;

				shape.path = 'hh m 0,' + face.ascender + ' l 0,' + face.descender + ' ';

				return shape;
			},

			_renderGlyph: function(shape, face, char, offsetX, style, vmlSegments) {

				var glyph = face.glyphs[char];

				if (!glyph) {
					this.log("glyph not defined: " + char);
					this.renderGlyph(shape, face, this.fallbackCharacter, offsetX, style);
					return;
				}
				
				vmlSegments.push('m');

				if (glyph.o) {
					
					var outline, outlineLength;
					
					if (glyph.cached_outline) {
						outline = glyph.cached_outline;
						outlineLength = outline.length;
					} else {
						outline = glyph.o.split(' ');
						outlineLength = outline.length;

						for (var i = 0; i < outlineLength;) {

							switch(outline[i++]) {
								case 'q':
									outline[i] = Math.round(outline[i++]);
									outline[i] = Math.round(outline[i++]);
								case 'm':
								case 'l':
									outline[i] = Math.round(outline[i++]);
									outline[i] = Math.round(outline[i++]);
									break;
							} 
						}	

						glyph.cached_outline = outline;
					}

					var prevX, prevY;
					
					for (var i = 0; i < outlineLength;) {

						var action = outline[i++];

						var x = Math.round(outline[i++]) + offsetX;
						var y = Math.round(outline[i++]);
	
						switch(action) {
							case 'm':
								vmlSegments.push('xm ', x, ',', y);
								break;
	
							case 'l':
								vmlSegments.push('l ', x, ',', y);
								break;

							case 'q':
								var cpx = outline[i++] + offsetX;
								var cpy = outline[i++];

								var cp1x = Math.round(prevX + 2.0 / 3.0 * (cpx - prevX));
								var cp1y = Math.round(prevY + 2.0 / 3.0 * (cpy - prevY));

								var cp2x = Math.round(cp1x + (x - prevX) / 3.0);
								var cp2y = Math.round(cp1y + (y - prevY) / 3.0);
								
								vmlSegments.push('c ', cp1x, ',', cp1y, ',', cp2x, ',', cp2y, ',', x, ',', y);
								break;

							case 'b':
								var cp1x = Math.round(outline[i++]) + offsetX;
								var cp1y = outline[i++];

								var cp2x = Math.round(outline[i++]) + offsetX;
								var cp2y = outline[i++];

								vmlSegments.push('c ', cp1x, ',', cp1y, ',', cp2x, ',', cp2y, ',', x, ',', y);
								break;
						}

						prevX = x;
						prevY = y;
					}					
				}

				vmlSegments.push('x e');
				return vmlSegments;
			},

			_renderWord: function(face, style, text) {
				var offsetX = 0;
				var shape = this.initializeSurface(face, style, text);
		
				var letterSpacingPoints = 
					style.letterSpacing && style.letterSpacing != 'normal' ? 
						this.pointsFromPixels(face, style, style.letterSpacing) : 
						0;

				letterSpacingPoints = Math.round(letterSpacingPoints);
				var chars = text.split('');
				var vmlSegments = [];
				for (var i = 0; i < chars.length; i++) {
					var char = chars[i];
					vmlSegments = this.renderGlyph(shape, face, char, offsetX, style, vmlSegments);
					offsetX += face.glyphs[char].ha + letterSpacingPoints ;	
				}

				if (style.textDecoration == 'underline') {
					var posY = face.underlinePosition - (face.underlineThickness / 2);
					vmlSegments.push('xm ', 0, ',', posY);
					vmlSegments.push('l ', offsetX, ',', posY);
					vmlSegments.push('l ', offsetX, ',', posY + face.underlineThickness);
					vmlSegments.push('l ', 0, ',', posY + face.underlineThickness);
					vmlSegments.push('l ', 0, ',', posY);
					vmlSegments.push('x e');
				}

				// make sure to preserve trailing whitespace
				shape.path += vmlSegments.join('') + 'm ' + offsetX + ' 0 l ' + offsetX + ' ' + face.ascender;
				
				return {
					element: shape,
					width: Math.floor(this.pixelsFromPoints(face, style, offsetX, 'horizontal'))
				};
			}

		}

	},

	setVectorBackend: function(backend) {

		this.vectorBackend = backend;
		var backendFunctions = ['renderWord', 'initializeSurface', 'renderGlyph'];

		for (var i = 0; i < backendFunctions.length; i++) {
			var backendFunction = backendFunctions[i];
			this[backendFunction] = this.vectorBackends[backend]['_' + backendFunction];
		}
	},
	
	initialize: function() {

		// quit if this function has already been called
		if (arguments.callee.done) return; 
		
		// flag this function so we don't do the same thing twice
		arguments.callee.done = true;

		// kill the timer
		if (window._typefaceTimer) clearInterval(_typefaceTimer);

		this.renderDocument( function(e) { e.style.visibility = 'visible' } );

	}
	
};

// IE won't accept real selectors...
var typefaceSelectors = ['.typeface-js', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

if (document.createStyleSheet) { 

	var styleSheet = document.createStyleSheet();
	for (var i = 0; i < typefaceSelectors.length; i++) {
		var selector = typefaceSelectors[i];
		styleSheet.addRule(selector, 'visibility: hidden');
	}

	styleSheet.addRule(
		'.typeface-js-selected-text', 
		'-ms-filter: \
			"Chroma(color=black) \
			progid:DXImageTransform.Microsoft.MaskFilter(Color=white) \
			progid:DXImageTransform.Microsoft.MaskFilter(Color=blue) \
			alpha(opacity=30)" !important; \
		color: black; \
		font-family: Modern; \
		position: absolute; \
		white-space: pre; \
		filter: alpha(opacity=0) !important;'
	);

	styleSheet.addRule(
		'.typeface-js-vector-container',
		'position: relative'
	);

} else if (document.styleSheets) {

	if (!document.styleSheets.length) { (function() {
		// create a stylesheet if we need to
		var styleSheet = document.createElement('style');
		styleSheet.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(styleSheet);
	})() }

	var styleSheet = document.styleSheets[0];
	document.styleSheets[0].insertRule(typefaceSelectors.join(',') + ' { visibility: hidden; }', styleSheet.cssRules.length); 

	document.styleSheets[0].insertRule(
		'.typeface-js-selected-text { \
			color: rgba(128, 128, 128, 0); \
			opacity: 0.30; \
			position: absolute; \
			font-family: Arial, sans-serif; \
			white-space: pre \
		}', 
		styleSheet.cssRules.length
	);

	try { 
		// set selection style for Mozilla / Firefox
		document.styleSheets[0].insertRule(
			'.typeface-js-selected-text::-moz-selection { background: blue; }', 
			styleSheet.cssRules.length
		); 

	} catch(e) {};

	try { 
		// set styles for browsers with CSS3 selectors (Safari, Chrome)
		document.styleSheets[0].insertRule(
			'.typeface-js-selected-text::selection { background: blue; }', 
			styleSheet.cssRules.length
		); 

	} catch(e) {};

	// most unfortunately, sniff for WebKit's quirky selection behavior
	if (/WebKit/i.test(navigator.userAgent)) {
		document.styleSheets[0].insertRule(
			'.typeface-js-vector-container { position: relative }',
			styleSheet.cssRules.length
		);
	}

}

var backend =  window.CanvasRenderingContext2D || document.createElement('canvas').getContext ? 'canvas' : !!(window.attachEvent && !window.opera) ? 'vml' : null;

if (backend == 'vml') {

	document.namespaces.add("v","urn:schemas-microsoft-com:vml","#default#VML");

	var styleSheet = document.createStyleSheet();
	styleSheet.addRule('v\\:shape', "display: inline-block;");
}

_typeface_js.setVectorBackend(backend);
window._typeface_js = _typeface_js;
	
if (/WebKit/i.test(navigator.userAgent)) {

	var _typefaceTimer = setInterval(function() {
		if (/loaded|complete/.test(document.readyState)) {
			_typeface_js.initialize(); 
		}
	}, 10);
}

if (document.addEventListener) {
	window.addEventListener('DOMContentLoaded', function() { _typeface_js.initialize() }, false);
} 

/*@cc_on @*/
/*@if (@_win32)

document.write("<script id=__ie_onload_typeface defer src=//:><\/script>");
var script = document.getElementById("__ie_onload_typeface");
script.onreadystatechange = function() {
	if (this.readyState == "complete") {
		_typeface_js.initialize(); 
	}
};

/*@end @*/

try { console.log('initializing typeface.js') } catch(e) {};

})();
;
if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace({"glyphs":{"S":{"x_min":35.875,"x_max":866.734375,"ha":901,"o":"m 422 1011 q 793 851 691 1015 q 814 805 807 829 q 829 754 822 782 q 831 728 832 743 q 825 707 830 714 q 805 696 818 698 q 777 694 793 694 l 690 694 q 665 694 677 694 q 644 697 652 694 q 623 719 627 704 q 612 750 619 735 q 597 779 607 764 q 576 803 587 794 q 538 826 556 817 q 497 838 522 833 q 447 844 473 843 q 397 843 422 846 q 352 832 372 840 q 303 799 320 818 q 279 743 286 780 q 277 721 276 733 q 281 703 279 710 q 313 662 293 673 q 361 639 333 650 q 392 628 376 632 q 425 619 408 625 q 502 598 462 607 q 580 578 541 589 q 594 575 587 575 q 608 572 601 575 q 666 554 636 562 q 719 530 695 546 q 784 483 757 507 q 834 422 811 460 q 846 397 841 411 q 857 369 851 383 q 858 362 858 365 q 859 355 858 358 q 865 300 865 333 q 865 286 868 293 l 865 261 q 860 232 862 246 q 854 204 858 218 q 836 158 845 179 q 812 118 826 137 q 801 106 807 111 q 791 94 795 101 q 776 78 784 86 q 758 64 768 71 q 743 53 751 58 q 727 41 736 47 q 678 16 704 26 q 625 -2 652 7 q 584 -11 605 -9 q 543 -18 563 -13 q 524 -20 533 -20 q 506 -22 515 -19 l 495 -22 q 488 -21 493 -22 q 480 -22 483 -20 q 456 -23 473 -23 q 433 -22 440 -23 l 419 -22 q 399 -20 409 -19 q 380 -18 388 -20 q 368 -17 373 -18 q 355 -15 362 -16 q 320 -8 338 -10 q 287 0 302 -5 q 168 56 219 22 q 81 146 116 90 q 47 225 59 179 q 43 241 44 233 q 40 260 43 250 q 36 287 37 271 q 41 311 34 303 q 61 324 48 322 q 91 326 75 326 l 179 326 q 202 326 190 326 q 225 322 215 326 q 243 299 240 315 q 252 266 245 283 q 266 236 258 250 q 284 210 275 222 q 300 194 291 201 q 316 182 308 187 q 391 150 347 162 q 410 147 401 147 q 430 144 419 147 l 437 144 q 468 141 448 141 q 498 144 487 141 q 512 146 502 146 q 527 148 519 147 q 541 151 534 148 q 616 185 588 164 q 655 254 644 205 q 656 276 658 264 q 651 296 654 289 q 604 354 637 333 q 588 362 600 357 q 542 382 568 375 q 491 398 516 390 q 472 403 481 401 q 452 408 463 405 q 407 420 430 415 q 363 432 384 425 q 352 435 356 435 q 343 437 348 435 q 322 443 331 440 q 302 448 313 446 q 241 471 270 460 q 187 498 212 483 q 129 547 155 519 q 87 611 102 575 q 79 637 81 623 q 72 665 76 650 q 68 701 69 678 q 69 740 66 725 q 70 757 70 746 q 77 786 75 772 q 86 814 80 800 q 139 896 106 862 q 215 958 172 930 q 275 985 243 975 q 343 1003 306 994 q 370 1006 356 1005 q 397 1010 383 1007 q 410 1010 401 1011 q 422 1011 419 1008 "},"/":{"x_min":0.921875,"x_max":517.171875,"ha":515,"o":"m 406 1013 l 456 1013 q 471 1013 463 1013 q 486 1013 479 1014 l 491 1013 q 506 1007 500 1010 q 515 997 512 1004 q 516 985 518 991 q 513 973 515 979 q 507 954 511 963 q 500 935 504 945 q 494 919 497 927 q 488 903 491 912 q 465 840 476 872 q 440 777 454 809 q 419 719 429 748 q 397 660 409 690 q 393 650 394 655 q 390 640 393 645 q 370 587 379 613 q 351 535 362 562 q 331 483 340 510 q 312 430 323 456 q 261 295 284 363 q 209 160 237 227 q 186 99 197 130 q 165 38 176 69 q 153 8 158 23 q 134 -15 148 -7 q 102 -22 123 -22 q 62 -22 81 -22 q 36 -22 50 -22 q 13 -18 23 -22 q 2 -6 5 -14 q 1 10 0 1 q 6 28 2 19 q 12 44 9 37 q 40 118 27 80 q 68 192 52 156 q 74 210 72 201 q 80 227 76 219 q 97 275 90 251 q 116 324 105 299 q 129 360 123 342 q 143 397 136 378 q 194 534 170 465 q 245 670 218 603 q 252 688 250 680 q 258 705 254 697 q 274 748 266 726 q 290 791 281 770 q 297 810 294 801 q 305 830 301 820 q 325 885 316 858 q 345 940 334 912 q 359 974 352 955 q 377 1004 365 994 q 395 1011 381 1008 q 401 1012 398 1013 q 406 1013 404 1011 "},"K":{"x_min":96.21875,"x_max":987.671875,"ha":1003,"o":"m 134 990 l 241 990 q 285 988 267 990 q 310 963 303 986 q 312 949 312 957 q 312 933 312 941 l 312 877 l 312 697 l 312 666 q 312 641 312 654 q 316 619 312 629 q 321 613 317 616 q 327 611 324 611 q 346 616 337 608 q 359 629 355 625 q 381 651 370 640 q 402 675 392 662 q 413 684 406 677 q 424 696 418 690 q 434 709 430 702 q 439 713 437 712 q 445 718 442 715 q 462 736 452 729 q 478 754 471 744 q 493 772 487 765 q 500 777 496 773 q 538 818 517 800 q 575 858 559 836 l 582 865 q 591 873 587 869 q 599 883 595 877 q 602 886 600 886 q 606 890 603 887 q 618 905 614 895 q 625 911 621 908 q 632 916 630 913 q 642 929 637 923 q 653 941 648 934 q 658 945 656 944 q 663 950 660 947 q 685 974 673 963 q 717 988 698 984 q 743 991 728 991 q 770 990 757 990 l 877 990 q 909 991 892 990 q 937 984 927 991 q 941 968 945 977 q 934 954 937 959 q 920 941 927 947 q 906 927 913 934 q 887 907 896 916 q 867 887 878 897 q 770 788 818 838 q 673 690 721 738 q 625 643 650 665 q 607 624 616 633 q 596 600 599 615 q 600 578 593 588 q 612 561 607 568 q 640 520 625 540 q 668 479 655 500 q 785 314 727 395 q 902 150 843 233 l 952 79 q 964 63 957 70 q 975 47 970 55 q 985 27 980 40 q 981 8 991 15 q 953 1 971 1 q 920 1 935 1 l 810 1 q 780 0 795 1 q 752 2 764 0 q 728 18 737 8 q 710 41 718 29 q 694 64 702 52 q 678 88 687 76 q 602 202 641 147 q 524 316 563 258 q 494 362 509 340 q 464 406 480 384 q 450 422 459 413 q 428 429 442 431 q 400 410 414 425 q 377 386 387 395 q 363 371 370 379 q 349 356 356 363 q 331 338 339 347 q 317 316 323 329 q 312 298 313 308 q 312 277 312 288 l 312 259 q 311 243 310 252 q 312 227 312 234 l 312 162 l 312 63 q 311 34 312 48 q 303 12 310 20 q 282 2 296 4 q 253 1 269 1 l 159 1 q 130 2 144 1 q 106 9 116 2 q 97 35 97 16 q 97 72 97 54 l 97 233 l 97 787 l 97 916 q 96 948 97 932 q 101 975 95 965 q 123 988 109 984 q 128 989 126 990 q 134 990 131 988 "},"7":{"x_min":54.171875,"x_max":715.328125,"ha":772,"o":"m 93 971 l 554 971 l 657 971 q 687 969 673 971 q 708 957 701 968 q 714 938 713 950 q 715 914 715 926 l 715 857 q 715 830 715 843 q 711 807 715 818 q 700 791 707 798 q 687 776 694 783 q 677 768 682 770 q 670 758 675 762 q 661 750 665 754 q 643 727 652 739 q 625 705 633 716 q 505 494 555 608 q 475 414 488 455 q 448 332 462 373 q 438 294 441 312 q 430 258 434 276 q 420 213 423 236 q 412 168 418 191 q 411 154 411 161 q 408 141 411 148 q 405 113 406 126 q 401 84 404 100 q 400 72 400 77 q 400 59 401 66 l 400 43 q 392 18 395 27 q 373 2 388 8 q 354 0 365 0 q 331 1 343 1 l 245 1 q 217 2 230 1 q 197 15 204 4 q 192 37 193 22 q 194 63 191 52 q 197 82 197 72 q 200 101 197 91 q 207 143 205 122 q 216 186 209 165 q 234 255 226 220 q 254 322 243 290 q 259 336 256 329 q 263 351 261 344 q 286 405 275 379 q 308 459 297 432 q 352 548 327 505 q 402 633 376 591 q 436 683 419 658 q 470 733 452 708 q 483 750 473 739 q 490 772 493 762 q 480 784 487 782 q 463 789 473 786 l 451 789 q 438 790 445 791 q 423 790 430 790 l 369 790 l 156 790 q 109 789 137 790 q 69 795 80 788 q 56 810 59 801 q 54 827 54 817 q 54 847 54 837 l 54 909 q 54 934 54 922 q 59 955 54 947 q 80 969 65 965 q 86 970 83 971 q 93 971 90 969 "},"d":{"x_min":46.625,"x_max":775,"ha":849,"o":"m 775 79 q 775 41 775 60 q 766 11 775 22 q 748 2 759 4 q 723 0 737 0 l 647 0 q 622 1 633 0 q 603 7 610 1 q 592 25 593 14 q 586 47 591 36 q 582 52 584 50 q 577 57 580 54 q 554 50 561 57 q 541 36 548 43 q 523 24 531 29 q 504 12 514 19 q 493 7 499 10 q 479 1 486 4 q 438 -10 460 -5 q 425 -13 431 -13 q 414 -14 420 -13 q 402 -15 407 -14 q 391 -16 398 -16 l 378 -16 q 353 -18 370 -19 q 329 -14 336 -17 q 312 -12 320 -12 q 296 -10 304 -13 q 263 0 279 -5 q 232 11 248 4 q 145 76 184 32 q 85 168 107 119 q 74 198 78 183 q 64 228 70 212 q 63 238 63 233 q 60 250 63 243 q 55 274 57 261 q 50 301 53 287 q 50 311 49 306 q 49 321 50 317 q 49 334 49 328 q 48 347 49 340 q 46 363 46 354 q 48 378 46 372 q 49 391 49 385 q 49 404 49 397 q 50 417 50 411 q 52 431 49 424 q 57 460 54 446 q 63 487 59 474 q 73 519 68 504 q 84 550 77 535 q 132 629 103 592 q 140 637 135 633 q 148 644 145 640 q 159 657 153 651 q 171 668 164 662 q 181 676 177 671 q 191 683 185 681 q 271 722 225 707 q 291 726 281 725 q 313 731 302 728 q 338 734 323 733 q 368 735 353 735 q 398 733 384 735 q 423 729 413 732 q 463 717 443 722 q 499 701 482 711 q 517 688 509 694 q 535 675 525 682 q 551 664 541 671 q 571 664 561 657 q 577 674 577 667 q 580 687 577 681 l 580 701 q 581 711 581 706 q 581 722 581 717 l 581 911 q 580 945 581 926 q 586 974 579 964 q 607 988 592 985 q 612 988 610 989 q 618 989 615 988 l 716 989 q 747 987 733 989 q 768 976 761 986 q 775 948 775 965 q 775 914 775 931 l 775 79 m 587 351 q 587 363 588 356 q 587 375 587 369 q 585 402 587 388 q 581 427 584 416 q 576 455 578 443 q 568 479 574 468 q 512 558 549 529 q 406 587 475 587 q 384 584 398 587 q 364 579 373 581 q 346 573 355 577 q 288 526 309 558 q 255 454 267 494 q 249 426 250 440 q 243 397 248 412 l 243 377 q 242 343 241 365 q 246 312 243 322 q 247 304 246 308 q 248 298 248 301 q 252 277 250 287 q 257 256 255 268 q 338 150 281 184 q 388 130 356 137 q 405 129 393 129 q 418 127 409 127 q 432 127 427 126 q 455 131 443 130 q 477 137 466 133 q 532 176 512 152 q 568 236 553 200 q 577 261 574 248 q 582 290 580 275 q 583 303 584 297 q 585 316 582 309 q 587 326 587 320 q 587 338 587 331 l 587 351 "},",":{"x_min":85,"x_max":300.765625,"ha":386,"o":"m 300 58 q 300 5 300 34 q 295 -43 301 -23 q 259 -128 283 -94 q 195 -186 236 -162 q 139 -214 169 -204 q 125 -219 133 -216 q 109 -220 116 -222 q 93 -212 98 -218 q 85 -181 86 -204 q 90 -145 85 -158 q 107 -125 96 -132 q 130 -109 119 -118 q 169 -62 152 -94 q 177 -45 172 -57 q 179 -25 182 -34 q 155 -1 175 -5 q 124 1 140 2 q 97 6 108 0 q 87 27 89 13 q 85 56 85 41 l 85 148 q 85 174 85 161 q 90 195 85 187 q 112 211 97 206 q 119 210 115 211 q 126 213 123 209 l 240 213 q 271 211 257 213 q 293 198 286 209 q 300 177 300 190 q 300 151 300 165 l 300 58 l 300 58 "},"Y":{"x_min":8.59375,"x_max":919.5,"ha":926,"o":"m 40 991 l 162 991 q 197 991 179 991 q 226 985 215 991 q 251 959 241 978 q 272 926 262 940 q 316 851 295 888 q 360 776 337 813 q 394 719 378 748 q 427 663 409 691 q 441 639 434 652 q 463 623 448 626 q 480 630 473 621 q 491 644 487 638 q 514 683 503 663 q 537 721 524 702 q 594 817 566 769 q 650 913 621 865 q 674 955 662 931 q 706 987 687 978 q 746 992 719 994 q 792 991 773 991 l 870 991 q 893 990 881 991 q 912 985 905 990 q 917 964 923 978 q 907 942 912 949 q 875 887 891 915 q 842 833 859 860 q 751 683 795 758 q 662 533 707 608 q 633 487 646 510 q 606 441 620 464 q 586 410 595 426 q 571 376 577 395 q 571 362 570 369 q 570 349 571 356 q 569 339 569 345 q 569 328 569 334 l 569 285 l 569 105 q 569 48 569 78 q 553 8 570 17 q 532 3 545 3 q 506 3 519 3 l 409 3 q 381 4 394 3 q 362 13 369 5 q 355 33 355 21 q 354 59 355 44 l 354 113 l 354 294 l 354 346 q 354 364 354 355 q 351 380 354 373 q 335 417 345 401 q 315 449 326 434 q 290 493 302 471 q 263 537 277 514 q 244 569 252 552 q 224 602 235 587 q 155 716 188 659 q 87 830 122 773 q 55 883 70 858 q 24 937 40 909 q 13 955 20 942 q 10 978 5 969 q 18 986 13 984 q 28 990 23 988 q 34 990 31 991 q 40 991 37 990 "},"E":{"x_min":96,"x_max":845.765625,"ha":900,"o":"m 133 991 l 652 991 l 773 991 q 805 989 790 991 q 827 978 820 988 q 831 968 830 974 q 834 957 831 963 l 834 942 q 835 921 836 932 q 834 900 834 910 q 835 878 834 889 q 834 858 836 868 q 833 837 833 851 q 819 815 829 821 q 798 810 811 810 q 772 810 786 810 l 676 810 l 424 810 q 399 810 413 810 q 370 810 384 811 q 342 807 355 810 q 324 801 330 805 q 313 781 315 794 q 311 751 311 768 l 311 672 l 311 632 q 316 613 313 621 q 326 601 319 606 q 345 595 334 596 q 369 595 356 595 l 444 595 l 683 595 q 707 595 692 595 q 736 595 722 596 q 761 593 749 595 q 779 588 773 592 q 788 571 786 583 q 792 544 791 558 q 792 514 792 529 q 791 487 791 498 q 791 468 791 478 q 788 451 791 458 q 777 433 786 440 q 758 428 770 429 q 732 426 747 426 q 703 427 717 426 q 679 428 688 428 l 408 428 q 376 428 391 428 q 347 427 361 429 q 325 418 334 425 q 312 400 316 412 q 311 385 311 393 q 311 371 311 377 l 311 318 l 311 240 q 313 210 311 223 q 324 190 315 197 q 335 185 329 186 q 348 182 341 184 l 362 182 q 377 181 369 180 q 392 182 386 182 l 451 182 l 712 182 l 786 182 q 807 182 797 182 q 826 177 817 182 q 841 162 837 173 q 845 145 844 155 q 845 124 845 136 l 845 60 q 844 29 845 44 q 831 7 842 14 q 810 1 823 1 q 781 1 797 1 l 677 1 l 266 1 l 157 1 q 123 3 137 1 q 101 16 108 5 q 96 37 96 24 q 96 63 96 51 l 96 163 l 96 541 l 96 845 l 96 931 q 96 956 96 943 q 101 975 96 968 q 122 989 107 985 q 127 990 125 991 q 133 991 130 989 "},"y":{"x_min":6.671875,"x_max":716.171875,"ha":721,"o":"m 36 720 l 141 720 q 169 720 155 720 q 193 714 183 720 q 215 679 209 702 q 229 635 222 655 q 240 601 236 619 q 252 566 245 583 q 273 503 263 534 q 294 441 283 472 l 323 354 q 331 328 327 341 q 340 302 334 315 q 349 277 344 291 q 369 265 354 263 q 374 268 372 267 q 379 272 376 269 q 386 285 383 279 q 391 299 388 292 q 402 332 398 315 q 412 366 406 349 q 450 481 431 424 q 487 597 468 538 q 499 635 494 616 q 511 672 504 654 q 518 693 515 683 q 531 711 522 704 q 552 719 540 718 q 580 720 565 720 l 665 720 q 691 718 679 720 q 711 710 704 717 q 713 684 719 700 q 707 662 711 673 q 698 640 702 651 q 661 541 679 591 q 623 441 643 490 q 608 399 615 420 q 593 357 601 377 q 579 319 586 337 q 565 281 572 301 q 513 142 537 212 q 461 3 488 72 q 454 -14 456 -5 q 448 -30 452 -22 q 427 -82 437 -57 q 406 -130 418 -107 q 380 -172 395 -153 q 343 -207 365 -191 q 303 -227 325 -219 q 256 -242 281 -235 q 234 -244 245 -244 q 212 -247 223 -244 l 176 -247 q 150 -247 165 -247 q 120 -245 134 -247 q 93 -242 105 -244 q 76 -235 81 -240 q 67 -222 69 -230 q 62 -203 65 -215 l 62 -170 q 62 -120 62 -147 q 79 -87 62 -94 q 97 -83 86 -84 q 118 -85 109 -83 l 152 -85 l 169 -85 q 180 -84 175 -84 q 191 -81 186 -84 q 247 -24 234 -69 q 252 -8 250 -19 q 252 11 255 2 q 250 25 250 18 q 247 39 250 32 q 229 93 238 66 q 208 147 219 120 q 188 200 197 173 q 168 252 179 226 q 156 286 161 269 q 144 319 151 302 q 103 427 122 372 q 62 536 84 483 q 59 545 59 541 q 56 552 59 548 q 38 603 45 577 q 19 652 30 629 q 10 677 16 661 q 8 704 4 693 q 26 718 12 715 q 31 719 29 720 q 36 720 33 718 "},"\"":{"x_min":117.234375,"x_max":522.734375,"ha":643,"o":"m 257 979 q 264 943 265 966 q 264 901 264 920 l 264 612 q 264 583 264 597 q 258 561 264 569 q 237 548 252 551 q 221 546 230 545 q 205 547 213 547 q 159 546 184 547 q 126 558 134 545 q 118 577 119 565 q 118 602 118 588 l 118 887 q 117 935 118 907 q 124 976 116 963 q 142 988 129 983 q 148 989 144 988 q 155 990 151 990 q 182 991 166 990 q 213 991 198 991 q 240 987 227 990 q 257 979 252 984 m 522 612 q 522 584 522 598 q 516 562 522 570 q 495 548 510 551 q 479 546 488 545 q 463 547 471 547 q 418 546 443 547 q 384 558 392 545 q 376 577 377 565 q 376 602 376 588 l 376 887 q 375 935 376 907 q 382 976 374 963 q 400 988 387 983 q 407 989 402 988 q 413 990 411 990 q 440 991 425 990 q 470 991 455 991 q 496 988 484 990 q 514 980 508 986 q 522 946 523 969 q 522 902 522 923 l 522 612 "},"g":{"x_min":52.78125,"x_max":763.953125,"ha":849,"o":"m 752 708 q 763 685 762 701 q 763 652 763 669 l 763 59 q 763 37 763 48 q 762 16 762 27 q 760 -3 761 5 q 758 -23 759 -12 q 749 -60 752 -43 q 738 -93 745 -78 q 678 -180 715 -146 q 588 -237 641 -215 q 558 -248 573 -244 q 526 -257 543 -253 q 495 -262 511 -261 q 465 -267 480 -264 q 454 -267 459 -267 q 441 -268 448 -268 q 429 -268 436 -269 q 415 -269 422 -268 q 397 -270 408 -270 q 379 -269 386 -270 q 366 -269 372 -269 q 355 -268 361 -269 q 332 -265 344 -265 q 311 -263 320 -265 q 304 -261 308 -261 q 297 -260 300 -261 q 270 -253 283 -257 q 244 -244 256 -250 q 150 -188 191 -222 q 88 -97 108 -154 q 86 -89 86 -93 q 84 -82 86 -84 q 88 -55 80 -64 q 109 -43 95 -46 q 140 -41 123 -40 q 173 -41 158 -41 l 220 -41 q 232 -42 227 -41 q 244 -43 237 -43 q 272 -57 266 -48 q 288 -82 277 -66 q 301 -96 293 -87 q 304 -100 302 -98 q 306 -104 305 -101 q 330 -119 318 -112 q 358 -132 343 -126 q 377 -135 368 -134 q 398 -139 387 -136 l 413 -139 q 438 -139 423 -141 q 462 -134 454 -137 q 474 -132 469 -132 q 484 -129 479 -132 q 533 -96 513 -116 q 565 -47 552 -75 q 569 -30 568 -39 q 573 -12 570 -22 q 577 14 576 0 q 577 44 577 28 q 578 55 577 49 q 577 65 579 60 q 575 77 575 71 q 573 88 576 83 q 570 92 572 91 q 565 96 568 94 q 545 91 552 98 q 530 78 537 84 q 505 60 518 69 q 477 45 493 52 q 447 34 462 38 q 415 26 431 30 q 399 24 406 24 q 384 21 391 23 q 362 20 377 20 q 340 21 347 20 l 329 21 q 320 23 325 23 q 309 24 315 23 q 272 32 290 28 q 238 42 254 35 q 142 108 179 66 q 80 210 105 151 q 70 242 73 226 q 62 276 68 259 q 61 287 62 283 q 58 311 58 298 q 55 335 58 324 q 54 349 54 342 q 54 362 54 355 q 52 379 52 369 q 54 397 52 390 l 54 410 q 54 422 55 416 q 56 433 54 427 q 61 460 59 447 q 65 487 62 473 q 82 540 73 515 q 105 587 91 565 q 121 612 112 601 q 140 637 130 624 q 152 651 144 644 q 166 663 159 658 l 175 672 q 188 682 181 677 q 202 691 195 687 q 240 710 220 702 q 283 726 259 719 q 306 731 294 730 q 329 734 318 731 q 344 734 334 735 q 356 735 354 733 q 436 727 401 737 q 500 699 472 717 q 508 693 504 697 q 518 685 512 690 q 533 672 526 678 q 550 659 540 665 q 557 656 552 658 q 565 658 562 655 q 573 667 572 660 q 577 681 575 674 q 582 696 580 688 q 590 709 584 703 q 610 715 598 715 q 634 716 622 716 l 705 716 q 732 715 720 716 q 752 708 744 715 m 562 279 q 572 311 568 291 q 577 352 576 330 q 578 394 579 373 q 573 431 577 415 q 571 441 570 437 q 570 450 572 444 q 565 469 568 459 q 558 487 562 479 q 502 562 538 536 q 397 588 466 588 q 389 586 394 586 q 380 586 384 587 q 362 581 370 583 q 345 576 354 579 q 290 530 309 561 q 258 462 270 500 q 255 451 255 455 q 254 440 255 447 q 248 395 250 425 q 251 348 247 366 l 251 334 q 255 313 254 323 q 259 291 256 302 q 290 228 272 255 q 340 184 308 201 q 379 170 354 177 q 394 169 388 170 q 402 168 397 169 q 411 169 408 168 l 425 169 q 448 173 437 172 q 470 180 459 175 q 527 219 505 194 q 562 279 548 244 "},"ƒ":{"x_min":1.390625,"x_max":701.4375,"ha":772,"o":"m 583 1013 q 611 1014 595 1013 q 643 1013 627 1015 q 671 1010 658 1012 q 691 1002 684 1008 q 699 989 697 998 q 701 970 701 980 q 699 949 701 959 q 695 930 697 938 q 693 919 693 924 q 691 908 693 913 q 688 892 688 899 q 683 880 687 885 q 650 866 673 866 l 638 866 q 631 867 636 867 q 623 867 626 867 q 614 867 619 866 q 605 866 609 867 q 581 860 593 863 q 562 851 570 858 q 537 823 545 840 q 523 785 529 806 q 520 772 520 779 q 518 756 520 765 q 513 733 515 745 q 508 708 511 720 q 500 670 504 690 q 494 631 497 651 q 495 621 493 626 q 500 613 497 616 q 529 599 508 599 q 572 598 550 598 q 585 598 579 598 q 597 597 591 598 q 616 573 615 590 q 612 537 618 556 q 609 520 609 529 q 607 505 609 512 q 600 485 604 494 q 586 473 595 477 q 563 469 576 469 q 536 469 550 469 q 508 470 522 470 q 483 466 494 470 q 461 447 466 460 q 452 416 456 434 q 447 386 448 401 q 441 356 445 372 q 441 349 441 353 q 440 341 440 345 q 434 310 436 326 q 429 278 431 294 q 423 251 425 265 q 418 223 422 238 q 404 146 408 185 q 390 69 400 106 q 388 60 388 65 q 387 51 388 55 q 379 11 381 31 q 370 -27 377 -8 q 358 -66 363 -47 q 344 -104 352 -86 q 304 -164 329 -137 q 245 -207 279 -191 q 229 -212 237 -209 q 213 -218 222 -215 q 152 -230 186 -228 q 81 -233 118 -233 q 47 -233 66 -233 q 18 -228 29 -233 q 4 -215 9 -225 q 1 -199 1 -208 q 2 -183 1 -190 q 7 -157 5 -171 q 12 -132 9 -144 q 15 -116 15 -123 q 19 -102 16 -109 q 31 -91 25 -94 q 50 -86 38 -89 q 65 -86 56 -84 q 80 -86 73 -87 l 90 -86 q 122 -76 108 -82 q 147 -59 137 -71 q 163 -28 158 -44 q 175 8 169 -12 q 177 24 177 16 q 180 38 177 31 q 194 108 188 73 q 208 177 200 144 q 211 197 211 188 q 215 216 212 206 q 219 239 218 227 q 223 262 220 251 q 235 326 230 294 q 248 390 240 358 q 254 424 251 402 q 250 456 256 445 q 233 467 244 465 q 209 469 222 469 q 183 468 197 469 q 159 472 169 467 q 143 494 147 477 q 143 513 140 501 q 148 533 145 526 q 157 574 154 556 q 186 598 161 591 l 213 598 q 255 599 236 598 q 284 615 275 601 q 293 634 291 623 q 297 658 294 645 q 304 692 301 674 q 311 727 306 710 q 313 740 313 734 q 315 754 312 747 q 325 799 322 776 q 336 844 329 822 q 359 896 347 873 q 388 941 372 919 q 396 949 391 945 q 405 956 401 954 q 419 967 412 962 q 433 979 426 973 q 470 995 450 990 q 512 1006 490 1001 q 535 1009 523 1009 q 558 1012 547 1009 q 572 1012 563 1013 q 583 1013 580 1010 "},"e":{"x_min":40.734375,"x_max":755.609375,"ha":797,"o":"m 754 364 q 754 339 757 353 q 744 321 751 325 q 724 314 737 316 q 695 311 711 312 q 663 311 679 310 q 634 312 647 312 l 295 312 q 277 312 286 312 q 261 309 268 312 q 247 298 250 303 q 241 287 244 295 q 240 273 238 280 q 243 257 243 264 q 247 241 244 249 q 274 186 258 208 q 318 148 290 165 q 341 139 329 141 q 365 133 352 137 q 395 128 376 130 q 429 130 415 127 l 441 130 q 467 136 455 133 q 490 144 479 140 q 521 162 504 151 q 547 184 538 173 q 561 203 554 194 q 580 216 569 212 q 616 222 594 223 q 655 222 637 222 q 672 222 663 222 q 688 221 682 223 l 702 221 q 722 214 716 218 q 728 201 727 211 q 726 184 729 191 q 711 150 719 165 q 691 119 702 134 q 622 45 661 73 q 525 -1 583 18 q 494 -8 509 -6 q 462 -13 479 -9 q 450 -14 456 -15 q 438 -15 444 -13 l 423 -15 q 407 -17 416 -17 q 391 -15 398 -16 q 372 -15 380 -13 q 354 -13 363 -16 q 338 -10 347 -10 q 323 -8 330 -10 q 293 -1 308 -5 q 265 8 277 1 q 236 18 250 14 q 212 30 223 23 q 133 95 168 58 q 76 180 98 132 q 65 211 69 196 q 54 244 61 227 q 52 255 52 250 q 51 265 52 259 q 44 301 45 282 q 41 340 43 320 q 40 355 41 347 q 41 370 40 363 l 41 387 l 45 420 q 55 466 51 444 q 68 508 59 488 q 270 712 127 652 q 310 724 290 720 q 352 733 330 727 q 373 734 363 734 q 394 736 383 734 q 516 720 465 737 q 607 674 566 702 q 632 656 619 666 q 654 634 644 645 q 665 623 658 627 q 686 592 676 608 q 707 559 695 576 q 718 533 713 546 q 729 505 723 520 q 740 467 736 487 q 750 428 744 448 q 752 404 752 417 q 754 380 751 391 l 754 364 m 545 446 q 547 480 555 460 q 536 510 540 500 q 484 568 516 548 q 395 590 452 588 q 386 588 391 587 q 376 588 380 590 q 361 585 369 585 q 345 581 352 584 q 255 505 284 562 q 249 490 252 499 q 244 472 245 481 q 245 454 243 463 q 254 440 247 446 q 284 434 265 434 q 322 434 304 434 l 476 434 q 517 434 495 434 q 545 446 538 435 "},"J":{"x_min":21.453125,"x_max":676.046875,"ha":772,"o":"m 497 990 l 615 990 q 644 988 630 990 q 665 981 658 987 q 672 960 670 974 q 675 932 675 947 q 675 901 676 917 q 675 874 675 886 l 675 594 l 675 358 q 675 292 675 326 q 669 230 676 258 q 667 217 666 223 q 665 204 668 211 q 658 178 661 192 q 650 153 655 165 q 562 36 619 76 q 520 12 543 22 q 472 -5 497 3 q 451 -10 461 -7 q 429 -14 440 -12 q 405 -17 418 -17 q 379 -20 392 -17 l 364 -20 q 341 -22 356 -23 q 318 -19 327 -21 q 296 -17 303 -19 q 269 -13 282 -14 q 245 -9 256 -12 q 214 0 229 -3 q 185 11 199 4 q 104 64 140 30 q 49 143 68 98 q 39 171 43 157 q 31 200 35 185 q 28 217 28 211 q 26 229 25 223 q 24 242 27 235 q 22 249 22 244 q 22 257 22 254 l 22 271 q 21 285 21 278 q 21 300 21 293 q 22 337 21 319 q 35 361 24 354 q 65 368 46 368 q 100 368 83 368 q 129 369 113 368 q 162 369 146 369 q 191 365 178 368 q 208 355 204 362 q 216 319 218 342 q 218 278 214 297 q 222 262 221 269 q 225 246 222 254 q 239 210 231 226 q 263 183 247 194 q 308 162 279 171 q 368 161 338 154 q 381 164 375 164 q 392 167 386 164 q 447 223 434 183 q 454 249 453 236 q 459 278 456 262 q 459 294 459 286 q 460 310 459 301 q 460 326 461 317 q 460 343 460 335 l 460 410 l 460 782 l 460 915 q 459 947 460 930 q 465 975 458 964 q 486 989 471 983 q 497 990 494 989 "},"|":{"x_min":81.25,"x_max":228.921875,"ha":310,"o":"m 82 -241 l 82 725 l 82 969 q 81 1029 82 998 q 88 1077 80 1059 q 103 1087 93 1084 q 126 1090 113 1090 q 151 1089 139 1090 q 172 1088 164 1088 l 201 1088 q 222 1076 214 1084 q 228 1033 229 1059 q 228 982 228 1007 l 228 759 l 228 54 l 228 -161 l 228 -213 q 228 -229 228 -220 q 228 -244 229 -237 q 227 -252 226 -248 q 226 -263 228 -256 q 215 -287 223 -279 q 201 -293 211 -291 q 180 -294 191 -294 q 158 -293 169 -294 q 139 -293 147 -293 q 114 -293 127 -293 q 94 -287 101 -294 q 82 -256 86 -276 l 82 -241 "},"^":{"x_min":102.78125,"x_max":734.328125,"ha":833,"o":"m 112 442 q 102 459 102 448 q 106 480 102 470 q 128 529 118 505 q 150 579 138 554 q 211 714 180 647 q 273 851 243 781 q 288 885 280 869 q 304 919 297 902 q 313 942 308 930 q 329 961 319 954 q 347 970 334 967 q 355 969 351 971 q 362 971 359 968 l 452 971 q 481 970 468 971 q 505 963 495 969 q 520 946 515 956 q 530 924 525 936 q 543 897 537 911 q 555 867 548 883 q 611 743 583 805 q 666 619 638 681 q 695 556 682 587 q 725 492 709 524 q 732 468 727 484 q 727 445 737 452 q 709 438 723 441 l 700 438 q 684 436 693 435 q 669 437 676 437 q 631 436 651 437 q 598 442 612 435 q 572 473 581 449 q 554 515 562 497 q 513 607 534 560 q 472 699 491 654 q 456 735 463 717 q 438 770 448 754 q 430 783 436 776 q 416 788 425 791 q 404 781 408 785 q 397 769 400 776 q 381 738 387 754 q 368 706 375 722 q 327 613 348 659 q 284 522 305 567 q 266 478 276 502 q 240 444 256 454 q 206 437 229 437 q 166 437 184 437 q 151 436 159 437 q 136 438 143 435 l 127 438 q 119 440 123 440 q 112 442 115 440 "},"q":{"x_min":43.234375,"x_max":772.75,"ha":849,"o":"m 772 -170 q 771 -214 772 -193 q 756 -244 770 -236 q 724 -250 745 -251 q 686 -250 704 -250 q 657 -250 673 -250 q 627 -250 641 -251 q 600 -246 612 -250 q 583 -234 589 -243 q 577 -203 576 -223 q 578 -166 578 -183 l 578 -15 q 578 19 578 0 q 573 48 578 38 q 568 53 571 51 q 564 58 566 55 q 544 53 551 59 q 529 41 537 47 q 503 23 516 31 q 475 8 490 15 q 419 -9 450 -2 q 357 -15 389 -15 q 293 -11 325 -16 q 237 5 262 -5 q 136 77 175 33 q 71 184 97 120 q 61 215 64 200 q 54 247 58 231 q 52 257 51 252 q 51 268 52 262 q 48 292 48 279 q 44 318 47 305 l 44 336 q 43 353 43 343 q 44 370 43 363 q 46 383 46 377 q 46 395 46 388 q 46 409 47 402 q 48 423 46 416 q 52 449 51 436 q 57 475 54 462 q 71 519 64 498 q 87 559 79 540 q 108 597 96 579 q 133 632 121 615 q 161 659 146 647 q 166 666 165 663 q 179 675 173 670 q 190 684 184 680 q 231 707 209 698 q 276 725 252 716 q 301 730 289 729 q 326 734 314 732 q 341 734 330 736 q 355 736 352 733 q 439 728 400 737 q 505 702 477 719 q 522 691 514 697 q 537 680 530 686 q 552 667 546 673 q 573 661 558 661 q 578 666 576 663 q 583 670 580 668 q 589 692 587 682 q 600 709 590 702 q 620 716 607 715 q 647 716 633 716 l 713 716 q 733 716 723 716 q 751 713 742 716 q 766 701 760 711 q 772 675 773 691 q 772 643 772 658 l 772 -170 m 584 348 q 584 355 585 351 q 584 362 584 359 q 582 388 582 376 q 579 412 582 401 q 578 420 577 416 q 577 427 579 423 q 572 447 574 438 q 567 466 570 456 q 530 536 554 506 q 469 580 506 565 q 436 588 453 587 q 399 588 419 588 q 390 586 395 586 q 378 586 384 587 q 362 581 370 583 q 347 576 353 579 q 283 523 306 558 q 248 443 260 488 q 244 422 245 431 q 241 402 244 413 q 240 388 241 393 q 237 364 238 381 q 240 340 237 347 l 240 327 q 241 316 241 322 q 242 306 241 311 q 243 300 242 304 q 244 293 244 295 q 248 272 247 281 q 253 252 249 262 q 283 193 265 218 q 328 150 301 168 q 372 133 348 138 q 379 131 376 131 q 388 130 383 131 q 401 128 392 129 q 417 129 410 127 q 425 129 420 130 q 434 130 430 129 q 453 134 444 133 q 472 138 462 136 q 529 179 508 154 q 566 240 551 204 q 573 263 570 251 q 579 288 576 276 q 580 298 579 294 q 581 308 581 302 q 584 331 584 322 l 584 348 "},"b":{"x_min":75,"x_max":796.8125,"ha":849,"o":"m 794 394 q 796 366 796 386 q 795 337 796 345 q 794 325 795 330 q 794 313 794 320 q 791 292 791 302 q 788 270 791 281 q 785 251 788 265 q 778 217 781 234 q 767 184 774 200 q 705 76 742 122 q 606 4 667 30 q 580 -4 594 -1 q 552 -12 567 -8 q 534 -15 544 -15 q 517 -16 525 -15 l 505 -16 q 482 -18 496 -19 q 460 -15 469 -18 l 452 -15 q 437 -13 445 -13 q 420 -11 428 -12 q 371 2 394 -4 q 330 22 349 9 q 314 33 321 27 q 299 45 306 38 q 291 51 295 48 q 282 55 287 54 q 267 50 270 59 q 258 27 260 40 q 248 6 256 13 q 228 0 239 1 q 203 0 217 0 l 137 0 q 117 0 127 0 q 98 1 106 -1 q 77 27 79 8 q 75 69 75 45 l 75 916 q 75 948 75 932 q 81 975 75 965 q 101 987 87 984 q 107 988 104 988 q 113 988 111 987 l 201 988 q 244 986 226 988 q 267 965 262 984 q 270 928 271 951 q 269 888 269 905 l 269 737 q 269 707 269 722 q 271 680 269 691 q 274 668 273 673 q 281 662 275 663 q 289 659 284 659 q 296 661 294 659 q 314 672 306 666 q 332 686 323 679 q 370 707 350 698 q 413 723 389 716 q 435 728 424 727 q 457 732 446 729 q 478 734 467 734 q 500 734 489 734 l 514 734 q 524 734 519 733 q 535 733 530 734 q 564 727 550 729 q 589 719 577 725 q 694 651 653 693 q 762 547 734 609 q 773 512 769 530 q 784 475 778 494 q 787 456 787 465 q 791 436 788 447 q 793 420 794 429 q 794 404 792 412 l 794 394 m 588 263 q 596 298 592 277 q 600 341 599 319 q 600 384 601 362 q 595 420 599 405 q 590 447 591 434 q 583 470 588 459 q 528 553 563 519 q 424 587 492 587 q 415 586 419 587 q 405 586 410 586 q 387 581 395 583 q 370 576 378 579 q 309 525 330 558 q 274 451 288 493 q 269 428 270 440 q 266 405 269 416 q 265 391 265 401 q 264 380 263 386 q 263 369 265 375 q 262 338 260 358 q 266 311 263 319 q 269 287 269 298 q 274 265 270 276 q 304 197 287 226 q 353 150 321 169 q 399 130 376 136 q 405 129 402 130 q 413 129 409 129 q 427 127 417 127 q 444 127 437 126 q 469 132 458 130 q 492 138 481 134 q 553 188 531 156 q 588 263 574 220 "},"D":{"x_min":95.203125,"x_max":972.453125,"ha":1029,"o":"m 971 527 q 971 516 971 523 q 972 501 972 509 q 971 486 972 493 q 971 476 971 479 q 970 457 971 466 q 969 440 969 448 q 967 426 966 433 q 966 412 968 419 q 962 381 964 397 q 957 351 961 366 q 944 306 950 327 q 930 263 939 284 q 872 158 907 205 q 789 77 837 110 q 731 44 761 58 q 666 19 701 30 q 638 12 652 14 q 608 6 623 10 q 595 5 601 5 q 582 3 589 5 q 571 3 576 2 q 558 2 565 3 q 550 1 555 1 q 541 1 544 2 q 514 0 530 -1 q 484 1 497 1 l 161 1 q 121 3 137 1 q 98 21 105 5 q 95 55 94 32 q 96 94 96 78 l 96 910 q 95 945 96 927 q 101 975 94 964 q 122 989 107 984 q 127 990 125 991 q 133 991 130 989 l 507 991 q 524 991 515 991 q 540 991 533 992 l 557 991 q 572 988 564 988 q 587 986 580 989 q 603 984 596 984 q 619 982 611 985 q 657 975 639 978 q 691 964 675 971 q 722 952 707 957 q 751 938 737 946 q 815 895 786 915 l 823 886 q 848 861 837 875 l 861 850 q 877 829 868 839 q 893 807 886 818 q 925 745 911 778 q 950 676 939 712 q 959 639 957 658 q 965 600 961 619 q 966 588 965 593 q 966 578 966 583 q 968 559 969 569 q 971 543 968 550 l 971 527 m 753 461 q 756 483 756 468 q 753 505 756 498 l 753 532 q 750 558 750 544 q 746 583 749 572 q 744 596 743 590 q 742 609 745 602 q 729 652 735 632 q 712 690 723 672 q 664 748 691 723 q 598 789 637 772 q 573 796 585 793 q 548 803 560 800 q 527 805 537 804 q 507 808 518 805 q 496 809 502 810 q 487 810 491 808 l 456 810 q 441 810 449 811 q 424 810 432 810 l 362 810 q 352 808 359 807 q 342 808 346 810 q 328 803 335 805 q 317 794 321 801 q 312 775 312 787 q 312 747 312 762 q 311 709 312 729 q 311 671 311 690 l 311 283 q 310 265 311 275 q 312 248 309 255 l 312 234 q 312 216 312 225 q 316 200 313 207 q 348 182 324 183 q 396 182 371 182 q 506 182 450 182 q 600 198 562 183 q 682 254 652 219 q 732 340 712 288 q 741 365 738 351 q 748 393 743 379 l 748 404 q 750 425 750 414 q 753 447 750 436 l 753 461 "},"z":{"x_min":29.78125,"x_max":688.9375,"ha":721,"o":"m 95 717 l 522 717 l 602 717 q 627 716 615 717 q 647 710 640 715 q 661 689 655 704 l 661 668 q 663 652 663 661 q 662 636 662 643 q 662 600 662 618 q 657 569 662 582 q 644 550 651 558 q 630 534 637 543 q 612 513 622 523 q 594 491 602 502 q 588 486 591 489 q 583 482 586 484 q 567 463 576 472 q 551 445 558 455 q 504 391 529 416 q 456 337 479 366 l 445 326 q 429 308 438 316 q 413 290 420 299 q 397 272 406 280 q 381 255 388 263 q 368 240 375 247 q 355 224 362 233 q 344 211 350 217 q 333 198 338 205 q 323 187 327 192 q 316 174 319 181 q 314 167 315 172 q 316 160 313 163 q 326 151 319 152 q 341 148 333 151 q 372 146 355 145 q 405 147 390 147 l 609 147 q 656 145 634 147 q 686 124 679 144 q 688 109 688 117 q 688 91 688 101 q 688 44 688 70 q 676 7 688 17 q 655 1 668 1 q 627 1 643 1 l 541 1 l 187 1 l 93 1 q 64 1 77 1 q 41 7 51 1 q 31 30 33 14 q 30 60 30 45 q 29 103 30 80 q 34 141 29 126 q 41 157 37 149 q 51 172 45 165 q 73 196 62 184 q 95 222 84 208 q 106 231 102 229 q 148 280 126 258 q 190 327 170 302 q 201 340 195 334 q 211 352 206 345 q 227 370 218 362 q 243 388 236 377 q 248 393 245 391 q 254 398 251 395 q 270 418 261 409 q 286 436 279 426 q 293 444 288 440 q 302 452 298 448 q 326 480 313 468 q 350 507 338 493 q 366 525 356 516 q 377 545 375 533 q 375 558 380 554 q 366 565 370 562 q 329 571 351 572 q 288 571 308 571 l 138 571 q 103 570 122 571 q 73 576 84 569 q 59 602 61 583 q 58 641 58 622 q 57 657 58 648 q 58 672 56 665 l 58 683 q 60 693 59 687 q 63 701 61 698 q 81 714 72 712 q 88 714 84 715 q 95 717 93 714 "},"w":{"x_min":20.203125,"x_max":1110.09375,"ha":1131,"o":"m 52 718 l 155 718 q 184 717 170 718 q 206 711 198 716 q 220 696 215 705 q 227 675 225 687 q 233 651 230 663 q 238 630 236 640 q 267 530 255 581 q 294 429 279 479 q 298 413 297 420 q 302 397 300 405 q 314 354 309 376 q 326 312 319 333 q 333 290 329 302 q 348 274 337 277 q 359 282 355 273 q 366 295 363 291 q 377 335 373 315 q 387 376 380 356 q 394 401 391 388 q 400 427 397 415 q 417 495 409 460 q 434 563 425 530 q 441 592 438 579 q 448 620 444 606 q 459 670 454 641 q 480 711 465 699 q 502 717 490 716 q 530 718 515 718 l 602 718 q 633 716 619 718 q 657 708 647 715 q 666 693 663 702 q 672 676 669 684 q 681 637 677 656 q 691 599 684 619 q 720 488 708 545 q 747 377 732 431 q 756 343 752 360 q 765 310 759 326 q 776 281 770 291 q 779 279 777 280 q 783 276 782 278 q 799 285 795 277 q 807 302 802 292 q 820 348 815 324 q 833 396 826 373 q 840 423 837 410 q 847 451 843 437 q 872 538 862 494 q 895 624 882 582 q 908 671 902 644 q 926 708 913 698 q 948 716 936 715 q 976 718 961 718 l 1050 718 q 1073 718 1061 718 q 1094 715 1086 718 q 1109 696 1108 709 q 1105 669 1111 684 q 1086 607 1095 637 q 1066 545 1077 577 q 1002 342 1033 444 q 937 138 970 239 q 924 94 930 116 q 911 51 918 73 q 900 23 905 35 q 882 6 895 12 q 845 1 868 0 q 805 2 823 2 q 750 1 783 2 q 702 8 716 1 q 690 23 694 14 q 683 44 686 33 q 672 82 676 63 q 663 120 669 101 q 657 146 659 133 q 648 173 654 159 q 627 256 636 213 q 604 341 618 299 q 590 394 595 366 q 568 438 584 421 q 550 428 554 438 q 543 406 547 417 q 528 351 533 378 q 513 295 523 323 q 488 193 498 245 q 462 91 477 141 q 456 69 459 81 q 451 45 454 56 q 443 24 448 34 q 431 9 438 14 q 412 3 425 3 q 384 2 400 2 l 311 2 l 270 2 q 255 5 262 3 q 243 9 248 6 q 229 28 233 16 q 220 53 225 41 q 206 96 213 74 q 193 141 200 119 q 127 346 158 244 q 62 552 95 449 q 44 606 52 580 q 27 659 36 633 q 21 682 25 667 q 23 705 18 696 q 41 717 27 710 q 52 718 50 717 "},"$":{"x_min":6.25,"x_max":773.6875,"ha":772,"o":"m 771 316 q 773 271 774 298 q 768 229 772 244 q 763 209 765 218 q 758 190 761 200 q 716 114 740 148 q 656 55 692 80 q 640 44 649 49 q 624 33 632 38 q 579 11 603 19 q 529 -5 554 2 q 504 -11 517 -9 q 478 -16 490 -13 q 467 -18 472 -18 q 457 -19 463 -18 q 428 -48 433 -27 q 427 -54 428 -51 q 427 -59 427 -57 q 426 -68 425 -62 q 427 -79 427 -73 q 426 -106 427 -93 q 420 -127 425 -119 q 394 -139 413 -136 q 386 -139 392 -140 q 378 -139 380 -139 q 359 -132 366 -136 q 348 -118 351 -129 q 345 -92 344 -105 q 346 -66 346 -79 q 343 -43 346 -54 q 330 -26 340 -33 q 309 -18 321 -19 q 286 -13 297 -16 q 248 -5 266 -9 q 214 5 230 -1 q 103 74 145 33 q 33 183 61 115 q 22 213 26 198 q 14 244 18 229 q 11 254 11 250 q 9 263 12 258 q 6 283 7 272 q 8 302 5 294 q 23 316 12 312 q 40 320 30 319 q 61 320 50 320 l 129 320 q 152 320 140 320 q 172 318 164 320 q 189 305 183 313 q 197 286 194 297 q 202 264 200 276 q 209 243 205 252 q 237 197 220 216 q 277 163 254 179 q 292 155 283 159 q 310 149 301 151 q 328 148 319 147 q 341 159 337 149 q 345 177 344 166 q 346 200 346 188 l 346 366 q 345 397 346 383 q 337 422 344 412 q 318 436 330 433 q 294 443 307 438 q 263 452 279 448 q 232 462 247 457 q 155 496 191 477 q 91 543 119 515 l 76 558 q 53 593 64 575 q 36 636 43 612 q 30 661 32 648 q 25 689 27 675 l 25 718 q 26 753 25 737 q 32 784 27 769 q 39 811 36 798 q 48 836 41 823 q 99 909 68 879 q 169 964 130 940 q 216 986 191 978 q 269 1003 241 994 q 301 1008 284 1007 q 329 1016 318 1010 q 341 1032 339 1023 q 346 1054 343 1040 q 346 1066 347 1060 q 347 1078 346 1072 q 348 1089 348 1085 q 348 1098 347 1093 q 364 1117 354 1112 q 371 1117 367 1118 q 378 1120 375 1117 q 406 1116 395 1120 q 423 1101 417 1113 q 426 1088 426 1093 l 426 1072 q 426 1062 427 1068 q 427 1050 426 1056 q 431 1031 429 1039 q 442 1017 433 1022 q 461 1010 450 1011 q 482 1006 471 1008 q 513 997 497 1000 q 543 987 528 993 q 647 926 606 962 q 714 828 689 889 q 728 789 721 812 q 729 780 729 785 q 731 772 729 776 q 735 757 733 765 q 733 742 736 748 q 718 723 729 728 q 700 721 710 721 q 679 721 690 721 l 613 721 q 590 720 602 721 q 568 722 578 719 q 543 743 549 728 q 531 776 538 758 q 483 835 513 815 q 454 844 471 842 q 429 829 436 847 q 426 804 426 819 q 427 775 427 789 l 427 669 q 427 639 427 654 q 433 615 427 625 q 463 596 443 600 q 502 586 482 593 q 572 563 538 575 q 635 532 606 551 q 704 477 674 508 q 753 401 733 446 q 762 373 758 387 q 768 344 765 359 q 770 330 771 337 q 771 316 768 323 m 323 634 q 344 658 343 638 q 346 701 346 677 l 346 788 q 346 816 346 804 q 339 837 346 829 q 312 847 330 847 q 309 846 311 845 q 304 845 307 847 q 287 840 293 843 q 248 813 265 830 q 225 770 232 795 l 220 750 q 219 732 218 743 q 222 716 220 722 q 225 707 225 711 q 226 700 225 704 q 247 670 234 680 q 275 650 259 659 q 297 638 282 645 q 323 634 312 632 m 577 258 q 577 283 579 269 q 572 305 575 297 q 544 353 563 337 q 497 381 525 369 q 475 391 486 387 q 447 394 464 394 q 438 390 442 391 q 432 383 435 388 q 426 358 425 373 q 427 329 427 343 l 427 208 q 428 169 427 186 q 446 145 429 152 q 463 144 456 143 q 528 175 500 154 q 570 230 556 197 q 573 244 572 237 q 577 258 574 251 "},"\\":{"x_min":-0.46875,"x_max":515.671875,"ha":515,"o":"m 502 50 q 509 33 505 43 q 514 13 512 23 q 514 -5 516 2 q 502 -18 512 -13 q 479 -22 493 -22 q 454 -22 466 -22 q 413 -22 434 -22 q 380 -15 393 -22 q 364 3 369 -8 q 354 29 359 15 q 336 77 344 52 q 318 127 329 102 q 295 188 305 156 q 272 248 284 219 q 267 262 269 255 q 262 276 265 269 q 245 322 252 298 q 227 368 237 345 q 223 379 225 375 q 219 390 222 384 q 202 439 209 413 q 183 488 194 465 q 132 624 155 555 q 81 759 109 693 q 77 774 79 766 q 72 788 75 782 q 51 843 61 815 q 30 897 41 870 q 25 914 27 905 q 18 932 22 923 q 10 953 13 943 q 2 975 6 963 q 0 984 1 977 q 1 997 -1 991 q 18 1011 5 1009 q 23 1011 20 1012 q 29 1013 26 1011 q 59 1014 43 1013 q 90 1014 75 1015 q 118 1011 105 1013 q 140 1002 131 1008 q 156 975 151 995 q 169 940 162 955 q 191 882 180 912 q 213 823 202 851 q 218 809 216 816 q 223 795 220 802 q 240 748 233 772 q 258 701 248 725 q 272 663 266 682 q 287 625 279 644 q 336 496 313 561 q 384 368 358 431 q 390 350 387 359 q 395 333 393 341 q 411 291 404 312 q 427 250 419 270 q 435 228 431 238 q 443 206 438 218 q 472 128 458 168 q 502 50 487 88 "},"~":{"x_min":100.609375,"x_max":733.78125,"ha":833,"o":"m 261 470 q 328 462 298 472 q 384 441 358 452 q 429 423 408 433 q 475 403 452 413 q 523 384 498 393 q 554 379 534 381 q 571 377 562 376 q 586 381 580 379 q 645 422 623 394 l 650 426 q 659 437 654 431 q 670 447 663 443 q 676 450 673 448 q 683 451 679 452 q 697 442 693 448 q 705 429 701 436 q 718 400 712 415 q 730 370 725 386 q 732 343 736 356 q 719 320 727 329 q 704 300 711 311 q 609 236 669 254 q 586 231 602 233 q 563 231 570 229 l 550 231 q 539 232 544 233 q 530 233 534 231 q 508 238 519 236 q 486 247 497 241 q 425 276 454 259 q 365 305 397 293 q 339 313 352 311 q 311 320 326 316 q 300 322 305 322 q 288 323 294 322 q 270 324 281 325 q 254 322 259 323 q 246 320 250 320 q 238 319 243 320 q 209 304 223 313 q 184 283 194 294 q 177 274 181 280 q 168 263 173 268 q 157 254 163 258 q 145 254 151 251 q 128 274 134 259 q 118 300 122 288 q 108 321 112 311 q 101 345 104 331 q 105 368 98 356 q 116 386 112 380 q 152 428 131 409 q 200 458 172 447 q 218 463 208 461 q 238 468 227 465 q 250 468 243 469 q 261 470 258 468 "},"-":{"x_min":73.953125,"x_max":491.359375,"ha":565,"o":"m 477 457 q 487 439 484 451 q 491 413 490 427 q 491 383 491 398 q 490 355 490 368 q 490 334 490 344 q 487 315 490 323 q 465 298 480 300 q 429 296 450 296 l 169 296 q 126 295 151 296 q 90 301 101 294 q 78 318 81 307 q 74 345 75 330 q 74 375 73 359 q 75 404 75 391 q 75 429 75 416 q 80 448 76 441 q 98 461 86 455 q 104 462 101 461 q 111 463 108 463 l 437 463 q 460 462 450 463 q 477 457 470 461 "},"Q":{"x_min":52.78125,"x_max":1028.6875,"ha":1081,"o":"m 1025 530 q 1028 502 1027 522 q 1026 473 1029 482 q 1026 459 1026 466 q 1025 444 1026 451 q 1022 414 1022 429 q 1018 384 1022 400 q 1013 361 1015 373 q 1008 337 1011 348 q 990 284 998 309 q 969 236 982 259 q 965 227 966 232 q 961 218 963 222 q 947 196 954 207 q 934 173 941 184 q 921 157 927 165 q 912 139 915 150 q 913 118 908 126 q 923 104 919 111 q 951 79 934 90 q 957 72 952 76 q 988 44 973 59 q 1002 27 994 37 q 1005 2 1011 18 q 986 -22 998 -10 q 963 -44 975 -33 q 948 -60 957 -51 q 929 -73 940 -69 q 902 -70 913 -80 q 883 -55 890 -60 q 853 -28 868 -42 q 822 -1 838 -13 q 804 14 812 5 q 780 26 795 23 q 761 25 769 29 q 747 19 752 22 q 716 7 732 12 q 686 -2 701 2 q 647 -10 668 -8 q 608 -16 627 -12 q 591 -17 600 -17 q 573 -19 583 -17 q 549 -21 566 -20 q 525 -19 531 -22 l 508 -19 q 481 -16 495 -16 q 455 -13 468 -16 q 436 -10 445 -10 q 416 -6 426 -9 q 370 6 393 0 q 327 22 348 12 q 195 114 254 54 q 105 246 137 173 q 90 284 97 265 q 76 325 83 304 q 68 356 72 340 q 62 387 65 372 q 59 405 59 396 q 56 422 59 414 q 56 439 55 430 q 55 455 56 447 l 55 471 q 52 492 52 478 q 55 514 52 507 q 54 522 55 518 q 55 529 54 526 q 56 543 55 536 q 56 557 56 550 q 59 580 58 568 q 62 603 61 591 q 70 641 68 622 q 80 679 73 661 q 186 866 119 793 q 361 985 252 940 q 399 996 379 991 q 438 1005 419 1000 q 452 1008 445 1008 q 465 1010 458 1008 l 506 1014 q 514 1014 509 1015 q 522 1014 519 1012 q 679 998 611 1016 q 801 944 748 979 q 848 911 823 932 q 858 903 854 908 q 868 894 862 897 q 886 877 877 886 q 902 857 895 868 q 910 848 905 853 q 918 840 915 844 q 948 794 933 818 q 975 746 963 771 q 989 708 983 726 q 1002 669 995 690 q 1009 641 1007 655 q 1016 611 1012 626 q 1019 592 1019 601 q 1022 575 1019 583 q 1024 557 1025 566 q 1025 541 1023 548 l 1025 530 m 809 469 q 812 490 812 476 q 809 512 812 505 l 809 535 q 809 546 808 541 q 807 556 809 551 q 804 576 804 566 q 801 595 804 585 q 792 631 795 614 q 782 663 788 648 q 745 732 766 701 q 693 785 723 763 q 622 820 662 807 q 529 833 581 833 q 513 831 520 831 q 498 830 505 831 q 468 823 483 826 q 438 814 452 820 q 345 744 380 789 q 288 637 309 699 q 282 607 284 621 q 276 577 280 592 q 275 567 275 571 q 273 556 275 562 q 272 541 270 549 q 270 526 273 532 l 270 510 q 269 492 269 503 q 270 474 269 481 l 270 459 q 272 439 273 449 q 275 419 272 428 q 276 410 276 414 q 277 402 276 406 q 283 377 280 389 q 288 352 286 364 q 341 250 308 294 q 426 182 373 206 l 447 174 q 466 168 456 170 q 486 163 475 166 q 501 161 493 162 q 516 160 509 160 l 526 160 q 542 158 533 157 q 558 159 551 159 l 570 159 q 583 160 577 160 q 594 163 588 160 q 601 196 618 176 q 581 218 593 209 q 559 239 569 227 q 552 249 556 244 q 551 264 548 255 q 563 286 554 278 q 580 305 573 294 q 586 312 583 309 q 593 320 590 316 q 600 326 595 321 q 606 335 602 330 q 616 342 611 339 q 634 351 623 349 q 655 346 644 353 q 682 324 670 337 q 708 301 693 312 l 716 292 q 731 282 722 288 q 751 280 740 277 q 766 294 758 282 q 772 303 769 298 q 779 313 776 307 q 791 348 786 330 q 801 385 795 366 q 804 402 802 394 q 807 419 805 410 q 809 437 808 428 q 809 456 809 446 l 809 469 "},"M":{"x_min":97,"x_max":1163,"ha":1260,"o":"m 136 990 l 318 990 q 363 990 340 990 q 398 980 386 990 q 412 960 408 973 q 421 934 416 947 q 437 889 429 912 q 453 843 444 866 q 513 665 485 755 q 575 486 542 575 q 594 429 586 458 q 614 372 603 400 q 619 358 617 365 q 629 347 622 351 q 635 344 632 345 q 640 345 637 343 q 655 362 651 348 q 664 387 660 376 q 684 450 675 419 q 704 513 693 481 q 760 684 732 598 q 815 855 787 769 q 829 899 822 877 q 843 943 836 920 q 851 965 847 954 q 867 983 855 976 q 888 990 875 990 q 915 990 901 990 l 1006 990 l 1101 990 q 1127 990 1114 990 q 1147 984 1140 990 q 1163 953 1163 976 q 1163 907 1163 930 l 1163 698 l 1163 181 l 1163 61 q 1162 31 1163 45 q 1153 9 1161 16 q 1132 2 1144 2 q 1104 1 1119 1 l 1038 1 l 1000 1 q 982 5 989 4 q 969 15 974 6 q 963 33 963 22 q 963 56 963 44 l 963 127 l 963 484 q 962 521 962 504 q 962 556 962 538 q 962 579 962 568 q 960 602 963 591 q 957 623 957 612 q 948 637 957 634 q 942 636 944 638 q 939 632 940 633 q 930 618 933 626 q 923 604 926 611 q 907 561 915 583 q 891 516 900 538 q 887 500 889 508 q 880 483 884 491 q 868 447 873 465 q 855 411 862 429 q 852 402 852 406 q 850 393 852 397 q 841 366 844 380 q 830 338 837 352 q 821 312 825 326 q 812 284 818 298 q 783 203 795 244 q 755 122 770 162 q 752 113 752 118 q 750 105 752 109 q 738 74 743 90 q 727 43 734 58 q 720 25 723 33 q 709 11 716 16 q 695 4 702 5 q 679 1 688 4 l 647 1 q 624 0 637 1 q 597 0 611 0 q 573 1 584 0 q 556 6 562 2 q 541 22 545 13 q 531 44 537 31 q 519 78 524 61 q 508 112 515 95 l 503 125 q 491 160 497 141 q 478 195 485 179 q 476 203 477 200 q 474 211 476 206 q 463 237 467 223 q 453 265 459 251 q 451 272 452 268 q 449 279 451 276 q 440 306 444 293 q 430 334 437 320 q 409 393 419 362 q 388 452 399 423 q 364 523 376 487 q 338 593 353 559 q 323 625 331 612 q 317 629 320 627 q 310 629 314 632 q 303 615 303 625 q 301 595 303 605 q 298 575 297 586 q 299 554 299 565 q 299 523 299 538 q 298 493 299 508 l 298 123 l 298 55 q 298 33 298 44 q 292 15 298 22 q 271 2 286 5 q 250 0 261 0 q 228 1 239 1 l 156 1 q 128 2 141 1 q 108 9 116 2 q 98 31 99 16 q 97 61 97 45 l 97 183 l 97 700 l 97 894 q 97 914 97 902 q 97 937 97 926 q 98 959 97 948 q 103 975 100 969 q 125 988 108 984 q 130 989 128 990 q 136 990 133 988 "},"C":{"x_min":52.78125,"x_max":970.3125,"ha":1029,"o":"m 520 1013 q 761 963 666 1016 q 911 823 855 911 q 936 775 926 799 q 954 722 945 751 q 959 699 957 712 q 958 676 962 687 q 947 665 955 667 q 930 661 940 663 l 919 661 q 900 659 911 658 q 880 660 890 660 q 850 659 868 660 q 816 659 833 658 q 786 662 800 660 q 765 668 772 664 q 748 694 754 678 q 734 723 743 711 q 665 796 708 769 q 600 825 636 814 q 541 833 576 833 q 479 826 505 833 q 459 821 468 823 q 440 815 450 819 q 306 682 345 775 q 294 647 300 665 q 281 610 288 629 q 279 591 280 600 q 276 573 277 583 q 274 556 273 565 q 272 537 275 547 q 270 514 269 526 q 270 492 270 503 q 270 480 270 486 q 270 469 269 475 l 270 457 q 272 443 273 450 q 275 429 272 436 q 277 407 275 421 q 283 378 280 392 q 290 353 286 365 q 340 253 309 294 q 420 186 370 212 q 452 174 436 179 q 488 164 469 169 q 502 162 495 162 q 515 161 508 161 l 526 161 q 544 159 533 158 q 562 161 555 160 q 575 162 570 161 q 606 168 591 165 q 634 178 620 171 q 689 215 666 192 q 730 267 712 237 q 744 297 738 280 q 757 330 750 314 q 765 358 761 346 q 783 378 769 371 q 804 381 791 381 q 827 381 816 381 l 912 381 q 938 381 925 381 q 959 375 951 381 q 970 353 969 368 q 966 323 970 337 l 958 286 q 945 246 951 265 q 929 208 938 226 q 918 186 922 197 q 907 166 913 176 q 684 0 830 47 q 654 -8 669 -5 q 623 -14 638 -11 q 610 -16 616 -16 q 597 -18 604 -15 q 578 -18 587 -18 q 559 -21 569 -19 l 537 -21 q 512 -21 525 -21 q 488 -18 500 -21 q 475 -17 484 -17 q 455 -14 465 -15 q 434 -11 445 -12 q 407 -4 420 -6 q 380 2 394 -1 q 355 11 368 7 q 331 22 343 16 q 190 118 248 58 q 97 262 133 179 q 83 304 88 283 q 70 347 77 325 q 68 359 68 354 q 66 369 68 363 q 62 395 63 381 q 58 422 61 409 q 56 433 55 429 q 55 444 56 438 l 55 470 q 52 491 52 477 q 55 512 52 505 q 56 521 56 516 q 55 529 55 526 l 55 541 q 59 565 58 552 q 61 590 59 577 q 65 611 63 601 q 69 633 66 622 q 79 671 75 652 q 90 706 83 690 q 104 742 97 724 q 122 776 112 761 q 168 845 144 815 q 183 863 175 855 q 200 880 191 872 q 272 939 234 915 q 359 983 311 963 q 394 995 376 990 q 431 1004 412 999 q 448 1006 440 1006 q 463 1009 456 1006 q 485 1011 475 1011 q 506 1013 495 1012 q 513 1013 509 1015 q 520 1013 518 1012 "},"[":{"x_min":96,"x_max":460.1875,"ha":463,"o":"m 453 -112 q 459 -134 459 -120 q 459 -159 459 -147 q 458 -215 459 -188 q 435 -248 458 -241 q 421 -250 428 -251 q 405 -250 413 -250 l 186 -250 q 138 -250 165 -250 q 104 -238 112 -251 q 96 -209 96 -227 q 96 -172 96 -191 l 96 955 q 96 979 96 968 q 101 1000 96 991 q 119 1012 107 1007 q 132 1013 129 1012 l 355 1013 q 378 1014 365 1013 q 404 1015 391 1015 q 428 1013 417 1015 q 445 1008 440 1012 q 460 970 460 997 q 459 919 459 943 q 459 899 459 909 q 456 882 459 888 q 426 861 449 863 q 375 861 402 859 q 324 859 348 862 q 292 838 299 857 q 290 816 290 829 q 290 791 290 802 l 290 -33 q 290 -61 290 -47 q 296 -83 291 -75 q 335 -97 308 -98 q 388 -97 363 -97 q 400 -96 394 -97 q 410 -97 406 -95 l 426 -97 q 442 -102 435 -100 q 453 -112 449 -105 "},"L":{"x_min":96,"x_max":794.8125,"ha":824,"o":"m 134 990 l 252 990 q 282 989 268 990 q 304 978 297 988 q 311 953 311 969 q 311 919 311 937 l 311 792 l 311 372 l 311 290 q 310 268 311 279 q 312 248 309 258 l 312 234 q 312 216 312 225 q 316 200 313 206 q 355 182 325 182 q 412 182 384 182 l 681 182 q 709 182 692 182 q 741 182 725 183 q 769 179 756 182 q 787 170 782 176 q 793 149 793 162 q 793 123 793 137 l 793 59 q 794 38 793 48 q 792 21 795 28 q 778 6 787 10 q 757 1 771 1 q 731 1 743 1 l 632 1 l 256 1 l 156 1 q 123 3 137 1 q 101 16 108 5 q 96 37 96 24 q 96 63 96 51 l 96 160 l 96 529 l 96 843 l 96 930 q 96 955 96 943 q 101 975 97 968 q 123 989 107 984 q 129 989 126 990 q 134 990 132 989 "},"!":{"x_min":86,"x_max":301,"ha":386,"o":"m 97 679 q 91 745 90 709 q 92 818 92 782 l 92 925 q 92 954 92 940 q 98 977 92 968 q 118 989 105 986 q 123 989 121 990 q 129 990 126 989 l 235 990 q 267 988 252 990 q 288 977 281 987 q 294 957 294 969 q 294 930 294 944 l 294 776 q 295 757 294 768 q 294 740 296 747 l 294 725 q 291 704 291 715 q 289 686 292 694 q 287 673 287 679 q 285 659 288 666 q 282 635 282 647 q 280 612 282 623 q 278 602 278 607 q 277 591 278 597 q 273 554 274 573 q 267 516 271 534 q 265 498 264 507 q 263 479 266 490 q 257 427 258 454 q 249 375 256 400 q 244 335 245 355 q 230 305 244 315 q 220 301 226 302 q 208 298 215 300 l 188 298 q 164 301 175 298 q 148 311 154 304 q 141 329 141 319 q 139 350 141 338 q 134 382 134 365 q 129 413 133 398 q 127 429 129 425 q 126 445 126 437 q 125 462 126 454 q 118 503 119 482 q 114 544 118 525 q 112 557 112 551 q 111 570 112 563 q 107 597 108 583 q 104 625 107 611 q 103 630 104 627 q 103 636 103 633 q 100 657 100 647 q 97 679 100 668 m 289 203 q 299 184 298 196 q 301 156 301 171 l 301 56 q 299 28 301 41 q 291 9 298 16 q 267 1 281 2 q 238 1 253 1 l 145 1 q 116 1 130 1 q 95 10 102 2 q 87 32 88 19 q 86 60 86 45 l 86 148 q 86 175 86 162 q 91 196 86 188 q 112 210 97 205 q 118 211 115 212 q 124 212 122 210 l 234 212 q 265 211 251 212 q 289 203 280 210 "},"\u001d":{"x_min":0,"x_max":0,"ha":0}," ":{"x_min":0,"x_max":0,"ha":386},"{":{"x_min":-10,"x_max":460.359375,"ha":463,"o":"m 290 1015 l 402 1015 q 431 1013 417 1015 q 452 1004 445 1012 q 460 969 461 992 q 459 927 459 947 q 459 899 459 912 q 454 876 459 885 q 439 865 448 867 q 419 863 430 863 q 396 862 408 862 q 373 859 384 862 q 315 802 329 848 q 310 764 309 785 q 311 722 311 742 l 311 622 q 311 597 311 610 q 310 573 312 584 l 310 538 q 307 515 307 527 q 304 492 307 503 q 287 453 297 473 q 261 422 276 433 q 243 409 253 415 q 223 397 233 403 q 220 392 221 394 q 216 387 219 390 q 216 381 216 384 q 218 374 215 377 q 237 358 222 367 q 258 342 251 349 q 289 308 278 328 q 307 260 300 287 q 310 240 310 251 q 310 219 310 230 l 310 199 q 311 174 312 188 q 311 148 311 159 l 311 41 q 313 -16 311 9 q 326 -62 315 -43 q 350 -84 337 -78 q 384 -94 363 -90 l 392 -94 q 402 -95 397 -96 q 413 -96 408 -94 l 426 -96 q 454 -109 448 -100 q 459 -131 459 -118 q 459 -158 459 -144 q 459 -212 459 -186 q 438 -246 459 -239 q 421 -248 431 -248 q 399 -248 411 -248 l 331 -248 q 297 -249 315 -248 q 263 -246 279 -250 q 178 -203 210 -233 q 126 -128 145 -173 q 121 -108 123 -118 q 117 -87 120 -98 q 117 -80 117 -83 q 116 -72 116 -76 q 114 -39 113 -58 q 115 -5 115 -21 l 115 149 q 116 174 115 160 q 115 198 117 187 q 113 212 112 205 q 112 226 115 219 q 91 271 105 253 q 55 303 77 290 q 33 312 44 309 q 14 319 23 316 q 0 330 6 323 q -10 352 -7 337 l -10 380 q -10 406 -10 392 q -5 428 -10 419 q 24 449 2 442 q 59 465 45 455 q 87 489 74 474 q 106 520 99 503 q 115 573 115 542 q 115 634 115 603 l 115 773 q 118 856 115 819 q 140 922 121 894 q 235 1004 174 980 q 251 1009 242 1006 q 267 1014 259 1011 q 279 1013 272 1014 q 290 1015 287 1012 "},"X":{"x_min":16.453125,"x_max":914.703125,"ha":926,"o":"m 73 990 l 205 990 q 245 989 226 990 q 275 979 263 989 q 284 971 280 976 q 291 960 287 965 q 304 938 298 949 q 318 915 311 926 q 363 844 341 879 q 408 772 384 808 q 424 745 416 758 q 440 719 431 732 q 450 706 445 712 q 465 696 455 699 q 479 699 473 694 q 487 707 484 704 q 508 735 500 719 q 527 767 516 751 q 577 844 551 806 q 626 922 602 883 q 650 960 637 939 q 683 988 662 981 q 708 990 694 990 q 736 990 722 990 l 836 990 q 866 988 851 990 q 884 976 882 987 q 882 958 888 967 q 873 944 876 950 q 848 906 861 925 q 823 868 836 887 q 736 739 779 803 q 650 610 694 675 q 629 577 638 593 q 608 544 619 561 q 600 530 605 539 q 598 511 595 522 q 607 489 601 499 q 620 471 613 480 q 673 393 644 433 q 754 269 713 330 q 837 144 795 207 q 868 98 852 121 q 898 53 883 76 q 909 36 901 47 q 913 15 916 25 q 893 2 909 3 q 859 1 876 1 l 748 1 q 719 1 734 1 q 693 3 704 0 q 657 31 669 10 q 632 72 644 53 q 577 158 604 115 q 522 244 550 201 q 510 263 515 254 q 498 282 505 272 q 490 296 494 289 q 480 310 486 303 q 470 319 476 314 q 455 322 465 325 q 441 312 445 319 q 430 299 436 305 q 414 273 422 286 q 398 248 406 261 q 340 160 369 204 q 283 72 311 117 q 259 32 272 54 q 222 3 245 10 q 197 1 211 0 q 170 1 183 1 l 79 1 q 50 1 65 1 q 25 5 34 0 q 20 10 22 8 q 16 15 19 12 q 22 41 15 30 q 37 62 30 51 q 66 105 52 85 q 95 148 80 126 q 176 270 136 210 q 256 393 216 330 q 280 428 268 411 q 304 464 293 446 q 319 486 311 475 q 330 512 327 497 q 329 533 333 524 q 320 547 325 542 q 301 579 311 564 q 280 610 291 594 q 266 630 273 621 q 252 651 259 640 q 195 737 223 694 q 136 822 166 779 q 122 843 129 833 q 109 864 116 853 q 92 889 100 876 q 76 912 84 901 q 63 929 69 921 q 52 946 58 937 q 45 962 50 953 q 45 981 40 972 q 62 989 50 986 q 68 989 65 990 q 73 990 70 989 "},"P":{"x_min":95.234375,"x_max":882.796875,"ha":926,"o":"m 824 867 q 871 768 856 823 q 881 638 886 714 q 872 581 879 607 q 855 533 865 555 q 850 523 852 528 q 845 512 848 518 q 835 494 840 503 q 823 476 830 484 q 756 413 795 437 q 666 372 716 389 q 634 365 651 366 q 601 359 617 363 q 584 358 592 358 q 567 357 576 358 l 511 357 l 394 357 q 356 357 376 357 q 324 348 336 357 q 311 314 311 338 q 311 266 311 290 l 311 83 q 311 47 311 66 q 305 16 312 27 q 280 1 299 6 q 259 0 270 -1 q 237 1 248 1 l 157 1 q 128 2 141 1 q 107 9 115 2 q 97 31 98 16 q 96 61 96 45 l 96 892 q 95 938 96 911 q 101 975 94 964 q 122 989 107 984 q 128 990 125 991 q 134 991 132 989 l 536 991 q 561 991 548 991 q 584 990 573 992 l 591 990 q 606 987 598 987 q 622 984 615 987 q 634 983 629 983 q 647 980 640 983 q 691 967 669 973 q 733 949 713 960 q 748 939 740 944 q 765 928 756 935 q 777 919 772 924 q 788 909 781 914 l 797 900 q 824 867 813 884 m 672 639 q 674 677 674 654 q 669 715 673 700 q 648 764 661 746 q 611 797 636 782 q 559 816 590 810 q 493 824 529 822 q 420 824 458 825 q 349 824 383 824 q 342 821 345 822 q 334 821 338 821 q 316 804 320 815 q 311 774 311 793 q 311 740 311 755 l 311 608 q 311 571 311 592 q 317 540 311 551 q 334 528 323 532 q 359 523 345 524 q 389 523 373 522 q 419 524 405 524 q 554 530 492 524 q 647 579 615 537 q 661 606 655 592 q 672 639 666 621 "},"%":{"x_min":102.78125,"x_max":1283.4375,"ha":1389,"o":"m 958 850 q 943 822 950 836 q 927 794 936 808 q 863 678 893 737 q 798 562 833 619 q 779 528 787 545 q 761 494 770 511 q 737 452 748 473 q 713 409 726 430 q 707 397 709 402 q 701 384 704 391 q 676 341 687 363 q 652 298 665 319 q 644 284 647 291 q 637 269 641 276 q 607 216 622 243 q 577 163 593 190 q 570 149 573 156 q 562 134 566 141 q 534 85 547 111 q 506 36 522 59 q 490 4 497 20 q 468 -19 483 -11 q 450 -25 462 -23 q 423 -28 437 -27 q 397 -27 409 -29 q 379 -22 384 -26 q 372 2 366 -15 q 380 22 375 12 q 391 40 386 33 q 431 113 412 76 q 473 187 451 151 q 484 206 480 197 q 494 227 488 216 q 561 344 530 286 q 626 461 591 402 q 647 499 637 480 q 668 536 657 518 q 674 548 672 543 q 680 559 676 554 q 702 597 691 579 q 723 636 712 616 q 729 647 726 643 q 736 659 732 652 q 765 711 751 684 q 794 763 779 738 q 804 781 800 772 q 813 800 808 790 q 847 860 832 829 q 882 920 863 891 q 895 945 888 933 q 909 969 902 958 q 916 980 912 975 q 923 988 919 986 q 941 1000 934 997 q 958 1002 947 1000 q 996 1002 976 1002 q 1023 991 1016 1002 q 1026 982 1026 988 q 1025 972 1026 976 q 1017 954 1022 962 q 1008 937 1012 945 q 983 893 995 915 q 958 850 970 870 m 544 586 q 495 511 526 541 q 419 465 465 480 q 395 459 406 461 q 369 454 383 456 q 356 453 362 452 q 344 452 351 454 q 325 450 338 450 q 306 452 312 451 q 295 454 300 455 q 283 455 290 454 q 256 461 269 458 q 233 469 244 463 q 120 594 151 505 q 114 618 116 605 q 109 641 112 630 q 108 662 108 648 q 106 674 105 668 q 105 686 106 680 l 105 701 q 105 730 100 715 l 105 741 q 106 754 105 748 q 106 768 106 761 q 113 804 111 786 q 123 838 116 822 q 171 921 143 887 q 248 975 200 955 q 274 983 261 980 q 302 988 287 986 q 316 988 306 990 q 327 990 325 987 q 463 957 413 991 q 540 863 513 923 q 549 839 545 852 q 555 813 552 826 q 556 805 556 809 q 558 797 556 801 q 561 779 561 788 q 563 761 561 770 q 564 752 565 757 q 565 744 563 747 l 565 729 q 565 700 568 713 q 563 684 562 691 q 563 669 565 676 q 562 656 562 662 q 559 644 562 651 q 553 614 556 629 q 544 586 550 600 m 358 558 q 398 587 383 566 q 413 617 408 601 q 422 652 418 633 q 423 667 425 659 q 425 684 422 675 q 427 703 426 690 q 425 723 427 716 l 425 755 q 424 766 423 761 q 423 776 425 770 q 419 795 420 786 q 415 813 418 805 q 409 832 412 823 q 401 850 406 841 q 387 866 394 858 q 372 879 380 873 q 327 886 355 888 q 315 884 325 884 q 306 880 311 882 q 297 876 301 879 q 270 849 280 865 q 254 813 261 833 q 248 786 250 800 q 244 757 247 772 l 244 730 q 242 703 241 722 q 244 676 243 684 q 246 659 247 668 q 247 644 245 651 q 261 602 254 620 q 283 572 268 584 q 313 556 298 562 q 326 555 322 556 q 332 554 329 555 q 338 555 336 554 q 348 556 344 556 q 358 558 352 556 m 1282 266 q 1283 250 1283 259 q 1282 234 1283 241 l 1282 222 q 1280 211 1280 216 q 1279 200 1280 205 q 1277 186 1277 193 q 1275 173 1277 180 q 1268 144 1272 158 q 1259 118 1265 130 q 1127 -5 1222 27 q 1107 -9 1118 -8 q 1086 -13 1097 -11 q 1073 -14 1079 -15 q 1061 -15 1068 -13 q 1042 -17 1055 -18 q 1025 -13 1029 -16 q 1012 -13 1018 -12 q 1001 -12 1007 -13 q 977 -6 988 -9 q 954 1 965 -4 q 879 52 907 20 q 837 133 852 84 q 831 156 833 144 q 826 179 829 168 q 825 186 826 183 q 825 194 825 190 q 823 209 823 201 q 822 223 823 216 l 822 240 q 822 265 819 251 l 822 277 q 823 297 822 291 q 825 318 825 304 q 831 345 829 331 q 838 372 833 359 q 887 454 859 423 q 968 506 915 486 q 992 514 979 512 q 1020 519 1005 516 q 1034 520 1027 519 q 1047 520 1040 520 q 1179 491 1129 523 q 1255 402 1230 459 q 1264 377 1261 391 q 1272 350 1268 363 q 1273 341 1273 345 q 1275 333 1273 337 q 1277 313 1277 323 q 1280 291 1277 302 q 1281 279 1280 284 q 1282 266 1282 273 m 1141 238 q 1143 261 1144 245 q 1141 283 1143 276 l 1141 293 q 1140 305 1140 300 q 1138 316 1140 311 q 1130 352 1134 336 q 1116 384 1126 369 q 1104 397 1111 391 q 1090 408 1097 404 q 1070 416 1080 415 q 1044 418 1059 418 q 1038 416 1041 415 q 1033 415 1036 416 q 1013 406 1022 412 q 987 381 997 397 q 970 345 977 365 q 965 320 966 334 q 961 293 963 306 l 961 266 q 959 240 958 258 q 961 213 959 222 q 962 199 963 206 q 963 184 961 191 q 975 140 970 158 q 997 106 980 123 q 1021 91 1004 100 q 1055 86 1038 83 q 1064 87 1059 87 q 1073 88 1069 87 q 1094 99 1084 93 q 1109 113 1104 105 q 1123 137 1118 125 q 1134 165 1129 150 q 1138 192 1138 177 q 1141 222 1138 206 l 1141 238 "},"#":{"x_min":45.84375,"x_max":724.5,"ha":772,"o":"m 723 630 q 724 611 723 620 q 722 595 725 602 q 707 576 718 580 q 683 572 697 572 q 654 572 669 572 q 626 569 640 573 q 606 554 612 565 q 597 529 600 544 q 594 499 595 515 q 590 469 593 483 q 588 457 588 463 q 586 444 587 451 l 586 436 q 585 432 586 434 q 584 427 584 430 q 589 413 587 419 q 598 402 591 406 q 629 397 609 395 q 662 394 648 400 q 682 363 677 387 l 682 351 q 683 335 683 344 q 682 319 683 326 l 682 308 q 680 300 680 304 q 677 291 680 295 q 657 277 672 279 q 622 275 641 275 q 611 275 616 275 q 601 273 605 275 l 593 273 q 563 256 572 269 q 556 228 556 245 q 551 194 555 211 q 542 134 544 165 q 533 72 540 102 q 529 50 530 61 q 527 29 529 38 q 519 12 525 19 q 502 1 513 5 q 486 0 495 -1 q 469 0 477 0 q 429 0 450 0 q 401 13 408 1 q 396 38 395 20 q 400 66 397 56 q 408 118 406 91 q 415 169 409 144 q 416 181 416 176 q 418 194 416 187 q 419 204 419 200 q 420 215 419 209 q 422 251 425 236 q 400 272 419 266 q 384 275 393 275 q 366 275 376 275 q 331 274 348 275 q 302 266 313 273 q 290 240 291 256 q 284 208 288 225 q 282 191 281 200 q 280 175 283 183 q 272 118 273 147 q 263 62 270 90 q 258 35 259 47 q 250 12 256 23 q 225 0 243 1 q 188 0 206 0 q 175 0 181 0 q 162 0 168 -1 q 150 2 155 2 q 141 4 145 1 q 129 25 130 11 q 130 55 127 40 q 131 65 131 61 q 133 75 131 70 q 140 124 138 98 q 147 173 141 150 q 148 186 148 180 q 150 198 148 191 q 154 227 152 209 q 152 256 156 245 q 137 271 148 268 q 111 275 126 275 q 99 274 105 275 q 87 275 93 273 q 80 275 84 275 q 73 276 76 276 q 48 298 52 280 q 45 313 45 305 q 45 331 45 322 q 46 365 45 348 q 56 388 47 381 q 78 395 65 394 q 106 397 91 397 q 134 397 120 397 q 159 401 148 397 q 176 417 170 405 q 184 443 181 429 q 188 474 187 458 q 193 504 190 490 q 196 524 194 511 q 197 544 198 537 q 183 566 193 561 q 150 571 170 573 q 113 573 129 569 q 88 600 93 580 q 87 620 88 613 q 87 644 84 632 q 89 661 90 652 q 91 677 88 670 q 118 693 98 693 q 161 694 138 694 l 180 694 q 204 700 195 697 q 220 718 213 704 q 225 742 225 729 q 229 768 226 755 q 238 829 236 798 q 247 890 240 861 q 252 926 251 908 q 262 955 252 944 q 280 966 266 963 q 287 967 283 968 q 294 969 291 966 q 318 970 305 969 q 344 970 331 970 q 366 966 356 969 q 380 957 376 963 q 385 930 386 948 q 381 901 384 912 q 377 875 379 888 q 373 848 376 862 q 366 799 368 825 q 359 750 365 773 q 357 728 356 740 q 362 709 358 716 q 387 695 368 698 q 402 694 394 694 q 416 694 409 694 q 455 695 436 694 q 483 707 475 695 q 492 727 490 715 q 497 750 494 738 q 498 765 497 761 q 505 816 504 790 q 512 866 506 843 q 514 882 515 875 q 516 897 513 890 q 520 927 519 912 q 529 954 522 943 q 559 968 537 968 q 604 969 580 969 q 629 968 616 969 q 647 958 641 966 q 652 927 654 947 q 648 893 651 907 q 647 882 647 887 q 645 872 647 877 q 640 834 641 854 q 634 795 638 813 q 633 775 633 788 q 627 747 630 766 q 627 718 625 729 q 641 700 632 702 q 665 694 650 697 q 675 693 669 693 q 683 694 680 694 q 693 693 688 693 q 701 691 697 694 q 721 670 719 686 q 723 630 723 654 m 462 508 q 466 534 465 519 q 461 556 466 548 q 427 572 451 572 q 379 572 402 572 q 371 570 376 569 q 363 570 366 572 q 337 554 345 566 q 332 539 333 547 q 329 522 331 531 q 322 485 325 504 q 316 448 320 466 q 315 429 315 440 q 319 412 316 418 q 342 399 326 401 q 377 397 358 397 q 391 396 384 397 q 404 398 398 395 q 414 398 409 400 q 425 400 419 397 q 445 416 438 404 q 454 443 451 427 q 457 476 456 459 q 462 508 458 493 "},"_":{"x_min":-0.421875,"x_max":689.953125,"ha":695,"o":"m 677 -109 q 686 -121 682 -112 q 688 -139 691 -130 q 676 -164 686 -158 q 654 -170 668 -169 q 626 -171 640 -171 l 69 -171 q 42 -171 56 -171 q 18 -166 27 -171 q 0 -139 2 -159 q 12 -109 -2 -119 q 20 -106 15 -106 q 29 -104 25 -105 q 36 -103 34 -104 l 630 -103 q 657 -103 644 -103 q 677 -109 669 -103 "},"+":{"x_min":68.59375,"x_max":767.8125,"ha":833,"o":"m 767 346 q 767 319 767 333 q 764 297 768 306 q 738 279 757 281 q 696 277 719 277 l 558 277 q 523 275 539 277 q 498 263 507 274 q 492 236 492 253 q 492 202 492 218 l 492 72 q 492 40 492 57 q 485 14 492 24 q 474 6 480 8 q 461 1 468 4 q 439 0 450 0 q 417 0 428 0 q 378 1 397 0 q 351 14 360 3 q 345 42 345 24 q 345 76 345 60 l 345 203 q 344 238 345 221 q 336 265 343 254 q 310 277 328 277 q 272 277 292 277 l 133 277 q 100 278 117 277 q 76 289 83 279 q 69 313 69 299 q 68 343 68 328 q 69 390 68 367 q 88 419 69 412 q 116 424 99 424 q 149 424 133 424 l 268 424 q 312 425 292 424 q 340 442 332 426 q 345 469 346 453 q 345 501 345 486 l 345 621 q 344 653 345 636 q 349 680 343 669 q 368 697 353 692 q 381 699 372 699 q 409 700 393 699 q 440 701 425 701 q 468 696 455 700 q 485 686 480 693 q 492 658 492 675 q 492 624 492 640 l 492 497 q 492 462 492 478 q 500 435 493 446 q 533 424 510 424 q 576 424 557 424 l 698 424 q 730 423 714 424 q 754 415 746 422 q 767 386 767 407 q 767 346 767 365 "},"":{"x_min":68.0625,"x_max":1026.46875,"ha":1097,"o":"m 558 853 q 550 866 554 855 q 548 889 545 878 q 551 912 551 903 q 556 932 554 922 q 563 951 559 943 q 569 969 566 961 q 576 984 572 976 q 582 995 579 990 q 588 1005 586 1000 q 630 1054 608 1035 q 683 1093 652 1073 q 702 1103 691 1098 q 722 1110 712 1107 q 733 1111 726 1111 q 743 1115 740 1112 q 763 1111 758 1115 q 772 1094 770 1105 q 772 1070 773 1083 q 768 1044 770 1057 q 762 1025 765 1032 q 713 933 743 972 q 638 866 683 894 q 623 857 633 862 q 602 850 613 853 q 578 847 590 847 q 558 853 566 847 m 1023 273 q 1025 256 1027 265 q 1020 240 1023 247 q 990 175 1007 205 q 959 118 976 147 q 920 63 941 88 q 875 16 900 37 q 820 -16 850 -4 q 803 -21 812 -20 q 783 -25 794 -22 l 772 -25 q 727 -20 748 -25 q 721 -18 725 -18 q 713 -18 718 -19 q 677 -6 694 -11 q 640 5 659 -1 q 626 8 633 8 q 612 11 619 8 q 569 15 593 15 l 558 15 q 531 11 544 12 q 506 6 519 9 q 468 -6 487 0 q 430 -20 450 -13 q 420 -22 425 -22 q 408 -25 415 -22 q 379 -28 397 -27 q 351 -25 362 -29 q 329 -18 340 -22 q 309 -9 318 -15 q 244 45 272 13 q 193 115 216 77 q 140 209 163 159 q 98 313 116 258 q 87 356 91 334 q 77 400 83 377 q 75 416 75 408 q 73 433 76 425 q 71 448 70 440 q 69 463 72 456 l 69 479 q 68 498 68 486 q 69 518 68 511 l 69 531 q 71 550 72 540 q 73 568 70 559 q 75 579 76 575 q 76 590 75 584 q 82 617 80 604 q 88 644 84 630 q 149 761 111 711 q 250 837 187 811 q 277 847 262 844 q 306 854 291 850 q 339 857 318 857 q 372 854 361 857 l 379 854 q 394 852 386 852 q 411 850 402 852 q 455 838 433 843 q 500 827 477 833 q 517 824 508 825 q 536 820 526 823 l 545 820 q 581 820 562 816 q 613 829 601 825 q 627 832 620 832 q 640 834 633 832 q 670 842 655 838 q 701 850 686 845 q 726 855 713 854 q 751 859 738 857 q 764 860 755 861 q 776 862 773 859 q 863 850 825 863 q 930 818 902 837 q 943 808 937 813 q 954 797 948 802 q 971 783 963 790 q 984 765 979 776 q 987 744 990 754 q 979 731 984 736 q 970 720 975 726 q 952 700 962 709 q 934 679 941 690 q 890 601 907 644 q 886 584 887 593 q 882 566 884 575 q 881 559 882 563 q 880 552 880 555 q 877 519 877 541 q 880 486 877 497 q 884 465 883 475 q 888 445 886 455 q 904 405 895 425 q 925 370 913 386 q 934 357 929 363 q 945 344 940 351 q 968 320 957 329 q 982 308 975 313 q 998 297 990 302 q 1013 286 1005 291 q 1023 273 1020 281 "},")":{"x_min":7.8125,"x_max":337.84375,"ha":411,"o":"m 336 416 q 337 402 338 409 q 337 387 337 394 q 337 373 337 380 q 336 359 338 366 l 336 346 q 336 330 336 339 q 335 315 336 322 q 334 301 335 308 q 333 287 333 294 l 324 212 q 319 184 321 197 q 314 155 317 171 q 309 129 312 143 q 303 101 306 115 q 286 37 294 69 q 266 -24 278 4 q 259 -45 262 -35 q 250 -66 256 -55 q 226 -124 239 -95 q 198 -178 213 -152 q 177 -214 186 -195 q 149 -244 167 -233 q 137 -247 143 -247 q 124 -249 131 -248 l 93 -249 q 68 -250 82 -249 q 42 -250 54 -251 q 20 -245 29 -249 q 9 -233 10 -241 q 9 -216 6 -224 q 16 -202 13 -208 q 29 -171 22 -187 q 43 -140 36 -155 q 70 -60 59 -101 q 96 19 82 -20 q 106 63 103 40 q 116 107 110 86 q 124 153 122 130 q 131 200 125 176 q 132 214 132 207 q 134 230 132 222 q 136 264 136 246 q 139 297 136 282 q 141 314 142 305 q 141 330 139 323 l 141 362 q 141 389 143 375 q 141 405 141 397 q 141 421 142 414 l 141 439 q 139 457 138 447 q 138 476 141 468 q 137 486 138 482 q 137 496 137 490 q 134 522 134 508 q 131 550 134 536 q 127 579 128 565 q 124 608 127 593 q 121 628 121 618 q 117 647 120 637 q 109 683 113 665 q 100 718 106 701 q 87 771 93 746 q 73 821 81 796 q 68 837 70 829 q 63 853 66 844 q 43 901 52 876 q 24 950 35 926 q 13 973 20 958 q 10 1000 6 989 q 30 1013 14 1010 q 35 1013 32 1014 q 41 1014 38 1013 l 96 1014 q 123 1014 110 1014 q 146 1010 135 1014 q 169 987 162 1003 q 185 958 177 972 q 220 891 205 926 q 250 819 235 855 q 270 771 262 796 q 285 723 278 747 q 294 696 291 709 q 301 668 296 682 l 317 597 q 324 555 323 576 q 330 514 326 533 q 331 500 331 507 q 333 487 331 494 q 335 462 334 475 q 336 437 336 450 l 336 416 l 336 416 "},"'":{"x_min":120.234375,"x_max":267.734375,"ha":386,"o":"m 260 979 q 267 943 268 966 q 267 901 267 920 l 267 612 q 267 583 267 597 q 261 561 267 569 q 240 548 255 551 q 225 546 233 545 q 208 547 216 547 q 162 546 187 547 q 129 558 137 545 q 121 577 122 565 q 121 602 121 588 l 121 887 q 120 935 121 907 q 126 976 119 963 q 144 988 132 983 q 150 989 147 988 q 158 990 154 990 q 185 991 169 990 q 216 991 201 991 q 243 987 230 990 q 260 979 255 984 "},"}":{"x_min":0.625,"x_max":471.015625,"ha":463,"o":"m 170 -250 l 58 -250 q 29 -248 43 -250 q 8 -239 15 -247 q 0 -204 0 -227 q 1 -162 1 -182 q 1 -134 1 -147 q 6 -111 1 -120 q 21 -100 12 -102 q 41 -98 30 -98 q 64 -97 52 -97 q 87 -94 76 -97 q 145 -37 131 -83 q 150 0 151 -20 q 150 42 150 22 l 150 142 q 149 167 150 154 q 151 191 148 180 l 151 226 q 153 249 153 237 q 156 272 153 261 q 173 311 163 291 q 199 342 184 331 q 217 355 207 349 q 237 367 227 361 q 240 372 239 370 q 244 377 241 374 q 244 383 244 380 q 242 390 245 387 q 223 406 238 397 q 202 422 209 415 q 171 456 182 436 q 153 504 160 477 q 151 524 151 513 q 151 545 151 534 l 151 565 q 149 590 148 576 q 150 616 150 605 l 150 723 q 147 781 150 755 q 134 827 145 808 q 110 849 123 843 q 76 859 97 855 l 68 859 q 58 860 63 861 q 47 861 52 859 l 34 861 q 6 874 12 865 q 1 896 1 883 q 1 923 1 909 q 1 977 1 951 q 22 1011 1 1004 q 39 1013 29 1013 q 61 1013 49 1013 l 129 1013 q 163 1014 145 1013 q 197 1011 181 1015 q 282 968 250 998 q 334 893 315 938 q 339 873 337 883 q 343 852 340 863 q 343 845 343 848 q 344 837 344 841 q 346 804 347 823 q 346 770 346 786 l 346 615 q 344 590 346 604 q 346 566 343 577 q 347 552 348 559 q 348 538 346 545 q 369 493 355 511 q 405 461 383 474 q 427 451 416 454 q 446 445 437 448 q 461 433 454 441 q 471 412 468 426 l 471 384 q 471 358 471 372 q 466 336 471 345 q 436 315 458 322 q 401 299 415 309 q 373 275 386 290 q 354 244 361 261 q 346 191 346 222 q 346 130 346 161 l 346 -8 q 342 -91 346 -54 q 320 -157 339 -129 q 225 -239 286 -215 q 209 -244 218 -241 q 193 -249 201 -246 q 181 -248 188 -249 q 170 -250 173 -247 "},"a":{"x_min":43.515625,"x_max":728.5625,"ha":797,"o":"m 725 55 q 728 24 727 40 q 713 3 729 9 q 694 0 705 0 q 672 0 683 0 l 597 0 q 572 0 584 0 q 554 6 561 1 q 539 22 544 12 q 526 40 534 33 q 519 44 523 42 q 508 45 515 46 q 495 38 501 42 q 481 31 488 34 q 466 21 475 26 q 450 13 458 17 q 412 0 431 5 q 372 -10 393 -4 q 353 -13 362 -12 q 334 -15 344 -13 q 326 -16 330 -15 q 318 -17 322 -17 l 302 -17 q 275 -17 288 -19 l 262 -17 q 243 -15 252 -14 q 226 -13 234 -15 q 200 -7 212 -10 q 176 0 187 -5 q 107 39 136 15 q 62 103 79 63 q 54 124 58 113 q 48 148 51 135 q 46 162 45 155 q 45 176 47 169 q 43 193 44 180 q 44 212 43 206 q 47 235 47 226 q 55 267 51 251 q 66 295 59 283 q 120 356 90 335 q 198 392 151 377 q 236 402 216 399 q 275 409 255 405 q 298 412 286 412 q 323 416 311 413 q 343 418 333 419 q 363 420 352 417 q 383 423 373 423 q 404 426 393 423 q 457 437 433 433 q 501 462 481 442 q 518 490 513 474 q 518 496 519 494 q 519 502 518 499 q 520 510 520 505 q 520 519 520 516 q 518 530 519 524 q 516 540 518 535 q 458 596 502 581 q 428 603 445 601 q 393 604 411 605 q 358 601 375 603 q 329 594 341 598 q 313 586 320 591 q 298 576 305 581 q 284 560 291 570 q 273 542 276 551 q 261 516 266 528 q 241 499 256 503 q 218 496 230 496 q 193 496 205 496 l 140 496 q 126 496 133 496 q 113 496 119 495 l 101 496 q 94 498 98 498 q 87 501 90 498 q 72 519 76 503 q 72 533 70 526 q 75 545 73 540 q 84 574 79 560 q 95 598 88 587 q 104 612 100 605 q 112 626 108 619 q 140 655 123 641 q 148 662 143 656 q 161 671 155 667 q 173 680 166 676 q 223 704 197 695 q 277 722 250 713 q 312 727 294 726 q 348 733 330 728 q 366 733 354 734 q 380 734 377 731 q 489 730 437 735 q 584 709 541 724 q 657 668 626 694 q 704 602 687 642 q 715 548 713 578 q 716 485 716 517 l 716 176 q 716 122 716 149 q 722 73 716 95 q 723 64 723 69 q 725 55 723 59 m 520 269 q 522 285 522 276 q 520 301 522 294 q 518 316 518 309 q 512 327 518 323 q 491 333 505 333 q 481 331 486 331 q 472 329 477 330 q 451 325 462 326 q 429 320 440 323 q 416 319 425 319 q 380 313 398 315 q 345 306 362 312 q 325 302 334 304 q 305 295 315 300 q 256 258 276 283 q 241 188 236 233 q 256 150 244 165 q 286 125 266 134 q 328 112 305 116 q 377 110 351 108 q 425 119 402 112 q 481 154 461 130 q 513 215 502 179 q 517 235 516 225 q 520 256 518 245 l 520 269 "},"T":{"x_min":19.765625,"x_max":830.078125,"ha":849,"o":"m 57 991 l 612 991 l 754 991 q 789 990 772 991 q 818 982 807 989 q 824 973 822 979 q 827 960 826 967 l 827 953 q 829 940 829 947 q 829 926 829 933 l 829 872 q 829 853 829 862 q 827 836 830 844 q 800 811 820 812 q 750 810 779 810 l 608 810 q 560 807 580 810 q 533 782 540 805 q 533 769 532 775 q 532 757 534 764 q 531 738 530 748 q 532 719 532 728 l 532 596 l 532 195 l 532 65 q 529 26 532 42 q 512 4 527 10 q 490 1 502 1 q 466 1 477 1 l 372 1 q 344 2 357 1 q 323 12 330 3 q 317 40 317 23 q 317 76 317 57 l 317 215 l 317 601 l 317 719 q 317 739 317 729 q 315 758 318 750 q 315 771 314 765 q 314 782 317 776 q 285 807 307 805 q 235 810 264 810 l 105 810 q 71 809 90 810 q 41 811 53 808 q 25 823 30 815 q 20 842 21 830 q 19 864 19 853 l 19 932 q 21 964 19 950 q 35 985 23 978 q 50 991 39 988 q 57 991 57 991 "},"=":{"x_min":67.328125,"x_max":767.5625,"ha":833,"o":"m 75 559 q 91 570 80 565 q 98 571 94 570 q 105 572 102 572 l 697 572 q 730 571 715 572 q 755 563 745 570 q 766 528 766 555 q 766 483 766 502 q 767 467 766 476 q 765 452 768 459 q 751 431 761 437 q 730 426 743 426 q 705 426 718 426 l 130 426 q 103 426 116 426 q 81 431 90 426 q 67 467 66 441 q 68 516 68 492 q 68 540 68 528 q 75 559 69 552 m 754 268 q 766 233 766 258 q 766 187 766 208 q 767 170 766 179 q 765 155 768 162 q 740 131 758 133 q 694 129 722 129 l 138 129 q 112 128 126 129 q 87 131 98 127 q 68 164 68 140 q 68 215 68 188 q 68 241 68 229 q 75 262 68 254 q 86 270 79 269 q 102 275 93 272 q 115 274 108 276 q 126 275 122 272 l 666 275 q 687 276 676 275 q 707 275 698 277 l 722 275 q 754 268 745 275 "},"N":{"x_min":97,"x_max":932.765625,"ha":1029,"o":"m 134 990 l 247 990 q 277 990 262 990 q 303 986 291 991 q 324 969 316 980 q 339 947 332 958 l 389 867 q 487 710 437 788 q 585 552 536 631 q 631 476 608 515 q 679 402 654 438 q 690 385 685 394 q 703 370 694 377 q 710 365 705 367 q 718 365 714 362 q 728 377 728 367 q 731 398 728 387 q 731 420 732 408 q 731 442 731 431 l 731 530 l 731 852 l 731 905 q 730 919 731 912 q 731 931 729 926 l 731 947 q 739 977 731 966 q 757 988 745 987 q 784 990 769 990 l 869 990 q 891 990 880 990 q 911 987 902 990 q 930 963 929 980 q 932 922 932 945 l 932 769 l 932 187 l 932 70 q 932 40 932 55 q 928 16 933 24 q 914 6 922 8 q 896 1 907 4 l 847 1 l 771 1 q 747 1 758 1 q 727 6 735 1 q 703 24 711 12 q 686 50 695 36 q 662 90 674 69 q 637 129 650 110 l 429 462 q 391 524 409 494 q 352 586 372 554 q 336 610 345 596 q 312 625 327 625 q 300 603 301 615 q 300 571 300 590 l 300 474 l 300 142 l 300 87 q 300 74 300 81 q 299 60 301 67 l 299 44 q 292 12 299 22 q 273 2 285 4 q 246 1 261 1 l 161 1 q 138 1 149 1 q 119 4 127 1 q 99 28 101 10 q 97 70 97 47 l 97 230 l 97 787 l 97 916 q 97 948 97 931 q 103 974 97 965 q 122 988 108 984 q 128 989 125 988 q 134 990 132 990 "},"2":{"x_min":32.453125,"x_max":742.765625,"ha":772,"o":"m 391 989 q 578 949 502 992 q 695 839 654 906 q 707 817 702 828 q 716 795 711 806 q 729 744 725 773 q 735 685 734 716 q 732 625 736 655 q 718 574 727 596 q 682 505 704 538 q 618 435 654 464 q 543 378 581 406 q 520 363 531 371 q 497 348 508 355 q 438 309 466 328 q 381 269 409 289 q 364 255 372 262 q 348 241 356 248 q 346 238 347 239 q 343 235 345 237 q 325 219 334 228 q 311 199 316 210 q 307 193 309 196 q 306 182 305 189 q 316 173 309 175 q 330 169 323 170 l 337 169 q 353 167 344 166 q 369 168 362 168 l 431 168 l 643 168 q 690 168 662 168 q 729 161 718 169 q 738 144 736 155 q 742 118 741 133 q 742 89 743 103 q 741 62 741 74 q 742 44 741 53 q 740 27 743 34 q 726 6 738 13 q 704 1 718 1 q 679 1 691 1 l 583 1 l 209 1 l 102 1 q 75 0 90 1 q 51 3 61 0 q 34 25 37 10 q 34 59 30 41 q 35 68 34 63 q 36 77 36 73 q 41 100 38 88 q 47 124 44 113 q 100 231 68 185 q 181 318 134 280 q 277 392 229 356 q 354 444 316 419 q 431 498 393 470 q 449 512 441 505 q 465 525 456 519 q 501 562 484 541 q 527 607 518 584 q 531 621 530 614 q 536 634 533 627 q 540 664 538 645 q 538 698 541 684 q 536 713 537 705 q 531 728 534 721 q 472 802 512 778 q 454 811 463 807 q 433 817 444 814 q 418 819 426 820 q 402 821 411 819 q 380 822 393 824 q 359 817 368 820 q 279 757 305 801 q 259 716 266 738 q 245 670 252 695 q 240 633 241 652 q 225 605 240 614 q 206 600 218 600 q 181 599 194 599 l 111 599 q 84 600 95 599 q 63 607 72 600 q 54 623 56 612 q 54 644 51 634 l 54 656 q 56 673 55 664 q 58 691 56 682 q 65 726 62 709 q 75 759 68 744 q 83 782 79 771 q 91 805 87 794 q 101 822 95 813 q 112 839 106 831 q 178 915 140 885 q 269 967 216 945 q 308 978 288 974 q 348 987 327 981 q 362 987 355 987 q 376 989 369 988 q 384 989 379 989 q 391 989 388 988 "},"j":{"x_min":-24.453125,"x_max":290.046875,"ha":386,"o":"m 149 830 q 122 831 135 830 q 103 841 110 832 q 95 858 97 846 q 93 883 93 870 q 94 910 93 896 q 95 935 95 924 q 95 958 95 946 q 100 976 96 969 q 108 983 103 980 q 117 988 113 985 q 123 989 119 988 q 129 990 126 990 l 226 990 q 255 990 241 990 q 276 983 268 990 q 289 947 289 973 q 289 899 289 921 q 289 884 289 892 q 288 868 290 875 l 288 860 q 278 838 285 845 q 256 830 269 831 q 228 830 243 830 l 149 830 m 289 27 q 286 -77 289 -27 q 264 -161 284 -128 q 222 -207 246 -189 q 164 -236 198 -225 q 139 -242 151 -241 q 114 -246 126 -243 q 94 -247 104 -247 q 75 -249 85 -247 l 60 -249 q 34 -252 51 -252 q 10 -249 17 -252 q -18 -232 -10 -245 q -22 -216 -21 -225 q -23 -195 -23 -206 q -23 -172 -23 -185 q -24 -147 -24 -160 q -23 -124 -24 -135 q -18 -106 -21 -113 q 6 -91 -11 -91 q 42 -86 24 -92 q 92 -34 82 -77 q 92 -22 93 -28 q 93 -10 92 -17 q 95 7 96 -2 q 95 27 95 17 l 95 641 q 94 673 95 656 q 100 702 93 691 q 122 716 106 711 q 131 715 125 716 q 139 717 136 714 l 208 717 q 226 717 216 717 q 243 716 236 718 l 255 716 q 270 711 262 713 q 280 703 277 710 q 286 685 284 696 q 289 660 289 674 q 289 632 290 646 q 289 607 289 618 l 289 27 "},"\t":{"x_min":0,"x_max":0,"ha":386},"Z":{"x_min":31.484375,"x_max":866.734375,"ha":900,"o":"m 112 991 l 669 991 l 790 991 q 827 988 811 991 q 848 971 843 986 q 852 942 852 961 q 852 908 852 922 q 854 888 852 899 q 852 871 855 878 l 852 854 q 848 822 852 836 q 834 799 843 808 q 816 778 825 789 q 793 749 805 763 q 769 719 780 735 q 763 712 766 717 q 757 706 759 708 q 737 682 747 693 q 718 658 727 671 q 713 653 715 656 q 708 647 711 650 q 688 623 698 635 q 668 599 677 611 q 602 519 636 558 q 536 440 568 480 q 529 432 533 436 q 522 425 525 428 q 491 387 506 405 q 461 350 476 369 q 452 340 456 344 q 444 330 447 336 q 411 291 429 311 q 379 252 394 272 q 360 232 370 241 q 347 207 350 222 q 350 191 344 195 q 362 184 355 187 q 375 182 366 184 l 393 182 q 403 181 397 180 q 415 182 409 182 l 461 182 l 744 182 l 811 182 q 836 181 825 182 q 854 175 847 180 q 864 155 862 168 q 866 127 866 143 l 866 52 q 864 27 866 39 q 855 9 862 14 q 830 1 845 2 q 798 1 815 1 l 682 1 l 215 1 l 101 1 q 72 0 87 1 q 48 6 56 0 q 33 30 38 12 q 31 51 30 39 q 33 73 33 62 q 32 126 33 96 q 38 173 31 155 q 56 199 45 188 q 76 222 66 210 q 104 257 90 241 q 133 292 119 273 q 142 302 137 298 q 150 310 147 306 q 170 336 161 324 q 191 361 180 348 q 196 367 194 363 q 201 373 198 370 q 256 438 227 406 q 309 504 284 469 q 327 524 318 515 q 344 544 336 533 q 351 552 347 548 q 358 559 355 555 q 383 590 369 575 q 408 622 397 605 q 419 634 413 629 q 429 644 425 639 q 470 694 448 671 q 511 744 491 718 q 524 759 518 751 q 534 776 530 766 q 539 784 537 779 q 538 794 541 789 q 523 807 536 805 q 497 810 511 808 l 412 810 l 181 810 q 158 809 172 810 q 131 808 144 808 q 106 810 118 808 q 88 815 94 811 q 77 835 80 821 q 74 866 75 848 q 74 901 73 883 q 75 932 75 920 q 75 957 75 945 q 81 978 76 970 q 101 989 86 986 q 106 990 104 991 q 112 991 109 989 "},"u":{"x_min":75.125,"x_max":745,"ha":823,"o":"m 110 715 l 214 715 q 242 713 229 715 q 260 703 254 712 q 268 680 267 695 q 270 651 270 666 l 270 553 l 270 346 q 274 252 270 296 q 299 178 278 208 q 361 137 318 149 q 373 135 368 135 q 385 134 378 135 q 400 133 392 133 q 413 134 409 133 q 425 135 420 137 q 435 137 429 134 q 481 155 464 144 q 521 194 506 170 q 541 249 535 219 q 549 315 548 278 q 551 392 551 352 l 551 560 l 551 651 q 551 676 551 663 q 557 698 551 690 q 577 712 563 710 q 610 715 591 715 l 684 715 q 710 715 698 715 q 731 710 722 715 q 743 689 742 703 q 745 657 745 675 l 745 551 l 745 161 l 745 62 q 745 34 745 48 q 739 14 745 21 q 718 1 732 3 q 689 0 704 0 l 614 0 q 587 1 599 0 q 569 12 576 3 q 564 25 566 16 q 560 41 562 33 q 555 57 558 50 q 547 65 552 64 q 540 66 544 68 q 533 64 535 65 q 516 51 523 58 q 501 39 509 44 q 490 30 495 34 q 478 21 485 25 q 403 -9 446 1 q 384 -12 393 -12 q 363 -16 374 -13 q 351 -17 357 -17 q 339 -17 345 -16 q 322 -18 335 -19 q 304 -16 309 -17 q 290 -15 297 -16 q 277 -15 283 -15 q 245 -8 260 -10 q 214 0 229 -5 q 202 5 207 3 q 191 9 197 7 q 113 83 142 36 q 87 153 95 112 q 76 241 78 194 q 75 337 74 287 q 76 434 76 386 l 76 623 q 75 666 76 641 q 82 701 74 690 q 98 714 86 708 q 110 715 106 714 "},"1":{"x_min":103.6875,"x_max":543.75,"ha":772,"o":"m 425 969 l 477 969 q 491 970 484 969 q 505 968 498 970 l 512 968 q 525 964 519 966 q 534 958 531 962 q 542 932 541 948 q 543 898 543 916 l 543 769 l 543 262 l 543 86 q 543 46 543 68 q 537 13 544 25 q 524 4 531 6 q 505 0 516 2 l 470 0 l 415 0 q 400 0 408 0 q 386 0 393 -1 l 379 0 q 366 4 372 2 q 355 12 360 6 q 349 34 349 20 q 349 63 349 48 l 349 168 l 349 463 l 349 552 q 349 578 349 563 q 347 602 350 593 q 321 628 340 626 q 274 630 301 630 l 173 630 q 136 632 154 630 q 110 644 118 633 q 107 654 107 650 q 105 666 107 659 q 103 681 103 673 q 104 695 104 688 q 104 733 104 713 q 111 763 104 752 q 131 775 118 773 q 158 779 144 776 l 172 779 q 189 782 180 782 q 207 784 198 783 q 238 794 223 790 q 268 805 253 798 q 323 841 300 819 q 362 891 346 863 q 378 929 371 907 q 397 961 385 952 q 412 968 404 966 q 418 968 415 969 q 425 969 422 968 "},"k":{"x_min":92.21875,"x_max":778.078125,"ha":797,"o":"m 129 990 l 230 990 q 257 988 245 990 q 277 981 270 987 q 287 940 288 968 q 287 889 287 912 l 287 654 l 287 569 q 285 549 287 560 q 287 528 284 537 l 287 515 q 291 501 289 508 q 299 490 292 493 q 310 489 303 487 q 320 494 317 492 q 344 517 334 504 q 366 540 355 529 q 389 563 377 551 q 412 589 402 575 q 421 597 416 592 q 435 612 428 604 q 449 626 442 619 l 481 658 q 489 667 484 664 q 498 676 493 671 q 522 701 509 690 q 555 715 535 711 q 574 717 562 717 q 585 717 580 718 q 598 717 591 717 l 643 717 q 671 718 655 717 q 698 717 687 719 l 713 717 q 727 713 720 714 q 737 707 734 712 q 737 696 739 703 q 732 686 735 689 q 712 662 724 672 q 688 640 699 651 q 669 621 678 630 q 649 603 660 611 q 637 591 642 597 q 625 579 632 585 q 613 568 618 575 q 600 555 607 561 l 548 503 q 530 487 538 494 q 516 468 523 479 q 510 458 513 464 q 510 444 507 451 q 521 419 513 429 q 535 399 528 410 q 555 368 546 383 q 575 337 564 353 l 721 117 q 748 78 735 97 q 773 39 762 58 q 778 22 777 32 q 771 7 778 12 q 760 4 766 4 q 748 1 755 4 q 735 1 742 0 q 721 1 728 1 l 667 1 q 614 1 645 1 q 568 7 584 0 q 542 33 553 14 q 521 67 531 51 q 474 142 498 104 q 427 218 450 180 q 405 254 416 236 q 382 289 395 272 q 373 300 380 293 q 357 304 366 307 q 339 296 345 301 q 325 283 332 290 q 305 264 314 275 q 289 237 295 253 q 287 213 287 226 q 287 187 287 200 l 287 101 q 287 80 287 92 q 288 55 288 68 q 287 33 288 43 q 281 17 285 22 q 264 5 275 8 q 237 1 252 1 q 205 1 221 0 q 176 1 188 1 q 142 1 160 1 q 113 4 124 0 q 94 29 95 11 q 93 71 93 47 l 93 230 l 93 787 l 93 917 q 92 949 93 932 q 97 975 91 965 q 116 989 102 985 q 122 989 119 989 q 129 990 126 990 "},"€":{"x_min":36.109375,"x_max":788.953125,"ha":772,"o":"m 534 1000 q 641 991 593 1002 q 732 961 690 980 q 764 948 747 955 q 787 925 782 942 q 787 911 790 918 q 782 899 784 903 q 768 868 775 882 q 752 838 761 853 q 740 811 745 824 q 726 788 734 799 q 722 781 723 781 q 684 778 707 770 q 669 786 677 782 q 652 795 661 791 q 597 814 625 806 q 579 818 588 817 q 561 821 570 818 l 543 821 q 516 822 531 824 q 491 817 500 820 q 477 813 484 814 q 463 809 470 811 q 414 776 434 796 q 377 730 394 756 q 365 705 370 717 q 354 677 359 692 q 349 666 351 673 q 350 652 347 659 q 372 632 354 634 q 415 630 391 630 l 588 630 q 618 630 602 630 q 644 627 633 631 q 660 616 655 624 q 659 592 665 609 q 646 560 655 577 q 625 538 637 544 q 597 533 613 533 q 565 533 580 533 l 447 533 l 409 533 q 398 533 404 533 q 388 533 393 534 l 359 533 q 336 523 344 528 q 326 503 329 519 q 326 497 325 501 q 327 491 327 494 q 351 474 334 476 q 390 472 368 472 l 545 472 q 582 471 565 472 q 602 455 600 470 q 600 433 605 444 q 593 417 595 423 q 581 395 587 406 q 563 379 575 384 q 541 375 554 375 q 513 375 527 375 l 426 375 q 375 375 401 375 q 343 355 350 375 q 342 347 343 352 q 343 338 341 343 q 385 236 355 283 q 462 169 415 190 q 485 161 473 165 q 509 155 497 158 q 518 155 513 155 q 529 154 523 155 q 541 153 534 152 q 552 155 548 154 l 562 155 q 573 156 568 156 q 583 158 579 156 q 596 161 590 161 q 609 163 602 161 q 697 202 659 179 q 707 208 701 204 q 720 215 713 212 q 734 217 727 218 q 745 211 741 216 q 752 186 752 202 q 752 155 752 170 q 752 144 752 149 q 751 133 752 138 l 751 111 q 752 74 751 93 q 747 43 752 55 q 727 22 740 29 q 701 9 715 16 q 669 -1 686 2 q 634 -11 652 -5 q 619 -13 627 -13 q 604 -16 611 -13 q 587 -18 595 -18 q 570 -19 579 -18 q 561 -20 566 -20 q 552 -20 555 -19 q 538 -21 548 -22 q 525 -19 529 -20 q 516 -18 520 -18 q 508 -19 511 -19 q 493 -18 501 -16 q 479 -16 486 -19 q 448 -11 463 -13 q 418 -4 433 -9 q 400 0 406 -1 q 379 8 388 4 q 359 16 369 12 q 326 36 343 23 q 236 114 273 68 q 175 219 200 161 q 159 259 165 238 q 145 301 152 279 q 138 333 141 316 q 127 361 136 350 q 113 370 122 368 q 94 375 105 372 l 76 375 q 54 378 63 377 q 40 390 44 379 q 39 406 37 398 q 44 419 41 413 q 58 448 51 434 q 80 469 65 462 q 102 477 93 475 q 118 493 112 479 q 119 506 120 500 q 91 532 115 527 q 83 532 87 532 q 76 533 79 533 q 52 536 62 536 q 37 551 41 537 q 37 564 34 558 q 43 574 40 570 q 56 606 50 591 q 80 627 63 621 q 110 632 95 632 q 134 645 125 632 q 144 666 141 655 q 151 689 147 678 q 176 756 161 724 q 235 854 198 809 q 315 931 272 899 q 375 964 343 950 q 444 989 406 978 q 476 995 459 993 q 509 999 493 996 q 522 999 513 1000 q 534 1000 531 998 "},"<":{"x_min":64.53125,"x_max":769.65625,"ha":833,"o":"m 125 247 q 97 256 112 252 q 75 272 83 261 q 64 320 63 287 q 65 379 65 352 q 65 405 65 393 q 72 425 66 418 q 92 441 79 436 q 118 452 105 447 q 166 472 141 463 q 215 491 191 480 q 408 568 311 531 q 601 645 505 605 q 660 668 630 657 q 718 691 690 679 q 743 697 729 695 q 763 688 757 700 q 768 671 768 682 q 768 650 768 661 q 769 599 768 626 q 759 558 770 572 q 745 546 754 551 q 725 537 736 541 q 693 525 709 530 q 662 512 677 519 q 536 462 600 486 q 411 412 473 438 q 362 393 387 401 q 315 373 337 384 q 300 365 309 370 q 293 348 290 359 q 306 333 295 337 q 326 325 316 329 q 367 307 345 315 q 409 291 388 300 q 525 244 468 266 q 641 198 583 222 q 678 183 661 190 q 713 169 695 176 q 734 161 725 165 q 751 151 744 158 q 768 113 768 140 q 768 59 768 87 q 768 37 768 48 q 766 18 769 26 q 760 9 763 11 q 750 4 757 8 q 718 9 732 2 q 690 22 704 16 q 640 42 665 33 q 590 62 615 51 q 552 76 570 69 q 513 91 533 83 q 375 146 444 119 q 236 202 305 173 q 180 225 208 213 q 125 247 152 236 "},"t":{"x_min":11.546875,"x_max":470.28125,"ha":489,"o":"m 169 931 l 262 931 q 299 928 283 931 q 322 911 315 926 q 325 894 325 904 q 325 875 325 885 l 325 812 q 324 796 325 806 q 325 780 323 787 l 325 765 q 326 745 325 754 q 333 729 327 736 q 368 716 343 717 q 418 715 394 715 q 434 715 426 715 q 450 712 443 715 q 467 687 465 705 q 469 647 469 669 q 470 628 469 637 q 468 611 470 618 q 438 587 461 589 q 388 586 416 586 q 377 587 383 586 q 366 586 370 587 q 356 585 361 585 q 348 583 352 586 q 332 571 337 580 q 325 550 327 562 q 325 535 323 543 q 325 519 326 526 l 325 433 l 325 271 q 327 210 325 236 q 344 165 329 185 q 363 153 351 157 q 387 147 375 150 q 396 146 391 146 q 404 146 401 147 l 419 146 q 445 144 434 146 q 463 133 456 143 q 469 112 469 125 q 469 85 469 99 q 468 31 469 55 q 445 -1 468 7 q 433 -3 438 -4 q 420 -6 427 -2 l 406 -6 q 398 -5 404 -6 q 388 -6 393 -4 q 374 -6 381 -7 q 359 -6 366 -6 q 345 -6 352 -6 q 333 -6 338 -7 l 318 -6 q 302 -4 311 -4 q 287 -3 294 -4 q 269 0 277 -1 q 252 3 261 1 q 223 12 237 7 q 197 25 209 18 q 189 31 193 27 q 179 39 185 34 q 172 45 176 41 q 165 51 168 48 q 136 109 146 77 q 134 120 133 115 q 133 132 135 125 q 132 139 132 134 q 131 146 132 143 l 131 159 q 130 172 129 165 q 131 186 131 179 l 131 239 l 131 445 l 131 519 q 131 538 131 529 q 129 556 132 548 q 110 581 124 576 q 71 586 94 588 q 31 590 47 583 q 17 602 19 594 q 11 623 14 611 l 11 652 q 14 692 11 677 q 37 713 17 708 q 49 715 43 716 q 61 715 54 715 q 100 717 82 715 q 125 733 118 719 q 130 755 129 742 q 131 780 131 767 l 131 866 q 131 890 131 877 q 133 910 131 902 q 154 929 140 924 q 162 930 157 931 q 169 931 167 929 "},"W":{"x_min":11.1875,"x_max":1293.28125,"ha":1311,"o":"m 45 990 l 155 990 q 186 990 170 990 q 209 983 201 990 q 224 960 220 974 q 231 930 227 945 q 241 890 237 911 q 251 851 245 870 q 254 839 254 844 q 255 827 254 834 q 264 788 261 808 q 273 749 268 769 q 281 718 279 734 q 288 684 284 701 q 311 591 302 638 q 333 498 320 544 q 343 456 340 477 q 352 415 347 436 q 361 386 358 398 q 375 363 363 374 q 378 363 377 363 q 381 363 379 362 q 394 379 390 366 q 401 399 398 391 q 410 436 406 417 q 420 473 413 455 q 423 486 422 480 q 426 499 425 492 q 436 536 433 517 q 445 573 440 555 q 448 584 447 579 q 451 597 450 590 q 458 622 455 609 q 465 648 461 636 q 468 665 468 659 q 473 684 470 674 q 479 704 476 694 q 500 782 491 743 q 519 861 508 822 q 529 899 526 880 q 538 938 533 919 q 548 967 544 954 q 568 987 552 980 q 590 990 577 990 q 615 990 602 990 l 697 990 q 725 989 712 990 q 748 981 738 988 q 761 961 758 974 q 768 934 763 948 q 780 883 775 909 q 793 833 786 858 q 802 797 798 815 q 811 761 805 779 q 818 731 815 745 q 826 701 820 716 q 852 596 841 649 q 879 491 863 542 q 889 448 886 470 q 900 406 893 426 q 907 381 904 392 q 916 359 909 369 q 923 355 918 358 l 929 355 q 932 357 930 356 q 934 359 933 358 q 945 383 943 370 q 952 411 948 397 q 963 455 959 433 q 973 499 966 477 q 1003 622 991 561 q 1033 744 1015 683 q 1043 788 1040 766 q 1054 833 1047 811 q 1057 845 1057 840 q 1058 856 1057 849 q 1068 895 1063 876 q 1077 934 1072 915 q 1084 959 1080 945 q 1095 980 1087 973 q 1119 988 1105 987 q 1151 990 1133 990 l 1230 990 q 1257 990 1244 990 q 1280 986 1270 990 q 1293 962 1294 979 q 1287 931 1291 945 q 1268 864 1276 899 q 1250 795 1261 829 q 1245 779 1247 787 q 1241 763 1244 772 q 1228 714 1234 740 q 1215 665 1222 688 q 1211 651 1212 658 q 1208 637 1211 644 q 1198 601 1201 619 q 1187 565 1194 583 q 1184 552 1184 558 q 1182 540 1184 547 q 1171 500 1175 520 q 1161 461 1168 480 q 1153 433 1157 447 q 1145 406 1150 420 q 1117 299 1129 354 q 1087 194 1105 245 q 1083 176 1084 184 q 1079 158 1082 167 q 1066 108 1072 134 q 1051 59 1059 83 q 1041 26 1045 41 q 1020 4 1037 11 q 997 1 1011 1 q 970 1 983 1 l 880 1 q 851 1 865 1 q 827 10 837 2 q 816 27 819 16 q 809 48 813 37 q 795 103 801 76 q 783 158 790 130 q 774 192 777 175 q 765 228 770 210 q 759 253 761 240 q 752 279 757 266 q 734 348 741 312 q 718 418 727 383 q 707 455 711 437 q 698 493 704 473 q 687 539 691 516 q 676 583 683 561 q 670 604 672 594 q 662 622 668 614 q 654 628 659 625 q 648 628 650 629 q 634 611 638 625 q 627 587 630 597 q 612 527 618 558 q 598 465 607 496 q 567 340 580 403 q 536 215 554 278 q 525 171 529 193 q 515 128 522 150 q 504 89 508 108 q 495 50 501 69 q 488 25 491 36 q 473 7 484 14 q 450 1 463 1 q 420 1 436 1 l 300 1 q 283 4 290 3 q 269 11 276 5 q 255 33 258 17 q 248 65 252 49 q 235 111 241 87 q 222 158 229 134 q 218 174 219 166 q 215 191 218 181 q 201 238 206 215 q 188 286 195 262 q 186 296 186 291 q 184 306 186 301 q 172 347 177 326 q 161 390 168 369 q 159 398 159 394 q 156 408 159 402 q 146 447 150 427 q 136 488 143 467 q 128 517 131 502 q 120 545 125 531 q 113 573 116 559 q 105 601 111 587 q 84 683 93 641 q 62 765 75 724 q 58 781 59 773 q 54 798 56 790 q 37 858 44 827 q 20 919 30 888 q 13 948 18 929 q 15 977 8 968 q 34 988 22 986 q 40 989 37 990 q 45 990 43 988 "},"v":{"x_min":17.21875,"x_max":699.78125,"ha":722,"o":"m 48 716 l 150 716 q 179 716 165 716 q 202 709 193 715 q 224 674 218 700 q 237 629 230 648 q 266 535 252 583 q 295 440 280 487 q 316 372 306 406 q 338 305 326 337 q 347 279 343 293 q 368 265 352 265 q 372 268 370 268 q 376 272 373 269 q 383 286 380 279 q 388 301 386 293 q 399 333 395 316 q 408 365 402 350 q 445 482 427 423 q 481 600 462 541 q 493 634 488 616 q 502 666 497 651 q 509 688 505 677 q 522 707 513 700 q 540 715 526 709 q 558 717 548 718 q 576 716 568 716 l 644 716 q 672 716 659 716 q 693 708 686 715 q 699 688 701 701 q 694 666 697 675 q 680 625 687 647 q 666 584 673 604 q 660 566 662 575 q 655 548 658 556 q 643 518 648 533 q 633 487 638 502 q 631 478 632 483 q 627 469 630 473 q 613 427 619 448 q 600 384 607 405 q 570 299 584 343 q 540 213 556 255 q 527 175 533 194 q 515 137 522 156 q 511 125 512 130 q 506 113 509 120 q 496 82 501 98 q 486 51 491 66 q 473 22 479 36 q 452 4 468 9 q 429 0 441 0 q 404 1 416 1 l 313 1 q 284 1 298 1 q 258 6 269 1 q 244 24 248 13 q 236 47 240 34 q 223 81 229 63 q 211 116 218 100 q 207 127 208 122 q 204 138 206 131 q 191 173 197 155 q 179 209 186 191 q 175 222 176 216 q 170 236 173 229 q 161 261 165 248 q 152 287 156 275 q 150 296 150 291 q 147 305 150 301 q 138 330 141 318 q 129 356 134 343 q 105 422 116 388 q 83 490 94 456 q 56 566 68 527 q 31 641 45 604 l 19 679 q 17 689 18 683 q 19 701 16 695 q 38 715 23 711 q 48 716 45 715 "},">":{"x_min":63.734375,"x_max":768.84375,"ha":833,"o":"m 708 455 q 735 445 720 450 q 758 430 750 441 q 768 382 769 415 q 768 323 768 350 q 767 297 768 309 q 761 277 766 284 q 741 261 754 266 q 715 250 727 255 q 666 230 691 238 q 618 211 641 222 q 425 134 522 170 q 231 56 327 97 q 172 34 202 45 q 115 11 143 23 q 90 4 104 6 q 69 13 76 2 q 65 31 65 20 q 65 52 65 41 q 63 103 65 76 q 73 144 62 130 q 88 156 79 151 q 108 165 97 161 q 139 177 123 172 q 170 190 155 183 q 296 240 233 216 q 422 290 359 263 q 470 309 445 301 q 518 329 495 318 q 533 337 523 331 q 540 354 543 343 q 527 369 537 365 q 506 377 516 373 q 466 395 487 387 q 423 411 444 402 q 307 458 365 436 q 191 504 250 480 q 154 519 172 512 q 119 533 137 526 q 98 541 108 537 q 81 551 88 544 q 65 588 65 562 q 65 643 65 615 q 64 665 65 654 q 66 684 63 676 q 72 693 69 691 q 83 698 76 694 q 115 693 101 700 q 143 680 129 686 q 193 660 168 669 q 243 640 218 651 q 281 626 262 633 q 319 611 300 619 q 458 556 388 583 q 597 500 527 529 q 652 477 625 488 q 708 455 680 466 "},"s":{"x_min":46.765625,"x_max":705.140625,"ha":746,"o":"m 347 736 q 528 713 451 738 q 645 625 605 687 q 663 593 655 609 q 676 558 670 577 q 679 540 679 550 q 676 523 679 530 q 661 512 670 515 q 644 509 654 509 q 625 509 634 509 l 563 509 q 544 509 554 509 q 526 511 534 508 q 505 522 512 513 q 493 539 498 530 q 482 559 487 548 q 468 576 477 569 q 441 593 454 587 q 408 602 427 598 q 379 606 398 605 q 351 605 361 608 l 341 605 q 328 603 334 604 q 315 601 322 602 q 277 582 291 594 q 256 547 262 570 q 256 529 254 537 q 262 515 259 520 q 285 488 272 498 q 316 472 298 479 q 374 453 343 461 q 438 439 405 445 q 502 425 470 433 q 561 406 533 418 q 585 397 573 401 q 608 387 597 394 q 656 351 634 370 q 690 302 677 331 q 697 283 694 293 q 702 262 700 273 q 704 236 704 254 q 704 209 705 219 l 704 202 q 700 186 701 194 q 698 172 700 179 q 668 98 688 130 q 613 44 645 65 q 541 8 581 23 q 509 -1 526 1 q 475 -8 491 -4 q 449 -11 462 -11 q 423 -15 436 -12 l 398 -15 q 370 -18 390 -18 q 341 -15 350 -18 q 332 -14 337 -15 q 322 -13 327 -13 q 288 -9 305 -11 q 256 -4 272 -8 q 161 31 202 11 q 90 91 119 51 q 56 152 70 118 q 51 175 54 161 q 47 194 48 181 q 48 215 45 206 q 62 229 52 225 q 79 231 69 231 q 100 231 88 231 l 165 231 q 187 231 176 231 q 206 229 198 231 q 227 211 222 223 q 238 184 231 198 q 249 166 241 177 q 262 152 256 155 q 294 131 279 138 q 333 116 309 123 q 347 114 340 113 q 361 113 354 115 q 385 111 372 111 q 408 115 398 112 q 421 116 415 116 q 434 119 427 116 q 470 136 454 126 q 495 161 486 145 q 506 195 502 172 q 506 213 509 205 q 501 227 504 222 q 477 256 491 247 q 443 275 462 266 q 387 293 416 286 q 329 308 358 300 q 306 312 318 311 q 283 316 294 313 q 198 341 238 329 q 125 376 158 352 q 68 451 86 404 q 62 477 65 461 q 58 501 59 487 q 59 526 56 515 q 61 538 62 533 q 62 550 59 543 q 68 578 65 565 q 77 604 72 591 q 127 669 95 644 q 200 709 159 694 q 231 720 215 716 q 266 727 248 723 q 283 731 275 730 q 300 733 291 732 q 323 734 311 734 q 347 736 336 734 "},"B":{"x_min":96.203125,"x_max":925.046875,"ha":978,"o":"m 923 311 q 924 270 926 295 q 919 231 922 245 q 913 205 916 218 q 906 181 910 192 q 816 67 877 112 q 765 39 792 51 q 708 17 738 27 q 676 10 692 12 q 644 5 659 7 q 631 3 637 3 q 617 2 624 3 q 606 2 612 1 q 592 1 599 3 q 581 0 587 0 q 567 1 574 1 l 162 1 q 122 3 138 1 q 99 21 106 5 q 96 55 95 32 q 97 94 97 78 l 97 910 q 96 945 97 927 q 102 975 95 964 q 123 989 108 985 q 128 990 126 991 q 134 991 131 989 l 548 991 q 567 991 558 991 q 585 991 577 992 q 599 989 592 988 q 613 990 606 991 l 622 990 q 639 987 630 987 q 658 985 648 988 q 679 981 669 983 q 701 977 690 980 q 751 958 727 967 q 794 935 774 949 q 840 887 822 916 q 869 820 858 857 q 872 800 872 810 q 876 779 873 791 q 876 768 877 774 q 877 757 876 763 q 878 747 879 753 q 876 738 877 741 l 876 725 q 875 715 876 721 q 874 707 874 710 q 871 690 872 697 q 867 675 870 682 q 820 593 849 625 q 799 576 810 583 q 780 558 788 569 q 774 551 777 556 q 773 539 770 546 q 791 520 776 528 q 817 505 806 512 q 879 447 855 480 q 913 372 901 415 q 919 349 917 361 q 923 326 920 337 l 923 311 m 318 808 q 312 784 312 798 q 312 754 312 769 l 312 679 q 311 659 312 669 q 312 641 310 648 l 312 627 q 316 613 314 619 q 320 601 317 607 q 337 591 325 594 q 364 588 349 589 q 393 588 378 587 q 421 589 409 589 q 465 588 442 589 q 511 587 488 587 q 555 589 534 587 q 591 597 575 591 q 653 645 632 611 q 666 693 663 664 q 652 767 668 740 q 603 809 635 794 q 585 814 595 812 q 564 819 575 816 q 548 821 559 821 q 509 824 531 825 q 468 824 488 824 l 350 824 q 344 822 348 822 q 338 821 341 822 q 318 808 324 817 m 707 288 q 705 330 710 308 q 695 363 700 352 q 618 433 675 413 q 566 441 595 440 q 507 443 538 443 l 350 443 q 346 440 348 440 q 341 441 343 441 q 318 427 324 437 q 312 399 312 416 q 312 366 312 381 l 312 243 q 312 208 312 226 q 320 181 313 191 q 338 171 325 174 q 366 167 350 168 q 399 167 382 166 q 428 168 416 168 q 509 167 470 168 q 582 171 548 166 q 644 188 617 176 q 688 224 671 199 q 699 250 695 236 q 707 280 703 265 l 707 288 "},"?":{"x_min":48.609375,"x_max":727.84375,"ha":772,"o":"m 725 761 q 727 741 727 754 q 725 720 727 729 q 724 707 723 713 q 723 694 725 701 q 716 660 719 676 q 705 629 712 644 q 679 581 694 605 q 644 543 663 558 l 637 536 q 616 518 626 527 q 594 501 605 509 q 556 473 575 487 q 520 443 537 459 q 480 376 493 415 q 475 341 475 361 q 466 309 475 320 q 454 302 461 304 q 438 298 447 301 l 404 298 q 375 297 391 298 q 342 297 358 297 q 313 301 326 298 q 295 311 301 304 q 289 328 290 318 q 288 350 288 338 l 288 361 q 290 375 290 368 q 291 388 291 381 q 300 424 297 406 q 311 456 304 441 q 340 509 322 483 q 377 551 358 536 l 390 563 q 407 577 400 570 q 423 590 415 583 q 463 623 445 605 q 495 665 481 641 q 505 690 501 675 q 510 722 509 705 q 509 755 511 738 q 501 784 506 772 q 493 801 498 793 q 483 816 488 809 q 461 835 475 827 q 431 848 447 843 q 422 850 426 850 q 411 851 418 850 q 395 853 404 852 q 379 852 386 854 q 365 850 372 850 q 351 848 358 851 q 266 772 291 827 q 259 749 262 761 q 252 725 255 737 q 246 697 248 709 q 233 679 244 686 q 212 673 225 673 q 187 673 200 673 l 105 673 q 79 674 91 673 q 59 680 66 675 q 50 698 52 686 q 50 723 47 711 q 52 739 51 732 q 55 755 54 747 q 63 785 59 770 q 73 813 68 800 q 79 827 76 820 q 86 841 81 834 q 112 884 100 865 q 158 934 131 912 q 215 975 184 955 q 236 986 225 982 q 258 994 247 990 q 295 1004 276 1001 q 334 1011 313 1007 q 352 1013 343 1012 q 370 1013 361 1013 q 509 1000 448 1016 q 613 951 569 983 q 640 930 626 941 q 663 907 654 919 q 675 892 669 900 q 686 877 682 884 q 691 868 688 872 q 697 858 694 863 q 711 825 707 843 q 722 787 716 807 q 724 774 725 780 q 725 761 723 768 m 485 85 q 486 66 485 75 q 485 48 487 56 l 485 34 q 480 19 482 25 q 472 7 479 12 q 451 1 464 2 q 423 1 439 1 l 326 1 q 297 2 311 1 q 276 13 283 3 q 270 35 271 21 q 270 62 270 48 l 270 152 q 270 177 270 164 q 276 199 271 191 q 296 210 283 207 q 301 211 299 212 q 307 212 304 210 l 418 212 q 448 212 433 212 q 472 205 464 212 q 480 193 479 200 q 485 178 482 187 l 485 167 q 485 153 486 160 q 485 139 485 146 l 485 85 "},"H":{"x_min":97,"x_max":932,"ha":1029,"o":"m 134 990 l 245 990 q 286 988 269 990 q 311 966 304 986 q 314 952 314 960 q 314 937 314 944 l 314 889 l 314 721 q 312 667 314 697 q 322 622 311 637 q 338 613 328 614 q 358 610 347 612 l 625 610 q 676 610 650 610 q 713 628 703 611 q 718 665 719 640 q 717 710 717 690 l 717 890 q 716 939 717 911 q 725 978 715 966 q 742 987 729 985 q 772 991 755 990 q 805 991 788 991 q 834 990 822 990 q 883 991 858 990 q 922 980 909 991 q 932 957 932 973 q 932 926 932 941 l 932 790 l 932 222 l 932 71 q 932 36 932 54 q 922 11 932 18 q 882 0 909 0 q 831 1 855 1 q 803 0 819 1 q 771 0 787 0 q 742 3 755 1 q 725 12 729 5 q 719 31 721 18 q 716 59 717 44 q 716 88 715 73 q 717 114 717 102 l 717 315 l 717 355 q 717 366 717 361 q 717 378 718 372 l 717 391 q 715 400 715 396 q 714 408 715 404 q 677 428 704 428 q 623 428 651 428 l 350 428 q 332 423 339 425 q 320 412 325 421 q 314 391 317 405 l 314 378 q 313 362 312 371 q 314 346 314 353 l 314 284 l 314 93 q 314 48 314 72 q 306 12 314 25 q 288 3 301 5 q 259 0 275 1 q 226 0 243 0 q 197 1 209 1 q 149 0 177 1 q 110 8 122 0 q 98 34 99 16 q 97 72 97 52 l 97 232 l 97 787 l 97 916 q 97 948 97 932 q 103 975 97 965 q 122 989 108 985 q 128 989 125 989 q 134 990 132 990 "},"c":{"x_min":51.390625,"x_max":751.65625,"ha":797,"o":"m 402 736 q 591 703 515 739 q 711 600 666 667 q 744 523 733 567 q 749 505 747 517 q 748 486 751 494 q 729 469 743 471 q 695 467 715 467 l 623 467 q 597 467 611 467 q 576 472 584 467 q 561 489 565 478 q 550 514 556 501 q 531 542 541 529 q 509 564 522 554 q 466 583 490 576 q 450 586 458 586 q 434 589 441 586 l 420 589 q 376 583 393 589 q 311 545 336 571 q 270 483 286 519 q 260 451 263 468 q 252 414 256 433 q 251 403 251 408 q 250 391 251 397 q 247 352 247 377 q 251 313 248 327 q 252 298 251 302 q 256 279 255 288 q 259 259 256 269 q 286 201 270 227 q 325 156 301 175 q 341 147 330 152 q 372 134 356 137 q 412 129 388 131 q 420 129 415 129 q 429 130 426 129 l 441 130 q 460 135 451 133 q 477 140 469 137 q 541 193 519 158 q 551 209 547 200 q 558 225 555 218 q 568 252 563 240 q 587 270 572 263 q 627 275 600 276 q 673 275 655 275 q 693 275 683 275 q 711 274 704 276 l 722 274 q 733 271 727 272 q 741 268 738 271 q 750 252 748 262 q 750 230 752 242 q 719 148 737 185 q 537 0 662 42 q 508 -5 523 -3 q 477 -12 493 -7 q 461 -13 469 -13 q 444 -14 452 -13 l 429 -14 q 408 -17 422 -17 q 387 -14 394 -16 q 367 -12 376 -12 q 348 -10 358 -13 q 334 -8 341 -9 q 320 -6 327 -7 q 291 1 305 -2 q 265 11 277 5 q 155 83 200 39 q 83 192 111 126 q 72 219 76 204 q 63 248 68 233 q 62 259 62 254 q 59 271 62 264 q 56 291 56 280 q 54 311 56 301 l 54 335 q 51 351 51 342 q 54 367 51 360 q 54 379 55 373 q 54 390 52 385 q 56 408 56 400 q 58 425 55 417 q 69 473 65 450 q 81 518 73 496 q 159 636 112 589 q 277 712 205 683 q 318 724 297 721 q 361 733 338 728 q 381 735 372 735 q 402 736 391 735 "},"&":{"x_min":45.84375,"x_max":939.171875,"ha":951,"o":"m 937 25 q 938 13 940 18 q 932 5 936 8 q 905 0 922 -1 q 873 0 888 0 l 788 0 q 747 0 765 0 q 716 12 730 1 q 707 21 711 16 q 698 31 702 26 q 693 37 695 34 q 688 43 691 40 q 677 56 683 50 q 665 70 672 63 q 654 79 661 75 q 636 81 647 84 q 618 73 625 79 q 604 62 611 68 q 581 47 593 55 q 559 31 570 38 q 517 11 540 20 q 470 -5 494 2 q 451 -9 461 -8 q 430 -13 441 -11 q 416 -15 423 -16 q 402 -16 409 -15 l 393 -16 q 372 -19 386 -19 q 352 -18 359 -19 q 340 -17 345 -18 q 327 -16 334 -16 q 300 -12 313 -13 q 273 -8 286 -11 q 240 1 255 -2 q 211 12 226 5 q 150 47 179 26 q 104 94 122 69 q 90 113 97 104 q 77 134 84 123 q 68 154 72 144 q 61 175 65 163 q 50 215 54 194 q 45 262 45 237 l 45 294 q 47 303 47 298 q 48 312 47 308 q 52 333 51 323 q 56 352 54 343 q 102 437 72 400 q 168 502 131 475 q 219 537 191 519 q 236 547 227 543 q 250 563 245 552 q 244 591 254 577 q 229 612 234 605 q 188 687 204 648 q 182 707 184 697 q 177 727 180 716 q 172 782 170 751 q 181 832 175 812 q 237 924 201 890 q 327 982 273 958 q 358 990 343 987 q 390 997 373 993 q 406 997 398 997 q 423 1000 415 998 q 573 970 511 1001 q 669 886 636 938 q 677 869 673 877 q 684 852 680 861 q 700 784 695 825 q 694 708 705 743 q 682 673 688 690 q 668 641 676 657 q 633 597 652 619 q 593 561 613 576 q 577 549 586 554 q 562 538 569 544 q 554 532 558 536 q 547 525 550 529 q 541 506 540 516 q 548 488 543 495 q 558 476 552 481 q 568 463 563 470 q 595 428 581 444 q 623 394 609 412 q 638 381 627 387 q 658 383 648 376 q 671 398 666 388 q 679 420 676 408 q 684 443 682 431 q 694 462 687 454 q 732 476 705 476 q 782 476 758 476 q 800 477 790 476 q 816 475 809 477 l 825 475 q 850 462 843 472 q 852 430 857 451 q 844 398 847 409 q 839 380 841 388 q 834 365 837 372 q 816 320 825 341 q 795 279 807 298 q 782 256 791 272 q 775 229 772 241 q 793 197 780 209 q 816 172 805 186 q 852 129 833 148 q 888 86 872 109 q 898 75 893 79 q 908 63 904 70 q 923 45 915 54 q 937 25 932 36 m 509 198 q 524 213 516 204 q 527 237 531 223 q 517 257 525 248 q 502 275 509 266 q 480 302 491 290 q 458 330 469 315 q 453 335 455 333 q 448 340 451 337 q 429 364 438 352 q 409 388 419 376 q 388 413 400 401 q 354 426 377 426 q 343 422 351 425 q 331 416 336 419 q 320 411 326 413 q 270 370 293 394 q 237 313 248 345 q 235 302 236 308 q 233 290 234 297 q 233 260 230 276 q 238 234 236 244 q 336 145 262 169 q 372 140 350 141 q 409 144 394 140 q 464 165 441 152 q 509 198 487 179 m 529 758 q 530 779 531 768 q 526 797 529 790 q 465 863 511 850 q 434 868 452 868 q 428 867 431 866 q 422 866 425 868 q 404 861 411 863 q 354 805 369 847 q 351 780 351 794 q 354 755 351 766 q 357 742 356 748 q 361 729 358 736 q 377 699 368 712 q 395 672 386 686 q 413 653 401 665 q 437 644 425 641 q 459 653 451 647 q 476 666 466 659 q 525 737 511 691 q 527 747 527 743 q 529 758 526 752 "},"I":{"x_min":94.234375,"x_max":310.75,"ha":410,"o":"m 132 989 l 251 989 q 280 988 267 989 q 301 978 294 988 q 309 953 308 968 q 310 919 310 938 l 310 799 l 310 317 l 310 89 q 310 49 310 71 q 304 15 311 26 q 279 0 298 5 q 258 0 269 -2 q 236 0 247 0 l 154 0 q 126 1 139 0 q 104 10 113 3 q 96 30 97 17 q 95 60 95 44 l 95 180 l 95 687 l 95 890 q 94 936 95 910 q 100 974 93 963 q 118 988 106 982 q 126 988 122 988 q 132 989 129 989 "},"G":{"x_min":51.390625,"x_max":970.90625,"ha":1054,"o":"m 520 1014 q 755 964 661 1017 q 902 828 850 912 q 945 725 929 784 q 950 701 948 716 q 944 680 951 687 q 925 668 937 670 q 897 667 912 667 l 807 667 q 778 668 791 667 q 757 675 765 668 q 739 699 744 684 q 727 728 734 714 q 701 765 715 748 q 668 796 687 782 q 604 825 641 814 q 588 829 597 828 q 573 831 580 830 q 561 832 569 832 q 519 833 544 835 q 480 828 494 831 q 462 824 470 825 q 445 818 454 823 q 381 782 409 803 q 331 730 352 762 q 301 673 312 703 q 280 607 290 642 q 275 577 276 592 q 270 546 273 562 l 270 528 q 268 510 268 520 q 269 491 269 500 q 270 444 269 467 q 277 399 272 420 q 279 389 279 394 q 280 380 279 385 q 333 260 300 309 q 429 182 366 210 q 454 173 441 177 q 483 164 468 169 q 499 164 491 163 q 513 162 506 164 q 534 159 522 159 q 556 162 547 159 q 569 162 563 163 q 580 163 575 162 q 592 164 587 164 q 602 166 597 163 q 638 176 622 171 q 670 189 655 181 q 726 237 705 210 q 762 305 747 264 q 770 341 768 320 q 757 370 772 362 q 735 376 748 376 q 709 376 722 376 l 638 376 q 620 375 630 376 q 602 377 611 374 l 590 377 q 579 379 584 378 q 569 382 573 379 q 559 399 562 388 q 556 423 556 410 q 556 451 555 436 q 556 478 556 466 q 557 499 556 489 q 561 516 558 509 q 576 533 566 529 q 590 536 584 536 l 605 536 q 616 537 609 537 q 627 537 622 537 l 668 537 l 870 537 q 924 537 894 537 q 963 524 954 537 q 970 495 970 513 q 970 460 970 477 l 970 316 l 970 88 q 970 37 970 62 q 951 6 969 13 q 931 2 943 2 q 908 2 919 2 q 860 4 880 2 q 832 25 840 6 q 823 53 826 38 q 813 80 820 69 q 807 86 811 82 q 795 88 802 89 q 777 77 784 85 q 761 62 769 69 q 734 41 747 50 q 707 23 722 32 q 668 5 688 12 q 627 -8 648 -1 q 613 -12 620 -11 q 598 -14 605 -12 q 575 -17 587 -17 q 550 -19 562 -17 q 534 -20 544 -21 q 519 -18 523 -19 l 505 -18 q 492 -17 498 -17 q 479 -15 486 -17 l 468 -15 q 445 -11 456 -12 q 423 -7 434 -10 q 404 -2 413 -4 q 384 2 394 0 q 311 31 343 14 q 177 133 229 74 q 90 280 126 192 q 77 319 81 299 q 66 357 73 338 q 65 369 65 364 q 62 381 65 374 q 59 401 59 391 q 56 423 59 412 q 54 434 54 430 q 54 446 55 439 l 54 471 q 51 493 51 478 q 54 514 51 507 l 54 530 q 54 547 55 538 q 56 563 54 556 q 59 588 59 575 q 62 612 59 600 q 69 641 66 627 q 77 671 72 656 q 90 709 84 691 q 105 746 97 728 q 125 784 113 766 q 147 820 136 803 q 241 919 188 878 q 369 988 294 960 q 402 998 384 995 q 438 1006 420 1002 q 453 1009 445 1009 q 468 1012 461 1009 q 486 1013 477 1014 q 505 1014 495 1012 q 513 1014 508 1016 q 520 1014 518 1013 "},"`":{"x_min":-31.953125,"x_max":261.953125,"ha":360,"o":"m -1 1001 l 91 1001 q 118 1001 105 1001 q 141 997 131 1001 q 165 979 156 991 q 180 956 173 967 q 202 925 191 941 q 223 894 212 909 q 241 869 231 882 q 258 841 251 857 q 261 829 261 836 q 259 817 262 822 q 240 807 254 809 l 231 807 q 219 806 226 805 q 205 807 212 807 q 177 807 190 807 q 152 811 163 807 q 129 824 138 816 q 109 841 120 833 l 102 848 q 64 883 81 863 q 26 918 47 902 q 18 926 22 922 q 9 936 13 930 q -3 948 2 941 q -16 961 -9 954 q -27 971 -22 966 q -31 987 -31 976 q -27 994 -29 992 q -20 999 -25 996 q -11 1000 -15 1000 q -1 1001 -6 1000 "},"(":{"x_min":72.78125,"x_max":402.65625,"ha":411,"o":"m 75 347 q 72 361 72 354 q 73 376 73 369 q 72 390 73 383 q 75 404 72 397 l 75 417 q 75 433 75 424 q 76 448 75 441 q 77 462 76 455 q 77 476 77 469 l 86 551 q 90 579 88 566 q 95 608 93 592 q 101 634 98 620 q 106 662 104 648 q 124 727 116 694 q 144 788 131 759 q 151 809 148 799 q 159 830 154 819 q 184 888 170 859 q 212 942 197 916 q 233 978 223 959 q 261 1008 243 997 q 272 1011 266 1011 q 286 1013 279 1012 l 316 1013 q 341 1014 327 1013 q 368 1014 355 1015 q 389 1009 380 1013 q 401 997 398 1005 q 400 980 404 988 q 394 966 397 972 q 380 935 387 951 q 366 904 373 919 q 339 824 351 865 q 313 744 327 784 q 303 700 306 723 q 294 656 300 677 q 286 610 287 633 q 279 563 284 587 q 277 549 277 556 q 276 533 277 541 q 273 499 273 517 q 270 466 273 481 q 269 449 268 458 q 269 433 270 440 l 269 401 q 269 374 266 387 q 268 358 269 366 q 269 342 268 349 l 269 324 q 270 306 272 316 q 272 287 269 295 q 272 277 272 281 q 273 267 273 273 q 276 241 276 255 q 279 213 276 227 q 282 184 281 198 q 286 155 283 170 q 289 135 288 145 q 293 116 290 126 q 300 80 297 98 q 309 45 304 62 q 322 -7 316 17 q 337 -57 329 -32 q 342 -73 340 -65 q 347 -89 344 -80 q 366 -137 358 -112 q 386 -186 375 -162 q 397 -209 390 -194 q 400 -236 404 -225 q 380 -249 395 -246 q 375 -249 377 -250 q 369 -250 372 -249 l 313 -250 q 287 -250 300 -250 q 263 -246 275 -250 q 240 -223 248 -239 q 225 -194 233 -208 q 190 -127 205 -162 q 159 -55 175 -91 q 140 -7 148 -32 q 125 40 131 16 q 116 67 119 54 q 109 95 113 81 l 93 166 q 86 208 87 187 q 80 249 84 230 q 79 263 79 256 q 77 276 79 269 q 75 301 76 288 q 75 326 75 313 l 75 347 l 75 347 "},"U":{"x_min":92,"x_max":935.75,"ha":1029,"o":"m 129 991 l 247 991 q 277 990 262 991 q 299 980 292 988 q 306 952 305 969 q 307 916 307 934 l 307 776 l 307 490 l 307 441 q 306 429 307 436 q 307 417 305 423 l 307 395 q 306 369 307 383 q 308 344 305 355 q 310 329 308 334 q 314 298 312 313 q 322 267 316 283 q 362 208 337 231 q 426 170 386 184 q 448 166 437 167 q 471 162 460 165 q 483 160 478 159 q 496 159 489 161 q 514 158 501 158 q 530 161 526 159 l 551 161 q 574 165 562 163 q 594 169 585 166 q 625 179 614 173 q 669 208 650 190 q 699 251 688 227 q 717 336 714 287 q 720 438 720 386 l 720 715 l 720 901 q 719 944 720 920 q 727 979 718 968 q 746 989 733 987 q 774 991 758 991 l 862 991 q 884 992 873 991 q 904 990 894 993 q 929 976 923 986 q 935 945 936 965 q 935 908 935 924 l 935 722 l 935 441 q 933 338 935 388 q 921 248 932 288 q 871 135 901 183 q 793 54 841 87 q 691 4 750 23 q 666 -2 679 0 q 640 -8 653 -5 q 624 -11 632 -11 q 608 -14 616 -11 q 571 -17 591 -16 q 530 -19 550 -19 q 305 13 398 -20 q 160 123 212 47 q 130 175 142 148 q 108 234 118 202 q 105 246 105 241 q 103 258 105 251 q 92 345 92 297 q 92 442 92 394 l 92 830 l 92 927 q 92 954 92 941 q 96 976 92 968 q 118 990 104 986 q 123 990 121 990 q 129 991 126 990 "},"◊":{"x_min":40.75,"x_max":646.8125,"ha":686,"o":"m 645 487 q 643 463 648 474 q 633 445 637 452 q 609 406 620 425 q 587 367 598 387 q 569 336 577 352 q 551 305 561 320 q 490 202 519 253 q 429 99 461 150 q 411 68 419 84 q 393 37 402 52 q 382 22 387 30 q 370 9 377 14 q 356 4 363 5 q 340 0 350 3 q 328 0 334 0 q 318 2 322 0 q 287 22 294 9 q 269 53 280 35 q 225 132 245 92 q 181 209 205 171 q 172 228 176 219 q 161 248 168 238 q 131 303 145 275 q 100 357 116 331 q 94 370 97 364 q 87 382 91 375 q 75 405 80 394 q 62 428 69 417 q 50 450 55 439 q 41 474 44 460 q 44 496 38 485 q 52 514 50 507 q 76 559 63 538 q 101 603 88 581 q 115 630 109 616 q 130 657 122 644 q 183 753 158 705 q 237 849 208 802 q 255 884 247 866 q 275 917 263 902 q 284 936 280 927 q 297 951 288 945 q 315 961 301 955 q 322 960 318 961 q 330 963 327 959 q 361 957 350 963 q 381 941 373 951 q 395 921 390 932 q 409 898 401 910 q 442 841 426 870 q 476 785 458 813 q 485 769 481 777 q 494 750 488 760 q 544 668 520 710 q 593 584 568 625 q 609 557 601 570 q 625 530 616 544 q 637 509 632 519 q 645 487 643 499 m 568 462 q 571 472 569 466 q 572 486 573 479 q 563 509 569 500 q 551 529 558 518 q 537 554 544 541 q 523 579 530 566 q 514 593 518 586 q 506 608 511 601 q 476 659 491 633 q 445 711 461 684 q 410 772 426 741 q 375 834 394 804 q 360 859 368 845 q 336 875 352 873 q 333 874 334 873 q 329 873 331 875 q 325 871 327 872 q 322 868 323 870 q 311 854 315 862 q 302 838 306 845 q 285 807 293 823 q 268 775 277 790 q 247 740 256 758 q 227 704 238 722 q 191 640 208 672 q 158 576 175 608 q 137 541 147 558 q 119 505 127 525 q 113 492 116 500 q 112 476 109 484 q 129 434 118 454 q 151 397 140 413 q 160 380 156 388 q 168 363 163 372 q 191 323 180 344 q 213 283 202 302 q 224 264 220 273 q 234 245 227 255 q 266 188 251 218 q 298 130 281 158 q 309 110 305 120 q 325 93 313 100 q 338 87 331 86 q 360 102 354 90 q 373 126 366 115 q 405 181 390 154 q 437 234 420 208 q 478 304 458 269 q 519 375 498 340 q 531 395 526 386 q 543 415 536 405 q 556 438 550 426 q 568 462 562 450 "},"F":{"x_min":95.234375,"x_max":791.59375,"ha":824,"o":"m 133 989 l 619 989 l 731 989 q 761 987 747 989 q 781 977 774 986 q 789 959 787 970 q 791 932 791 947 q 790 903 791 918 q 790 876 790 888 q 790 856 790 866 q 790 838 791 846 q 785 825 787 831 q 777 814 783 819 q 739 807 766 806 q 692 808 712 808 l 424 808 q 371 808 402 808 q 326 801 340 809 q 312 780 317 795 q 310 755 309 770 q 311 729 311 740 l 311 662 q 310 646 311 655 q 311 629 309 636 l 311 614 q 317 593 313 601 q 331 581 320 585 q 348 577 338 578 q 369 577 358 577 l 422 577 l 615 577 q 640 577 626 577 q 670 577 655 578 q 696 575 684 577 q 713 570 708 574 q 727 533 727 560 q 726 483 726 506 q 727 459 726 472 q 724 435 727 446 q 709 414 719 419 q 672 409 699 408 q 626 410 644 410 l 398 410 q 347 408 372 410 q 315 389 322 407 q 312 380 312 385 q 311 371 312 375 l 311 357 l 311 336 l 311 298 l 311 103 q 311 55 311 83 q 305 14 312 26 q 294 5 301 7 q 280 0 287 3 q 259 -1 270 -2 q 237 0 248 0 l 157 0 q 128 0 141 0 q 107 8 115 1 q 96 30 97 15 q 96 59 96 44 l 96 179 l 96 687 l 96 890 q 95 936 96 909 q 101 973 94 962 q 122 987 107 983 q 127 988 125 989 q 133 989 130 987 "},"r":{"x_min":75,"x_max":537.0625,"ha":540,"o":"m 482 735 q 509 732 497 735 q 527 719 521 729 q 536 681 536 708 q 536 633 536 654 q 536 598 536 618 q 532 568 537 579 q 516 555 526 558 q 492 552 505 552 q 464 554 479 552 q 437 552 450 555 q 418 549 427 550 q 400 546 408 548 q 355 525 377 539 q 321 495 333 512 q 306 473 314 484 q 291 448 298 461 q 284 425 287 437 q 277 402 280 414 q 275 382 275 393 q 272 362 275 372 q 271 352 271 357 q 271 343 272 347 l 271 320 q 269 299 268 311 q 271 276 271 287 l 271 187 l 271 69 q 269 36 271 51 q 261 11 268 20 q 252 4 258 6 q 239 1 245 2 l 232 1 q 216 0 225 0 q 201 0 208 0 l 141 0 q 124 1 133 1 q 105 1 115 1 q 91 5 98 3 q 81 14 84 7 q 75 35 76 21 q 75 62 75 48 l 75 156 l 75 548 l 75 651 q 75 678 75 665 q 80 700 75 691 q 101 713 87 711 q 134 716 115 716 l 205 716 q 234 714 222 716 q 254 701 247 712 q 259 681 258 694 q 261 657 259 669 q 266 636 262 645 q 279 626 269 626 q 284 629 282 629 q 290 631 287 629 q 305 647 298 638 q 321 663 311 656 q 330 672 326 668 q 340 681 334 677 q 366 698 352 690 q 393 713 379 706 q 421 723 407 719 q 451 732 436 727 q 467 732 455 733 q 482 735 479 732 "},":":{"x_min":85,"x_max":300,"ha":386,"o":"m 85 640 q 85 666 85 653 q 90 687 85 680 q 111 703 96 697 q 117 702 114 703 q 123 703 121 701 l 233 703 q 264 703 250 703 q 288 696 279 703 q 298 676 297 689 q 300 648 300 664 l 300 548 q 298 520 300 533 q 290 501 297 507 q 266 493 280 494 q 237 492 252 492 l 144 492 q 115 493 129 492 q 94 503 101 494 q 86 524 87 511 q 85 553 85 537 l 85 640 m 85 149 q 85 175 85 162 q 90 196 85 189 q 111 212 96 206 q 117 211 114 212 q 123 212 121 210 l 233 212 q 264 212 250 212 q 288 205 279 212 q 298 185 297 198 q 300 157 300 173 l 300 57 q 298 29 300 42 q 290 10 297 16 q 266 2 280 3 q 237 1 252 1 l 144 1 q 115 2 129 1 q 94 12 101 3 q 86 33 87 20 q 85 62 85 46 l 85 149 "},"x":{"x_min":21.9375,"x_max":722.984375,"ha":746,"o":"m 73 716 l 184 716 q 221 715 204 716 q 250 705 238 713 q 267 686 259 698 q 281 663 275 675 q 305 628 293 645 q 330 593 318 611 q 346 568 337 581 q 369 550 355 554 q 379 550 375 548 q 387 555 384 552 q 402 572 397 562 q 415 591 408 581 q 438 627 426 609 q 463 662 451 644 q 485 695 475 682 q 520 715 495 709 q 541 717 530 718 q 563 716 552 716 l 650 716 q 677 714 663 716 q 693 701 690 712 q 692 688 695 694 q 686 677 688 682 q 669 652 679 663 q 651 626 659 640 q 588 537 619 581 q 526 448 558 493 q 509 426 518 437 q 494 401 501 415 q 489 390 491 397 q 488 376 487 383 q 500 350 493 361 q 515 329 508 340 q 531 306 523 318 q 547 283 540 294 q 606 197 577 240 q 666 109 636 154 q 690 76 677 93 q 713 41 702 59 q 720 29 716 37 q 720 13 725 22 q 705 2 718 4 q 679 1 693 1 l 551 1 q 537 3 544 2 q 523 6 530 4 q 498 34 508 18 q 477 66 488 51 q 448 109 462 87 q 420 151 434 130 q 400 182 412 163 q 373 205 388 201 q 356 202 363 208 q 347 190 350 195 q 325 159 336 175 q 304 126 315 143 l 250 47 q 235 25 243 36 q 215 6 227 13 q 171 0 200 0 q 120 1 143 1 l 75 1 q 63 0 69 1 q 52 1 56 0 q 42 2 47 2 q 33 4 37 1 q 27 9 29 6 q 22 13 25 11 q 26 36 20 27 q 37 54 31 45 q 59 84 48 69 q 80 115 69 100 q 136 197 108 155 q 191 280 163 238 q 209 305 201 293 q 226 330 218 318 q 239 350 233 340 q 248 373 245 359 q 248 386 251 380 q 244 394 245 391 q 228 421 237 409 q 211 445 219 433 q 146 539 179 494 q 81 633 113 584 q 66 655 75 644 q 51 679 58 666 q 45 688 48 683 q 44 701 41 694 q 51 710 47 708 q 62 715 55 712 q 73 716 70 715 "},"*":{"x_min":41.78125,"x_max":524.78125,"ha":565,"o":"m 140 737 q 106 747 123 743 q 73 759 88 752 q 48 775 59 766 q 44 804 37 783 q 47 816 45 811 q 52 829 50 822 q 58 845 55 837 q 68 859 61 854 q 102 865 83 872 q 139 851 122 858 q 175 837 156 844 q 198 831 184 833 q 219 838 212 829 q 227 877 227 850 q 226 923 226 904 q 226 935 226 929 q 227 945 226 941 q 227 956 229 951 q 229 966 226 961 q 248 988 233 983 q 254 989 251 988 q 262 990 258 990 q 304 990 284 991 q 331 973 325 988 q 334 957 334 966 q 334 936 334 947 q 335 907 334 920 q 336 879 336 893 q 337 853 336 865 q 345 836 338 841 q 361 831 352 832 q 379 833 370 830 q 417 847 398 840 q 455 862 436 855 q 479 866 466 866 q 500 858 493 866 q 509 843 505 851 q 515 827 512 836 q 519 814 518 820 q 523 801 520 808 q 516 774 527 782 q 494 761 505 766 q 456 747 476 754 q 419 734 437 741 q 400 727 409 730 q 388 712 391 723 q 393 688 384 700 q 408 669 402 676 q 429 640 419 654 q 450 611 438 626 q 456 600 452 607 q 458 583 461 593 q 445 563 455 570 q 426 548 436 555 q 413 538 419 544 q 398 530 406 533 q 372 535 381 525 q 355 554 362 545 q 336 581 345 568 q 315 608 326 594 q 302 626 309 616 q 283 638 295 636 q 263 631 272 641 q 251 616 255 622 l 213 562 q 204 548 208 555 q 194 537 201 541 q 180 531 188 533 q 163 531 172 529 q 148 540 155 534 q 134 551 141 545 q 119 563 127 556 q 106 579 111 569 q 106 594 104 586 q 111 607 108 602 q 132 638 120 623 q 155 669 144 654 q 170 688 161 676 q 175 713 179 701 q 161 729 170 725 q 140 737 151 733 "},"V":{"x_min":3.328125,"x_max":874.640625,"ha":875,"o":"m 36 990 l 148 990 q 179 990 163 990 q 205 983 195 990 q 222 961 218 976 q 231 930 226 945 q 249 877 241 904 q 266 823 256 851 q 321 651 294 737 q 376 479 348 565 q 391 431 383 455 q 405 384 398 408 q 413 359 409 372 q 425 337 418 347 q 428 334 426 334 q 433 330 430 333 q 453 343 448 330 q 462 368 458 356 q 481 427 473 397 q 501 490 490 458 q 560 672 531 581 q 619 855 588 763 q 633 899 626 877 q 647 943 640 920 q 656 965 652 954 q 670 983 659 976 q 693 990 680 990 q 720 990 707 990 l 813 990 q 841 990 827 990 q 863 984 855 990 q 873 959 877 977 q 865 927 869 940 q 842 861 852 895 q 820 794 832 827 q 814 777 816 786 q 809 761 812 769 q 789 701 798 732 q 769 640 780 670 q 694 414 732 527 q 619 188 657 301 q 597 124 607 156 q 576 59 587 91 q 562 24 569 40 q 534 2 555 8 q 509 0 523 0 q 483 1 495 1 l 383 1 q 350 0 368 1 q 322 6 333 0 q 302 32 306 15 q 291 66 297 50 q 272 125 281 95 q 254 184 263 155 q 195 361 223 272 q 137 538 168 450 q 113 618 125 579 q 87 697 101 658 q 79 722 81 709 q 70 747 76 734 q 46 824 58 786 q 20 901 34 862 q 13 925 18 913 q 5 950 9 937 q 3 963 4 957 q 5 976 2 970 q 23 988 9 986 q 29 989 26 990 q 36 990 33 988 "},"h":{"x_min":74.375,"x_max":746.859375,"ha":823,"o":"m 113 988 l 207 988 q 234 988 221 988 q 256 982 248 988 q 269 958 266 976 q 269 945 269 951 q 270 932 270 938 l 270 882 l 270 722 q 269 700 270 712 q 270 675 268 687 q 276 656 271 663 q 290 648 281 648 q 296 651 293 651 q 301 654 299 651 q 319 670 311 661 q 339 686 328 679 q 371 705 354 697 q 407 722 387 713 q 418 725 412 725 q 430 727 424 725 q 460 733 444 732 q 493 734 475 734 q 506 734 500 734 q 519 733 512 734 l 528 733 q 546 730 537 732 q 565 727 555 729 q 609 713 589 720 q 648 694 629 705 q 698 645 679 675 q 729 579 716 615 q 734 556 732 568 q 739 533 736 544 q 742 506 742 520 q 745 479 742 493 l 745 463 q 746 439 747 452 q 745 415 745 426 l 745 316 l 745 100 q 746 50 745 76 q 737 9 747 23 q 714 0 730 1 q 684 0 699 0 l 614 0 q 577 2 592 0 q 555 19 561 4 q 551 39 551 27 q 551 62 551 51 l 551 141 l 551 363 q 545 471 551 422 q 510 548 539 520 q 463 576 491 568 q 454 577 457 577 q 445 579 450 577 q 430 581 439 580 q 416 580 421 583 q 398 579 407 579 q 381 576 389 579 q 325 551 349 568 q 288 499 300 531 q 272 425 276 466 q 269 338 268 384 q 270 250 270 293 l 270 81 q 270 43 270 63 q 263 12 270 23 q 251 4 258 6 q 238 0 245 2 q 219 -1 229 -2 q 199 0 209 0 q 170 0 186 0 q 137 -1 153 -1 q 106 0 120 -1 q 86 8 92 2 q 76 29 77 15 q 76 59 76 44 l 76 183 l 76 705 l 76 894 q 74 937 76 912 q 80 973 73 962 q 102 987 88 983 q 107 988 105 988 q 113 988 110 987 "},"0":{"x_min":29.140625,"x_max":740.921875,"ha":772,"o":"m 740 523 q 740 505 741 515 q 740 486 740 495 q 740 472 740 479 q 740 458 741 465 l 740 437 l 736 387 q 734 364 734 376 q 732 340 733 352 q 721 289 725 315 q 709 240 718 263 q 638 96 682 154 q 512 5 594 38 q 474 -4 494 -1 q 433 -12 454 -6 q 415 -13 424 -13 q 397 -15 407 -13 q 383 -15 393 -16 q 369 -13 374 -15 l 356 -13 q 348 -13 353 -13 q 340 -12 343 -13 q 318 -9 329 -9 q 296 -5 307 -8 q 247 10 270 1 q 206 31 225 19 q 124 106 154 63 q 70 208 93 150 q 59 248 63 227 q 48 290 55 269 q 42 322 43 305 q 37 355 41 338 q 36 368 35 362 q 34 379 37 373 q 34 395 34 387 q 32 412 34 404 q 31 425 31 419 q 31 437 32 430 q 29 462 28 448 q 30 487 30 476 q 29 507 30 497 q 31 526 28 518 l 31 544 q 32 566 34 555 q 34 587 31 576 l 34 601 q 36 618 36 609 q 38 636 35 626 q 40 652 40 643 q 43 669 40 661 q 51 707 49 688 q 61 743 54 725 q 133 882 89 826 q 255 970 178 938 q 291 981 272 977 q 329 988 309 984 q 343 990 336 990 q 356 991 350 990 q 364 991 359 993 q 372 991 369 990 q 500 975 445 993 q 595 923 555 957 q 662 843 635 890 q 707 743 689 797 q 719 694 716 719 q 730 644 723 669 q 732 622 732 633 q 734 601 731 612 q 737 572 737 587 q 740 544 737 558 l 740 523 m 546 461 q 546 475 547 468 q 546 490 546 483 q 546 504 546 497 q 546 519 547 512 l 546 530 q 546 549 546 540 q 545 566 546 558 l 545 580 q 541 607 542 594 q 539 634 540 620 q 535 657 536 645 q 531 679 533 668 q 505 752 519 718 q 461 805 490 786 q 424 824 444 818 q 374 830 404 830 q 366 829 371 827 q 358 829 361 830 q 345 825 351 826 q 332 820 339 823 q 282 780 300 807 q 250 722 264 754 q 239 677 242 701 q 231 627 236 652 q 228 605 229 616 q 226 583 227 594 q 225 559 225 572 q 225 536 225 547 l 225 520 q 223 505 222 513 q 224 490 224 497 q 224 476 224 483 q 225 462 224 469 q 225 446 226 455 q 225 430 223 437 l 225 411 q 228 384 228 398 q 231 358 228 370 l 231 347 q 235 321 233 334 q 239 295 236 308 q 256 244 247 268 q 279 200 264 220 q 310 168 294 180 q 353 148 326 156 q 372 143 360 145 q 394 144 385 141 q 409 147 401 147 q 424 150 417 147 q 456 165 439 155 q 482 187 472 176 q 503 221 494 205 q 519 258 511 237 q 529 295 526 276 q 538 333 532 313 q 539 346 539 340 q 540 359 539 352 q 542 379 543 369 q 545 400 541 390 q 545 423 545 411 q 546 447 545 436 l 546 461 "},".":{"x_min":85,"x_max":300,"ha":386,"o":"m 85 149 q 85 175 85 162 q 90 196 85 189 q 111 212 96 206 q 117 211 114 212 q 123 212 121 210 l 233 212 q 264 212 250 212 q 288 205 279 212 q 298 185 297 198 q 300 157 300 173 l 300 57 q 298 29 300 42 q 290 10 297 16 q 266 2 280 3 q 237 1 252 1 l 144 1 q 115 2 129 1 q 94 12 101 3 q 86 33 87 20 q 85 62 85 46 l 85 149 "},"\b":{"x_min":0,"x_max":0,"ha":0},"@":{"x_min":50,"x_max":1061.65625,"ha":1111,"o":"m 1057 633 q 1061 606 1059 625 q 1059 576 1062 587 q 1059 560 1057 568 q 1058 545 1061 552 q 1057 534 1057 540 q 1055 523 1057 529 q 1051 502 1052 512 q 1047 483 1050 493 q 1045 474 1045 479 q 1043 465 1044 469 q 1020 406 1033 436 q 1011 386 1016 395 q 998 368 1005 377 q 920 275 965 315 q 816 211 876 236 q 785 199 802 204 q 749 193 768 194 q 711 193 730 191 q 679 204 693 195 q 666 213 672 208 q 654 223 659 218 q 643 236 648 230 q 626 245 637 243 q 611 240 618 247 q 591 227 600 233 q 573 213 583 220 q 509 191 550 198 q 433 195 468 184 q 331 255 369 215 q 273 358 294 295 q 269 378 270 368 q 265 400 268 388 l 265 418 q 265 440 262 429 l 265 452 q 265 463 265 458 q 266 473 266 468 q 271 502 269 488 q 277 530 273 516 q 299 588 288 561 q 325 638 309 615 q 345 665 334 652 q 366 690 355 677 q 377 700 369 694 q 381 704 380 702 q 386 709 383 707 q 398 719 394 715 q 438 745 418 733 q 484 765 459 757 q 502 770 493 768 q 519 775 511 772 l 529 775 q 559 778 540 777 q 591 776 579 779 q 608 772 600 773 q 623 769 616 772 q 682 740 657 758 q 698 724 690 733 q 718 712 707 715 q 730 714 725 709 q 738 722 736 719 q 748 738 744 730 q 762 751 752 745 q 770 754 765 754 q 779 755 775 754 l 787 755 q 803 757 794 757 q 819 755 812 757 l 827 755 q 843 750 836 752 q 852 740 850 747 q 854 724 855 733 q 851 709 852 715 q 843 675 845 693 q 834 643 840 658 q 830 624 832 633 q 826 604 829 615 q 809 537 816 572 q 793 470 802 502 q 788 453 790 462 q 784 436 787 444 q 776 404 779 420 q 769 370 773 387 q 766 357 768 365 q 766 343 765 350 q 775 320 769 327 q 795 311 780 313 q 815 312 807 308 q 829 316 822 312 q 877 350 857 327 q 913 397 898 372 q 932 439 925 416 q 945 486 938 462 q 949 504 948 495 q 952 525 950 513 l 952 531 q 954 552 954 541 q 954 573 954 562 q 941 657 954 620 q 938 672 938 665 q 934 686 937 679 q 863 798 907 752 q 754 872 820 844 q 690 893 726 883 q 677 895 683 895 q 663 897 670 895 q 623 904 644 902 q 579 905 602 905 q 556 905 568 905 q 534 902 544 905 q 516 900 525 900 q 498 898 506 901 q 457 888 477 893 q 418 876 437 883 q 316 813 359 851 q 241 723 273 775 q 214 664 225 695 q 193 598 204 633 q 191 586 191 591 q 188 573 191 580 q 183 529 184 554 q 182 480 181 505 q 186 431 183 455 q 194 391 190 408 q 204 354 200 372 q 216 319 208 337 q 299 198 247 248 q 422 118 351 148 q 467 104 444 109 q 515 93 490 100 q 541 90 527 90 q 566 87 554 90 l 586 87 q 602 86 591 86 q 619 88 612 86 l 629 88 q 644 90 636 90 q 659 93 652 90 q 679 95 670 95 q 697 98 687 95 q 726 105 712 102 q 752 113 740 108 q 769 122 761 118 q 786 129 777 126 q 808 138 800 133 q 829 151 819 145 q 848 163 838 156 q 867 178 858 170 q 887 193 876 186 q 920 201 898 198 q 959 200 943 204 q 975 195 968 197 q 984 187 982 194 q 986 179 987 184 q 983 172 984 175 q 974 158 979 163 q 963 145 969 152 q 952 133 958 138 q 940 120 947 127 q 928 109 933 115 q 916 97 923 102 q 886 75 901 86 q 854 54 870 65 q 745 4 805 22 q 723 -2 734 0 q 701 -8 712 -5 q 671 -13 686 -12 q 641 -18 657 -13 q 629 -18 634 -18 q 616 -19 623 -18 q 592 -21 609 -20 q 566 -19 575 -22 l 540 -19 q 513 -15 527 -16 q 487 -12 500 -15 q 450 -4 468 -6 q 415 5 431 -1 q 279 69 340 30 q 252 87 265 77 q 227 108 240 97 q 222 113 225 111 q 218 118 220 115 q 165 173 190 140 q 147 196 156 184 q 130 220 137 208 q 97 280 111 248 q 72 348 83 312 q 63 385 65 366 q 55 423 61 404 q 54 439 55 431 q 52 455 54 447 l 52 465 q 50 488 50 473 q 52 512 50 504 l 52 537 q 56 563 55 550 q 59 588 56 577 q 61 597 61 594 q 62 607 61 601 q 71 641 68 623 q 81 673 75 658 q 113 740 97 709 q 150 800 129 770 q 166 822 156 811 q 186 844 176 833 l 197 855 q 206 866 201 861 q 219 876 212 870 q 226 883 222 879 q 234 890 230 887 q 272 918 254 905 q 311 944 291 932 q 368 972 338 961 q 430 994 398 983 q 471 1003 450 1001 q 515 1011 493 1005 q 538 1013 526 1012 q 561 1013 550 1013 q 737 991 662 1016 q 875 927 812 966 q 896 911 886 920 q 918 895 907 902 q 923 890 920 893 q 929 884 926 887 q 958 855 945 872 q 968 843 962 848 q 979 832 973 838 q 1003 795 991 813 q 1025 757 1015 776 q 1041 713 1034 736 q 1054 666 1047 690 q 1056 650 1057 658 q 1057 633 1055 643 m 683 506 q 684 533 686 518 q 680 558 683 548 q 652 613 670 593 q 598 645 633 634 q 581 647 591 648 q 562 647 572 647 q 557 646 559 645 q 552 645 555 647 q 540 643 545 644 q 527 638 534 641 q 476 607 501 627 q 462 593 469 601 q 450 577 455 584 q 412 504 426 543 q 405 473 411 491 q 404 431 402 456 q 412 393 406 405 q 441 348 423 365 q 487 323 458 331 q 538 322 511 316 q 580 338 565 329 q 641 396 619 362 q 677 479 663 430 q 680 493 679 486 q 683 506 682 500 "},"f":{"x_min":-0.890625,"x_max":461.234375,"ha":463,"o":"m 347 990 q 375 990 359 990 q 407 988 391 990 q 436 984 423 987 q 452 974 448 981 q 461 942 461 962 q 461 904 461 922 q 460 876 461 890 q 454 855 459 862 q 440 845 448 847 q 421 843 432 843 q 400 844 411 843 q 380 843 390 844 q 341 830 355 837 q 319 799 327 822 q 317 791 316 794 q 316 783 318 787 q 314 767 315 778 q 314 749 312 755 q 320 732 316 739 q 333 721 325 725 q 366 717 347 714 q 402 717 386 719 q 414 716 409 715 q 425 715 419 717 q 443 703 437 710 q 447 690 445 699 q 450 670 448 680 q 450 649 451 660 q 448 633 450 639 q 448 623 447 628 q 447 612 450 618 q 430 592 444 596 q 404 587 419 586 q 373 587 389 587 q 364 587 369 587 q 354 586 358 587 l 343 586 q 314 555 319 580 q 312 536 311 547 q 314 514 314 525 l 314 429 l 314 158 l 314 93 q 314 76 314 85 q 313 60 315 67 l 313 44 q 306 12 313 22 q 296 6 303 8 q 282 1 289 4 l 275 1 q 260 1 268 0 q 244 1 251 1 l 183 1 q 163 1 173 1 q 145 3 152 0 q 123 17 129 7 q 118 35 119 23 q 118 57 118 46 l 118 129 l 118 518 q 115 559 118 542 q 95 583 112 576 q 58 587 80 590 q 20 590 36 583 q 1 614 5 597 q 0 630 -1 621 q 0 650 0 640 q 2 692 0 675 q 26 715 5 708 q 49 718 37 718 q 74 718 62 718 q 95 720 86 718 q 111 730 105 722 q 118 766 120 744 q 120 807 116 787 q 122 818 122 812 q 124 830 123 824 q 136 866 130 850 q 151 896 141 882 q 202 949 170 929 q 275 981 234 969 q 298 985 286 985 q 323 989 311 986 q 336 988 327 990 q 347 990 344 987 "},";":{"x_min":85,"x_max":300.765625,"ha":386,"o":"m 85 640 q 85 666 85 653 q 90 687 85 680 q 111 703 96 697 q 117 702 114 703 q 123 703 121 701 l 233 703 q 264 703 250 703 q 288 696 279 703 q 298 676 297 689 q 300 648 300 664 l 300 548 q 298 520 300 533 q 290 501 297 507 q 266 493 280 494 q 237 492 252 492 l 144 492 q 115 493 129 492 q 94 503 101 494 q 86 524 87 511 q 85 553 85 537 l 85 640 m 300 58 q 300 6 300 35 q 295 -42 301 -23 q 259 -128 283 -93 q 195 -185 236 -162 q 139 -213 169 -203 q 125 -218 133 -216 q 109 -220 116 -221 q 93 -212 98 -217 q 85 -180 86 -203 q 90 -145 85 -157 q 107 -124 96 -131 q 130 -109 119 -117 q 169 -62 152 -93 q 177 -45 172 -56 q 179 -24 182 -34 q 155 0 175 -5 q 124 1 140 3 q 97 7 108 0 q 87 28 89 14 q 85 57 85 42 l 85 149 q 85 174 85 161 q 90 196 85 188 q 112 211 97 207 q 119 210 115 211 q 126 213 123 210 l 240 213 q 271 211 257 213 q 293 199 286 210 q 300 178 300 190 q 300 151 300 165 l 300 58 "},"i":{"x_min":80.953125,"x_max":276,"ha":358,"o":"m 266 981 q 276 947 276 969 q 276 904 276 925 q 276 866 276 885 q 266 839 276 846 q 244 831 257 832 q 216 830 231 830 l 138 830 q 111 831 123 830 q 91 839 100 832 q 84 855 86 843 q 81 882 82 867 q 81 912 80 896 q 82 938 82 927 q 82 959 82 949 q 87 975 83 968 q 95 983 90 980 q 105 989 100 986 q 112 989 108 989 q 119 990 116 990 l 220 990 q 246 988 234 990 q 266 981 259 987 m 276 76 q 274 29 276 48 q 249 2 273 9 q 231 0 241 0 q 210 1 221 1 l 133 1 q 109 2 120 1 q 91 11 97 4 q 82 35 83 20 q 82 66 82 50 l 82 652 q 82 680 82 666 q 87 702 82 694 q 111 715 95 712 q 118 716 113 716 q 126 716 123 715 l 195 716 q 214 717 203 716 q 231 716 224 718 l 242 716 q 257 712 251 713 q 269 704 264 711 q 275 684 274 697 q 276 658 276 672 l 276 76 "},"6":{"x_min":28.328125,"x_max":741.265625,"ha":772,"o":"m 740 346 q 741 323 741 339 q 738 300 740 307 q 737 289 737 294 q 736 277 737 284 q 731 248 733 262 q 723 220 729 234 q 656 95 700 148 q 545 13 612 42 q 520 4 533 7 q 491 -4 506 0 q 468 -8 480 -7 q 443 -12 455 -10 q 428 -14 436 -15 q 413 -14 420 -12 q 392 -17 405 -17 q 372 -14 379 -17 l 362 -14 q 350 -12 356 -12 q 338 -11 344 -12 q 325 -9 331 -8 q 312 -7 319 -10 q 261 8 284 0 q 216 30 237 16 q 122 117 158 64 q 62 239 86 170 q 50 286 54 262 q 40 334 45 310 q 36 357 37 345 q 33 381 36 369 q 32 407 33 394 q 30 434 31 420 l 30 452 q 28 466 27 459 q 29 481 29 474 q 28 496 29 488 q 30 509 27 503 l 30 525 l 34 580 q 41 622 40 600 q 50 663 43 644 q 82 761 65 716 q 127 845 100 806 q 202 923 159 890 q 302 976 244 957 q 334 984 318 982 q 368 990 351 986 q 384 991 372 992 q 400 992 397 990 q 496 982 452 993 q 574 953 540 972 q 635 908 608 934 q 682 850 662 882 q 700 812 693 832 q 715 770 708 793 q 717 753 718 763 q 712 737 716 743 q 702 729 708 730 q 687 725 695 727 l 672 725 q 652 723 663 722 q 630 725 641 725 q 607 723 619 725 q 584 725 595 722 q 563 726 577 726 q 533 747 540 731 q 515 781 526 763 q 437 840 488 823 q 416 845 429 842 q 391 844 402 847 q 363 838 376 841 q 340 827 351 834 q 286 776 306 806 q 250 705 265 745 q 245 691 247 698 q 241 678 244 685 q 234 655 237 667 q 229 630 231 642 q 228 623 229 627 q 227 617 227 620 q 226 602 226 610 q 229 588 226 594 q 231 584 230 585 q 236 580 233 582 q 261 587 251 577 q 280 603 270 596 q 314 625 295 616 q 354 641 333 634 q 377 646 365 644 q 400 650 388 648 q 411 650 406 652 q 423 652 416 649 q 440 653 430 653 q 456 652 450 653 q 473 650 462 650 q 487 648 480 649 q 501 645 494 648 q 522 640 512 642 q 544 634 533 638 q 623 590 588 616 q 684 528 658 564 q 707 489 697 510 q 725 444 718 467 q 731 421 729 432 q 736 398 733 409 q 738 380 737 388 q 740 362 738 371 l 740 346 m 534 254 q 545 322 544 283 q 534 390 545 361 q 487 472 519 438 q 391 505 455 505 q 383 504 388 504 q 373 504 377 505 q 354 500 363 501 q 336 495 344 498 q 250 397 270 468 q 245 378 247 387 q 240 358 243 369 l 240 347 q 238 318 237 334 q 241 290 238 301 q 245 276 244 283 q 248 262 245 269 q 325 163 268 197 q 365 147 341 154 q 377 145 373 147 q 391 143 383 144 q 405 144 398 143 q 428 149 418 147 q 450 155 438 151 q 502 195 481 169 q 534 254 523 222 "},"A":{"x_min":6.078125,"x_max":946.46875,"ha":951,"o":"m 934 66 q 939 52 936 61 q 945 35 943 44 q 945 18 947 26 q 936 5 944 9 q 899 0 925 -1 q 857 1 873 1 l 791 1 q 771 0 780 1 q 754 2 762 0 q 732 19 738 7 q 721 43 725 30 q 712 68 718 55 q 697 112 705 90 q 682 155 690 134 q 674 178 677 168 q 666 197 670 189 q 654 211 662 205 q 632 221 645 218 q 618 221 625 221 q 605 222 612 222 l 386 222 q 335 222 362 222 q 293 212 308 223 q 277 190 281 204 q 268 162 273 176 q 249 113 256 139 q 231 62 241 87 q 221 33 226 48 q 205 9 216 18 q 185 2 198 4 q 156 0 172 0 q 123 0 140 0 q 94 1 106 1 q 50 0 76 1 q 13 7 25 0 q 6 19 6 11 q 7 36 5 27 q 12 54 9 46 q 18 68 15 62 q 43 133 31 100 q 68 198 55 166 q 76 220 73 209 q 84 242 79 231 q 106 302 95 272 q 129 362 118 333 q 150 417 140 390 q 170 472 159 444 q 229 626 202 548 q 288 780 256 703 q 293 792 291 787 q 297 805 294 798 q 319 865 308 834 q 343 924 330 895 q 354 956 350 940 q 372 981 359 972 q 390 988 379 985 q 395 989 393 990 q 401 990 398 988 l 523 990 q 554 990 538 990 q 580 984 570 991 q 600 960 595 976 q 612 927 605 944 q 630 881 622 904 q 648 834 638 858 q 654 817 651 826 q 659 801 657 809 q 680 746 670 773 q 701 691 690 719 q 753 551 729 622 q 807 410 777 480 q 810 400 809 405 q 813 390 811 395 q 830 345 822 367 q 847 301 838 323 q 855 279 852 290 q 862 258 858 269 q 895 169 880 214 q 929 82 911 125 q 932 74 932 77 q 934 66 932 71 m 575 384 q 591 408 593 391 q 583 440 590 425 q 580 450 580 445 q 577 461 580 455 q 544 557 559 508 q 509 654 529 605 q 504 671 506 661 q 497 691 501 682 q 487 707 493 700 q 473 713 481 713 q 468 709 470 711 q 462 705 465 708 q 446 672 451 691 q 434 634 441 652 q 404 555 418 595 q 376 475 391 515 q 366 447 370 461 q 358 419 362 434 q 359 394 354 408 q 382 383 366 384 q 415 382 398 382 l 520 382 q 548 382 533 382 q 575 384 563 382 "},"n":{"x_min":75.25,"x_max":745,"ha":823,"o":"m 481 735 q 620 711 564 737 q 707 633 675 685 q 722 600 717 618 q 734 565 728 583 q 737 544 736 554 q 741 525 738 534 q 742 514 741 516 q 745 473 745 494 q 745 433 745 453 l 745 309 l 745 84 q 744 34 745 58 q 724 3 743 9 q 704 0 715 0 q 682 0 693 0 l 607 0 q 578 2 591 0 q 558 13 564 4 q 551 35 552 22 q 551 63 551 48 l 551 161 l 551 368 q 546 463 551 419 q 521 537 542 506 q 464 576 502 565 q 450 579 457 579 q 434 581 442 579 q 416 582 427 583 q 400 580 406 581 q 391 579 395 579 q 382 577 386 579 q 331 555 350 569 q 278 462 286 523 q 270 325 270 401 l 270 151 l 270 66 q 270 41 270 54 q 266 20 270 29 q 243 2 259 5 q 206 0 228 0 l 136 0 q 106 1 121 0 q 84 11 90 3 q 75 47 74 23 q 76 91 76 71 l 76 280 l 76 586 l 76 657 q 76 685 76 672 q 84 705 77 697 q 93 712 86 710 q 106 715 99 714 l 113 715 q 127 716 120 716 q 142 716 135 716 l 200 716 q 221 716 211 716 q 240 712 232 715 q 253 700 250 708 q 260 680 257 691 q 260 671 261 675 q 263 662 260 666 q 267 654 265 655 q 274 650 269 653 q 299 660 289 648 q 319 679 308 672 q 403 723 357 707 q 428 729 415 728 q 457 733 442 730 q 469 734 461 735 q 481 735 478 733 "},"O":{"x_min":52.78125,"x_max":1028.6875,"ha":1081,"o":"m 1025 529 q 1028 501 1027 521 q 1026 472 1029 481 l 1026 454 q 1023 425 1023 440 q 1020 395 1023 410 q 1016 375 1018 385 q 1012 356 1015 365 q 999 307 1005 331 q 983 261 993 283 q 870 99 941 164 q 695 0 800 35 q 665 -7 680 -4 q 634 -13 650 -10 q 620 -16 627 -16 q 605 -17 612 -16 l 559 -21 q 540 -22 554 -23 q 522 -20 526 -21 q 509 -19 515 -18 q 495 -18 502 -20 l 480 -18 q 459 -15 469 -16 q 438 -11 450 -14 q 416 -7 427 -9 q 394 -2 405 -4 q 363 8 379 3 q 331 21 347 14 q 190 117 248 57 q 97 261 133 178 q 83 302 88 281 q 70 346 77 324 q 68 358 68 353 q 66 368 68 363 q 62 388 63 378 q 58 410 61 399 q 57 423 56 417 q 55 435 58 429 q 55 452 54 443 q 55 470 56 461 q 52 491 52 477 q 55 513 52 506 q 55 526 56 520 q 55 539 54 532 l 55 547 q 57 566 58 557 q 59 583 56 575 q 62 598 62 590 q 65 613 62 606 q 76 659 72 636 q 88 704 80 682 q 109 752 100 728 q 133 796 119 775 q 229 907 175 863 q 361 984 283 952 q 399 995 379 990 q 438 1004 419 999 q 452 1007 445 1007 q 465 1009 458 1007 l 506 1013 q 514 1013 509 1014 q 522 1013 519 1011 q 693 992 620 1015 q 822 929 765 970 q 859 901 840 917 q 891 868 879 885 q 905 854 898 861 q 918 839 912 846 q 948 794 933 817 q 975 745 963 771 q 989 707 983 725 q 1002 668 995 689 q 1009 640 1007 654 q 1016 610 1012 625 q 1019 591 1019 600 q 1022 574 1019 582 q 1024 556 1025 565 q 1025 540 1023 547 l 1025 529 m 809 470 q 812 490 812 477 q 809 511 812 504 l 809 534 q 809 545 808 540 q 807 555 809 550 q 803 577 804 566 q 800 597 802 587 q 797 612 800 604 q 788 643 793 627 q 777 673 784 658 q 689 788 747 744 q 529 832 632 832 q 522 831 526 830 q 516 830 519 832 q 505 829 511 829 q 493 827 500 830 q 463 821 477 825 q 436 812 448 818 q 343 743 377 787 q 288 636 309 698 q 282 606 284 620 q 276 576 280 591 q 275 566 275 570 q 273 555 275 561 q 272 540 270 548 q 272 525 273 531 q 268 499 269 518 q 270 473 268 480 l 270 458 q 272 446 272 452 q 273 434 272 440 q 274 424 273 429 q 275 413 275 419 q 281 383 279 398 q 288 354 283 368 q 326 271 304 309 q 381 209 348 233 q 396 198 388 202 q 412 190 404 194 q 445 174 427 180 q 481 163 462 169 q 495 161 488 161 q 508 161 501 162 q 525 158 516 158 q 543 158 533 158 l 554 158 q 566 159 561 159 q 579 161 572 158 q 607 165 593 163 q 633 173 620 168 q 727 234 693 197 q 784 331 761 272 q 795 365 791 347 q 804 401 798 383 l 808 434 q 809 446 809 440 q 809 459 809 452 l 809 470 "},"]":{"x_min":1.609375,"x_max":366,"ha":462,"o":"m 8 876 q 2 897 2 884 q 2 923 2 911 q 1 952 2 937 q 2 979 1 966 q 9 1000 3 991 q 26 1012 15 1008 q 40 1014 33 1015 q 56 1013 48 1013 l 275 1013 q 323 1014 296 1013 q 357 1002 349 1015 q 366 973 366 991 q 366 936 366 955 l 366 -191 q 366 -215 366 -204 q 360 -236 366 -227 q 342 -248 354 -243 q 329 -250 332 -248 l 106 -250 q 83 -250 97 -250 q 57 -251 70 -251 q 33 -250 44 -251 q 16 -244 21 -248 q 1 -206 1 -233 q 2 -155 2 -179 q 2 -135 2 -145 q 5 -118 2 -125 q 35 -97 12 -100 q 86 -97 59 -95 q 137 -96 113 -98 q 169 -75 162 -94 q 172 -52 172 -65 q 172 -27 172 -38 l 172 797 q 171 825 172 811 q 165 847 170 838 q 126 861 153 862 q 73 861 98 861 q 61 860 67 861 q 51 861 55 859 l 35 861 q 19 866 26 863 q 8 876 12 869 "},"3":{"x_min":26.390625,"x_max":745.421875,"ha":772,"o":"m 373 990 q 495 975 443 993 q 590 932 548 958 q 606 920 598 926 q 622 907 613 913 q 684 826 662 877 q 691 809 687 818 q 698 791 695 801 q 708 729 707 766 q 702 663 709 691 q 673 595 691 623 q 665 586 669 590 q 657 577 661 582 q 648 566 651 569 q 613 539 627 552 q 608 532 611 536 q 607 523 605 529 q 618 508 607 516 q 637 496 627 501 q 658 483 647 490 q 729 389 705 448 q 737 362 734 376 q 743 332 740 347 q 743 316 745 325 q 744 300 741 308 q 745 284 745 294 q 743 269 744 275 q 741 251 743 257 q 736 229 738 240 q 732 207 734 218 q 657 83 705 128 q 534 8 609 39 q 504 0 519 3 q 472 -8 488 -3 q 457 -10 465 -10 q 443 -13 450 -10 q 421 -14 431 -13 q 400 -16 411 -15 q 384 -17 394 -17 q 368 -15 373 -16 l 344 -15 q 334 -14 340 -13 q 325 -13 329 -15 q 302 -9 313 -10 q 281 -5 291 -8 q 271 -2 276 -2 q 262 -1 266 -2 q 234 7 247 3 q 208 18 220 12 q 116 81 155 41 q 54 173 77 121 q 43 205 47 189 q 33 240 38 222 q 31 255 30 247 q 29 269 31 262 q 26 292 26 279 q 29 315 26 305 q 66 334 37 333 q 122 335 95 335 q 143 335 131 335 q 162 334 154 336 l 177 334 q 198 327 193 331 q 211 305 209 320 q 219 275 213 290 q 231 240 226 256 q 248 208 237 224 q 325 152 273 171 q 341 148 333 149 q 358 145 350 147 l 365 145 q 395 143 379 142 q 423 149 412 145 q 447 154 437 152 q 495 184 475 165 q 527 231 516 203 q 534 249 531 239 q 538 270 536 259 q 542 292 541 277 q 540 315 543 307 q 539 321 540 318 q 538 327 538 324 q 536 341 537 334 q 531 356 534 349 q 495 405 518 388 q 436 433 472 422 q 416 436 426 436 q 394 439 405 436 q 385 440 390 440 q 377 440 380 440 l 365 440 q 356 441 361 442 q 348 442 351 440 q 330 449 337 444 q 320 461 323 453 q 317 478 318 468 q 316 498 316 487 q 317 536 316 516 q 325 566 318 555 q 341 575 329 572 q 366 579 352 577 q 393 581 380 580 q 415 584 406 582 q 478 611 454 596 q 516 663 502 627 q 522 688 519 672 q 522 719 525 705 q 516 742 519 730 q 506 763 513 754 q 430 823 481 807 q 417 826 423 826 q 404 829 411 826 q 377 830 393 832 q 351 826 361 829 q 339 822 344 823 q 327 819 334 822 q 262 766 286 802 q 249 740 254 754 q 240 711 244 726 q 233 682 236 695 q 219 662 230 669 q 201 657 215 659 l 186 657 q 169 656 179 655 q 151 657 159 657 q 102 655 129 657 q 61 665 75 654 q 52 681 55 669 q 52 704 50 693 q 55 718 55 711 q 58 732 55 725 q 66 764 62 748 q 77 795 70 780 q 151 904 106 862 q 266 973 195 947 q 299 982 281 979 q 334 987 316 984 q 354 989 345 988 q 373 990 363 990 "},"m":{"x_min":82,"x_max":1177.046875,"ha":1258,"o":"m 484 734 q 574 723 535 735 q 642 688 613 710 q 662 669 653 680 q 683 646 671 658 q 692 639 685 644 q 705 637 698 634 q 734 657 720 641 q 760 681 748 673 q 802 707 780 696 q 852 727 824 717 q 879 732 863 730 q 913 735 895 734 q 946 734 930 735 q 975 730 962 733 q 987 728 981 728 q 999 726 993 728 q 1037 715 1019 720 q 1070 699 1055 709 q 1158 594 1129 663 q 1166 568 1163 581 q 1172 542 1169 555 q 1174 524 1173 533 q 1176 508 1174 516 l 1176 494 q 1176 474 1177 485 q 1176 453 1176 463 l 1176 373 l 1176 102 q 1176 76 1176 91 q 1176 48 1177 62 q 1173 23 1176 35 q 1164 8 1170 12 q 1143 0 1156 1 q 1114 0 1130 0 l 1041 0 q 1006 2 1022 0 q 986 18 991 5 q 982 39 982 27 q 982 62 982 51 l 982 140 l 982 327 l 982 386 q 982 401 982 393 q 981 416 983 409 l 981 427 q 981 444 981 436 q 979 461 981 452 q 977 472 977 466 q 976 484 977 479 q 964 521 970 505 q 945 550 957 537 q 898 577 926 569 q 888 578 892 579 q 878 580 884 577 q 865 582 873 581 q 851 581 857 583 q 834 579 842 579 q 817 576 826 579 q 759 534 777 562 q 730 454 735 502 q 726 350 726 406 l 726 166 l 726 63 q 726 36 726 50 q 719 13 726 22 q 698 2 712 4 q 669 0 685 0 l 594 0 q 570 0 581 0 q 550 4 558 1 q 534 26 536 10 q 532 60 532 41 l 532 179 l 532 397 q 529 473 532 437 q 511 533 526 509 q 482 562 500 552 q 440 579 465 572 q 429 579 434 580 q 416 580 423 579 q 387 577 401 583 q 381 576 384 577 q 376 576 378 576 q 333 552 353 569 q 298 514 310 535 q 282 465 287 492 q 276 406 277 438 q 276 337 276 374 l 276 149 l 276 65 q 276 40 276 52 q 272 17 276 27 q 251 2 266 5 q 216 0 235 0 l 144 0 q 117 0 130 0 q 95 7 104 1 q 82 32 83 13 q 82 71 82 51 l 82 234 l 82 573 l 82 656 q 82 683 82 671 q 89 703 83 695 q 111 715 95 712 l 119 715 q 133 716 126 716 q 148 716 141 716 l 205 716 q 226 715 216 716 q 245 712 236 715 q 259 698 256 708 q 266 676 263 688 q 266 668 267 671 q 269 662 266 665 q 272 655 270 658 q 277 651 274 653 q 304 661 293 649 q 325 680 315 673 q 365 705 345 694 q 409 723 385 716 q 434 728 421 727 q 460 733 446 730 q 473 733 464 734 q 484 734 481 733 "},"9":{"x_min":26.9375,"x_max":740.34375,"ha":772,"o":"m 738 521 q 740 494 740 514 q 738 468 740 475 l 738 451 q 737 436 737 444 q 736 421 737 428 q 734 407 734 414 q 733 394 734 401 q 729 361 730 378 q 723 329 727 344 q 715 298 718 314 q 707 266 712 282 q 683 207 695 236 q 655 154 670 179 q 641 133 648 143 q 627 112 634 123 q 618 103 623 107 q 609 91 613 98 q 600 80 605 87 q 588 71 594 73 q 566 51 577 61 q 541 34 554 41 q 503 14 523 23 q 462 -1 483 5 q 431 -7 447 -5 q 400 -12 416 -9 q 385 -13 393 -15 q 370 -13 377 -12 q 351 -15 363 -16 q 331 -13 338 -15 q 321 -12 326 -13 q 309 -12 316 -12 q 287 -8 298 -9 q 266 -3 276 -6 q 238 5 251 1 q 212 14 225 8 q 52 211 88 68 q 52 229 50 219 q 72 248 58 246 q 106 250 86 250 l 151 250 q 177 251 162 250 q 202 250 193 253 q 234 228 227 243 q 252 193 241 212 q 275 166 261 180 q 307 144 288 153 q 348 131 326 134 q 394 134 370 128 q 446 159 425 143 q 483 196 468 175 q 509 245 498 218 q 529 303 519 272 q 533 321 531 311 q 537 340 534 330 q 538 350 538 346 q 540 358 538 354 q 541 373 541 365 q 538 387 541 382 q 535 391 537 390 q 531 394 533 393 q 512 390 519 396 q 498 379 505 385 q 475 362 487 371 q 448 347 462 354 q 402 331 429 337 q 347 323 376 325 q 290 325 319 322 q 240 336 262 328 q 138 389 177 355 q 66 473 98 422 q 51 510 56 490 q 38 548 45 529 q 34 569 36 558 q 30 591 33 580 q 29 602 30 597 q 29 612 29 607 q 27 632 27 619 q 29 651 26 644 q 29 666 30 658 q 30 680 27 673 q 31 697 30 691 q 36 726 34 712 q 44 753 38 739 q 65 807 54 782 q 94 855 77 833 q 106 873 100 865 q 120 889 113 880 q 132 901 125 894 q 145 912 140 908 l 150 916 q 163 928 156 922 q 179 937 170 933 q 221 961 198 951 q 269 979 244 971 q 297 985 283 983 q 326 990 311 987 q 343 991 331 992 q 358 992 355 990 q 482 977 429 993 q 576 930 536 961 q 645 858 616 900 q 695 768 675 816 q 707 730 702 748 q 718 691 712 711 q 722 672 720 682 q 726 653 723 662 q 731 623 730 637 q 734 594 732 608 q 735 582 736 587 q 736 572 734 578 q 737 556 737 564 q 737 540 737 548 q 738 530 738 536 q 738 521 737 525 m 526 608 q 530 662 533 632 q 520 711 527 692 q 467 796 502 762 q 363 831 431 831 q 355 829 361 828 q 347 829 350 831 l 318 821 q 261 776 281 806 q 230 707 241 746 q 223 665 225 692 q 226 621 222 637 q 229 601 229 610 q 231 585 229 593 q 259 527 243 550 q 304 487 276 504 q 322 478 312 482 q 344 472 333 475 q 350 471 347 472 q 358 471 354 471 q 368 469 362 469 q 379 469 375 468 q 386 470 381 471 q 395 471 391 469 q 412 475 404 474 q 429 479 420 476 q 513 562 486 504 q 520 585 518 574 q 526 608 523 596 "},"l":{"x_min":81.234375,"x_max":276.75,"ha":358,"o":"m 119 990 l 220 990 q 246 988 234 990 q 266 981 259 987 q 275 955 274 971 q 276 922 276 939 l 276 799 l 276 300 l 276 87 q 276 49 276 71 q 270 17 277 28 q 245 1 263 5 q 226 0 237 -1 q 206 1 216 1 l 140 1 q 112 3 124 1 q 91 11 100 4 q 82 33 83 18 q 82 62 82 47 l 82 186 l 82 707 l 82 896 q 81 939 82 914 q 87 975 80 964 q 95 983 90 981 q 105 989 100 986 q 112 989 108 989 q 119 990 116 990 "},"8":{"x_min":21.28125,"x_max":753.765625,"ha":772,"o":"m 751 306 q 753 292 752 300 q 752 279 754 284 q 751 266 751 272 q 751 254 751 261 q 750 244 750 250 q 748 233 750 238 q 744 216 745 225 q 740 201 743 208 q 733 179 737 190 q 725 156 729 168 q 714 138 720 147 q 701 119 708 129 q 629 49 672 77 q 533 2 586 20 q 502 -4 518 -1 q 472 -11 487 -6 q 461 -13 466 -13 q 450 -15 455 -12 q 427 -15 438 -15 q 405 -18 416 -16 l 393 -18 q 375 -18 384 -18 q 358 -16 365 -19 q 341 -15 350 -13 q 326 -15 333 -16 q 315 -13 320 -12 q 302 -11 309 -13 q 277 -6 290 -8 q 254 0 265 -4 q 247 1 251 1 q 241 2 244 1 q 187 23 213 11 q 127 61 156 37 q 77 109 97 84 q 52 150 63 127 q 43 168 47 158 q 37 187 40 177 q 30 212 33 198 q 25 240 27 226 q 23 251 23 245 q 22 262 23 256 l 22 275 q 21 293 20 280 q 23 312 22 306 q 29 346 27 330 q 37 377 30 362 q 66 433 50 408 q 106 476 83 458 q 150 502 126 488 q 161 511 155 506 q 170 522 168 515 q 170 531 172 527 q 165 537 168 534 q 136 559 154 548 q 97 603 112 577 q 70 661 81 629 q 62 732 59 691 q 75 801 65 773 q 147 907 100 869 q 262 969 194 945 q 300 979 280 976 q 340 986 319 982 q 359 988 350 987 q 377 988 368 988 q 502 975 448 991 q 597 930 556 959 q 622 911 611 920 q 645 888 634 901 l 650 884 q 661 870 655 877 q 672 855 666 862 q 677 847 675 851 q 682 837 679 843 q 709 758 700 808 q 704 663 718 708 q 677 606 693 632 q 638 562 662 580 q 623 551 632 556 q 609 538 615 545 q 604 532 607 536 q 604 522 601 529 q 611 511 607 515 q 620 505 615 508 q 640 495 630 500 q 659 483 650 490 q 733 390 708 450 q 743 359 740 375 q 750 326 745 344 q 750 316 750 320 q 751 306 751 312 m 250 758 q 240 707 240 737 q 250 657 240 677 q 280 616 261 632 q 326 588 300 600 q 340 585 333 586 q 354 583 347 584 q 393 579 369 579 q 431 583 416 579 q 493 613 468 594 q 529 668 518 632 q 534 694 531 677 q 534 723 537 711 q 532 733 533 729 q 530 743 531 737 q 524 763 527 754 q 515 783 520 773 q 441 836 491 818 q 427 838 434 838 q 412 841 419 838 q 394 843 404 844 q 375 841 384 841 q 367 840 372 838 q 358 840 362 841 q 343 836 351 837 q 329 833 336 836 q 281 804 301 822 q 250 758 261 786 m 554 261 q 555 311 561 284 q 543 354 550 338 q 484 422 523 398 q 381 448 444 447 q 373 446 379 445 q 363 447 368 447 q 345 443 354 444 q 327 438 336 441 q 268 407 293 427 q 229 355 243 387 q 224 338 226 347 q 219 318 222 329 q 218 282 216 302 q 223 251 219 262 q 233 222 227 236 q 261 180 244 198 q 300 150 279 162 q 312 144 306 147 q 325 138 318 141 q 341 134 331 136 q 358 130 350 133 q 375 129 363 129 q 389 127 379 127 q 404 127 400 126 q 430 131 418 130 q 454 138 443 133 q 507 171 484 151 q 543 220 530 191 q 549 240 547 230 q 554 261 551 250 "},"p":{"x_min":74.234375,"x_max":803.765625,"ha":849,"o":"m 802 366 q 803 341 803 358 q 800 318 803 325 l 800 300 q 796 270 796 284 q 791 243 795 256 q 785 217 788 230 q 777 191 782 204 q 757 147 767 168 q 735 108 748 127 q 718 85 727 95 q 698 63 709 75 l 688 54 q 673 41 681 47 q 659 30 666 36 q 634 15 648 22 q 607 2 621 9 q 579 -6 594 -4 q 549 -12 564 -9 q 532 -15 541 -15 q 513 -18 523 -15 l 500 -18 q 480 -18 489 -20 l 466 -18 q 448 -15 457 -15 q 431 -13 439 -16 q 389 -1 409 -6 q 352 15 369 4 q 334 27 342 20 q 316 40 325 33 q 299 52 310 44 q 280 54 288 61 q 273 43 273 50 q 270 29 273 37 q 268 -2 267 15 q 269 -36 269 -20 l 269 -177 q 268 -213 269 -195 q 260 -241 267 -230 q 245 -250 256 -247 q 220 -253 234 -252 q 192 -253 206 -254 q 169 -252 178 -252 l 131 -252 q 122 -252 127 -252 q 112 -251 116 -252 l 101 -251 q 76 -224 77 -244 q 75 -176 75 -204 l 75 638 q 74 671 75 654 q 80 698 73 688 q 95 711 86 708 q 113 713 102 713 q 133 713 123 713 l 199 713 q 226 713 213 713 q 246 707 238 713 q 257 689 256 700 q 263 668 257 679 q 266 661 264 663 q 271 657 269 659 q 296 665 287 655 q 316 682 306 675 q 353 704 334 694 q 396 722 373 715 q 421 727 407 726 q 446 732 434 729 q 458 732 452 733 q 469 733 464 730 q 603 711 548 736 q 696 648 657 687 q 709 635 703 641 q 720 622 714 629 q 737 597 730 609 q 752 572 745 584 q 755 565 755 569 q 759 555 756 561 q 774 522 767 541 q 780 504 777 513 q 785 486 782 495 q 793 451 791 469 q 799 413 795 433 q 800 398 799 406 q 802 381 800 390 l 802 366 m 606 334 q 607 353 607 341 q 606 372 607 365 l 606 384 q 603 402 603 393 q 600 422 603 412 q 595 449 597 436 q 586 473 592 462 q 543 544 570 518 q 468 583 517 570 q 444 586 457 586 q 418 586 431 586 q 409 584 413 584 q 399 583 404 584 q 380 578 389 580 q 363 572 371 576 q 306 525 327 556 q 274 454 286 493 q 270 431 271 443 q 266 408 268 419 q 265 390 265 402 q 263 377 261 384 q 263 362 265 369 q 263 347 260 354 l 263 330 q 263 318 263 323 q 266 306 263 312 q 267 291 266 297 q 270 275 268 283 q 274 258 271 266 q 304 192 286 218 q 353 147 321 166 q 399 129 372 136 q 409 128 404 127 q 418 127 413 129 q 435 125 424 126 q 453 126 446 125 q 476 131 464 129 q 499 137 488 133 q 553 176 532 151 q 588 234 574 201 q 597 269 595 251 q 604 306 600 287 q 605 320 604 313 q 606 334 606 327 "},"4":{"x_min":21.625,"x_max":749.171875,"ha":773,"o":"m 725 384 q 748 353 747 377 q 749 302 749 330 l 749 263 q 742 240 746 249 q 726 228 739 231 q 699 225 714 224 q 670 226 683 226 q 643 222 656 226 q 625 207 631 219 q 620 188 622 202 l 620 173 q 619 155 618 166 q 620 135 620 145 l 620 63 q 620 35 620 48 q 613 13 620 21 q 602 5 608 7 q 589 0 596 3 l 582 0 q 556 0 571 -1 q 529 0 540 0 q 501 0 515 0 q 473 0 486 0 q 451 6 461 2 q 437 20 441 10 q 435 37 435 27 q 435 59 435 48 l 435 126 q 435 142 435 132 q 435 159 436 152 l 435 188 q 429 206 432 199 q 419 219 426 213 q 380 226 407 227 q 335 226 354 226 l 129 226 q 103 225 118 226 q 74 225 89 224 q 48 228 59 226 q 32 237 36 230 q 23 267 23 246 l 23 284 q 21 305 21 294 q 22 327 22 316 q 22 365 22 344 q 26 401 22 387 q 34 419 29 410 q 44 434 39 427 q 72 470 58 453 q 100 506 86 487 q 175 610 136 559 q 253 713 215 660 q 269 734 260 724 q 285 755 278 744 q 335 823 310 790 q 386 891 361 856 q 401 912 393 902 q 418 933 410 922 q 426 946 422 940 q 437 958 430 952 q 448 963 443 961 q 460 968 453 966 q 467 968 462 969 q 475 971 472 968 l 565 971 q 593 969 581 971 q 613 958 606 968 q 619 937 618 950 q 620 909 620 925 l 620 456 q 620 433 620 445 q 622 410 620 420 q 645 388 626 392 q 685 386 661 383 q 725 384 708 390 m 435 451 q 435 467 436 458 q 435 484 435 477 l 435 601 q 435 615 435 608 q 435 629 436 622 q 434 646 432 637 q 433 663 436 655 q 430 683 430 674 q 415 694 429 692 q 409 690 412 691 q 403 687 405 690 q 389 672 396 681 q 376 655 383 662 q 356 627 366 640 q 335 599 346 615 q 325 586 330 592 q 314 572 319 579 l 239 472 q 228 456 233 465 q 216 440 223 448 q 209 429 214 434 q 201 417 204 424 q 200 403 198 411 q 207 392 201 395 q 231 386 215 386 q 261 386 247 386 l 343 386 q 364 385 353 386 q 383 386 375 384 l 397 386 q 414 390 407 388 q 426 399 422 392 q 433 415 432 406 q 435 436 435 424 l 435 451 "},"R":{"x_min":95.234375,"x_max":932.328125,"ha":1003,"o":"m 931 32 q 930 16 933 23 q 922 7 926 9 q 899 0 914 0 q 869 1 885 1 l 793 1 q 754 3 771 1 q 729 19 738 5 q 717 63 718 37 q 710 113 715 90 q 709 124 710 119 q 708 133 708 129 q 704 168 704 150 q 701 202 704 187 q 700 215 700 207 q 695 246 697 230 q 689 277 693 262 q 663 334 678 309 q 619 372 647 359 q 606 376 613 375 q 590 380 599 377 q 533 389 565 389 q 468 389 500 389 l 354 389 q 335 384 343 386 q 321 376 326 383 q 311 333 310 362 q 313 280 313 304 l 313 102 q 312 79 313 91 q 312 57 312 68 q 312 36 312 45 q 309 20 312 27 q 292 4 305 8 q 275 1 285 1 q 254 1 266 1 l 192 1 q 144 0 169 1 q 107 9 119 0 q 96 35 96 16 q 96 72 96 54 l 96 917 q 95 949 96 932 q 101 975 94 965 q 122 989 107 984 q 128 990 125 991 q 134 991 132 989 l 607 991 q 649 990 629 991 q 688 985 669 989 q 702 982 694 982 q 717 979 710 982 q 736 974 726 977 q 756 967 746 971 q 819 929 790 952 q 868 878 849 907 q 877 863 874 871 q 886 849 881 856 q 903 808 897 829 q 915 762 908 788 q 916 751 917 757 q 918 740 915 746 l 918 728 q 919 701 921 717 q 915 675 918 685 q 913 655 913 664 q 910 636 913 646 q 896 596 903 615 q 878 561 889 578 q 871 552 875 557 q 864 543 867 547 q 855 532 860 537 q 844 522 850 526 q 828 508 836 515 q 810 494 819 501 q 799 485 804 490 q 790 473 793 480 q 793 459 788 465 q 803 451 799 454 q 831 429 817 440 q 854 402 844 418 q 881 354 871 379 q 899 297 890 329 q 902 270 901 284 q 906 244 903 257 q 906 228 906 236 q 907 212 907 220 q 908 200 908 207 q 908 187 907 194 q 909 176 910 182 q 910 163 908 170 q 913 134 913 150 q 915 105 913 119 l 919 80 q 925 55 922 68 q 931 32 928 43 m 701 658 q 702 696 704 673 q 697 729 700 718 q 694 739 694 734 q 692 747 694 743 q 631 810 675 790 q 576 822 607 821 q 513 824 546 824 l 351 824 q 346 821 349 821 q 340 822 343 822 q 318 808 324 818 q 312 780 311 797 q 313 746 313 762 l 313 617 q 313 583 313 600 q 319 557 313 567 q 338 546 325 548 q 365 542 350 543 q 397 541 381 540 q 426 542 414 542 l 508 542 q 529 541 518 542 q 549 543 540 540 l 567 543 q 588 545 578 545 q 608 548 599 545 q 650 566 632 555 q 681 595 668 577 q 693 623 689 608 q 701 658 697 638 "},"\r":{"x_min":0,"x_max":0,"ha":386},"o":{"x_min":50.546875,"x_max":794.515625,"ha":849,"o":"m 791 387 q 794 363 794 379 q 791 340 794 348 l 791 326 q 789 304 788 315 q 787 281 790 293 q 783 263 784 272 q 780 245 782 255 q 770 214 775 230 q 759 184 766 198 q 683 76 730 118 q 569 6 636 34 q 535 -3 552 0 q 500 -11 518 -6 q 484 -13 493 -13 q 469 -15 476 -13 q 460 -15 465 -15 q 451 -16 455 -16 q 429 -18 444 -18 q 405 -16 413 -19 l 391 -16 q 377 -15 384 -15 q 362 -13 369 -16 q 352 -12 356 -12 q 340 -11 347 -12 q 312 -4 326 -6 q 286 4 298 -1 q 254 15 269 9 q 225 29 240 20 q 141 97 176 58 q 83 190 106 136 q 72 216 76 202 q 65 245 69 230 q 62 258 62 252 q 59 270 62 263 q 56 293 56 281 q 54 316 56 305 q 52 329 52 323 q 52 341 52 334 q 50 365 50 350 q 54 388 51 380 l 54 398 q 54 413 55 405 q 56 427 54 420 q 58 441 58 434 q 61 454 58 447 q 70 489 66 472 q 81 523 75 506 q 141 618 106 580 q 226 688 176 657 q 255 701 240 695 q 286 713 270 707 q 323 723 304 720 q 363 732 343 726 q 384 733 375 733 q 404 734 394 733 q 543 718 484 736 q 648 668 602 700 q 679 643 663 657 q 707 615 695 630 q 727 587 718 601 q 745 558 736 573 q 761 525 755 543 q 773 488 766 508 q 780 465 777 477 q 786 440 783 452 q 787 429 787 434 q 788 418 787 423 q 790 402 791 411 q 791 387 788 394 m 597 337 q 598 357 598 344 q 597 377 598 370 l 597 388 q 594 404 594 395 q 593 419 594 412 q 591 427 593 425 q 586 450 588 438 q 580 473 584 462 q 544 535 565 509 q 488 576 523 561 q 472 581 480 579 q 454 586 463 583 q 430 588 443 588 q 405 587 418 587 q 395 585 401 584 q 386 584 390 586 q 367 579 376 581 q 351 573 358 577 q 295 529 316 558 q 261 463 273 501 q 254 434 256 450 q 250 404 252 419 q 248 390 248 397 q 248 376 248 383 q 246 347 245 366 q 250 318 247 327 l 250 305 q 254 284 252 294 q 258 262 255 273 q 288 195 272 220 q 338 148 304 169 q 360 137 348 141 q 384 130 372 133 q 394 129 390 129 q 404 129 398 130 q 416 127 409 127 q 427 127 422 126 l 438 127 q 461 131 450 130 q 481 137 472 133 q 540 175 518 151 q 577 233 562 198 q 586 261 583 247 q 593 290 588 275 q 594 300 594 295 q 595 311 594 305 q 595 324 595 318 q 597 337 595 330 "},"5":{"x_min":30.375,"x_max":747.28125,"ha":772,"o":"m 188 971 l 547 971 l 633 971 q 661 970 648 971 q 683 962 675 969 q 691 946 688 958 q 695 920 694 934 q 695 892 695 907 q 694 866 694 877 q 694 847 694 856 q 691 831 694 838 q 668 813 684 815 q 629 811 652 811 l 522 811 l 372 811 q 332 810 352 811 q 301 801 312 809 q 290 785 294 795 q 284 761 286 774 q 280 734 281 748 q 276 711 279 720 q 272 688 273 699 q 268 666 270 677 q 266 652 266 662 q 263 636 263 645 q 266 622 263 627 q 269 618 268 619 q 273 613 270 616 q 294 616 286 612 q 309 624 302 620 q 329 636 319 631 q 350 644 338 640 q 389 654 366 651 q 438 659 412 658 q 488 658 463 661 q 530 649 512 655 q 561 638 545 644 q 591 624 577 633 q 718 484 677 574 q 729 450 725 468 q 737 413 733 433 q 744 373 741 397 q 747 326 747 350 q 744 279 747 302 q 736 240 741 256 q 720 197 727 218 q 701 157 712 176 q 684 130 693 143 q 665 107 675 118 q 662 104 663 105 q 659 102 661 104 q 648 89 654 95 q 636 77 643 83 q 634 75 634 76 q 630 72 633 73 q 617 61 623 66 q 604 50 611 55 q 502 0 559 18 q 479 -6 491 -4 q 452 -11 466 -8 q 429 -14 441 -14 q 401 -17 416 -15 q 390 -17 395 -17 q 379 -17 384 -18 l 369 -17 q 354 -15 362 -15 q 340 -15 347 -15 q 309 -10 325 -10 q 277 -5 293 -9 q 216 15 245 4 q 162 41 187 26 q 146 52 154 47 q 130 65 138 58 l 122 73 q 110 83 115 77 q 101 94 105 88 q 90 106 95 101 q 80 117 84 111 q 56 159 66 137 q 38 206 47 181 q 31 239 36 217 q 34 271 27 260 q 54 284 41 282 q 86 287 68 287 l 161 287 q 185 287 173 287 q 206 282 197 287 q 225 262 220 275 q 236 234 230 248 q 247 214 241 223 q 259 195 252 205 q 269 185 263 189 q 280 177 275 181 q 300 162 288 167 q 354 144 319 150 q 420 146 390 138 q 457 162 441 153 q 488 182 473 171 q 500 192 495 187 q 508 205 504 198 q 529 236 520 220 q 544 273 537 252 q 550 299 547 289 l 550 312 q 552 337 552 320 q 550 362 552 353 q 545 382 547 371 q 540 401 543 392 q 497 467 523 441 q 427 506 472 494 q 413 509 420 509 q 400 512 406 509 l 388 512 q 368 513 380 515 q 350 509 356 512 q 338 508 343 508 q 327 506 333 508 q 299 494 312 501 q 275 479 286 487 q 253 458 262 470 q 229 440 244 447 q 189 434 213 433 q 144 436 165 436 q 124 434 134 436 q 106 436 113 433 l 94 436 q 73 442 79 438 q 65 477 61 454 q 72 515 69 497 q 79 554 75 534 q 80 563 80 559 q 81 573 80 568 q 86 601 84 587 q 91 629 88 615 q 96 653 94 640 q 101 677 98 666 q 102 693 102 684 q 105 708 102 701 q 118 771 113 738 q 129 834 122 804 q 130 843 130 838 q 131 850 130 847 q 136 879 134 865 q 143 909 138 894 q 147 936 145 925 q 158 959 150 948 q 177 969 163 966 q 183 970 180 971 q 188 971 186 969 "}},"cssFontWeight":"bold","ascender":1355,"underlinePosition":-100,"cssFontStyle":"normal","boundingBox":{"yMin":-294.46875,"xMin":-31.953125,"yMax":1120,"xMax":1293.28125},"resolution":1000,"original_font_information":{"postscript_name":"AlteHaasGrotesk_Bold","version_string":"1","vendor_url":"http://www.kub.fr/","full_font_name":"Alte Haas Grotesk Bold","font_family_name":"Alte Haas Grotesk","copyright":"Copyright (c) 2007 by Yann Le Coroller. All rights reserved.","description":"Copyright (c) 2007 by Yann Le Coroller. All rights reserved.","trademark":"","designer":"Yann Le Coroller","designer_url":"http://www.kub.fr/","unique_font_identifier":"YannLeCoroller: Alte Haas Grotesk Bold: 2007","license_url":"","license_description":"","manufacturer_name":"Yann Le Coroller","font_sub_family_name":"Bold"},"descender":-302,"familyName":"Alte Haas Grotesk","lineHeight":1696,"underlineThickness":50});;
(function ($) {

Drupal.toolbar = Drupal.toolbar || {};

/**
 * Attach toggling behavior and notify the overlay of the toolbar.
 */
Drupal.behaviors.toolbar = {
  attach: function(context) {

    // Set the initial state of the toolbar.
    $('#toolbar', context).once('toolbar', Drupal.toolbar.init);

    // Toggling toolbar drawer.
    $('#toolbar a.toggle', context).once('toolbar-toggle').click(function(e) {
      Drupal.toolbar.toggle();
      // Allow resize event handlers to recalculate sizes/positions.
      $(window).triggerHandler('resize');
      return false;
    });
  }
};

/**
 * Retrieve last saved cookie settings and set up the initial toolbar state.
 */
Drupal.toolbar.init = function() {
  // Retrieve the collapsed status from a stored cookie.
  var collapsed = $.cookie('Drupal.toolbar.collapsed');

  // Expand or collapse the toolbar based on the cookie value.
  if (collapsed == 1) {
    Drupal.toolbar.collapse();
  }
  else {
    Drupal.toolbar.expand();
  }
};

/**
 * Collapse the toolbar.
 */
Drupal.toolbar.collapse = function() {
  var toggle_text = Drupal.t('Show shortcuts');
  $('#toolbar div.toolbar-drawer').addClass('collapsed');
  $('#toolbar a.toggle')
    .removeClass('toggle-active')
    .attr('title',  toggle_text)
    .html(toggle_text);
  $('body').removeClass('toolbar-drawer').css('paddingTop', Drupal.toolbar.height());
  $.cookie(
    'Drupal.toolbar.collapsed',
    1,
    {
      path: Drupal.settings.basePath,
      // The cookie should "never" expire.
      expires: 36500
    }
  );
};

/**
 * Expand the toolbar.
 */
Drupal.toolbar.expand = function() {
  var toggle_text = Drupal.t('Hide shortcuts');
  $('#toolbar div.toolbar-drawer').removeClass('collapsed');
  $('#toolbar a.toggle')
    .addClass('toggle-active')
    .attr('title',  toggle_text)
    .html(toggle_text);
  $('body').addClass('toolbar-drawer').css('paddingTop', Drupal.toolbar.height());
  $.cookie(
    'Drupal.toolbar.collapsed',
    0,
    {
      path: Drupal.settings.basePath,
      // The cookie should "never" expire.
      expires: 36500
    }
  );
};

/**
 * Toggle the toolbar.
 */
Drupal.toolbar.toggle = function() {
  if ($('#toolbar div.toolbar-drawer').hasClass('collapsed')) {
    Drupal.toolbar.expand();
  }
  else {
    Drupal.toolbar.collapse();
  }
};

Drupal.toolbar.height = function() {
  var height = $('#toolbar').outerHeight();
  // In IE, Shadow filter adds some extra height, so we need to remove it from
  // the returned height.
  if ($('#toolbar').css('filter').match(/DXImageTransform\.Microsoft\.Shadow/)) {
    height -= $('#toolbar').get(0).filters.item("DXImageTransform.Microsoft.Shadow").strength;
  }
  return height;
};

})(jQuery);
;
