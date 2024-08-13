import json
from console import console  # Custom call of app for checking purpose
import frappe
from frappe import _, msgprint

@frappe.whitelist()
def make_warehouse_entry(supplier_name,parent_warehouse=None):
    console("hdddddddddddd").log()
    console("supplier_name", supplier_name).log()

    if supplier_name:
        warehouse_entry = frappe.new_doc("Warehouse")
        warehouse_entry.warehouse_name = supplier_name
        warehouse_entry.parent_warehouse = parent_warehouse
        
        # Insert the new Warehouse entry
        warehouse_entry.insert()
        frappe.db.commit()

        return warehouse_entry.name
    else:
        frappe.throw(_("No Supplier selected for Warehouse"))
