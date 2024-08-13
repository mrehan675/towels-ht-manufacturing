import json
from console import console #custom call of app for checking purpose
import frappe
from frappe import _, msgprint





@frappe.whitelist()
def make_rm_stock_entry(purchase_order, items):
	console("hdddddddddddd").log()
	console("purchase_order",purchase_order).log()
	console("items",items).log()


	rm_items = get_supplied_items(purchase_order)
	
	rm_items_list = rm_items

	# rm_items_list = rm_items

	if isinstance(rm_items, str):
		rm_items_list = json.loads(rm_items)
	elif not rm_items:
		frappe.throw(_("No Items available for transfer"))

	if isinstance(items, str):
		grn_items_list = json.loads(items)
		
	elif not grn_items_list:
		frappe.throw(_("No Items available for transfer"))

	if rm_items_list:
		fg_items = list(set(d["rm_item_code"] for d in rm_items_list))
	else:
		frappe.throw(_("No Items selected for transfer"))

	if purchase_order:
		purchase_order = frappe.get_doc("Purchase Order", purchase_order)

	if fg_items:
		items = tuple(set(d["rm_item_code"] for d in rm_items_list))
		item_wh = get_item_details(items)

		stock_entry = frappe.new_doc("Stock Entry")
		stock_entry.purpose = "Send to Subcontractor"
		stock_entry.purchase_order = purchase_order.name
		stock_entry.supplier = purchase_order.supplier
		stock_entry.supplier_name = purchase_order.supplier_name
		stock_entry.supplier_address = purchase_order.supplier_address
		stock_entry.address_display = purchase_order.address_display
		stock_entry.company = purchase_order.company
		stock_entry.to_warehouse = purchase_order.supplier_warehouse
		stock_entry.dn_type = "Stock Yarn Dying"
		stock_entry.set_stock_entry_type()

		for item_code in fg_items:
			for rm_item_data in rm_items_list:
				if rm_item_data["rm_item_code"] == item_code:
					rm_item_code = rm_item_data["rm_item_code"]
					
					
					matching_item = next((item for item in grn_items_list if item["item_code"] == rm_item_code), None)
					qty = 0
					console("matching_item",matching_item).log()
					# if matching_item:
					# 	console("if pass matching-item").log()
					# 	qty = matching_item.get("qty", 0)
					# 	console("qty",qty).log()
					# 	items_dict = {
                    #     "item_code": rm_item_code,
                    #     "po_detail": rm_item_data.get("name"),
                    #     "item_name": item_wh.get(rm_item_code, {}).get("item_name", ""),
                    #     "description": item_wh.get(rm_item_code, {}).get("description", ""),
                    #     "qty": qty,
                    #     "s_warehouse": rm_item_data["reserve_warehouse"],
					# 	"t_warehouse": "GHafoor Bhai Weaving Service - HT_SB",
                    #     "stock_uom": rm_item_data["stock_uom"],
                    #     "subcontracted_item": rm_item_data["main_item_code"],
                    #     "allow_alternative_item": item_wh.get(rm_item_code, {}).get("allow_alternative_item"),
                    # }
					# stock_entry.append("items", items_dict)

					if matching_item:
						console("Matching item found", matching_item).log()
						qty = matching_item.get("qty", 0)

						if qty > 0:
							items_dict = {
								"item_code": rm_item_code,
								"po_detail": rm_item_data.get("name"),
								"item_name": item_wh.get(rm_item_code, {}).get("item_name", ""),
								"description": item_wh.get(rm_item_code, {}).get("description", ""),
								"qty": qty,
								"s_warehouse": rm_item_data["reserve_warehouse"],
								"t_warehouse": "GHafoor Bhai Weaving Service - HT_SB",
								"stock_uom": rm_item_data["stock_uom"],
								"subcontracted_item": rm_item_data["main_item_code"],
								"allow_alternative_item": item_wh.get(rm_item_code, {}).get("allow_alternative_item"),
							}
							stock_entry.append("items", items_dict)
							update_supplied_qty(rm_item_data["name"], qty)
					else:
						frappe.throw(_("No matching item found for item_code {} in Purchase Order").format(rm_item_code))

					# else:
					# 	qty = 0
					# items_dict = {
					# 	rm_item_code: {
					# 		"po_detail": rm_item_data.get("name"),
					# 		"item_name": rm_item_data["item_name"],
					# 		"description": item_wh.get(rm_item_code, {}).get("description", ""),
					# 		"qty": rm_item_data["qty"],
					# 		"from_warehouse": rm_item_data["warehouse"],
					# 		"stock_uom": rm_item_data["stock_uom"],
					# 		"serial_no": rm_item_data.get("serial_no"),
					# 		"batch_no": rm_item_data.get("batch_no"),
					# 		"main_item_code": rm_item_data["item_code"],
					# 		"allow_alternative_item": item_wh.get(rm_item_code, {}).get("allow_alternative_item"),
					# 	}
					# }
					# items_dict = {
                    #     "item_code": rm_item_code,
                    #     "po_detail": rm_item_data.get("name"),
                    #     "item_name": item_wh.get(rm_item_code, {}).get("item_name", ""),
                    #     "description": item_wh.get(rm_item_code, {}).get("description", ""),
                    #     "qty": qty,
                    #     "s_warehouse": rm_item_data["reserve_warehouse"],
					# 	"t_warehouse": "GHafoor Bhai Weaving Service - HT_SB",
                    #     "stock_uom": rm_item_data["stock_uom"],
                    #     "subcontracted_item": rm_item_data["main_item_code"],
                    #     "allow_alternative_item": item_wh.get(rm_item_code, {}).get("allow_alternative_item"),
                    # }
					# stock_entry.append("items", items_dict)
		
		stock_entry.insert()
		frappe.db.commit()

		
			
		return stock_entry.as_dict()
	else:
		frappe.throw(_("No Items selected for transfer"))
	return purchase_order.name


def get_supplied_items(purchase_order):
    # Query to fetch supplied items based on the purchase order number
    supplied_items = frappe.db.sql("""
        SELECT
		
            po_item.main_item_code,
            po_item.required_qty,
            po_item.reserve_warehouse,
            po_item.stock_uom,
            po_item.name,
            po_item.rm_item_code
        FROM
            `tabPurchase Order Item Supplied` po_item
        WHERE
            po_item.parent = %s
    """, purchase_order, as_dict=1)

    return supplied_items


def get_item_details(items):
	item_details = {}
	for d in frappe.db.sql(
		"""select item_code, description, allow_alternative_item from `tabItem`
		where name in ({0})""".format(
			", ".join(["%s"] * len(items))
		),
		items,
		as_dict=1,
	):
		item_details[d.item_code] = d

	return item_details






def update_supplied_qty(po_detail, qty):
    # Fetch current supplied_qty
    current_supplied_qty = frappe.db.get_value("Purchase Order Item Supplied", po_detail, "supplied_qty") or 0
    # Add the new qty to the current supplied_qty
    new_supplied_qty = current_supplied_qty + qty
    # Update the supplied_qty in the Purchase Order Item Supplied table
    frappe.db.set_value("Purchase Order Item Supplied", po_detail, "supplied_qty", new_supplied_qty)
    frappe.db.commit()







#Purchase Order Item Table
# @frappe.whitelist()
# def fetch_yarn_items(job_no, purchase_type,supplier):
#     raw_list = []
    
#     raw_list = frappe.db.sql(""" 
#         SELECT
#             po_it.parent AS po_name,
#             po.transaction_date AS po_date,
#             po_it.item_code AS yarn_item,
#             po_it.brand,
#             po_it.qty,
#             po_it.received_qty,
#             po_it.rate AS rate_per_10lbs
#         FROM
#             `tabPurchase Order Item` AS po_it
#         JOIN
#             `tabPurchase Order` AS po
#         ON
#             po.name = po_it.parent
#         WHERE
#             po_it.parent = %s
#     """, (po_order_no,), as_dict=1)

#     return raw_list






@frappe.whitelist()
def fetch_yarn_items(job_no, purchase_type, supplier):
    raw_list = []
    
    raw_list = frappe.db.sql(""" 
        SELECT
			po.name AS purchase_order,
			po_it.name AS item_row_name,
            po_it.parent AS po_name,
            po.transaction_date AS po_date,
            po_it.item_code AS item_code,
			po_it.item_name As item_name,
			po_it.description As description,
            po_it.brand,
            po_it.qty,
            po_it.received_qty,
            po_it.rate AS rate_per_10lbs
        FROM
            `tabPurchase Order Item` AS po_it
        JOIN
            `tabPurchase Order` AS po
        ON
            po.name = po_it.parent
        WHERE
            po.job_number = %s AND
            po.purchase_type = %s AND
            po.supplier = %s
    """, (job_no, purchase_type, supplier), as_dict=1)


    return raw_list


@frappe.whitelist()
def fetch_weave_items(job_no, purchase_type, supplier):
    raw_list = []
    
    raw_list = frappe.db.sql(""" 
        SELECT
			po.name AS purchase_order,
			po_it.name AS item_row_name,
            po_it.parent AS po_name,
            po.transaction_date AS po_date,
            po_it.item_code AS item_code,
			po_it.item_name As item_name,
			po_it.description As description,
			po_it.received_qty,
			po_it.qty,			
            po_it.fancy,
			po_it.greigh_weigh_unit,
			po_it.finish_weight_unit
            
           
            
        FROM
            `tabPurchase Order Item` AS po_it
        JOIN
            `tabPurchase Order` AS po
        ON
            po.name = po_it.parent
        WHERE
            po.job_number = %s AND
            po.purchase_type = %s AND
            po.supplier = %s
    """, (job_no, purchase_type, supplier), as_dict=1)


    return raw_list




@frappe.whitelist()
def fetch_accessories_items(job_no, purchase_type, supplier):
    raw_list = []
    
    raw_list = frappe.db.sql(""" 
        SELECT
			po.name AS purchase_order,
			po_it.name AS item_row_name,
            po_it.parent AS po_name,
            po.transaction_date AS po_date,
            po_it.item_code AS item_code,
			po_it.item_name As item_name,
			po_it.description As description,
			po_it.job_no,
			po_it.category,
			po_it.uom,	
			po_it.received_qty,
			po_it.qty		
            
            
           
            
        FROM
            `tabPurchase Order Item` AS po_it
        JOIN
            `tabPurchase Order` AS po
        ON
            po.name = po_it.parent
        WHERE
            po.job_number = %s AND
            po.purchase_type = %s AND
            po.supplier = %s
    """, (job_no, purchase_type, supplier), as_dict=1)


    return raw_list


@frappe.whitelist()
def fetch_yarn_dying_items(job_no, purchase_type, supplier):
    raw_list = []
    
    raw_list = frappe.db.sql(""" 
        SELECT
			po.name AS purchase_order,
			po_it.name AS item_row_name,
            po_it.parent AS po_name,
            po.transaction_date AS po_date,
            po_it.item_code AS item_code,
			po_it.item_name As item_name,
			po_it.description As description,
			po_it.job_no,						 
			po_it.uom,	
			po_it.received_qty,
			po_it.qty,
			po_it.rate,
			po_it.color		
            
            
           
            
        FROM
            `tabPurchase Order Item` AS po_it
        JOIN
            `tabPurchase Order` AS po
        ON
            po.name = po_it.parent
        WHERE
            po.job_number = %s AND
            po.purchase_type = %s AND
            po.supplier = %s
    """, (job_no, purchase_type, supplier), as_dict=1)


    return raw_list




















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
        
#         frappe.log_error(message=f"Filters received - register_type: {register_type}, receipt_type: {receipt_type}", title="Filter User Query Parameters")

#         results = frappe.db.sql("""
#             SELECT
#                 register_name,name
#             FROM
#                 `tabRegister`
#             WHERE
#                 docstatus < 2
#                 AND register_type = %(register_type)s
#                 AND receipt_type = %(receipt_type)s
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
        
#         frappe.log_error(message=f"Results returned: {results}", title="Filter User Query Results")
        
#         return results
    
#     except frappe.DoesNotExistError as e:
#         frappe.log_error(message=str(e), title="Filter User Query Error")
#         return []
