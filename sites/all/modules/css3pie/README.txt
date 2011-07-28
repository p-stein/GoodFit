
*CSS3PIE*

a very simple Drupal module to implement the css3pie.com javascript to your drupal and
make the css selectors configurable over ui. This module creates a real css file on drupal
files folder and add them via drupal_add_css.

Installation:
--------------
Download the PIE Library from http://css3pie.com and it to /sites/all/libraries/PIE.

Configuration:
--------------
go to admin/build/themes/css3pie and configure as you want. In the textarea use one line for every
selector (dont use a commata).
If you have problems with the file mime type on .htc files you can set the php wrapper option
to yes and the file comes with a own mime type header.

The CSS File will be rebuild if you save new options.

*NOTICE*:
its not neccesary to load the PIE.htc file manualy in your theme css file. this is the main part
of this module. a better description will be follow.

Implement in own module:
--------------
You can use the hook: hook_css3pie() in your own module to provides a array with selectors
that you are using.

  Example:
  --------
  hook_css3pie() {
    return array('yourmodulename' => array(
      '.class1', '.class2', '.class3',
    ));
  }


The Result:
-----------

The result of the css is very simple:

Example CSS file:
-----
.myclass1, .myclass2, #myId1, #myId1 > .myclass3
{
  behaviour: url(/sites/all/libraries/PIE/PIE.htc);
}
----
