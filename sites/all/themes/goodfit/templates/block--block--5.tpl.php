<?php

// $Id: block.tpl.php,v 1.4.2.3 2011/02/06 22:47:17 andregriffin Exp $

if (!isset($block_classes))
        $block_classes = "";
?>
<div id="try_goodfit">

<?php print '<img id="big_up_arrow" src="' . path_to_theme() . '/images/yellow_up.gif" alt="^" title="Try GoodFit!">'; ?>
<section id="<?php print $block_html_id; ?>" class="<?php print $classes; ?> <?php print $block_classes; ?>"<?php print $attributes;
?>>
<a href="/demo" title="Try GoodFit!" style="display: block; position: relative; z-index: 3000; width: 100%; height: 100%">

  <?php print render($title_prefix); ?>
  <?php if (!empty($block->subject)): ?>
    <h2 <?php print $title_attributes; ?>><?php print $block->subject ?></h2>
  <?php endif;?>
  <?php print render($title_suffix); ?>

  <div class="content"<?php print $content_attributes; ?>>


    <?php print $content ?>
  </div>
</a>

</section> <!-- /.block -->
</div>

