<?php

/**
 * @file
 * This file contains the callbacks for the default checkout panes supplied with
 * Ubercart and their corresponding helper functions.
 *
 * Checkout panes are defined using hook_uc_checkout_pane() and use a callback
 * to handle the different processes involved in completing the checkout form.
 * The default checkout panes are defined in uc_cart_uc_checkout_pane() in
 * uc_cart.module.
 */

/**
 * Displays the cart contents for review during checkout.
 */
function uc_checkout_pane_cart($op, $order, $form = NULL, &$form_state = NULL) {
  switch ($op) {
    case 'view':
      $order->products = uc_cart_get_contents();

      $contents['cart_review_table'] = array(
        '#theme' => 'uc_cart_review_table',
        '#items' => $order->products,
        '#weight' => variable_get('uc_pane_cart_field_cart_weight', 2),
      );
      return array('contents' => $contents, 'next-button' => FALSE);

    case 'review':
      $items = uc_cart_get_contents();

      $output = '<table>';
      foreach ($items as $item) {
        $desc = check_plain($item->title) . uc_product_get_description($item);

        $output .= '<tr valign="top"><td>' . $item->qty . '&times;</td><td width="100%">' . $desc
                  . '</td><td nowrap="nowrap">' . theme('uc_price', array('price' => $item->price * $item->qty)) . '</td></tr>';
      }
      $output .= '</table>';
      $review[] = $output;
      return $review;
  }
}

/**
 * Gets the user's email address for login.
 */
function uc_checkout_pane_customer($op, $order, $form = NULL, &$form_state = NULL) {
  global $user;

  switch ($op) {
    case 'view':
      if (!empty($order->primary_email)) {
        $email = $order->primary_email;
      }
      elseif (isset($user->mail)) {
        $email = $user->mail;
      }
      else {
        $email = '';
      }

      if ($user->uid) {
        $description = t('Order information will be sent to your account e-mail listed below.');// . '<br />'
        $contents['primary_email'] = array('#type' => 'hidden', '#value' => check_plain($email));
        $contents['email_text'] = array(
          '#markup' => '<div>' . t('<b>E-mail address:</b> @email (<a href="!url">edit</a>)', array('@email' => $email, '!url' => url('user/' . $user->uid . '/edit', array('query' => drupal_get_destination())))) . '</div>',
        );
      }
      else {
        $description = t('Enter a valid email address for this order or <a href="!url">click here</a> to login with an existing account and return to checkout.', array('!url' => url('user/login', array('query' => drupal_get_destination()))));
        $contents['primary_email'] = uc_textfield(t('E-mail address'), $email, TRUE, NULL, 64);
      }

      if (variable_get('uc_cart_email_validation', FALSE) && !$user->uid) {
        $contents['primary_email_confirm'] = uc_textfield(t('Confirm e-mail address'), $email, TRUE, NULL, 64);
      }

      if ($user->uid == 0) {
        $contents['new_account'] = array();

        if (variable_get('uc_cart_new_account_name', FALSE)) {
          $contents['new_account']['name'] = array(
            '#type' => 'textfield',
            '#title' => t('Username'),
            '#default_value' => isset($order->data['new_user']['name']) ? $order->data['new_user']['name'] : '',
            '#maxlength' => 60,
            '#size' => 32,
          );
        }
        if (variable_get('uc_cart_new_account_password', FALSE)) {
          $contents['new_account']['pass'] = array(
            '#type' => 'password',
            '#title' => t('Password'),
            '#maxlength' => 32,
            '#size' => 32,
          );
          $contents['new_account']['pass_confirm'] = array(
            '#type' => 'password',
            '#title' => t('Confirm password'),
            '#description' => t('Passwords must match to proceed.'),
            '#maxlength' => 32,
            '#size' => 32,
          );
        }

        if (!empty($contents['new_account'])) {
          $array = array(
            '#type' => 'fieldset',
            '#title' => t('New account details'),
            '#description' => variable_get('uc_cart_new_account_details', t('<b>Optional.</b> New customers may supply custom account details.<br />We will create these for you if no values are entered.')),
            '#collapsible' => FALSE,
          );
          $contents['new_account'] = array_merge($array, $contents['new_account']);
        }

        /**
         * This code adds profile fields required for registration to the
         * customer checkout pane.  However, I don't have the time to fool with
         * validation/submission stuff, so I'm postponing this feature. -RS
        $null = NULL;
        $extra = _user_forms($null, NULL, NULL, 'register');
        if (!empty($extra)) {
          $contents = array_merge($contents, $extra);
        }*/
      }

      return array('description' => $description, 'contents' => $contents);

    case 'process':
      $pane = $form_state['values']['panes']['customer'];

      if (!empty($pane['primary_email']) && !valid_email_address($pane['primary_email'])) {
        form_set_error('panes][customer][primary_email', t('You must enter a valid e-mail address.'));
      }

      $order->primary_email = $pane['primary_email'];

      if (variable_get('uc_cart_email_validation', FALSE) && !$user->uid &&
          $pane['primary_email'] !== $pane['primary_email_confirm']) {
        form_set_error('panes][customer][primary_email_confirm', t('The e-mail address did not match.'));
      }

      // Invalidate if an account already exists for this e-mail address, and the user is not logged into that account
      if ($user->uid == 0 && !empty($pane['primary_email'])) {
        if (db_query("SELECT uid FROM {users} WHERE mail LIKE :mail", array(':mail' => $pane['primary_email']))->fetchField() > 0) {
          form_set_error('panes][customer][primary_email', t('An account already exists for your e-mail address. You will either need to login with with this e-mail address or use a different e-mail address.'));
        }
      }

      // If new users can specify names or passwords then...
      if ((variable_get('uc_cart_new_account_name', FALSE) ||
          variable_get('uc_cart_new_account_password', FALSE)) &&
          $user->uid == 0) {
        // Validate the username.
        if (variable_get('uc_cart_new_account_name', FALSE) && !empty($pane['new_account']['name'])) {
          $message = user_validate_name($pane['new_account']['name']);
          if (!empty($message)) {
            form_set_error('panes][customer][new_account][name', $message);
          }
          if (db_query("SELECT uid FROM {users} WHERE name LIKE :name", array(':name' => $pane['new_account']['name']))->fetchField()) {
            form_set_error('panes][customer][new_account][name', t('The username %name is already taken. Please enter a different name or leave the field blank for your username to be your e-mail address.', array('%name' => $pane['new_account']['name'])));
          }
          $order->data['new_user']['name'] = $pane['new_account']['name'];
        }
        // Validate the password.
        if (variable_get('uc_cart_new_account_password', FALSE)) {
          if (strcmp($pane['new_account']['pass'], $pane['new_account']['pass_confirm'])) {
            form_set_error('panes][customer][new_account][pass_confirm', t('The passwords you entered did not match. Please try again.'));
          }
          $order->data['new_user']['pass'] = $pane['new_account']['pass'];
        }
      }

      if ($user->uid) {
        $order->uid = $user->uid;
      }
      return TRUE;

    case 'review':
      $review[] = array('title' => t('E-mail'), 'data' => check_plain($order->primary_email));
      return $review;

    case 'settings':
      $form['uc_cart_email_validation'] = array(
        '#type' => 'checkbox',
        '#title' => t('Require e-mail confirmation in checkout for anonymous customers.'),
        '#default_value' => variable_get('uc_cart_email_validation', FALSE),
      );
      $form['uc_cart_new_account_name'] = array(
        '#type' => 'checkbox',
        '#title' => t('Allow anonymous customers to specify a new user account name.'),
        '#default_value' => variable_get('uc_cart_new_account_name', FALSE),
      );
      $form['uc_cart_new_account_password'] = array(
        '#type' => 'checkbox',
        '#title' => t('Allow anonymous customers to specify a new user account password.'),
        '#default_value' => variable_get('uc_cart_new_account_password', FALSE),
      );
      $form['uc_cart_new_account_details'] = array(
        '#type' => 'textarea',
        '#title' => t('New account details help message'),
        '#description' => t('Enter the help message displayed in the new account details fieldset when shown.'),
        '#default_value' => variable_get('uc_cart_new_account_details', t('<b>Optional.</b> New customers may supply custom account details.<br />We will create these for you if no values are entered.')),
      );

      return $form;
  }
}

/**
 * Gets the delivery information.
 */
function uc_checkout_pane_delivery($op, $order, $form = NULL, &$form_state = NULL) {
  $description = t('Enter your delivery address and information here.');
  $copy = t('My delivery information is the same as my billing information.');
  return uc_checkout_pane_address('delivery', $op, $order, $form_state, $description, $copy);
}

/**
 * Gets the billing information.
 */
function uc_checkout_pane_billing($op, $order, $form = NULL, &$form_state = NULL) {
  $description = t('Enter your billing address and information here.');
  $copy = t('My billing information is the same as my delivery information.');
  return uc_checkout_pane_address('billing', $op, $order, $form_state, $description, $copy);
}

/**
 * Generic address pane handler.
 */
function uc_checkout_pane_address($pane, $op, $order, &$form_state, $description, $copy) {
  global $user;

  // Source pane for "copy address" checkbox.
  static $source;
  if (!isset($source)) {
    $source = $pane;
  }

  switch ($op) {
    case 'view':
      if ($source != $pane) {
        $contents['copy_address'] = array(
          '#type' => 'checkbox',
          '#title' => $copy,
          '#ajax' => array(
            'callback' => 'uc_checkout_pane_address_render',
            'wrapper' => $pane . '-address-pane',
            'progress' => array(
              'type' => 'throbber',
            ),
          ),
        );
      }

      if ($user->uid && $addresses = uc_select_addresses($user->uid, $pane)) {
        $contents['select_address'] = array(
          '#type' => 'select',
          '#title' => t('Saved addresses'),
          '#options' => $addresses['#options'],
          '#ajax' => array(
            'callback' => 'uc_checkout_pane_address_render',
            'wrapper' => $pane . '-address-pane',
            'progress' => array(
              'type' => 'throbber',
            ),
          ),
          '#states' => array(
            'invisible' => array(
              'input[name="panes[' . $pane . '][copy_address]"]' => array('checked' => TRUE),
            ),
          ),
        );
      }

      $contents['address'] = array(
        '#type' => 'uc_address',
        '#default_value' => $order,
        '#key_prefix' => $pane,
        '#hidden' => !empty($form_state['values']['panes'][$pane]['copy_address']),
        '#prefix' => '<div id="' . $pane . '-address-pane">',
        '#suffix' => '</div>',
      );

      if (isset($form_state['triggering_element'])) {
        $element = &$form_state['triggering_element'];

        if ($element['#name'] == "panes[$pane][copy_address]") {
          $address = &$form_state['values']['panes'][$source]['address'];
          foreach ($address as $field => $value) {
            $field = str_replace($source, $pane, $field);
            $form_state['input']['panes'][$pane]['address'][$field] = $value;
            $order->$field = $value;
          }
        }

        if ($element['#name'] == "panes[$pane][select_address]") {
          $address = $addresses[$element['#value']];
          foreach ($address as $field => $value) {
            $form_state['input']['panes'][$pane]['address'][$pane . '_' . $field] = $value;
            $order->{$pane . '_' . $field} = $value;
          }
        }
      }

      return array('description' => $description, 'contents' => $contents);

    case 'process':
      $panes = &$form_state['values']['panes'];
      foreach ($panes[$pane]['address'] as $key => $value) {
        if (!empty($panes[$pane]['copy_address'])) {
          $value = $panes[$source]['address'][str_replace($pane, $source, $key)];
        }

        $order->$key = $value;
      }
      return TRUE;

    case 'review':
      $review[] = array('title' => t('Address'), 'data' => uc_order_address($order, $pane, FALSE));
      if (uc_address_field_enabled('phone') && !empty($order->{$pane . '_phone'})) {
        $review[] = array('title' => t('Phone'), 'data' => check_plain($order->{$pane . '_phone'}));
      }
      return $review;
  }
}

/**
 * Ajax callback to re-render the full address element.
 */
function uc_checkout_pane_address_render($form, &$form_state) {
  $element = &$form;
  foreach (array_slice($form_state['triggering_element']['#array_parents'], 0, -1) as $field) {
    $element = &$element[$field];
  }
  return $element['address'];
}

/**
 * Allows a customer to make comments on the order.
 */
function uc_checkout_pane_comments($op, $order, $form = NULL, &$form_state = NULL) {
  switch ($op) {
    case 'view':
      $description = t('Use this area for special instructions or questions regarding your order.');

      if (!empty($order->order_id)) {
        $default = db_query("SELECT message FROM {uc_order_comments} WHERE order_id = :id", array(':id' => $order->order_id))->fetchField();
      }
      else {
        $default = NULL;
      }
      $contents['comments'] = array(
        '#type' => 'textarea',
        '#title' => t('Order comments'),
        '#default_value' => $default,
      );

      return array('description' => $description, 'contents' => $contents);

    case 'process':
      if (strlen($form_state['values']['panes']['comments']['comments']) > 0) {
        db_delete('uc_order_comments')
          ->condition('order_id', $order->order_id)
          ->execute();
        uc_order_comment_save($order->order_id, 0, $form_state['values']['panes']['comments']['comments'], 'order', uc_order_state_default('post_checkout'), TRUE);
      }
      return TRUE;

    case 'review':
      $review = NULL;
      $result = db_query("SELECT message FROM {uc_order_comments} WHERE order_id = :id", array(':id' => $order->order_id));
      if ($comment = $result->fetchObject()) {
        $review[] = array('title' => t('Comment'), 'data' => check_plain($comment->message));
      }
      return $review;
  }
}

/**
 * Finds the collapsible pane displayed above the pane with an ID of $pane_id.
 */
function _uc_cart_checkout_prev_pane($panes, $pane_id = NULL) {
  if (is_null($pane_id)) {
    return FALSE;
  }

  $prev = FALSE;
  foreach ($panes as $target) {
    if ($target['id'] == $pane_id) {
      return $prev;
    }
    if ($target['collapsible'] && $target['enabled']) {
      $prev = $target['id'];
    }
  }

  return FALSE;
}

/**
 * Finds the pane that displays below the pane with an ID of $pane_id.
 */
function _uc_cart_checkout_next_pane($panes, $pane_id = NULL) {
  if (is_null($pane_id)) {
    return FALSE;
  }

  $next = FALSE;
  foreach ($panes as $target) {
    if ($next) {
      if ($target['collapsible'] && $target['enabled']) {
        return $target['id'];
      }
    }
    if ($target['id'] == $pane_id) {
      $next = TRUE;
    }
  }

  return FALSE;
}

/**
 * Builds a list of checkout panes defined in the enabled modules.
 */
function _uc_checkout_pane_list($action = NULL) {
  static $panes;

  if (count($panes) > 0 && $action !== 'rebuild') {
    return $panes;
  }

  $panes = module_invoke_all('uc_checkout_pane', NULL);

  // Set the global default values first
  foreach ($panes as $i => $value) {
    $panes[$i]['enabled'] = variable_get('uc_pane_' . $panes[$i]['id'] . '_enabled', (!isset($panes[$i]['enabled']) ? TRUE : $panes[$i]['enabled']));
    $panes[$i]['weight'] = variable_get('uc_pane_' . $panes[$i]['id'] . '_weight', (!isset($panes[$i]['weight']) ? 0 : $panes[$i]['weight']));
  }

  // Allow other modules to alter the panes.
  drupal_alter('uc_checkout_pane', $panes);

  // Make sure that all the required attributes are set
  foreach ($panes as $i => $value) {
    $panes[$i]['enabled'] = !isset($panes[$i]['enabled']) ? TRUE : $panes[$i]['enabled'];
    $panes[$i]['weight'] = !isset($panes[$i]['weight']) ? 0 : $panes[$i]['weight'];
    $panes[$i]['review'] = !isset($panes[$i]['review']) ? TRUE : $panes[$i]['review'];
    $panes[$i]['process'] = !isset($panes[$i]['process']) ? TRUE : $panes[$i]['process'];
    $panes[$i]['collapsible'] = !isset($panes[$i]['collapsible']) ? TRUE : $panes[$i]['collapsible'];
  }
  usort($panes, 'uc_weight_sort');

  return $panes;
}

/**
 * Returns data from a checkout pane by pane ID and the array key.
 */
function _uc_checkout_pane_data($pane_id, $key) {
  $panes = _uc_checkout_pane_list();
  foreach ($panes as $pane) {
    if ($pane['id'] == $pane_id) {
      return $pane[$key];
    }
  }
}

/**
 * Formats the cart contents table on the checkout page.
 *
 * @param $show_subtotal
 *   TRUE or FALSE indicating if you want a subtotal row displayed in the table.
 *
 * @return
 *   The HTML output for the cart review table.
 *
 * @ingroup themeable
 */
function theme_uc_cart_review_table($variables) {
  $items = $variables['items'];
  $show_subtotal = $variables['show_subtotal'];

  $subtotal = 0;

  // Set up table header.
  $header = array(
    array('data' => t('Qty'), 'class' => array('qty')),
    array('data' => t('Products'), 'class' => array('products')),
    array('data' => t('Price'), 'class' => array('price')),
  );

  // Set up table rows.
  foreach ($items as $item) {
    $total = $item->price * $item->qty;
    $subtotal += $total;

    $description = check_plain($item->title) . uc_product_get_description($item);

    // Remove node from context to prevent the price from being altered.
    $rows[] = array(
      array('data' => t('@qty&times;', array('@qty' => $item->qty)), 'class' => array('qty')),
      array('data' => $description, 'class' => array('products')),
      array('data' => array('#theme' => 'uc_price', '#price' => $total), 'class' => array('price')),
    );
  }

  // Add the subtotal as the final row.
  if ($show_subtotal) {
    $rows[] = array(
      'data' => array(
        // One cell
        array(
          'data' => array(
            '#theme' => 'uc_price',
            '#prefix' => '<span id="subtotal-title">' . t('Subtotal:') . '</span> ',
            '#price' => $subtotal,
          ),
          // Cell attributes
          'colspan' => 3,
          'class' => array('subtotal'),
        ),
      ),
      // Row attributes
      'class' => array('subtotal'),
    );
  }

  return theme('table', array('header' => $header, 'rows' => $rows, 'attributes' => array('class' => array('cart-review'))));
}
