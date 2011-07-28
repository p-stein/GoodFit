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
