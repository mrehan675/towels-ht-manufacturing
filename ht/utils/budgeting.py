import frappe

@frappe.whitelist()
def create_budgeting_entry(sales_order_name):
    sales_order = frappe.get_doc("Sales Order", sales_order_name)

    # Prepare the data dictionary to populate the form
    data = {
        "customer": sales_order.customer,
        "sales_order": sales_order.name,
        "shipment_date": sales_order.delivery_date,
        "currency": sales_order.currency,
        "order_receiving_date": sales_order.transaction_date,
        "us_dollar": sales_order.total,
        "exchange_rate": sales_order.conversion_rate,
        "total_amount_pkr": sales_order.base_total,
        "order_receiving_date": sales_order.po_date,
        "loom_type": sales_order.loom_type,
        "merchandiser_": sales_order.merchandiser_,
        "work_order": sales_order.po_no,
        "budgeting_item": [],
        "rawmaterial_yarn_items": [],
        "parent_item_tab": []
    }

    # Populate Budgeting Items table
    for item in sales_order.items:
        data["budgeting_item"].append({
            "item_code": item.item_code,
            "delivery_date": item.delivery_date,
            "item_name": item.item_name,
            "description": item.description,
            "qty": item.qty,
            "uom": item.uom,
            "stock_uom": item.stock_uom,
            "conversion_factor": item.conversion_factor,
            "picked_qty": item.picked_qty,
            "stock_qty": item.stock_qty,
            "price_list_rate": item.price_list_rate,
            "base_price_list_rate": item.base_price_list_rate,
            "margin_type": item.margin_type,
            "discount_percentage": item.discount_percentage,
            "discount_amount": item.discount_amount,
            "rate": item.rate,
            "base_rate": item.base_rate,
            "amount": item.amount,
            "base_amount": item.base_amount,
            "warehouse": item.warehouse,
            "net_rate": item.net_rate,
            "net_amount": item.net_amount,
            "variant_of": item.variant_of,
            "net_weight": item.net_weight,
            "greigh_weight": item.greigh_weight,
            "weight_difference": item.weight_difference,            
            "weight_measuring_unit" : item.weight_measuring_unit,
            "total_secondary_qty" : item.total_secondary_qty,
            "total_seconday_qty_uom" : item.total_seconday_qty_uom,
            "total_parent_qty": item.total_parent_qty,
            "total_parent_qty_uom": item.total_parent_qty_uom,
            "b_percent": item.b_percent,  # Fixed the '=' to ':'
            "total_secondary_qty_with_b_percent": item.total_secondary_qty_with_b_percent,
            "total_parent_qty_with_b_percent": item.total_parent_qty_with_b_percent,
            "loom_wastage": item.loom_wastage,
            "parent_greigh_kgs": item.parent_greigh_kgs,
            "parent_greigh_lbs": item.parent_greigh_lbs,
            "total_final_lbs": item.total_final_lbs,
            "secondary_qty": item.secondary_qty,
            "qty_with_b_percent": item.qty_with_b_percent,
            "secondary_qty_with_b_percent": item.secondary_qty_with_b_percent,
            "secondary_to_standard_qty_ratio": item.secondary_to_standard_qty_ratio,
            "greigh_kilograms": item.greigh_kilograms,
            "lbs_greigh": item.lbs_greigh,
            "final_lbs_": item.final_lbs_,
            "net_lbs": item.net_lbs,

            # Vals of Weaving, Dyeing and Stitching
            "weave_qlty": item.weave_qlty,
            "oh_rate": item.oh_rate,
            "sh_rate": item.sh_rate,
            "weaving_lbs": item.lbs,
            "weaving_amount": item.weaving_amount,

            "dye_qlty": item.dye_qlty,
            "dye_rate": item.dye_rate,
            "dye_waste_percentage": item.dye_waste_percentage,
            "dye_lbs": item.dye_lbs,
            "total_dyeing_amount": item.total_dyeing_amount,

            "stiching_rate": item.stiching_rate,
            "stitch_waste_qty": item.stitch_waste_qty,
            "embroidery_rate": item.embroidery_rate,
            "total_qty_with_waste": item.total_qty_with_waste,
            "printing_rate": item.printing_rate,
            "final_stich_rate": item.final_stich_rate,
            "total_stitching_amount": item.total_stitching_amount,

            # Value of Production fields
            "b_percent_qty": item.b_percent_qty,
            "qty_with_b_percent": item.qty_with_b_percent,

            # Change b_kgs and b_kgs_value formulas here 
            # budgetEntryItem.b_kgs   = ((item.total_parent_qty_with_b_percent) - (item.total_parent_qty)) *  (item.net_weight/1000)
            # budgetEntryItem.b_kgs_value  = (item.total_weaving_amount + item.total_yarn_amount ) * (item.b_percent /100)

            # b_kgs and b_kgs_value has been calculating in Sales order just setting in budgeting
            "b_kgs": item.b_kgs,
            "b_kgs_value": item.b_kgs_value

        })

    # Populate Raw Material table
    for raw_item in sales_order.get("sales_order_raw_material", []):
        data["rawmaterial_yarn_items"].append({
            "parent_item": raw_item.parent_item,
            "qty": raw_item.qty,
            "net_lbs": raw_item.net_lbs,
            "loom_wastage": raw_item.loom_wastage,            
            "component" : raw_item.component,
            "total_yarn_required" : raw_item.total_yarn_required,
            "raw_mat_item" : raw_item.raw_mat_item,
            "raw_mat_item_name" : raw_item.raw_mat_item_name,
            "consumption_" : raw_item.consumption_,
            "consumption_lbs" : raw_item.consumption_lbs,
            "rate_per_lbs"  : raw_item.rate_per_lbs,
            "raw_material_amount" : raw_item.raw_material_amount,
            "net_weight" : raw_item.net_weight

        })

    # Populate Parent Items table
    for parent_item in sales_order.get("parent_items_table", []):
        data["parent_item_tab"].append({
            "item_code": parent_item.item_code,
            "delivery_date": parent_item.delivery_date,
            
                "item_code": parent_item.item_code,
    "delivery_date": parent_item.delivery_date,
    "item_name": parent_item.item_name,
    "description": parent_item.description,
    "qty": parent_item.qty,
    "uom": parent_item.uom,
    "conversion_factor": parent_item.conversion_factor,
    "variant_of": parent_item.variant_of,
    "stock_uom": parent_item.stock_uom,
    "picked_qty": parent_item.picked_qty,
    "stock_qty": parent_item.stock_qty,
    "price_list_rate": parent_item.price_list_rate,
    "base_price_list_rate": parent_item.base_price_list_rate,
    "margin_type": parent_item.margin_type,
    "discount_percentage": parent_item.discount_percentage,
    "discount_amount": parent_item.discount_amount,
    "rate": parent_item.rate,
    "base_rate": parent_item.base_rate,
    "amount": parent_item.amount,
    "base_amount": parent_item.base_amount,
    "warehouse": parent_item.warehouse,
    "net_rate": parent_item.net_rate,
    "net_amount": parent_item.net_amount,
    "b_value": parent_item.b_value,

    # Weaving
    "weave_qlty": parent_item.weave_qlty,
    "oh_rate": parent_item.oh_rate,
    "sh_rate": parent_item.sh_rate,
    "lbs": parent_item.lbs,
    "weaving_amount": parent_item.weaving_amount,

    # Dyeing
    "dye_qlty": parent_item.dye_qlty,
    "dye_rate": parent_item.dye_rate,
    "dye_waste_percentage": parent_item.dye_waste_percentage,
    "dye_lbs": parent_item.dye_lbs,
    "total_dyeing_amount": parent_item.total_dyeing_amount,

    # Stitching
    "stiching_rate": parent_item.stiching_rate,
    "embroidery_rate": parent_item.embroidery_rate,
    "printing_rate": parent_item.printing_rate,
    "final_stich_rate": parent_item.final_stich_rate,
    "stitch_waste_qty": parent_item.stitch_waste_qty,
    "total_qty_with_waste": parent_item.total_qty_with_waste,
    "total_stitching_amount": parent_item.total_stitching_amount,

    # Parent Item Net weight Details
    "net_weight": parent_item.net_weight,
    "total_secondary_qty": parent_item.total_secondary_qty,
    "b_percent": parent_item.b_percent,
    "loom_wastage": parent_item.loom_wastage,
    "greigh_weight": parent_item.greigh_weight,
    "total_seconday_qty_uom": parent_item.total_seconday_qty_uom,
    "total_secondary_qty_with_b_percent": parent_item.total_secondary_qty_with_b_percent,
    "parent_greigh_kgs": parent_item.parent_greigh_kgs,
    "weight_difference": parent_item.weight_difference,
    "total_parent_qty": parent_item.total_parent_qty,
    "total_parent_qty_with_b_percent": parent_item.total_parent_qty_with_b_percent,
    "total_secondary_qty_with_b_percent": parent_item.total_secondary_qty_with_b_percent,
    "parent_greigh_lbs": parent_item.parent_greigh_lbs,
    "weight_measuring_unit": parent_item.weight_measuring_unit,
    "total_parent_qty_uom": parent_item.total_parent_qty_uom,
    "total_final_lbs": parent_item.total_final_lbs,
    "b_kgs": parent_item.b_kgs,
    "b_kgs_rate": parent_item.b_kgs_rate,
    "net_lbs": parent_item.net_lbs,
    "b_kgs_value": parent_item.b_kgs_value,
    "weave_waste_lbs": parent_item.weave_waste_lbs,
    "dye_waste_lbs": parent_item.dye_waste_lbs,

    # Net weight Details
    "secondary_qty": parent_item.secondary_qty,
    "secondary_qty_with_b_percent": parent_item.secondary_qty_with_b_percent,
    "greigh_kilograms": parent_item.greigh_kilograms,
    "lbs_greigh": parent_item.lbs_greigh,
    "qty_with_b_percent": parent_item.qty_with_b_percent,
    "secondary_to_standard_qty_ratio": parent_item.secondary_to_standard_qty_ratio,
    "final_lbs_": parent_item.final_lbs_,
    "b_percent_qty": parent_item.b_percent_qty,

    # Additional values
    "total_final_lbs": parent_item.total_final_lbs,
    "total_yarn_amount": parent_item.total_yarn_amount,
    "total_weaving_amount": parent_item.total_weaving_amount,
    "total_yarn_required": parent_item.total_yarn_required
    
    })

    return data
