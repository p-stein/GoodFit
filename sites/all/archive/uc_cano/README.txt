Chained Attributes aNd Options for Ubercart (UC_CANO)

Ver 1.x
July 1, 2010

================
What is it for?
================

CANO is created to define relations between options and attribtues, and establish hierarchical dependency between ubercart attributes and options. Once established, these dependencies are content type level. In other words, different dependencies can be established for different product classes in ubercart. Below is an example how CANO can be used in a handy way that's not possible in ubercart.

For example, a product class has Size and Measurements as attributes for Shorts Shorts, and say, Size is before Color (because of their weights). In some situations, I want the Attribute Color disabled (and ideally, hidden) only when certain Size options are selected. n Size, one particular option is "Custom Size", other options may be something like S; M; L; XL. If the customer selects "Custom Size", then we use some techniques to show the "Measurements" attribute. In this attribute, customer can provide detailed measurements. 

================
Features
================

1) CANO supports two types of dependency between options and attributes: Disable, and Enable.

For example, if on loading your default option of Attribute A is No, and in this case you want to disable the dependant attribute B, then you'll need to define this: "No" of Attribute A --> Disable --> Attribute B. As a result, on loading of any product page of this class, Attribute B is disabled and hidden. And if a customer selects "Yes" of Attribute A, then Attribute B will be enabled and displayed. You can, however, impose dependency of Attribute B on the "Yes" option of Attribute A to either Enable (not necessary but doable) or Disable as well.

2) CANO supports recursive hierarchy of relations. A recursive dependency handler is implemented. See these two scenarios. Say M2M is an option of Attribute A, and Custom Lenght is Attribute B (which has two option: Yes / No), and Length is Attribute C;

i). M2M -> Disables -> Custom Lenght, and Custom Length -> Yes -> Enables -> Length
output : when I selected M2M, the custom length was disabled and hence the Length was too. So it was a positive output.

ii). M2M -> Enables -> Custom Length, and Custom Length -> Yes -> Disables -> Length
ouput : when I selected M2M, the custom Length as enabled and hence the Length was too, as the default selection of custom length was not "Yes". So it was a positvie output.

3) CANO is designed in a way so that even "Required" attributes can be disabled and hidden if necessary. In order to do this, CANO super-imposes "NULL" string to these attributes when customers put the product in shopping cart so that ubercart won't complain. This is very useful because in many situations, there're attributes that you want them to be required if enabled. This is not possible in any other ubercart modules.

4) CANO establishes the dependencies between Attributes and Options in per product-class level. No definition is needed on per product level.

================
Considerations and limitations:
================

*) Designed for drop down style of attributes only;

*) It's not possible and not allowed to define multiple dependencies on the same attribute. For example, none of these combinations is possible:
	a) "Option 1" of Attribute A --> Enable/Disable --> Attribute P; and "Option 3" of Attribute A --> Enable/Disable --> Attribute P;
	b) "Option 1" of Attribute A --> Enable/Disable --> Attribute P; and "Option 3" of Attribute B --> Enable/Disable --> Attribute P;
	Note: this is actually not a limitation. It's designed in this way so that there's no confusion to the handler. In most cases the recursive dependency can provide what you want if defined properly.

*) The convenience of per product-class dependency definition means that it's not handy when you need to customize dependencies per product. Actually this is not possible in CANO as of now.

================
Default assumptions and behavior explained:
================

CANO makes these assumptions of default dependency when no dependency is defined (i.e., NO option in that Attribute has dependency over the dependent attribute.).

i) for un-defined attributes / options, display as normal;
ii) if a dependency is defined as "Enable", then only when the depending option is selected, then the dependent Attribute will show; otherwise disable it;
iii) if a dependency is defined as "Disable", then only when the depending option is selected, then the dependent Attribute will be disabled; otherwise it will be shown as normal;

To show how to properly take advantage of these CANO assumptions, say there're Attribute Color, and Attribute Delivery Time; below are two Scenarios:

Scenario 1):
a) Green -> {Enable} -> Delivery time;
b) Red -> {Disable} -> Delivery time;

In this scenario, definition b) is UN-NECESSARY because of the default CANO assumptions; but it's fine to define it that way since there're no conflicts and the module will simply ignore it.

Scenario 2):
a) Green -> {Enable} -> Delivery time;
b) Red -> {Enable} -> Delivery time;

In this scenario, definition b) is necessary. And when Red is selected, Delivery time should be displayed. Suppose that b) is not defined, then Delivery time is disabled by default. 

In addition, in Scenerio 1, if the selected option is something else, say Blue or "Please select" (no default selection is set in Attribute definition), then what to show? According to the default assumptions, because Blue is not defined over Delivery time, then Delivery Time should be disabled. 

================
Credits and License:
================
This module is proudly sponsored by PromDressExpress.com - Your Prom Dress Marketplace (http://PromDressExpress.com)
Licensed under GNU General Public License.