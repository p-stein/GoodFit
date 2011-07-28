<?php
/**
 * @file hooks and callbacks for file and theme access for theme editor
 */

/**
 * Callback for theme_editor_theme_editor_access_records()
 * 
 * the functions called should return either THEME_EDITOR_FILE_ACCESS_DENY
 * or THEME_EDITOR_FILE_ACCESS_ALLOW after checking the file/theme
 */
function _theme_editor_access_records($file, $op, $account) {
  $function = '_theme_editor_access_' . $op;
  return call_user_func_array($function, array($file, $account));
}

function _theme_editor_access_create($file, $account) {
  //in create mode we don't get a fid so we need to determine if we are allowed to create files in this theme.
}

function _theme_editor_access_edit($file, $account) {
  
}

function _theme_editor_access_delete($file, $account) {
  
}

/**
 * Creates the default theme access form.
 */
function theme_editor_settings_access_form($global) {
  $settings = $global['access'];
  $form['access'] = array(
    '#type' => 'fieldset',
    '#title' => t('Access settings'),
    '#collpsible' => TRUE,  
  );
  
}
