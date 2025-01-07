
import frappe
from erpnext.stock.doctype.stock_entry.stock_entry import StockEntry
from console import console
from erpnext.stock.utils import get_bin
from frappe.utils import cint, comma_or, cstr, flt, format_time, formatdate, getdate, nowdate
from erpnext.controllers.stock_controller import StockController


from erpnext.stock.doctype.stock_entry.stock_entry import StockEntry

from erpnext.stock.doctype.stock_entry.stock_entry import get_supplied_items


class CustomStockEntry(StockEntry):
	def update_purchase_order_supplied_items(self):
		if self.purchase_order and (
			self.purpose in ["Send to Subcontractor", "Material Transfer"] or self.is_return
		):
			console("enter in Class").log()

			# Get PO Supplied Items Details
			item_wh = frappe._dict(
				frappe.db.sql(
					"""
				select rm_item_code, reserve_warehouse
				from `tabPurchase Order` po, `tabPurchase Order Item Supplied` poitemsup
				where po.name = poitemsup.parent
				and po.name = %s""",
					self.purchase_order,
				)
			)

			supplied_items = get_supplied_items(self.purchase_order)
			# console("supplied_items.items()",supplied_items.items()).log()
			for name, item in supplied_items.items():
				frappe.db.set_value("Purchase Order Item Supplied", name, item)

			# Update reserved sub contracted quantity in bin based on Supplied Item Details and
			for d in self.get("items"):
				item_code = d.get("original_item") or d.get("item_code")
				reserve_warehouse = item_wh.get(item_code)
				if not (reserve_warehouse and item_code):
					continue
				stock_bin = get_bin(item_code, reserve_warehouse)
				stock_bin.update_reserved_qty_for_sub_contracting()

		if not self.purchase_order and (
			self.purpose in ["Send to Subcontractor", "Material Transfer"] or self.is_return
		):
			console("enter in multiplclass").log()

			# # Get PO Supplied Items Details
			# item_wh = frappe._dict(
			# 	frappe.db.sql(
			# 		"""
			# 	select rm_item_code, reserve_warehouse
			# 	from `tabPurchase Order` po, `tabPurchase Order Item Supplied` poitemsup
			# 	where po.name = poitemsup.parent
			# 	and po.name = %s""",
			# 		self.purchase_order,
			# 	)
			# )

			# supplied_items = get_supplied_items(self.purchase_order)
			# console("supplied_items.items()",supplied_items.items()).log()
			# for name, item in supplied_items.items():
			# 	frappe.db.set_value("Purchase Order Item Supplied", name, item)

			# Update reserved sub contracted quantity in bin based on Supplied Item Details and
			for d in self.get("items"):
				if not d.po_detail:
					continue

				# Get PO Supplied Items Details
				item_wh = frappe._dict(
					frappe.db.sql(
						"""
					select rm_item_code, reserve_warehouse
					from `tabPurchase Order` po, `tabPurchase Order Item Supplied` poitemsup
					where po.name = poitemsup.parent
					and poitemsup.name = %s""",
						d.po_detail,
					)
				)
				console("po det",d.po_detail).log()
				supplied_items = custom_get_supplied_items(d.po_detail)
				console("supplied_items.items()",supplied_items.items()).log()
				for name, item in supplied_items.items():
					frappe.db.set_value("Purchase Order Item Supplied", name, item)

				item_code = d.get("original_item") or d.get("item_code")
				reserve_warehouse = item_wh.get(item_code)
				if not (reserve_warehouse and item_code):
					continue
				stock_bin = get_bin(item_code, reserve_warehouse)
				stock_bin.update_reserved_qty_for_sub_contracting()

def custom_get_supplied_items(po_detail):
    
	# purchase_order = "f373cd5a9a"
	# SQL query to fetch the data
	query = """
		SELECT
			`tabStock Entry Detail`.`transfer_qty`,
			`tabStock Entry`.`is_return`,
			`tabStock Entry Detail`.`po_detail`,
			`tabStock Entry Detail`.`item_code`
		FROM
			`tabStock Entry Detail`
		JOIN
			`tabStock Entry` ON `tabStock Entry`.`name` = `tabStock Entry Detail`.`parent`
		WHERE
			`tabStock Entry`.`docstatus` = 1
			AND `tabStock Entry Detail`.`po_detail` = %s;
	"""
	console("po",po_detail).log()
	# Execute the query
	results = frappe.db.sql(query, po_detail, as_dict=True)

	# Initialize the dictionary to store the results
	supplied_item_details = {}

	# Process the rows returned from the query
	for row in results:
		console("ROW",row).log()
		if not row.po_detail:
			continue
		
		key = row.po_detail
		if key not in supplied_item_details:
			supplied_item_details.setdefault(
				key, frappe._dict({"supplied_qty": 0, "returned_qty": 0, "total_supplied_qty": 0})
			)

		supplied_item = supplied_item_details[key]

		# Update quantities based on whether the entry is a return
		if row.is_return:
			supplied_item.returned_qty += row.transfer_qty
		else:
			supplied_item.supplied_qty += row.transfer_qty

		# Update total supplied quantity
		supplied_item.total_supplied_qty = flt(supplied_item.supplied_qty) - flt(supplied_item.returned_qty)

	return supplied_item_details

# class StockEntry(StockController):
#     # def on_submit(self):
#     def validate(self):
#         def update_purchase_order_supplied_items(self):
#             if not self.purchase_order and (
#                 self.purpose in ["Send to Subcontractor", "Material Transfer"] or self.is_return
#             ):

#                 # # Get PO Supplied Items Details
#                 # item_wh = frappe._dict(
#                 # 	frappe.db.sql(
#                 # 		"""
#                 # 	select rm_item_code, reserve_warehouse
#                 # 	from `tabPurchase Order` po, `tabPurchase Order Item Supplied` poitemsup
#                 # 	where po.name = poitemsup.parent
#                 # 	and po.name = %s""",
#                 # 		self.purchase_order,
#                 # 	)
#                 # )

#                 # supplied_items = get_supplied_items(self.purchase_order)
#                 # console("supplied_items.items()",supplied_items.items()).log()
#                 # for name, item in supplied_items.items():
#                 # 	frappe.db.set_value("Purchase Order Item Supplied", name, item)

#                 # Update reserved sub contracted quantity in bin based on Supplied Item Details and
#                 for d in self.get("items"):
#                     if not d.po_detail:
#                         continue
            
#                     # Get PO Supplied Items Details
#                     item_wh = frappe._dict(
#                         frappe.db.sql(
#                             """
#                         select rm_item_code, reserve_warehouse
#                         from `tabPurchase Order` po, `tabPurchase Order Item Supplied` poitemsup
#                         where po.name = poitemsup.parent
#                         and poitemsup.name = %s""",
#                             d.po_detail,
#                         )
#                     )
#                     supplied_items = get_supplied_items(d.po_detail)
#                     console("supplied_items.items()",supplied_items.items()).log()
#                     for name, item in supplied_items.items():
#                         frappe.db.set_value("Purchase Order Item Supplied", name, item)

#                     item_code = d.get("original_item") or d.get("item_code")
#                     reserve_warehouse = item_wh.get(item_code)
#                     if not (reserve_warehouse and item_code):
#                         continue
#                     stock_bin = get_bin(item_code, reserve_warehouse)
#                     stock_bin.update_reserved_qty_for_sub_contracting()


#         def get_supplied_items(po_details):
#             # purchase_order = "f373cd5a9a"
#             # SQL query to fetch the data
#             query = """
#                 SELECT
#                     `tabStock Entry Detail`.`transfer_qty`,
#                     `tabStock Entry`.`is_return`,
#                     `tabStock Entry Detail`.`po_detail`,
#                     `tabStock Entry Detail`.`item_code`
#                 FROM
#                     `tabStock Entry Detail`
#                 JOIN
#                     `tabStock Entry` ON `tabStock Entry`.`name` = `tabStock Entry Detail`.`parent`
#                 WHERE
#                     `tabStock Entry`.`docstatus` = 1
#                     AND `tabStock Entry Detail`.`po_detail` = %s;
#             """
            
#             # Execute the query
#             results = frappe.db.sql(query, po_details, as_dict=True)

#             # Initialize the dictionary to store the results
#             supplied_item_details = {}

#             # Process the rows returned from the query
#             for row in results:
#                 console("ROW",row).log()
#                 if not row.po_detail:
#                     continue
                
#                 key = row.po_detail
#                 if key not in supplied_item_details:
#                     supplied_item_details.setdefault(
#                         key, frappe._dict({"supplied_qty": 0, "returned_qty": 0, "total_supplied_qty": 0})
#                     )

#                 supplied_item = supplied_item_details[key]

#                 # Update quantities based on whether the entry is a return
#                 if row.is_return:
#                     supplied_item.returned_qty += row.transfer_qty
#                 else:
#                     supplied_item.supplied_qty += row.transfer_qty

#                 # Update total supplied quantity
#                 supplied_item.total_supplied_qty = flt(supplied_item.supplied_qty) - flt(supplied_item.returned_qty)

#             return supplied_item_details



# # stock_entry.update_purchase_order_supplied_items = custom_update_purchase_order_supplied_items