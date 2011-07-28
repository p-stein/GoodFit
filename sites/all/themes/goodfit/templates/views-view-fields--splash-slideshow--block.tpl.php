<?php
$image_path = file_create_url($row->field_field_image[0]['raw']['uri']);

$slideshow_data = $row->_field_data['nid']['entity'];

$horizontal = "left";
$vertical = "top";

if (!empty($slideshow_data->field_slide_text_vertical))
	$vertical = $slideshow_data->field_slide_text_vertical['und'][0]['value'];
if (!empty($slideshow_data->field_slide_text_horizontal))
	$horizontal = $slideshow_data->field_slide_text_horizontal['und'][0]['value'];

?>

<div class="slide_container_image" style="background-image: url('<?php print $image_path; ?>');">
<!-- <img src="<?php print path_to_theme(); ?>/images/slider_fade.png" class="background_image" alt="" width="100%" height="100%" style="position: absolute"> -->
<div class="slide_container_outer horizontal-<?php print $horizontal; ?> vertical-<?php print $vertical; ?>">
<div class="slide_container">
<?php

/**
 * @file views-view-fields.tpl.php
 * Default simple view template to all the fields as a row.
 *
 * - $view: The view in use.
 * - $fields: an array of $field objects. Each one contains:
 *   - $field->content: The output of the field.
 *   - $field->raw: The raw data for the field, if it exists. This is NOT output safe.
 *   - $field->class: The safe class id to use.
 *   - $field->handler: The Views field handler object controlling this field. Do not use
 *     var_export to dump this object, as it can't handle the recursion.
 *   - $field->inline: Whether or not the field should be inline.
 *   - $field->inline_html: either div or span based on the above flag.
 *   - $field->wrapper_prefix: A complete wrapper containing the inline_html to use.
 *   - $field->wrapper_suffix: The closing tag for the wrapper.
 *   - $field->separator: an optional separator that may appear before a field.
 *   - $field->label: The wrap label text to use.
 *   - $field->label_html: The full HTML of the label to use including
 *     configured element type.
 * - $row: The raw result object from the query, with all data it fetched.
 *
 * @ingroup views_templates
 */
?>
<?php foreach ($fields as $id => $field): ?>
  <?php if (!empty($field->separator)): ?>
    <?php print $field->separator; ?>
  <?php endif; ?>

  <?php print $field->wrapper_prefix; ?>
    <?php print $field->label_html; ?>
    <?php print $field->content; ?>
  <?php print $field->wrapper_suffix; ?>
<?php 
endforeach;
?>
</div>
</div>
</div>
