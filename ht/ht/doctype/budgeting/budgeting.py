# Copyright (c) 2023, hammad and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from collections import defaultdict

class Budgeting(Document):
	
	def validate(self):
		total_yarn_cost = 0.0
		total_weaving_cost = 0.0
		total_shearing_cost = 0.0
		total_dyeing_cost = 0.0
		total_stitching_cost = 0.0
		total_embroidery_cost = 0.0
		total_printing_cost = 0.0
		total_accessories_cost = self.acc_total_amount or 0.0
		total_packing_cost = self.pack_total_amount or 0.0
		total_expense_cost = self.total_expense_amount or 0.0
		self.total_cost_percent = 0.0
		self.total_cost_rslb_export = 0.0
		# self.us_dollar = 0.0
		self.local_sales = 0.0
		self.export_lbs = 0.0
		

		for d in self.rawmaterial_yarn_items:
			total_yarn_cost += d.raw_material_amount or 0.0

		grouped_raw_object = defaultdict()
		for p in self.parent_items_table:
			total_weaving_cost += p.total_weaving_amount or 0.0
			total_dyeing_cost += p.total_dyeing_amount or 0.0
			total_stitching_cost += (p.stiching_rate or 0.0)*(p.total_parent_qty_with_b_percent or 0.0)
			total_embroidery_cost += (p.embroidery_rate or 0.0)*(p.total_parent_qty_with_b_percent or 0.0)
			total_printing_cost += (p.printing_rate or 0.0)*(p.total_parent_qty_with_b_percent or 0.0)
			self.export_lbs += p.net_lbs or 0.0
			self.local_sales += (p.b_kgs or 0.0)*(p.b_kgs_rate or 0.0)
			# self.us_dollar += p.total_parent_qty * (p.rate or 0.0)


		"""Group raw materials by raw material item code for printing purpose"""
		self.raw_materials_grouped = []
		for rt in self.rawmaterial_yarn_items:
			unique_key = str(rt.parent_item).replace(" ", "_").replace("-","-").lower()+"_"+str(rt.raw_mat_item).replace(" ", "_").replace("-","-").lower()
			grouped_raw_object[unique_key] = {"consumption_": 0.0, "consumption_lbs":0.0, "rate_per_lbs": 0.0, "raw_material_amount":0.0}

		

		for rt in self.rawmaterial_yarn_items:
			unique_key = str(rt.parent_item).replace(" ", "_").replace("-","-").lower()+"_"+str(rt.raw_mat_item).replace(" ", "_").replace("-","-").lower()
			grouped_raw_object[unique_key]["parent_item"] = rt.parent_item
			grouped_raw_object[unique_key]["raw_mat_item"] = rt.raw_mat_item
			grouped_raw_object[unique_key]["raw_mat_item_name"] = rt.raw_mat_item_name
			grouped_raw_object[unique_key]["consumption_"] += rt.consumption_
			grouped_raw_object[unique_key]["consumption_lbs"] += rt.consumption_lbs
			grouped_raw_object[unique_key]["rate_per_lbs"] = rt.rate_per_lbs
			grouped_raw_object[unique_key]["raw_material_amount"] += rt.raw_material_amount
		
		grouped_raw_materials = [value for value in grouped_raw_object.values()]
		for grm in grouped_raw_materials:
			self.append("raw_materials_grouped", grm)

		self.total_amount_pkr = self.us_dollar*self.exchange_rate
		self.rate__lbs = round(self.total_amount_pkr / (self.export_lbs or 1), 2)
		self.rebate_value = round(self.total_amount_pkr*(self.rebate_percent_rate or 0.0)/100, 2)
		self.export_lbs = round(self.export_lbs, 2)
		

		self.total_cost_amount = '{0:,.2f}'.format(total_yarn_cost + total_weaving_cost + total_shearing_cost + total_dyeing_cost + total_stitching_cost +\
									total_embroidery_cost + total_printing_cost + total_accessories_cost + total_packing_cost + total_expense_cost)
		self.total_amount = '{0:,.2f}'.format(self.total_amount_pkr + self.local_sales + self.rebate_value)

		total_amount = round(self.total_amount_pkr + self.local_sales + self.rebate_value, 2)
		self.total_amounts = self.total_amount
		# self.profit_loss = (float(self.total_amounts)) - float(self.total_cost_amount)
		self.total_costs = self.total_cost_amount
		self.profit_loss = float(self.total_amounts.replace(",", "")) - float(self.total_cost_amount.replace(",", ""))

		
		for cost in self.cost_details:
			if cost.cost_component == 'Yarn':
				cost.cost_amount = total_yarn_cost
				cost.cost_percent = round(total_yarn_cost*100/(total_amount or 1), 2)
				cost.rs_lb_export = round(total_yarn_cost/(float(self.export_lbs) or 1), 2)

			elif cost.cost_component == 'Weaving':
				cost.cost_amount = total_weaving_cost
				cost.cost_percent = round(total_weaving_cost*100/(total_amount or 1), 2)
				cost.rs_lb_export = round(total_weaving_cost/(float(self.export_lbs) or 1), 2)

			elif cost.cost_component == 'Dyeing':
				cost.cost_amount = total_dyeing_cost
				cost.cost_percent = round(total_dyeing_cost*100/(total_amount or 1), 2)
				cost.rs_lb_export = round(total_dyeing_cost/(float(self.export_lbs) or 1), 2)

			elif cost.cost_component == 'Stitching':
				cost.cost_amount = total_stitching_cost
				cost.cost_percent = round(total_stitching_cost*100/(total_amount or 1), 2)
				cost.rs_lb_export = round(total_stitching_cost/(float(self.export_lbs) or 1), 2)

			elif cost.cost_component == 'Embroidery':
				cost.cost_amount = total_embroidery_cost
				cost.cost_percent = round(total_embroidery_cost*100/(total_amount or 1), 2)
				cost.rs_lb_export = round(total_embroidery_cost/(float(self.export_lbs) or 1), 2)

			elif cost.cost_component == 'Printing':
				cost.cost_amount = total_printing_cost
				cost.cost_percent = total_printing_cost*100/(total_amount or 1)
				cost.rs_lb_export = total_printing_cost/(float(self.export_lbs) or 1)

			elif cost.cost_component == 'Accessories':
				cost.cost_amount = total_accessories_cost
				cost.cost_percent = round(total_accessories_cost*100/(total_amount or 1), 2)
				cost.rs_lb_export = round(total_accessories_cost/(float(self.export_lbs) or 1), 2)

			elif cost.cost_component == 'Packing':
				cost.cost_amount = total_packing_cost
				cost.cost_percent = round(total_packing_cost*100/(total_amount or 1), 2)
				cost.rs_lb_export = round(total_packing_cost/(float(self.export_lbs) or 1), 2)

			elif cost.cost_component == 'Expense':
				cost.cost_amount = total_expense_cost
				cost.cost_percent = round(total_expense_cost*100/(total_amount or 1), 2)
				cost.rs_lb_export = round(total_expense_cost/(float(self.export_lbs or 0.0) or 1), 2)

			self.total_cost_percent += cost.cost_percent or 0.0
			self.total_cost_rslb_export += cost.rs_lb_export or 0.0
		self.total_cost_percent = '{0:.2f}'.format(self.total_cost_percent)
		self.total_cost_rslb_export = '{0:,.2f}'.format(self.total_cost_rslb_export)

		# self.total_cost_amount = '{0:,.2f}'.format(total_yarn_cost + total_weaving_cost + total_shearing_cost + total_dyeing_cost + total_stitching_cost +\
		# 							total_embroidery_cost + total_printing_cost + total_accessories_cost + total_packing_cost + total_expense_cost)
		# self.total_amount = '{0:,.2f}'.format(self.total_amount_pkr + self.local_sales + self.rebate_value)
  
  
  
  
  
  
  
  
  
  
  
  
  
  # Copyright (c) 2023, hammad and contributors
# For license information, please see license.txt

# import frappe
# from frappe.model.document import Document
# from collections import defaultdict

# class Budgeting(Document):
	
# 	def validate(self):
# 		total_yarn_cost = 0.0
# 		total_weaving_cost = 0.0
# 		total_shearing_cost = 0.0
# 		total_dyeing_cost = 0.0
# 		total_stitching_cost = 0.0
# 		total_embroidery_cost = 0.0
# 		total_printing_cost = 0.0
# 		total_accessories_cost = self.acc_total_amount or 0.0
# 		total_packing_cost = self.pack_total_amount or 0.0
# 		total_expense_cost = self.total_expense_amount or 0.0
# 		self.total_cost_percent = 0.0
# 		self.total_cost_rslb_export = 0.0
# 		# self.us_dollar = 0.0
# 		self.local_sales = 0.0
# 		self.export_lbs = 0.0
		

# 		for d in self.rawmaterial_yarn_items:
# 			total_yarn_cost += d.raw_material_amount or 0.0

# 		grouped_raw_object = defaultdict()
# 		for p in self.parent_items_table:
# 			total_weaving_cost += p.total_weaving_amount or 0.0
# 			total_dyeing_cost += p.total_dyeing_amount or 0.0
# 			total_stitching_cost += (p.stiching_rate or 0.0)*(p.total_parent_qty_with_b_percent or 0.0)
# 			total_embroidery_cost += (p.embroidery_rate or 0.0)*(p.total_parent_qty_with_b_percent or 0.0)
# 			total_printing_cost += (p.printing_rate or 0.0)*(p.total_parent_qty_with_b_percent or 0.0)
# 			self.export_lbs += p.net_lbs or 0.0
# 			self.local_sales += (p.b_kgs or 0.0)*(p.b_kgs_rate or 0.0)
# 			# self.us_dollar += p.total_parent_qty * (p.rate or 0.0)


# 		"""Group raw materials by raw material item code for printing purpose"""
# 		self.raw_materials_grouped = []
# 		for rt in self.rawmaterial_yarn_items:
# 			unique_key = str(rt.parent_item).replace(" ", "_").replace("-","-").lower()+"_"+str(rt.raw_mat_item).replace(" ", "_").replace("-","-").lower()
# 			grouped_raw_object[unique_key] = {"consumption_": 0.0, "consumption_lbs":0.0, "rate_per_lbs": 0.0, "raw_material_amount":0.0}

		

# 		for rt in self.rawmaterial_yarn_items:
# 			unique_key = str(rt.parent_item).replace(" ", "_").replace("-","-").lower()+"_"+str(rt.raw_mat_item).replace(" ", "_").replace("-","-").lower()
# 			grouped_raw_object[unique_key]["parent_item"] = rt.parent_item
# 			grouped_raw_object[unique_key]["raw_mat_item"] = rt.raw_mat_item
# 			grouped_raw_object[unique_key]["raw_mat_item_name"] = rt.raw_mat_item_name
# 			grouped_raw_object[unique_key]["consumption_"] += rt.consumption_
# 			grouped_raw_object[unique_key]["consumption_lbs"] += rt.consumption_lbs
# 			grouped_raw_object[unique_key]["rate_per_lbs"] = rt.rate_per_lbs
# 			grouped_raw_object[unique_key]["raw_material_amount"] += rt.raw_material_amount
		
# 		grouped_raw_materials = [value for value in grouped_raw_object.values()]
# 		for grm in grouped_raw_materials:
# 			self.append("raw_materials_grouped", grm)

# 		self.total_amount_pkr = self.us_dollar*self.exchange_rate
# 		self.rate__lbs = round(self.total_amount_pkr / (self.export_lbs or 1), 2)
# 		self.rebate_value = round(self.total_amount_pkr*(self.rebate_percent_rate or 0.0)/100, 2)
# 		self.export_lbs = round(self.export_lbs, 2)
		

# 		self.total_cost_amount = '{0:,.2f}'.format(total_yarn_cost + total_weaving_cost + total_shearing_cost + total_dyeing_cost + total_stitching_cost +\
# 									total_embroidery_cost + total_printing_cost + total_accessories_cost + total_packing_cost + total_expense_cost)
# 		self.total_amount = '{0:,.2f}'.format(self.total_amount_pkr + self.local_sales + self.rebate_value)

# 		total_amount = round(self.total_amount_pkr + self.local_sales + self.rebate_value, 2)
		
# 		for cost in self.cost_details:
# 			if cost.cost_component == 'Yarn':
# 				cost.cost_amount = total_yarn_cost
# 				cost.cost_percent = round(total_yarn_cost*100/(total_amount or 1), 2)
# 				cost.rs_lb_export = round(total_yarn_cost/(float(self.export_lbs) or 1), 2)

# 			elif cost.cost_component == 'Weaving':
# 				cost.cost_amount = total_weaving_cost
# 				cost.cost_percent = round(total_weaving_cost*100/(total_amount or 1), 2)
# 				cost.rs_lb_export = round(total_weaving_cost/(float(self.export_lbs) or 1), 2)

# 			elif cost.cost_component == 'Dyeing':
# 				cost.cost_amount = total_dyeing_cost
# 				cost.cost_percent = round(total_dyeing_cost*100/(total_amount or 1), 2)
# 				cost.rs_lb_export = round(total_dyeing_cost/(float(self.export_lbs) or 1), 2)

# 			elif cost.cost_component == 'Stitching':
# 				cost.cost_amount = total_stitching_cost
# 				cost.cost_percent = round(total_stitching_cost*100/(total_amount or 1), 2)
# 				cost.rs_lb_export = round(total_stitching_cost/(float(self.export_lbs) or 1), 2)

# 			elif cost.cost_component == 'Embroidery':
# 				cost.cost_amount = total_embroidery_cost
# 				cost.cost_percent = round(total_embroidery_cost*100/(total_amount or 1), 2)
# 				cost.rs_lb_export = round(total_embroidery_cost/(float(self.export_lbs) or 1), 2)

# 			elif cost.cost_component == 'Printing':
# 				cost.cost_amount = total_printing_cost
# 				cost.cost_percent = total_printing_cost*100/(total_amount or 1)
# 				cost.rs_lb_export = total_printing_cost/(float(self.export_lbs) or 1)

# 			elif cost.cost_component == 'Accessories':
# 				cost.cost_amount = total_accessories_cost
# 				cost.cost_percent = round(total_accessories_cost*100/(total_amount or 1), 2)
# 				cost.rs_lb_export = round(total_accessories_cost/(float(self.export_lbs) or 1), 2)

# 			elif cost.cost_component == 'Packing':
# 				cost.cost_amount = total_packing_cost
# 				cost.cost_percent = round(total_packing_cost*100/(total_amount or 1), 2)
# 				cost.rs_lb_export = round(total_packing_cost/(float(self.export_lbs) or 1), 2)

# 			elif cost.cost_component == 'Expense':
# 				cost.cost_amount = total_expense_cost
# 				cost.cost_percent = round(total_expense_cost*100/(total_amount or 1), 2)
# 				cost.rs_lb_export = round(total_expense_cost/(float(self.export_lbs or 0.0) or 1), 2)

# 			self.total_cost_percent += cost.cost_percent or 0.0
# 			self.total_cost_rslb_export += cost.rs_lb_export or 0.0
# 		self.total_cost_percent = '{0:.2f}'.format(self.total_cost_percent)
# 		self.total_cost_rslb_export = '{0:,.2f}'.format(self.total_cost_rslb_export)

# 		# self.total_cost_amount = '{0:,.2f}'.format(total_yarn_cost + total_weaving_cost + total_shearing_cost + total_dyeing_cost + total_stitching_cost +\
# 		# 							total_embroidery_cost + total_printing_cost + total_accessories_cost + total_packing_cost + total_expense_cost)
# 		# self.total_amount = '{0:,.2f}'.format(self.total_amount_pkr + self.local_sales + self.rebate_value)