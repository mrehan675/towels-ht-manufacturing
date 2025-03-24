from frappe import _
import frappe






def update_raw_materials_table(self, method):
	# Calculate the percentage multiplied by the qty of variants for the parent item
	for d in self.sales_order_raw_material:
		for variant in self.items:
			if variant.variant_of == d.parent_item:
				consumption_lbs = (d.consumption_ or 0.0)*(variant.total_final_lbs or 0.0)/100
		d.consumption_lbs = consumption_lbs
		d.raw_material_amount = (d.consumption_lbs or 0)*(d.rate_per_lbs or 0)






""" Set parent item details for use in print layouts etc"""

def set_parent_items_table(self, method):
	self.parent_items_tables  = []
	seen_values = set()
	unique_records_array = []

	for d in self.items:
		# d = d.__dict__()
		value = d.get("variant_of")
		
		if value is not None and value not in seen_values:
			seen_values.add(value)
			row = {
				"item_code": d.item_code,
				"item_name": d.item_name,
				"description": d.description,
				"delivery_date": d.delivery_date,
				"qty": d.qty,
				"uom": d.uom,
				"rate": d.rate,
				"amount": d.amount,
				"net_rate": d.net_rate,
				"net_amount": d.net_amount,
				"conversion_factor": d.conversion_factor,
				"variant_of": d.variant_of,
				"net_weight": d.net_weight,
				"greigh_weight": d.greigh_weight,
				"weight_measuring_unit": d.weight_measuring_unit,
				"cut_length":d.cut_length,
				"weight_difference": d.weight_difference,
				"b_percent": d.b_percent,
				"total_secondary_qty": d.total_secondary_qty,
				"total_seconday_qty_uom":d.total_seconday_qty_uom,
				"total_secondary_qty_with_b_percent": d.total_secondary_qty_with_b_percent,
				"total_parent_qty": d.total_parent_qty,
				"total_parent_qty_uom": d.total_parent_qty_uom,
				"total_parent_qty_with_b_percent": d.total_parent_qty_with_b_percent,
				"loom_wastage": d.loom_wastage,
				"total_final_lbs": d.total_final_lbs,
				"net_lbs": d.net_lbs,
				"final_lbs_": d.final_lbs_,
				"b_kgs": (d.total_parent_qty_with_b_percent-d.total_parent_qty)*d.dye_qlty,
				"b_kgs_rate": d.b_kgs_rate or 0.0,
				"b_kgs_value": (d.b_kgs or 0.0)*(d.b_kgs_rate or 0.0),
				"b_value": (d.total_weaving_amount+d.total_yarn_amount)*d.b_percent/100,
				"weave_qlty": d.weave_qlty or 0.0,
				"sh_rate": d.sh_rate or 0.0,
				"oh_rate": d.oh_rate or 0.0,
				"lbs": d.lbs or 0.0,
				"weaving_amount": d.weaving_amount or 0.0,
				"weave_waste_lbs": d.total_yarn_required-d.lbs,
				"dye_waste_lbs": d.lbs - d.dye_lbs,
				"dye_qlty": d.dye_qlty or 0.0,
				"dye_waste_percentage": d.dye_waste_percentage or 0.0,
				"dye_lbs": d.dye_lbs or 0.0,
				"dye_rate": d.dye_rate or 0.0,
				"total_dyeing_amount": d.total_dyeing_amount or 0.0,
				"stiching_rate": d.stiching_rate or 0.0,
				"embroidery_rate": d.embroidery_rate or 0.0,
				"printing_rate": d.printing_rate or 0.0,
				"final_stich_rate": d.final_stich_rate or 0.0,
				"stitch_waste_qty": d.stitch_waste_qty or 0.0,
				"total_qty_with_waste": d.total_qty_with_waste or 0.0,
				"total_stitching_amount": d.total_stitching_amount or 0.0,
    			"fancy": d.fancy or 0.0,
				"brand": d.brand

			}

			self.append("parent_items_tables", row)


	for prt in self.parent_items_tables:

		""" Calculate total yarn amount from raw materials for each parent item"""
		total_yarn_amount = 0.0
		total_yarn_required = 0.0
		for rmt in self.sales_order_raw_material:
			if prt.variant_of == rmt.parent_item:
				total_yarn_amount += rmt.raw_material_amount or 0.0
				total_yarn_required = rmt.total_yarn_required or 0.0
		prt.total_yarn_required = total_yarn_required
		prt.total_yarn_amount = total_yarn_amount

		""" Calculate total weaving amount from items table for each parent item"""
		total_weaving_amount = 0.0
		for item in self.items:
			if item.variant_of == prt.variant_of:
				total_weaving_amount = item.weaving_amount or 0.0
		prt.total_weaving_amount = total_weaving_amount

		prt.b_kgs_value = (prt.b_kgs or 0.0)*(prt.b_kgs_rate or 0.0)
		prt.b_value = (prt.total_weaving_amount+prt.total_yarn_amount)*prt.b_percent/100


