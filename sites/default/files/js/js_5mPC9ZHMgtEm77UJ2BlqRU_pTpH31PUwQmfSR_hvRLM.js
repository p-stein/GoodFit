(function($) {

Drupal.wysiwyg.editor.init.ckeditor = function(settings) {
  // Plugins must only be loaded once. Only the settings from the first format
  // will be used but they're identical anyway.
  var registeredPlugins = {};
  for (var format in settings) {
    if (Drupal.settings.wysiwyg.plugins[format]) {
      // Register native external plugins.
      // Array syntax required; 'native' is a predefined token in JavaScript.
      for (var pluginName in Drupal.settings.wysiwyg.plugins[format]['native']) {
        if (!registeredPlugins[pluginName]) {
          var plugin = Drupal.settings.wysiwyg.plugins[format]['native'][pluginName];
          CKEDITOR.plugins.addExternal(pluginName, plugin.path, plugin.fileName);
          registeredPlugins[pluginName] = true;
        }
      }
      // Register Drupal plugins.
      for (var pluginName in Drupal.settings.wysiwyg.plugins[format].drupal) {
        if (!registeredPlugins[pluginName]) {
          Drupal.wysiwyg.editor.instance.ckeditor.addPlugin(pluginName, Drupal.settings.wysiwyg.plugins[format].drupal[pluginName], Drupal.settings.wysiwyg.plugins.drupal[pluginName]);
          registeredPlugins[pluginName] = true;
        }
      }
    }
  }
};


/**
 * Attach this editor to a target element.
 */
Drupal.wysiwyg.editor.attach.ckeditor = function(context, params, settings) {
  // Apply editor instance settings.
  CKEDITOR.config.customConfig = '';

  settings.on = {
    instanceReady: function(ev) {
      var editor = ev.editor;
      // Get a list of block, list and table tags from CKEditor's XHTML DTD.
      // @see http://docs.cksource.com/CKEditor_3.x/Developers_Guide/Output_Formatting.
      var dtd = CKEDITOR.dtd;
      var tags = CKEDITOR.tools.extend({}, dtd.$block, dtd.$listItem, dtd.$tableContent);
      // Set source formatting rules for each listed tag except <pre>.
      // Linebreaks can be inserted before or after opening and closing tags.
      if (settings.apply_source_formatting) {
        // Mimic FCKeditor output, by breaking lines between tags.
        for (var tag in tags) {
          if (tag == 'pre') {
            continue;
          }
          this.dataProcessor.writer.setRules(tag, {
            indent: true,
            breakBeforeOpen: true,
            breakAfterOpen: false,
            breakBeforeClose: false,
            breakAfterClose: true
          });
        }
      }
      else {
        // CKEditor adds default formatting to <br>, so we want to remove that
        // here too.
        tags.br = 1;
        // No indents or linebreaks;
        for (var tag in tags) {
          if (tag == 'pre') {
            continue;
          }
          this.dataProcessor.writer.setRules(tag, {
            indent: false,
            breakBeforeOpen: false,
            breakAfterOpen: false,
            breakBeforeClose: false,
            breakAfterClose: false
          });
        }
      }
    },

    pluginsLoaded: function(ev) {
      // Override the conversion methods to let Drupal plugins modify the data.
      var editor = ev.editor;
      if (editor.dataProcessor && Drupal.settings.wysiwyg.plugins[params.format]) {
        editor.dataProcessor.toHtml = CKEDITOR.tools.override(editor.dataProcessor.toHtml, function(originalToHtml) {
          // Convert raw data for display in WYSIWYG mode.
          return function(data, fixForBody) {
            for (var plugin in Drupal.settings.wysiwyg.plugins[params.format].drupal) {
              if (typeof Drupal.wysiwyg.plugins[plugin].attach == 'function') {
                data = Drupal.wysiwyg.plugins[plugin].attach(data, Drupal.settings.wysiwyg.plugins.drupal[plugin], editor.name);
                data = Drupal.wysiwyg.instances[params.field].prepareContent(data);
              }
            }
            return originalToHtml.call(this, data, fixForBody);
          };
        });
        editor.dataProcessor.toDataFormat = CKEDITOR.tools.override(editor.dataProcessor.toDataFormat, function(originalToDataFormat) {
          // Convert WYSIWYG mode content to raw data.
          return function(data, fixForBody) {
            data = originalToDataFormat.call(this, data, fixForBody);
            for (var plugin in Drupal.settings.wysiwyg.plugins[params.format].drupal) {
              if (typeof Drupal.wysiwyg.plugins[plugin].detach == 'function') {
                data = Drupal.wysiwyg.plugins[plugin].detach(data, Drupal.settings.wysiwyg.plugins.drupal[plugin], editor.name);
              }
            }
            return data;
          };
        });
      }
    },

    selectionChange: function (event) {
      var pluginSettings = Drupal.settings.wysiwyg.plugins[params.format];
      if (pluginSettings && pluginSettings.drupal) {
        $.each(pluginSettings.drupal, function (name) {
          var plugin = Drupal.wysiwyg.plugins[name];
          if ($.isFunction(plugin.isNode)) {
            var node = event.data.selection.getSelectedElement();
            var state = plugin.isNode(node ? node.$ : null) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
            event.editor.getCommand(name).setState(state);
          }
        });
      }
    },

    focus: function(ev) {
      Drupal.wysiwyg.activeId = ev.editor.name;
    }
  };

  // Attach editor.
  CKEDITOR.replace(params.field, settings);
};

/**
 * Detach a single or all editors.
 *
 * @todo 3.x: editor.prototype.getInstances() should always return an array
 *   containing all instances or the passed in params.field instance, but
 *   always return an array to simplify all detach functions.
 */
Drupal.wysiwyg.editor.detach.ckeditor = function(context, params) {
  if (typeof params != 'undefined') {
    var instance = CKEDITOR.instances[params.field];
    if (instance) {
      instance.destroy();
    }
  }
  else {
    for (var instanceName in CKEDITOR.instances) {
      CKEDITOR.instances[instanceName].destroy();
    }
  }
};

Drupal.wysiwyg.editor.instance.ckeditor = {
  addPlugin: function(pluginName, settings, pluginSettings) {
    CKEDITOR.plugins.add(pluginName, {
      // Wrap Drupal plugin in a proxy pluygin.
      init: function(editor) {
        if (settings.css) {
          editor.on('mode', function(ev) {
            if (ev.editor.mode == 'wysiwyg') {
              // Inject CSS files directly into the editing area head tag.
              $('head', $('#cke_contents_' + ev.editor.name + ' iframe').eq(0).contents()).append('<link rel="stylesheet" href="' + settings.css + '" type="text/css" >');
            }
          });
        }
        if (typeof Drupal.wysiwyg.plugins[pluginName].invoke == 'function') {
          var pluginCommand = {
            exec: function (editor) {
              var data = { format: 'html', node: null, content: '' };
              var selection = editor.getSelection();
              if (selection) {
                data.node = selection.getSelectedElement();
                if (data.node) {
                  data.node = data.node.$;
                }
                if (selection.getType() == CKEDITOR.SELECTION_TEXT) {
                  if (CKEDITOR.env.ie) {
                    data.content = selection.getNative().createRange().text;
                  }
                  else {
                    data.content = selection.getNative().toString();
                  }
                }
                else if (data.node) {
                  // content is supposed to contain the "outerHTML".
                  data.content = data.node.parentNode.innerHTML;
                }
              }
              Drupal.wysiwyg.plugins[pluginName].invoke(data, pluginSettings, editor.name);
            }
          };
          editor.addCommand(pluginName, pluginCommand);
        }
        editor.ui.addButton(pluginName, {
          label: settings.iconTitle,
          command: pluginName,
          icon: settings.icon
        });

        // @todo Add button state handling.
      }
    });
  },
  prepareContent: function(content) {
    // @todo Don't know if we need this yet.
    return content;
  },
  insert: function(content) {
    content = this.prepareContent(content);
    CKEDITOR.instances[this.field].insertHtml(content);
  }
};

})(jQuery);
;
(function($) {

/**
 * Attach this editor to a target element.
 *
 * @param context
 *   A DOM element, supplied by Drupal.attachBehaviors().
 * @param params
 *   An object containing input format parameters. Default parameters are:
 *   - editor: The internal editor name.
 *   - theme: The name/key of the editor theme/profile to use.
 *   - field: The CSS id of the target element.
 * @param settings
 *   An object containing editor settings for all enabled editor themes.
 */
Drupal.wysiwyg.editor.attach.none = function(context, params, settings) {
  if (params.resizable) {
    var $wrapper = $('#' + params.field).parents('.form-textarea-wrapper:first');
    $wrapper.addClass('resizable');
    if (Drupal.behaviors.textarea.attach) {
      Drupal.behaviors.textarea.attach();
    }
  }
};

/**
 * Detach a single or all editors.
 *
 * @param context
 *   A DOM element, supplied by Drupal.attachBehaviors().
 * @param params
 *   (optional) An object containing input format parameters. If defined,
 *   only the editor instance in params.field should be detached. Otherwise,
 *   all editors should be detached and saved, so they can be submitted in
 *   AJAX/AHAH applications.
 */
Drupal.wysiwyg.editor.detach.none = function(context, params) {
  if (typeof params != 'undefined') {
    var $wrapper = $('#' + params.field).parents('.form-textarea-wrapper:first');
    $wrapper.removeOnce('textarea').removeClass('.resizable-textarea')
      .find('.grippie').remove();
  }
};

/**
 * Instance methods for plain text areas.
 */
Drupal.wysiwyg.editor.instance.none = {
  insert: function(content) {
    var editor = document.getElementById(this.field);

    // IE support.
    if (document.selection) {
      editor.focus();
      var sel = document.selection.createRange();
      sel.text = content;
    }
    // Mozilla/Firefox/Netscape 7+ support.
    else if (editor.selectionStart || editor.selectionStart == '0') {
      var startPos = editor.selectionStart;
      var endPos = editor.selectionEnd;
      editor.value = editor.value.substring(0, startPos) + content + editor.value.substring(endPos, editor.value.length);
    }
    // Fallback, just add to the end of the content.
    else {
      editor.value += content;
    }
  }
};

})(jQuery);
;
(function ($) {

/**
 * Automatically display the guidelines of the selected text format.
 */
Drupal.behaviors.filterGuidelines = {
  attach: function (context) {
    $('.filter-guidelines', context).once('filter-guidelines')
      .find(':header').hide()
      .parents('.filter-wrapper').find('select.filter-list')
      .bind('change', function () {
        $(this).parents('.filter-wrapper')
          .find('.filter-guidelines-item').hide()
          .siblings('.filter-guidelines-' + this.value).show();
      })
      .change();
  }
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;
(function ($) {

/**
 * Provide the summary information for the block settings vertical tabs.
 */
Drupal.behaviors.blockSettingsSummary = {
  attach: function (context) {
    // The drupalSetSummary method required for this behavior is not available
    // on the Blocks administration page, so we need to make sure this
    // behavior is processed only if drupalSetSummary is defined.
    if (typeof jQuery.fn.drupalSetSummary == 'undefined') {
      return;
    }

    $('fieldset#edit-path', context).drupalSetSummary(function (context) {
      if (!$('textarea[name="pages"]', context).val()) {
        return Drupal.t('Not restricted');
      }
      else {
        return Drupal.t('Restricted to certain pages');
      }
    });

    $('fieldset#edit-node-type', context).drupalSetSummary(function (context) {
      var vals = [];
      $('input[type="checkbox"]:checked', context).each(function () {
        vals.push($.trim($(this).next('label').text()));
      });
      if (!vals.length) {
        vals.push(Drupal.t('Not restricted'));
      }
      return vals.join(', ');
    });

    $('fieldset#edit-role', context).drupalSetSummary(function (context) {
      var vals = [];
      $('input[type="checkbox"]:checked', context).each(function () {
        vals.push($.trim($(this).next('label').text()));
      });
      if (!vals.length) {
        vals.push(Drupal.t('Not restricted'));
      }
      return vals.join(', ');
    });

    $('fieldset#edit-user', context).drupalSetSummary(function (context) {
      var $radio = $('input[name="custom"]:checked', context);
      if ($radio.val() == 0) {
        return Drupal.t('Not customizable');
      }
      else {
        return $radio.next('label').text();
      }
    });
  }
};

/**
 * Move a block in the blocks table from one region to another via select list.
 *
 * This behavior is dependent on the tableDrag behavior, since it uses the
 * objects initialized in that behavior to update the row.
 */
Drupal.behaviors.blockDrag = {
  attach: function (context, settings) {
    // tableDrag is required and we should be on the blocks admin page.
    if (typeof Drupal.tableDrag == 'undefined' || typeof Drupal.tableDrag.blocks == 'undefined') {
      return;
    }

    var table = $('table#blocks');
    var tableDrag = Drupal.tableDrag.blocks; // Get the blocks tableDrag object.

    // Add a handler for when a row is swapped, update empty regions.
    tableDrag.row.prototype.onSwap = function (swappedRow) {
      checkEmptyRegions(table, this);
    };

    // A custom message for the blocks page specifically.
    Drupal.theme.tableDragChangedWarning = function () {
      return '<div class="messages warning">' + Drupal.theme('tableDragChangedMarker') + ' ' + Drupal.t('The changes to these blocks will not be saved until the <em>Save blocks</em> button is clicked.') + '</div>';
    };

    // Add a handler so when a row is dropped, update fields dropped into new regions.
    tableDrag.onDrop = function () {
      dragObject = this;
      // Use "region-message" row instead of "region" row because
      // "region-{region_name}-message" is less prone to regexp match errors.
      var regionRow = $(dragObject.rowObject.element).prevAll('tr.region-message').get(0);
      var regionName = regionRow.className.replace(/([^ ]+[ ]+)*region-([^ ]+)-message([ ]+[^ ]+)*/, '$2');
      var regionField = $('select.block-region-select', dragObject.rowObject.element);
      // Check whether the newly picked region is available for this block.
      if ($('option[value=' + regionName + ']', regionField).length == 0) {
        // If not, alert the user and keep the block in its old region setting.
        alert(Drupal.t('The block cannot be placed in this region.'));
        // Simulate that there was a selected element change, so the row is put
        // back to from where the user tried to drag it.
        regionField.change();
      }
      else if ($(dragObject.rowObject.element).prev('tr').is('.region-message')) {
        var weightField = $('select.block-weight', dragObject.rowObject.element);
        var oldRegionName = weightField[0].className.replace(/([^ ]+[ ]+)*block-weight-([^ ]+)([ ]+[^ ]+)*/, '$2');

        if (!regionField.is('.block-region-' + regionName)) {
          regionField.removeClass('block-region-' + oldRegionName).addClass('block-region-' + regionName);
          weightField.removeClass('block-weight-' + oldRegionName).addClass('block-weight-' + regionName);
          regionField.val(regionName);
        }
      }
    };

    // Add the behavior to each region select list.
    $('select.block-region-select', context).once('block-region-select', function () {
      $(this).change(function (event) {
        // Make our new row and select field.
        var row = $(this).parents('tr:first');
        var select = $(this);
        tableDrag.rowObject = new tableDrag.row(row);

        // Find the correct region and insert the row as the first in the region.
        $('tr.region-message', table).each(function () {
          if ($(this).is('.region-' + select[0].value + '-message')) {
            // Add the new row and remove the old one.
            $(this).after(row);
            // Manually update weights and restripe.
            tableDrag.updateFields(row.get(0));
            tableDrag.rowObject.changed = true;
            if (tableDrag.oldRowElement) {
              $(tableDrag.oldRowElement).removeClass('drag-previous');
            }
            tableDrag.oldRowElement = row.get(0);
            tableDrag.restripeTable();
            tableDrag.rowObject.markChanged();
            tableDrag.oldRowElement = row;
            $(row).addClass('drag-previous');
          }
        });

        // Modify empty regions with added or removed fields.
        checkEmptyRegions(table, row);
        // Remove focus from selectbox.
        select.get(0).blur();
      });
    });

    var checkEmptyRegions = function (table, rowObject) {
      $('tr.region-message', table).each(function () {
        // If the dragged row is in this region, but above the message row, swap it down one space.
        if ($(this).prev('tr').get(0) == rowObject.element) {
          // Prevent a recursion problem when using the keyboard to move rows up.
          if ((rowObject.method != 'keyboard' || rowObject.direction == 'down')) {
            rowObject.swap('after', this);
          }
        }
        // This region has become empty.
        if ($(this).next('tr').is(':not(.draggable)') || $(this).next('tr').size() == 0) {
          $(this).removeClass('region-populated').addClass('region-empty');
        }
        // This region has become populated.
        else if ($(this).is('.region-empty')) {
          $(this).removeClass('region-empty').addClass('region-populated');
        }
      });
    };
  }
};

})(jQuery);
;
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
