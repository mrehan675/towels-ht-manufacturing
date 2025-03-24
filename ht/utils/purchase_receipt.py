import json
from console import console 
import frappe
from frappe import _, msgprint
from frappe.utils import flt

from erpnext.stock import get_item_details

from erpnext.stock.get_item_details import process_args,get_price_list_currency_and_exchange_rate,apply_price_list_on_item,process_string_args,validate_item_details,get_basic_details,get_item_tax_template,get_item_tax_map,get_party_item_code,set_valuation_rate,update_party_blanket_order,get_price_list_rate,get_pos_profile_item_details,get_bin_details,get_pricing_rule_for_item,update_stock,get_default_bom,get_gross_profit
from six import iteritems, string_types
from frappe.utils import add_days, add_months, cint, cstr, flt, getdate




def update_brand_on_save(doc, method):
    if not doc.voucher_no or not doc.voucher_type:
        console("enter in stock").log()

        return  

    try:
        console("enter in stock").log()
        item_doc = frappe.get_doc(doc.voucher_type, doc.voucher_no)

        for item in item_doc.items:
            if item.item_code == doc.item_code:
                doc.brand = item.brand
                doc.save()
                break

    except frappe.DoesNotExistError:
        frappe.throw(f"Document {doc.voucher_type} {doc.voucher_no} does not exist.")
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Update Brand on Save Error")



@frappe.whitelist()
def custom_apply_price_list(args, as_doc=False):
    console("enter in custom apply price").log()
    """Apply pricelist on a document-like dict object and return as
    {'parent': dict, 'children': list}

    :param args: See below
    :param as_doc: Updates value in the passed dict

            args = {
                    "doctype": "",
                    "name": "",
                    "items": [{"doctype": "", "name": "", "item_code": "", "brand": "", "item_group": ""}, ...],
                    "conversion_rate": 1.0,
                    "selling_price_list": None,
                    "price_list_currency": None,
                    "price_list_uom_dependant": None,
                    "plc_conversion_rate": 1.0,
                    "doctype": "",
                    "name": "",
                    "supplier": None,
                    "transaction_date": None,
                    "conversion_rate": 1.0,
                    "buying_price_list": None,
                    "ignore_pricing_rule": 0/1
            }
    """

    args = process_args(args)

    parent = get_price_list_currency_and_exchange_rate(args)
    args.update(parent)

    children = []

    if "items" in args:
        item_list = args.get("items")
        args.update(parent)

        for item in item_list:
            args_copy = frappe._dict(args.copy())
            args_copy.update(item)

            item_details = apply_price_list_on_item(args_copy)

            # Custom work: Remove the rate field if it exists
            if args.get("doctype") == "Purchase Receipt":
                if "rate" in item_details:
                    console("apply newww").log()
                    frappe.logger().info(f"Removing rate from item details: {item_details}")
                    item_details.pop("rate")
                if "price_list_rate" in item_details:
                    console("apply price_list_rate").log()
                    frappe.logger().info(f"Removing price_list_rate from item details: {item_details}")
                    item_details.pop("price_list_rate")                 
                
                if "uom" in item_details:
                    console("uom").log()
                    frappe.logger().info(f"Removing uom from item details: {item_details}")
                    item_details.pop("uom")                 

                if "brand" in args:
                    console("brand").log()
                    frappe.logger().info(f"Removing brand from item details: {item_details}")
                    item_details.pop("brand")                 

            children.append(item_details)

    if as_doc:
        args.price_list_currency = (parent.price_list_currency,)
        args.plc_conversion_rate = parent.plc_conversion_rate
        if args.get("items"):
            for i, item in enumerate(args.get("items")):
                for fieldname in children[i]:
                    # If the field exists in the original doc, update the value
                    if fieldname in item and fieldname not in ("name", "doctype"):
                        item[fieldname] = children[i][fieldname]
        return args
    else:
        return {"parent": parent, "children": children}

# get_item_details.apply_price_list = apply_price_list
@frappe.whitelist()
def custom_get_item_details(args, doc=None, for_validate=False, overwrite_warehouse=True):
    console("enter in custom get item details").log()
    """
    args = {
            "item_code": "",
            "warehouse": None,
            "customer": "",
            "conversion_rate": 1.0,
            "selling_price_list": None,
            "price_list_currency": None,
            "plc_conversion_rate": 1.0,
            "doctype": "",
            "name": "",
            "supplier": None,
            "transaction_date": None,
            "conversion_rate": 1.0,
            "buying_price_list": None,
            "is_subcontracted": "Yes" / "No",
            "ignore_pricing_rule": 0/1
            "project": ""
            "set_warehouse": ""
    }
    """

    args = process_args(args)
    for_validate = process_string_args(for_validate)
    overwrite_warehouse = process_string_args(overwrite_warehouse)
    item = frappe.get_cached_doc("Item", args.item_code)
    validate_item_details(args, item)

    out = get_basic_details(args, item, overwrite_warehouse)

    if isinstance(doc, string_types):
        doc = json.loads(doc)

    if doc and doc.get("doctype") == "Purchase Invoice":
        args["bill_date"] = doc.get("bill_date")

    if doc:
        args["posting_date"] = doc.get("posting_date")
        args["transaction_date"] = doc.get("transaction_date")

    get_item_tax_template(args, item, out)
    out["item_tax_rate"] = get_item_tax_map(
        args.company,
        args.get("item_tax_template")
        if out.get("item_tax_template") is None
        else out.get("item_tax_template"),
        as_json=True,
    )

    get_party_item_code(args, item, out)

    set_valuation_rate(out, args)

    update_party_blanket_order(args, out)

    # Custom work
    # out.update(get_price_list_rate(args, item))
    if args.customer and cint(args.is_pos):
        out.update(get_pos_profile_item_details(args.company, args, update_data=True))

    if (
        args.get("doctype") == "Material Request"
        and args.get("material_request_type") == "Material Transfer"
    ):
        out.update(get_bin_details(args.item_code, args.get("from_warehouse")))

    elif out.get("warehouse"):
        if doc and doc.get("doctype") == "Purchase Order":
            # calculate company_total_stock only for po
            bin_details = get_bin_details(args.item_code, out.warehouse, args.company)
        else:
            bin_details = get_bin_details(args.item_code, out.warehouse)

        out.update(bin_details)

    # update args with out, if key or value not exists
    for key, value in iteritems(out):
        if args.get(key) is None:
            args[key] = value

    data = get_pricing_rule_for_item(args, out.price_list_rate, doc, for_validate=for_validate)

    out.update(data)

    update_stock(args, out)

    if args.transaction_date and item.lead_time_days:
        out.schedule_date = out.lead_time_date = add_days(args.transaction_date, item.lead_time_days)

    if args.get("is_subcontracted") == "Yes":
        out.bom = args.get("bom") or get_default_bom(args.item_code)

    get_gross_profit(out)
    if args.doctype == "Material Request":
        out.rate = args.rate or out.price_list_rate
        out.amount = flt(args.qty) * flt(out.rate)

    # Custom work for Purchase Receipt
    if args.get("doctype") == "Purchase Receipt":
        console("Doctype Check",args.get("doctype")).log()
        if "price_list_rate" in out:
            console("price_list_rate", out).log()
            out.pop("price_list_rate")

        # Ensure custom rate logic
        if "rate" in args:
            console("rate").log()
            out.pop("rate")
        if "last_purchase_rate" in args:
            console("last_purchase_rate").log()
            out.pop("last_purchase_rate")

        if "uom" in args:
            console("uom").log()
            out.pop("uom")
        
        if "brand" in args:
            console("brand").log()
            out.pop("brand")
        

    return out


get_item_details.get_item_details = custom_get_item_details


@frappe.whitelist()
def set_child_itemlist(pr_name):
    print("pr_name", pr_name)
    if pr_name:
        print("pass first if")
        
        # Fetch the Purchase Receipt document using the correct doctype and name
        item_doc = frappe.get_doc("Purchase Receipt", pr_name)  # Assuming "Purchase Receipt" is the correct DocType
        
        if item_doc:
            print("pass second if")
            # Assuming you are accessing the child table called 'items' in the Purchase Receipt
            item_code_list = [d.item_code for d in item_doc.items]
            print("item_code_list", item_code_list)
            
            return item_code_list


def set_subcontracted_items(doc, method):
	if not doc.purchase_order:
		return

	# Fetch supplied items from the Purchase Order
	po_items = frappe.db.get_all('Purchase Order Item Supplied',
									filters={'parent': doc.purchase_order},
									fields=['main_item_code', 'rm_item_code'])

	console("po_item",po_items).log()
	console("po",doc.purchase_order).log()
	po_item_map = {item['rm_item_code']: item['main_item_code'] for item in po_items}

	console("po_item_map",po_item_map).log()

	for item in doc.items:
		console("enter i item").log()
		# Match the item_code in the Purchase Receipt with the Purchase Order's supplied items
		if item.item_code in po_item_map:
			console("pass").log()
			item.subcontracted_item = po_item_map[item.item_code]
    

@frappe.whitelist()
def make_rm_stock_entry(purchase_order, items, purchase_receipt):
    # Parse items JSON into a Python object
    items = json.loads(items) if isinstance(items, str) else items

    if not items or not purchase_order:
        frappe.throw(_("No items or purchase order found for Stock Entry creation."))

    # Fetch the Purchase Receipt document
    purchase_receipt_doc = frappe.get_doc("Purchase Receipt", purchase_receipt)

    # Validate that supplier_warehouse and set_warehouse fields are present
    if not purchase_receipt_doc.supplier_warehouse or not purchase_receipt_doc.set_warehouse:
        frappe.throw(_("Supplier Warehouse or Target Warehouse is missing in the Purchase Receipt."))

    # Log received data for debugging
    frappe.log_error(f"Received purchase_order: {purchase_order}")
    frappe.log_error(f"Received items: {items}")

    # Process and create a single Stock Entry
    stock_entry = frappe.new_doc("Stock Entry")
    stock_entry.purpose = "Send to Subcontractor"
    stock_entry.stock_entry_type = "Send to Subcontractor"
    stock_entry.purchase_receipt = purchase_receipt
    stock_entry.supplier = purchase_receipt_doc.stock_supplier_
    stock_entry.supplier_name = purchase_receipt_doc.stock_supplier_
    stock_entry.company = purchase_receipt_doc.company
    stock_entry.dn_type = "Stock Yarn Dying"
    
    stock_entry.set_stock_entry_type()

    # Add consolidated items
    for item in items:
        console("alternate",item.get("allow_alternate", [None])[0]).log()
        console("brand",item.get("brand", [None])[0]).log()

        stock_entry.append("items", {
            "item_code": item["item_code"],
            "qty": item["supplied_qty"],
            "brand": item.get("brand", [None])[0],
            # "s_warehouse": purchase_receipt_doc.supplier_warehouse,  # Access from Purchase Receipt doc
            # "t_warehouse": purchase_receipt_doc.set_warehouse,      # Access from Purchase Receipt doc
            "s_warehouse": item.get("source_warehouse", [None])[0], # Access from Purchase Receipt doc
            "t_warehouse": item.get("target_warehouse", [None])[0],     # Access from Purchase Receipt doc

            "stock_uom": item.get("stock_uom"),
            "subcontracted_item": item.get("parent_item_codes", [None])[0],
            "allow_alternative_item": item.get("allow_alternate", [None])[0],
            "po_detail": item.get("po_detail", [None])[0],
            "po_number": item.get("po_name", [None])[0],
        })

    # Save and commit the Stock Entry
    stock_entry.insert()
    # stock_entry.submit()  # Submit the Stock Entry
    frappe.db.commit()
    return stock_entry.as_dict()


def get_supplied_items(purchase_order):
    # Query to fetch supplied items based on the purchase order number
    supplied_items = frappe.db.sql("""
        SELECT
		
            po_item.main_item_code,
            po_item.required_qty,
            po_item.reserve_warehouse,
            po_item.stock_uom,
            po_item.name,
            po_item.rm_item_code,
			po_item.name
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
    new_supplied_qty = float(current_supplied_qty) + float(qty)
    # Update the supplied_qty in the Purchase Order Item Supplied table
    frappe.db.set_value("Purchase Order Item Supplied", po_detail, "supplied_qty", new_supplied_qty)
    frappe.db.commit()


@frappe.whitelist()
def fetch_yarn_items(purchase_type, supplier):
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
			po_it.rate,
            po_it.received_qty,
            po_it.rate AS rate_per_10lbs,
			po_it.bag_ctn,
			po_it.lbs_bag,
			po_it.uom,
            po_it.fancy
        FROM
            `tabPurchase Order Item` AS po_it
        JOIN
            `tabPurchase Order` AS po
        ON
            po.name = po_it.parent
        WHERE
            po.purchase_type = %s AND
            po.supplier = %s
    """, (purchase_type, supplier), as_dict=1)


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
			po_it.rate,	
            po_it.uom,
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
def fetch_supplied_items(stock_supplier, po_type,po_name_filter=None):
    console("Supplier", stock_supplier).log()
    console("Po type", po_type).log()
    console("Po type", po_name_filter).log()
    # po_name_filter = 'PUR-ORD-2025-00145'
    result = []

    if po_name_filter:
        # Fetch relevant Purchase Orders
        po_list = frappe.db.sql("""
            SELECT name, job_number
            FROM `tabPurchase Order`
            WHERE supplier = %s AND purchase_type = %s AND name = %s
            ORDER BY name
        """, (stock_supplier, po_type,po_name_filter), as_dict=True)

        console("PO List If", po_list).log()
    else:
        po_list = frappe.db.sql("""
            SELECT name, job_number
            FROM `tabPurchase Order`
            WHERE supplier = %s AND purchase_type = %s 
            ORDER BY name
        """, (stock_supplier, po_type), as_dict=True)

        console("PO List", po_list).log()

    if po_list:
        # Extract PO names and map job_no for each PO
        po_names = [po['name'] for po in po_list]
        po_job_map = {po['name']: po['job_number'] for po in po_list}

        # Fetch supplied items and include job_no in the result
        result = frappe.db.sql("""
            SELECT 
                si.*, si.name, po.job_number
            FROM 
                `tabPurchase Order Item Supplied` si
            JOIN 
                `tabPurchase Order` po ON si.parent = po.name
            WHERE 
                si.parent IN (%s)
        """ % ','.join(['%s'] * len(po_names)), tuple(po_names), as_dict=True)

        console("Result New",result).log()
        # # Attach job_no to each result item (if needed for further processing)
        # for row in result:
        #     row['job_no'] = po_job_map.get(row['parent'], None)

    return result


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
			po_it.qty,
			po_it.rate,
            po_it.fancy
            
            
           
            
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
			po_it.color,
            po_it.fancy
                     
                       
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
def fetch_dying_service_items(job_no, purchase_type, supplier):
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
			po_it.finish_weight,
			po_it.color,		
			po_it.qty_in_pcs,
            po_it.qty,
			po_it.received_qty,			
			po_it.rate,
            po_it.fancy
			
            
            
           
            
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
def fetch_bathrobe_items(job_no, purchase_type, supplier):
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
			po_it.finish_weight,
			po_it.cut_length,	
			po_it.color,		
			po_it.qty,				 
			po_it.received_qty,			
			po_it.rate,
            po_it.fancy
			
            
            
           
            
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
def update_direct_to_db(docname, auto_stock_check, stock_supplier, grn_item, po_type, source_warehouse, target_warehouse):
    doc = frappe.get_doc("Purchase Receipt", docname)
    
    # Disable automatic timestamp update
    doc.flags.ignore_validate_update_after_submit = True
    
    doc.auto_stock_transfer = auto_stock_check
    doc.stock_supplier_ = stock_supplier
    doc.grn_items = grn_item
    doc.po_types = po_type
    doc.source_warehouse_ = source_warehouse
    doc.target_warehouse = target_warehouse

    # Save without changing 'modified' timestamp
    frappe.db.set_value("Purchase Receipt", docname, {
        "auto_stock_transfer": auto_stock_check,
        "stock_supplier_": stock_supplier,
        "grn_items": grn_item,
        "po_types": po_type,
        "source_warehouse_": source_warehouse,
        "target_warehouse": target_warehouse
    }, update_modified=False)

    return {"message": "Record updated successfully"}

