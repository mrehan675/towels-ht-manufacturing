import frappe
import json
from console import console

from erpnext.controllers.item_variant  import generate_keyed_value_combinations,get_variant,copy_attributes_to_variant,make_variant_item_code

from six import string_types



@frappe.whitelist()
def enqueue_multiple_variant_creation(item, args):

	console("enter Custom").log()


	# There can be innumerable attribute combinations, enqueue
	if isinstance(args, string_types):
		variants = json.loads(args)
	total_variants = 1
	for key in variants:
		total_variants *= len(variants[key])
	if total_variants >= 600:
		frappe.throw(_("Please do not create more than 500 items at a time"))
		return
	if total_variants < 10:
		return create_multiple_variants(item, args)
	else:
		frappe.enqueue(
			"ht.utils.item.create_multiple_variants",
			item=item,
			args=args,
			now=frappe.flags.in_test,
		)
		return "queued"


def create_multiple_variants(item, args):
	count = 0
	if isinstance(args, string_types):
		args = json.loads(args)

	args_set = generate_keyed_value_combinations(args)

	create_multiple_color_variants(item, args)
	console("args_set",args_set).log()

	for attribute_values in args_set:
		console("attribute_values",attribute_values).log()
		if not get_variant(item, args=attribute_values):
			variant = create_variant(item, attribute_values)
			variant.save()
			count += 1

	return count

# Custom work
def create_multiple_color_variants(item, args):
	console("enter Custom").log()
	count = 0
	if isinstance(args, string_types):
		args = json.loads(args)

	# Filter args to include only the "Colour" attribute
	color_args = {k: v for k, v in args.items() if k == "Colour"}
	console("color_args",color_args).log()

	# Generate combinations only for the "Colour" attribute
	args_set = generate_keyed_value_combinations(color_args)

	console("args_set",args_set).log()

	for attribute_values in args_set:
		console("attribute_values",attribute_values).log()
		if not get_variant(item, args=attribute_values):
			variant = create_variant(item, attribute_values)
			variant.save()
			count += 1

	return count





def create_variant(item, args):
	console("enter in my create variant function").log()
	if isinstance(args, string_types):
		args = json.loads(args)

	template = frappe.get_doc("Item", item)
	variant = frappe.new_doc("Item")
	variant.variant_based_on = "Item Attribute"
	variant_attributes = []

	for d in template.attributes:
		variant_attributes.append({"attribute": d.attribute, "attribute_value": args.get(d.attribute)})

	variant.set("attributes", variant_attributes)
	copy_attributes_to_variant(template, variant)
	make_variant_item_code(template.item_code, template.item_name, variant)

	console("variant",variant).log()

	variant.is_sub_contracted_item = 1

	# Check if the item name contains '-ST'
	if "-ST" in variant.item_name:
		console("enter in variant check").log()
		# Remove '-ST' from the item name and set it to item_color_variant
		variant.item_colour_variant = variant.item_name.replace("-ST", "").strip()


	return variant






















# def create_multiple(item, args):
# 	console("ds").log()
# 	count = 0
# 	if isinstance(args, string_types):
# 		args = json.loads(args)

# 	args_set = generate_keyed_value_combinations(args)

# 	create_multiple_color_variants(item, args)
# 	console("args_set",args_set).log()

# 	for attribute_values in args_set:
# 		console("attribute_values",attribute_values).log()
# 		if not get_variant(item, args=attribute_values):
# 			variant = create_variant(item, attribute_values)
# 			variant.save()
# 			count += 1

# 	return count

# # Custom work
# def create_multiple_color_variants(item, args):
# 	console("enter color").log()
# 	count = 0
# 	if isinstance(args, string_types):
# 		args = json.loads(args)

# 	# Filter args to include only the "Colour" attribute
# 	color_args = {k: v for k, v in args.items() if k == "Colour"}
# 	console("color_args",color_args).log()

# 	# Generate combinations only for the "Colour" attribute
# 	args_set = generate_keyed_value_combinations(color_args)

# 	console("args_set",args_set).log()

# 	for attribute_values in args_set:
# 		console("attribute_values",attribute_values).log()
# 		if not get_variant(item, args=attribute_values):
# 			variant = create_variant(item, attribute_values)
# 			variant.save()
# 			count += 1

# 	return count


# create_multiple_variants = create_multiple