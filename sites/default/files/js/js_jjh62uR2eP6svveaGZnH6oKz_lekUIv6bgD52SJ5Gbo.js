(function ($) {

$(document).ready(function() {
  /**
   * define the indexOf method if does not exists (like in IE)
   */
  if(!Array.indexOf){
	    Array.prototype.indexOf = function(obj){
	        for(var i=0; i<this.length; i++){
	            if(this[i]==obj){
	                return i;
	            }
	        }
	        return -1;
	    }
	}

  rebuildAttrDisplay();
});
function rebuildAttrDisplay() {
  $('.uc-cano-dependent-attr').each(function(index) {
    $(this).parents(".form-item").parents(".attribute").hide();
  });
  $('.uc-cano-parent-attr').change();
}
function uc_cano_parent_attr_trigger(id, selected_option, cano_def) {
  var oidArray = new Array();
  $(".add-to-cart .attributes").fadeOut();
  for(var oid in cano_def) {
    oidArray.push(oid)
  }
  if(oidArray.length > 0) {
    for(var oid in cano_def) {
      if(oid == selected_option) {
        for(var attr_id in cano_def[oid]) {
          if(cano_def[oid][attr_id] == 'disable' || cano_def[oid][attr_id] == 'disabled') {
            $("div.attribute-" + attr_id).hide();
            //empty the value of hidden attributes
            if($("div.attribute-" + attr_id + " input").is("input:radio")) {
              $("div.attribute-" + attr_id + " input").attr("checked", false);
            }
            else {
              $("div.attribute-" + attr_id + " input").val("");
              //$("div.attribute-" + attr_id + " select").val("");
              $("div.attribute-" + attr_id + " select option:first").attr('selected','selected');
            }
          }
          else if(cano_def[oid][attr_id] == 'enable' || cano_def[oid][attr_id] == 'enabled') {
            $("div.attribute-" + attr_id).show();
          }
          
          if($("div.attribute-" + attr_id).find("select").hasClass("uc-cano-parent-dependent-attr")) {
            //fire change event on this dependent attr so that any other attr that are dependent on it will show.
            $("div.attribute-" + attr_id + " .uc-cano-parent-dependent-attr").change();
          }
        }
      }
      else if(oidArray.indexOf(selected_option) < 0) {
        var oid_inner = '';
        var attr_id_inner = '';
        var attrArray = new Array();
        for(oid_inner in cano_def) {
          for(attr_id_inner in cano_def[oid_inner]) {
            if(cano_def[oid_inner][attr_id_inner] == 'enable') {
              $("div.attribute-" + attr_id_inner).hide();
              //empty the value of hidden attributes
              if($("div.attribute-" + attr_id_inner + " input").is("input:radio")) {
                $("div.attribute-" + attr_id_inner + " input").attr("checked", false);
              }
              else {
                $("div.attribute-" + attr_id_inner + " input").val("");
                //$("div.attribute-" + attr_id_inner + " select").val("");
                $("div.attribute-" + attr_id_inner + " select option:first").attr('selected','selected');
              }
              attrArray.push(attr_id_inner);
            }
          }
        }
        for(oid_inner in cano_def) {
          for(attr_id_inner in cano_def[oid_inner]) {
            if(attrArray.indexOf(attr_id_inner) < 0) {
             if(cano_def[oid_inner][attr_id_inner] == 'disable') {
                $("div.attribute-" + attr_id_inner).show();
              } 
            }
          }
        }
      }
    }
  }
  else {
    for(var oid in cano_def) {
      for(var attr_id in cano_def[oid]) {
        $("div.attribute-" + attr_id).show();
      }
    }
  }
  $(".add-to-cart .attributes").fadeIn();
}
function uc_cano_filter_attr_options(selected_option, element_id) {
  var url = Drupal.settings.basePath + "js/uc_cano/filter_attr_options/" + selected_option;
  $.ajax({
    url: url,
    success: function(data) {
      var html = "";
      var data_arr = eval('(' + data + ')');
      for(var oid in data_arr) {
        html += '<option value="' + oid + '">' + data_arr[oid] + '</option>';
      }
      $("select[name*=" + element_id + "]").html(html);
    }
  });
}

})(jQuery);
;
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
