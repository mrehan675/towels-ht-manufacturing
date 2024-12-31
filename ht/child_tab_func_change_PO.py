import json
from console import console
import frappe
from frappe import _, scrub
from frappe.utils import cint, flt, round_based_on_smallest_currency_fraction

import erpnext
from erpnext.accounts.doctype.journal_entry.journal_entry import get_exchange_rate
from erpnext.accounts.doctype.pricing_rule.utils import get_applied_pricing_rules
from erpnext.controllers.accounts_controller import (
	validate_conversion_rate,
	validate_inclusive_tax,
	validate_taxes_and_charges,
)
from erpnext.buying.utils import check_on_hold_or_closed_status, validate_for_items

from erpnext.stock.get_item_details import _get_item_tax_template

from erpnext.controllers.taxes_and_totals import calculate_taxes_and_totals  #import class for Yarn PO work
from erpnext.buying.doctype.purchase_order.purchase_order import PurchaseOrder # fetching class for work of weaving subcontracting for Raw material (supplied_items)

from erpnext.accounts.doctype.sales_invoice.sales_invoice import (
	unlink_inter_company_doc,
	update_linked_doc,
	validate_inter_company_party,
)

#import get_site_name method
from frappe.utils import get_site_name





#Overriding exisiting returned qty against Purchase receipt
def custom_get_returned_qty_map(purchase_receipt):
    console("enter in my custom app mee").log()
    """Custom version of get_returned_qty_map"""
    returned_qty_map = frappe._dict(
        frappe.db.sql(
            """select pr_item.purchase_receipt_item, sum(abs(pr_item.qty)) as qty
            from `tabPurchase Receipt Item` pr_item, `tabPurchase Receipt` pr
            where pr.name = pr_item.parent
                and pr.docstatus = 1
                and pr.is_return = 1
                and pr.return_against = %s
            """,
            purchase_receipt,
        )
    )
    frappe.log_error(message=returned_qty_map, title="Returned Quantity Map")
    return returned_qty_map

# Monkey patch
from erpnext.stock.doctype.purchase_receipt import purchase_receipt
purchase_receipt.get_returned_qty_map = custom_get_returned_qty_map


def calculate_item_values(self):
	console("Checking right method").log()

	#get the site_name
	site_name = get_site_name(frappe.local.request.host)

		
	#check site url
	if site_name == 'ht.sandbox.srp.ai':
		console("checking site url", site_name).log()


		if self.doc.get("is_consolidated"):
			return

		if not self.discount_amount_applied:
			for item in self.doc.get("items"):
				self.doc.round_floats_in(item)

				if item.discount_percentage == 100:
					item.rate = 0.0
				elif item.price_list_rate:
					if not item.rate or (item.pricing_rules and item.discount_percentage > 0):
						item.rate = flt(
							item.price_list_rate * (1.0 - (item.discount_percentage / 100.0)), item.precision("rate")
						)

						item.discount_amount = item.price_list_rate * (item.discount_percentage / 100.0)

					elif item.discount_amount and item.pricing_rules:
						item.rate = item.price_list_rate - item.discount_amount

				if item.doctype in [
					"Purchase Order Item",
					"Purchase Receipt Item",
				]:
					item.rate_with_margin, item.base_rate_with_margin = self.calculate_margin(item)
					if flt(item.rate_with_margin) > 0:
						item.rate = flt(
							item.rate_with_margin * (1.0 - (item.discount_percentage / 100.0)), item.precision("rate")
						)

						if item.discount_amount and not item.discount_percentage:
							item.rate = item.rate_with_margin - item.discount_amount
						else:
							item.discount_amount = item.rate_with_margin - item.rate

					elif flt(item.price_list_rate) > 0:
						item.discount_amount = item.price_list_rate - item.rate
				elif flt(item.price_list_rate) > 0 and not item.discount_amount:
					item.discount_amount = item.price_list_rate - item.rate

				item.net_rate = item.rate

				if not item.qty and self.doc.get("is_return"):
					item.amount = flt(-1 * item.rate, item.precision("amount"))
				elif not item.qty and self.doc.get("is_debit_note"):
					item.amount = flt(item.rate, item.precision("amount"))
				else:
					

					if item.doctype in ["Purchase Order Item"] or item.doctype in ["Purchase Receipt Item"] :
						console("Item Purchase Type",item.doctype).log()
						
						if item.purchase_type == 'Yarn Purchase' or item.purchase_type == 'Yarn Purchase Receipt':
							console("Item Purchase Type",item.purchase_type).log()
							console("if doc").log()
						
							item.amount = flt(item.qty / 10 * item.rate, item.precision("amount"))

						
						elif item.purchase_type == 'Weaving Service' or item.purchase_type == 'Weaving Purchase Receipt':
							if item.weight_type == 'Lower Weight':
								
								item.amount = flt( (flt(item.greigh_weigh_unit)/1000) * item.qty * 2.2046 * item.rate)
							if item.weight_type == 'Greigh Weight':
								
								item.amount = flt( (flt(item.greigh_weigh_unit)/1000) * item.qty * 2.2046 * item.rate)

							if item.weight_type == 'Finish Weight':
							
								item.amount = flt( (flt(item.finish_weight_unit)/1000) * item.qty * 2.2046 * item.rate)

							
							else:
								pass
							
						elif item.purchase_type == 'Dying Service' or item.purchase_type == 'Dying Purchase Receipt':
							item.amount = flt((item.qty) * (flt(item.finish_weight_unit)/1000) * (2.2046) * (item.rate),item.precision("amount")) 

						#PO Amount=Qty in Pcs*(Finish Weight/1000)*2.2046*Rate
						
						else:
							
							item.amount = flt(item.rate * item.qty, item.precision("amount"))

				item.net_amount = item.amount

				self._set_in_company_currency(
					item, ["price_list_rate", "rate", "net_rate", "amount", "net_amount"]
				)

				item.item_tax_amount = 0.0


calculate_taxes_and_totals.calculate_item_values = calculate_item_values


#Working of Weaving PO to changed BOM flow to our flow 
def validate(self):
		console("Validat function").log()

		#get the site_name
		site_name = get_site_name(frappe.local.request.host)

		
		if site_name == 'ht.sandbox.srp.ai':
			console("checking Validate", site_name).log()


			super(PurchaseOrder, self).validate()

			self.set_status()

			# apply tax withholding only if checked and applicable
			self.set_tax_withholding()

			self.validate_supplier()
			self.validate_schedule_date()
			validate_for_items(self)
			self.check_on_hold_or_closed_status()

			self.validate_uom_is_integer("uom", "qty")
			self.validate_uom_is_integer("stock_uom", "stock_qty")

			self.validate_with_previous_doc()
			self.validate_for_subcontracting()
			self.validate_minimum_order_qty()
			# self.validate_bom_for_subcontracting_items()
			#self.create_raw_materials_supplied("supplied_items")
			self.set_received_qty_for_drop_ship_items()
			validate_inter_company_party(
				self.doctype, self.supplier, self.company, self.inter_company_order_reference
			)
			self.reset_default_field_value("set_warehouse", "items", "warehouse")

PurchaseOrder.validate = validate