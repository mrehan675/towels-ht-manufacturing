# In your custom app (e.g., ht/ht/utils/sales_order.py)
import frappe
from frappe import _



# @frappe.whitelist()
# def change_docstatus_to_draft(docname):
#     # Check if the document exists
#     doc = frappe.get_doc("Sales Order", docname)

#     # Check if the document is submitted
#     if doc.docstatus == 1:
#         # Change the document status to Draft directly using the database
#         frappe.db.set_value("Sales Order", docname, "docstatus", 0)
        
#         # Optionally, you may want to perform any additional updates or validations here
#         return _("Document has been changed to Draft.")
#     else:
#         return _("Document is already in Draft state.")
    
    

@frappe.whitelist()
def change_docstatus_to_draft(docname, doctype):
    # Check if the document exists
    doc = frappe.get_doc(doctype, docname)

    # Check if the document is submitted
    if doc.docstatus == 1:
        # Change the document status to Draft directly using the database
        frappe.db.set_value(doctype, docname, "docstatus", 0)

        # Optionally, you may want to perform any additional updates or validations here
        return _("Document has been changed to Draft.")
    else:
        return _("Document is already in Draft state.")

