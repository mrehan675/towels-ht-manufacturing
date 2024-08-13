# import frappe
# import json

# @frappe.whitelist()
# @frappe.validate_and_sanitize_search_inputs
# def filter_user(doctype, txt, searchfield, start, page_len, filters):


#     try:
#         if isinstance(filters, str):
#             filters = json.loads(filters)
        
#         register_type = filters.get('register_type')
#         receipt_type = filters.get('receipt_type')

#         return frappe.db.sql("""
#             SELECT
#                 register_name
#             FROM
#                 `tabRegister`
#             WHERE
#                 docstatus < 2
#                 AND (register_type = %(register_type)s)
#                 AND (receipt_type = %(receipt_type)s)
#                 AND ({key} LIKE %(txt)s OR register_name LIKE %(txt)s)
#             ORDER BY
#                 name ASC
#             LIMIT
#                 %(start)s, %(page_len)s
#         """.format(key=searchfield), {
#             'txt': "%%%s%%" % txt,
#             'start': start,
#             'page_len': page_len,
#             'register_type': register_type,
#             'receipt_type': receipt_type
#         })
    
#     except frappe.DoesNotExistError as e:
#         print(e)
#         return []


import frappe
import json

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def filter_user(doctype, txt, searchfield, start, page_len, filters):
    try:
        if isinstance(filters, str):
            filters = json.loads(filters)
        
        register_type = filters.get('register_type')
        receipt_type = filters.get('receipt_type')
        
        frappe.log_error(message=f"Filters received - register_type: {register_type}, receipt_type: {receipt_type}", title="Filter User Query Parameters")

        results = frappe.db.sql("""
            SELECT
                register_name,name
            FROM
                `tabRegister`
            WHERE
                docstatus < 2
                AND register_type = %(register_type)s
                AND receipt_type = %(receipt_type)s
                AND ({key} LIKE %(txt)s OR register_name LIKE %(txt)s)
            ORDER BY
                name ASC
            LIMIT
                %(start)s, %(page_len)s
        """.format(key=searchfield), {
            'txt': "%%%s%%" % txt,
            'start': start,
            'page_len': page_len,
            'register_type': register_type,
            'receipt_type': receipt_type
        })
        
        frappe.log_error(message=f"Results returned: {results}", title="Filter User Query Results")
        
        return results
    
    except frappe.DoesNotExistError as e:
        frappe.log_error(message=str(e), title="Filter User Query Error")
        return []
