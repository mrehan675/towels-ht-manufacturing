import frappe
from frappe import _

# def execute(filters=None):
#     columns, data = [], []
#     columns = get_columns()
#     data = get_data(filters)
#     return columns, data

# def get_columns():
#     return [
#         {"label": _("Shipment Required"), "fieldname": "delivery_date", "fieldtype": "Data", "width": 120},
#         {"label": _("Buyer"), "fieldname": "customer", "fieldtype": "Data", "width": 120},
#         {"label": _("Order"), "fieldname": "po_no", "fieldtype": "Data", "width": 120},
#         {"label": _("Sale Order"), "fieldname": "name", "fieldtype": "Data", "width": 120},
#         {"label": _("Export Lbs"), "fieldname": "export_lbs", "fieldtype": "Float", "width": 120},
#         {"label": _("Yarn"), "fieldname": "total_yarn_required", "fieldtype": "HTML", "width": 300}  # Allow HTML content
#     ]

# def get_data(filters):
#     from_date = filters.get("from_date")
#     to_date = filters.get("to_date")

#     query = """
#         SELECT
#             so.name,
#             so.delivery_date, 
#             so.customer, 
#             so.po_no,
#             b.export_lbs,
#             b.total_yarn_required
#         FROM 
#             `tabSales Order` AS so
#         JOIN 
#             `tabBudgeting` AS b ON so.name = b.sales_order
#         WHERE 
#             so.delivery_date BETWEEN %(from_date)s AND %(to_date)s
#     """
#     data = frappe.db.sql(query, {"from_date": from_date, "to_date": to_date}, as_dict=1)

#     for row in data:
#         if row.get("export_lbs") is not None and row.get("total_yarn_required") is not None:
#             total_yarn_required = row["total_yarn_required"]
#             export_lbs = row["export_lbs"]
#             # Format both values into a single HTML string
#             formatted_yarn = f"<div style='text-align: center;'>{total_yarn_required:,}<br>{export_lbs:.2f}</div>"
#             row["total_yarn_required"] = formatted_yarn

#     return data


# import frappe
# from frappe import _

# def execute(filters=None):
#     columns, data = [], []
#     columns = get_columns()
#     data = get_data(filters)
#     return columns, data

# def get_columns():
#     return [
#         {"label": _("Shipment Required"), "fieldname": "delivery_date", "fieldtype": "Data", "width": 120},
#         {"label": _("Buyer"), "fieldname": "customer", "fieldtype": "Data", "width": 120},
#         {"label": _("Order"), "fieldname": "po_no", "fieldtype": "Data", "width": 120},
#         {"label": _("Sale Order"), "fieldname": "name", "fieldtype": "Data", "width": 120},
#         {"label": _("Export Lbs"), "fieldname": "export_lbs", "fieldtype": "Float", "width": 120},
#         {"label": _("Yarn"), "fieldname": "yarn_costing_amount", "fieldtype": "HTML", "width": 120},
#         {"label": _("Weaving"), "fieldname": "weaving_costing_amount", "fieldtype": "HTML", "width": 120},  
#         {"label": _("Dyeing"), "fieldname": "dyeing_costing_amount", "fieldtype": "HTML", "width": 120},  
#         {"label": _("Stitching"), "fieldname": "stitching_costing_amount", "fieldtype": "HTML", "width": 120},
#         {"label": _("Accessory"), "fieldname": "accessory_costing_amount", "fieldtype": "HTML", "width": 120},
#         {"label": _("Expense"), "fieldname": "expense_costing_amount", "fieldtype": "HTML", "width": 120},
#         {"label": _("Total Cost"), "fieldname": "total_costing", "fieldtype": "HTML", "width": 120},  
  
  


#     ]

# def get_data(filters):
#     from_date = filters.get("from_date")
#     to_date = filters.get("to_date")
#     total_cost = 0.0
#     total_export = 0.0

#     query = """
#         SELECT
#             so.delivery_date, 
#             so.customer, 
#             so.po_no,
#             so.name,
#             b.export_lbs,
#             bcd_yarn.cost_amount AS yarn_costing_amount,
#             bcd_weaving.cost_amount AS weaving_costing_amount,
#             bcd_dyeing.cost_amount AS dyeing_costing_amount,
#             bcd_stitching.cost_amount AS stitching_costing_amount,
#             bcd_accessory.cost_amount AS accessory_costing_amount,
#             bcd_expense.cost_amount AS expense_costing_amount
#         FROM 
#             `tabSales Order` AS so
#         JOIN 
#             `tabBudgeting` AS b ON so.name = b.sales_order
#         LEFT JOIN 
#             `tabBudgeting Cost Details` AS bcd_yarn ON b.name = bcd_yarn.parent AND bcd_yarn.cost_component = 'Yarn'  
#         LEFT JOIN 
#             `tabBudgeting Cost Details` AS bcd_weaving ON b.name = bcd_weaving.parent AND bcd_weaving.cost_component = 'Weaving'  
#         LEFT JOIN 
#             `tabBudgeting Cost Details` AS bcd_dyeing ON b.name = bcd_dyeing.parent AND bcd_dyeing.cost_component = 'Dyeing'  
#         LEFT JOIN 
#             `tabBudgeting Cost Details` AS bcd_stitching ON b.name = bcd_stitching.parent AND bcd_stitching.cost_component = 'Stitching'  
#         LEFT JOIN 
#             `tabBudgeting Cost Details` AS bcd_accessory ON b.name = bcd_accessory.parent AND bcd_accessory.cost_component = 'Accessories'  
#         LEFT JOIN 
#             `tabBudgeting Cost Details` AS bcd_expense ON b.name = bcd_expense.parent AND bcd_expense.cost_component = 'Expense'  


#         WHERE 
#             so.delivery_date BETWEEN %(from_date)s AND %(to_date)s
#     """
#     data = frappe.db.sql(query, {"from_date": from_date, "to_date": to_date}, as_dict=1)

#     for row in data:
#         export_lbs = row.get("export_lbs") or 0

#         if row.get("export_lbs") is not None and row.get("yarn_costing_amount") is not None:

#             unit_value = row["yarn_costing_amount"] / row["export_lbs"]
#             total_yarn = row["yarn_costing_amount"]

            
#             # formatted_yarn = f"<div style='text-align: center;'>{total_yarn:,}<br>{unit_value:.2f}</div>"
#             formatted_yarn = f"<div style='text-align: center;'>{total_yarn:,}<br><span style='color: green;'>{unit_value:.2f}</span></div>"

#             row["yarn_costing_amount"] = formatted_yarn
        
#         yarn_costing_amount = row.get("yarn_costing_amount") or 0
#         total_cost += yarn_costing_amount
#         total_export += yarn_costing_amount /export_lbs   or 0

            
#         if row.get("export_lbs") is not None and row.get("weaving_costing_amount") is not None:

#             unit_value = row["weaving_costing_amount"] / row["export_lbs"]
#             total_weave = row["weaving_costing_amount"]

#             # total_cost += row["weaving_costing_amount"] or 0
#             # total_export += unit_value   or 0


#             # formatted_yarn = f"<div style='text-align: center;'>{total_yarn:,}<br>{unit_value:.2f}</div>"
#             formatted_weave = f"<div style='text-align: center;'>{total_weave:,}<br><span style='color: green;'>{unit_value:.2f}</span></div>"
#             row["weaving_costing_amount"] = formatted_weave

#         weaving_costing_amount = row.get("weaving_costing_amount") or 0
#         total_cost += weaving_costing_amount
#         total_export += weaving_costing_amount /export_lbs   or 0


#         if row.get("export_lbs") is not None and row.get("dyeing_costing_amount") is not None:

#             unit_value = row["dyeing_costing_amount"] / row["export_lbs"]
#             total_dye = row["dyeing_costing_amount"]

#             # total_cost += row["dyeing_costing_amount"] or 0
#             # total_export += unit_value   or 0


#             # formatted_yarn = f"<div style='text-align: center;'>{total_yarn:,}<br>{unit_value:.2f}</div>"
#             formatted_dye = f"<div style='text-align: center;'>{total_dye:,}<br><span style='color: green;'>{unit_value:.2f}</span></div>"
#             row["dyeing_costing_amount"] = formatted_dye
        
#         dyeing_costing_amount= row.get("dyeing_costing_amount") or 0
#         total_cost += dyeing_costing_amount
#         total_export += dyeing_costing_amount /export_lbs   or 0
        
#         if row.get("export_lbs") is not None and row.get("stitching_costing_amount") is not None:

#             unit_value = row["stitching_costing_amount"] / row["export_lbs"]
#             total_stitch = row["stitching_costing_amount"]

#             # total_cost += row["stitching_costing_amount"] or 0
#             # total_export += unit_value  or 0

#             # formatted_yarn = f"<div style='text-align: center;'>{total_yarn:,}<br>{unit_value:.2f}</div>"
#             formatted_stitch = f"<div style='text-align: center;'>{total_stitch:,}<br><span style='color: green;'>{unit_value:.2f}</span></div>"
#             row["stitching_costing_amount"] = formatted_stitch
        
#         stitching_costing_amount = row.get("stitching_costing_amount") or 0
#         total_cost += stitching_costing_amount 
#         total_export += stitching_costing_amount /export_lbs   or 0
        
        

        
#         if row.get("export_lbs") is not None and row.get("accessory_costing_amount") is not None:

#             unit_value = row["accessory_costing_amount"] / row["export_lbs"]
#             total_accessory = row["accessory_costing_amount"]

#             # total_cost += row["accessory_costing_amount"] or 0
#             # total_export += unit_value   or 0



#             # formatted_yarn = f"<div style='text-align: center;'>{total_yarn:,}<br>{unit_value:.2f}</div>"
#             formatted_accessory = f"<div style='text-align: center;'>{total_accessory:,}<br><span style='color: green;'>{unit_value:.2f}</span></div>"
#             row["accessory_costing_amount"] = formatted_accessory

#         accessory_costing_amount = row.get("accessory_costing_amount") or 0
#         total_cost += accessory_costing_amount
#         total_export += accessory_costing_amount /export_lbs   or 0


#         if row.get("export_lbs") is not None and row.get("expense_costing_amount") is not None:

#             unit_value = row["expense_costing_amount"] / row["export_lbs"]
#             total_expense = row["expense_costing_amount"]

#             # total_cost += row["weaving_costing_amount"] or 0
#             # total_export += unit_value   or 0

#             # formatted_yarn = f"<div style='text-align: center;'>{total_yarn:,}<br>{unit_value:.2f}</div>"
#             formatted_expense = f"<div style='text-align: center;'>{total_expense:,}<br><span style='color: green;'>{unit_value:.2f}</span></div>"
#             row["expense_costing_amount"] = formatted_expense

#         expense_costing_amount = row.get("expense_costing_amount") or 0
#         total_cost += expense_costing_amount
#         total_export += expense_costing_amount / export_lbs   or 0

#     # After the loop, set the total costing
#     formatted_total_cost = f"<div style='text-align: center;'>{total_cost:,}<br><span style='color: green;'>{total_export:.2f}</span></div>"
#     for row in data:
#         row["total_costing"] = formatted_total_cost
            

#     return data



# import frappe
# from frappe import _

# def execute(filters=None):
#     columns, data = [], []
#     columns = get_columns()
#     data = get_data(filters)
#     return columns, data

# def get_columns():
#     return [
#         {"label": _("Shipment Required"), "fieldname": "delivery_date", "fieldtype": "Data", "width": 120},
#         {"label": _("Buyer"), "fieldname": "customer", "fieldtype": "Data", "width": 120},
#         {"label": _("Order"), "fieldname": "po_no", "fieldtype": "Data", "width": 120},
#         {"label": _("Sale Order"), "fieldname": "name", "fieldtype": "Data", "width": 120},
#         {"label": _("Export Lbs"), "fieldname": "export_lbs", "fieldtype": "Float", "width": 120},
#         {"label": _("Yarn"), "fieldname": "yarn_costing_amount", "fieldtype": "HTML", "width": 120},
#         {"label": _("Weaving"), "fieldname": "weaving_costing_amount", "fieldtype": "HTML", "width": 120},  
#         {"label": _("Dyeing"), "fieldname": "dyeing_costing_amount", "fieldtype": "HTML", "width": 120},  
#         {"label": _("Stitching"), "fieldname": "stitching_costing_amount", "fieldtype": "HTML", "width": 120},
#         {"label": _("Accessory"), "fieldname": "accessory_costing_amount", "fieldtype": "HTML", "width": 120},
#         {"label": _("Expense"), "fieldname": "expense_costing_amount", "fieldtype": "HTML", "width": 120},
#         {"label": _("Total Cost"), "fieldname": "total_costing", "fieldtype": "HTML", "width": 120},  
#         {"label": _("Export Sale"), "fieldname": "export_sale", "fieldtype": "HTML", "width": 120},  
#         {"label": _("Rebate"), "fieldname": "rebate", "fieldtype": "HTML", "width": 120},
#         {"label": _("Local Sale"), "fieldname": "local_sales", "fieldtype": "HTML", "width": 120},
#         {"label": _("Total Revenue"), "fieldname": "total_revenue", "fieldtype": "HTML", "width": 120},
#         {"label": _("On Order"), "fieldname": "on_order", "fieldtype": "HTML", "width": 120},  
#         {"label": _("Per Lbs"), "fieldname": "per_lbs", "fieldtype": "HTML", "width": 120},  
 
 


#     ]

# def get_data(filters):
#     from_date = filters.get("from_date")
#     to_date = filters.get("to_date")
#     total_cost = 0.0
#     total_export = 0.0

#     query = """
#         SELECT
#             so.delivery_date, 
#             so.customer, 
#             so.po_no,
#             so.name,
#             b.export_lbs,
#             bcd_yarn.cost_amount AS yarn_costing_amount,
#             bcd_weaving.cost_amount AS weaving_costing_amount,
#             bcd_dyeing.cost_amount AS dyeing_costing_amount,
#             bcd_stitching.cost_amount AS stitching_costing_amount,
#             bcd_accessory.cost_amount AS accessory_costing_amount,
#             bcd_expense.cost_amount AS expense_costing_amount,
#             b.total_amount_pkr as  export_sale,
#             b.rebate_value as rebate,
#             b.local_sales
            
#         FROM 
#             `tabSales Order` AS so
#         JOIN 
#             `tabBudgeting` AS b ON so.name = b.sales_order
#         LEFT JOIN 
#             `tabBudgeting Cost Details` AS bcd_yarn ON b.name = bcd_yarn.parent AND bcd_yarn.cost_component = 'Yarn'  
#         LEFT JOIN 
#             `tabBudgeting Cost Details` AS bcd_weaving ON b.name = bcd_weaving.parent AND bcd_weaving.cost_component = 'Weaving'  
#         LEFT JOIN 
#             `tabBudgeting Cost Details` AS bcd_dyeing ON b.name = bcd_dyeing.parent AND bcd_dyeing.cost_component = 'Dyeing'  
#         LEFT JOIN 
#             `tabBudgeting Cost Details` AS bcd_stitching ON b.name = bcd_stitching.parent AND bcd_stitching.cost_component = 'Stitching'  
#         LEFT JOIN 
#             `tabBudgeting Cost Details` AS bcd_accessory ON b.name = bcd_accessory.parent AND bcd_accessory.cost_component = 'Accessories'  
#         LEFT JOIN 
#             `tabBudgeting Cost Details` AS bcd_expense ON b.name = bcd_expense.parent AND bcd_expense.cost_component = 'Expense'  
#         WHERE 
#             so.delivery_date BETWEEN %(from_date)s AND %(to_date)s
#     """
#     data = frappe.db.sql(query, {"from_date": from_date, "to_date": to_date}, as_dict=1)

#     for row in data:
#         export_lbs = row.get("export_lbs") or 0

#         # Process Yarn Cost
#         yarn_costing_amount = row.get("yarn_costing_amount") or 0
#         if export_lbs > 0:
#             yarn_unit_value = yarn_costing_amount / export_lbs
#         else:
#             yarn_unit_value = 0.0
#         formatted_yarn = f"<div style='text-align: center;'>{yarn_costing_amount:,}<br><span style='color: green;'>{yarn_unit_value:.2f}</span></div>"
#         row["yarn_costing_amount"] = formatted_yarn
#         total_cost += yarn_costing_amount
#         total_export += yarn_unit_value

        
#         # Process Weaving Cost
#         weaving_costing_amount = row.get("weaving_costing_amount") or 0
#         if export_lbs > 0:
#             weaving_unit_value = weaving_costing_amount / export_lbs
#         else:
#             weaving_unit_value = 0.0
#         formatted_weaving = f"<div style='text-align: center;'>{weaving_costing_amount:,}<br><span style='color: green;'>{weaving_unit_value:.2f}</span></div>"
#         row["weaving_costing_amount"] = formatted_weaving
#         total_cost += weaving_costing_amount
#         total_export += weaving_unit_value

       
#         # Process Dyeing Cost
#         dyeing_costing_amount = row.get("dyeing_costing_amount") or 0
#         if export_lbs > 0:
#             dyeing_unit_value = dyeing_costing_amount / export_lbs
#         else:
#             dyeing_unit_value = 0.0
#         formatted_dyeing = f"<div style='text-align: center;'>{dyeing_costing_amount:,}<br><span style='color: green;'>{dyeing_unit_value:.2f}</span></div>"
#         row["dyeing_costing_amount"] = formatted_dyeing
#         total_cost += dyeing_costing_amount
#         total_export += dyeing_unit_value

        
#         # Process Stitching Cost
#         stitching_costing_amount = row.get("stitching_costing_amount") or 0
#         if export_lbs > 0:
#             stitching_unit_value = stitching_costing_amount / export_lbs
#         else:
#             stitching_unit_value = 0.0
#         formatted_stitching = f"<div style='text-align: center;'>{stitching_costing_amount:,}<br><span style='color: green;'>{stitching_unit_value:.2f}</span></div>"
#         row["stitching_costing_amount"] = formatted_stitching
#         total_cost += stitching_costing_amount
#         total_export += stitching_unit_value

        
#         # Process Accessory Cost
#         accessory_costing_amount = row.get("accessory_costing_amount") or 0
#         if export_lbs > 0:
#             accessory_unit_value = accessory_costing_amount / export_lbs
#         else:
#             accessory_unit_value = 0.0
#         formatted_accessory = f"<div style='text-align: center;'>{accessory_costing_amount:,}<br><span style='color: green;'>{accessory_unit_value:.2f}</span></div>"
#         row["accessory_costing_amount"] = formatted_accessory
#         total_cost += accessory_costing_amount
#         total_export += accessory_unit_value

        
#         # Process Expense Cost
#         expense_costing_amount = row.get("expense_costing_amount") or 0
#         if export_lbs > 0:
#             expense_unit_value = expense_costing_amount / export_lbs
#         else:
#             expense_unit_value = 0.0
#         formatted_expense = f"<div style='text-align: center;'>{expense_costing_amount:,}<br><span style='color: green;'>{expense_unit_value:.2f}</span></div>"
#         row["expense_costing_amount"] = formatted_expense
#         total_cost += expense_costing_amount
#         total_export += expense_unit_value


#         # Calculate Total Revenue
#         export_sale = row.get("export_sale") or 0
#         rebate = row.get("rebate") or 0
#         local_sales = row.get("local_sales") or 0
#         total_revenue = export_sale + rebate + local_sales
#         formatted_total_revenue = f"<div style='text-align: center;'>{total_revenue:,}</div>"
#         row["total_revenue"] = formatted_total_revenue


#     # After the loop, set the total costing
#     formatted_total_cost = f"<div style='text-align: center;'>{total_cost:,}<br><span style='color: green;'>{total_export:.2f}</span></div>"
#     for row in data:
#         row["total_costing"] = formatted_total_cost
        
#         on_order  = float(total_revenue) - total_cost 
#         per_lbs  = on_order / export_lbs if export_lbs > 0 else 0.0

#         formatted_on_order = f"<div style='text-align: blue;'>{on_order:,}</div>"
#         formatted_per_lbs = f"<div style='text-align: blue;'>{per_lbs:,}</div>"

#         row["on_order"] = formatted_on_order
#         row["per_lbs"] = formatted_per_lbs
          

#     return data

import frappe
from frappe import _

def execute(filters=None):
    columns, data = [], []
    columns = get_columns()
    data = get_data(filters)
    return columns, data

def get_columns():
    return [
        {"label": _("Shipment Required"), "fieldname": "delivery_date", "fieldtype": "Data", "width": 120},
        {"label": _("Buyer"), "fieldname": "customer", "fieldtype": "Data", "width": 120},
        {"label": _("Order"), "fieldname": "po_no", "fieldtype": "Data", "width": 120},
        {"label": _("Sale Order"), "fieldname": "name", "fieldtype": "Data", "width": 120},
        {"label": _("Export Lbs"), "fieldname": "export_lbs", "fieldtype": "Float", "width": 120},
        {"label": _("Yarn"), "fieldname": "yarn_costing_amount", "fieldtype": "HTML", "width": 120},
        {"label": _("Weaving"), "fieldname": "weaving_costing_amount", "fieldtype": "HTML", "width": 120},  
        {"label": _("Dyeing"), "fieldname": "dyeing_costing_amount", "fieldtype": "HTML", "width": 120},  
        {"label": _("Stitching"), "fieldname": "stitching_costing_amount", "fieldtype": "HTML", "width": 120},
        {"label": _("Accessory"), "fieldname": "accessory_costing_amount", "fieldtype": "HTML", "width": 120},
        {"label": _("Expense"), "fieldname": "expense_costing_amount", "fieldtype": "HTML", "width": 120},
        {"label": _("Total Cost"), "fieldname": "total_costing", "fieldtype": "HTML", "width": 120},  
        {"label": _("Export Sale"), "fieldname": "export_sale", "fieldtype": "HTML", "width": 120},  
        {"label": _("Rebate"), "fieldname": "rebate", "fieldtype": "HTML", "width": 120},
        {"label": _("Local Sale"), "fieldname": "local_sales", "fieldtype": "HTML", "width": 120},
        {"label": _("Total Revenue"), "fieldname": "total_revenue", "fieldtype": "HTML", "width": 120},
        {"label": _("On Order"), "fieldname": "on_order", "fieldtype": "HTML", "width": 120},  
        {"label": _("Per Lbs"), "fieldname": "per_lbs", "fieldtype": "HTML", "width": 120},  
    ]

def get_data(filters):
    from_date = filters.get("from_date")
    to_date = filters.get("to_date")
    total_cost = 0.0
    total_export = 0.0

    query = """
        SELECT
            so.delivery_date, 
            so.customer, 
            so.po_no,
            so.name,
            b.export_lbs,
            bcd_yarn.cost_amount AS yarn_costing_amount,
            bcd_weaving.cost_amount AS weaving_costing_amount,
            bcd_dyeing.cost_amount AS dyeing_costing_amount,
            bcd_stitching.cost_amount AS stitching_costing_amount,
            bcd_accessory.cost_amount AS accessory_costing_amount,
            bcd_expense.cost_amount AS expense_costing_amount,
            b.total_amount_pkr as  export_sale,
            b.rebate_value as rebate,
            b.local_sales
            
        FROM 
            `tabSales Order` AS so
        JOIN 
            `tabBudgeting` AS b ON so.name = b.sales_order
        LEFT JOIN 
            `tabBudgeting Cost Details` AS bcd_yarn ON b.name = bcd_yarn.parent AND bcd_yarn.cost_component = 'Yarn'  
        LEFT JOIN 
            `tabBudgeting Cost Details` AS bcd_weaving ON b.name = bcd_weaving.parent AND bcd_weaving.cost_component = 'Weaving'  
        LEFT JOIN 
            `tabBudgeting Cost Details` AS bcd_dyeing ON b.name = bcd_dyeing.parent AND bcd_dyeing.cost_component = 'Dyeing'  
        LEFT JOIN 
            `tabBudgeting Cost Details` AS bcd_stitching ON b.name = bcd_stitching.parent AND bcd_stitching.cost_component = 'Stitching'  
        LEFT JOIN 
            `tabBudgeting Cost Details` AS bcd_accessory ON b.name = bcd_accessory.parent AND bcd_accessory.cost_component = 'Accessories'  
        LEFT JOIN 
            `tabBudgeting Cost Details` AS bcd_expense ON b.name = bcd_expense.parent AND bcd_expense.cost_component = 'Expense'  
        WHERE 
            so.delivery_date BETWEEN %(from_date)s AND %(to_date)s
    """
    data = frappe.db.sql(query, {"from_date": from_date, "to_date": to_date}, as_dict=1)

    for row in data:
        export_lbs = row.get("export_lbs") or 0

        # Process Yarn Cost
        yarn_costing_amount = row.get("yarn_costing_amount") or 0
        if export_lbs > 0:
            yarn_unit_value = yarn_costing_amount / export_lbs
        else:
            yarn_unit_value = 0.0
        formatted_yarn = f"<div style='text-align: center;'>{yarn_costing_amount:,}<br><span style='color: green;'>{yarn_unit_value:.2f}</span></div>"
        row["yarn_costing_amount"] = formatted_yarn
        total_cost += yarn_costing_amount
        total_export += yarn_unit_value

        
        # Process Weaving Cost
        weaving_costing_amount = row.get("weaving_costing_amount") or 0
        if export_lbs > 0:
            weaving_unit_value = weaving_costing_amount / export_lbs
        else:
            weaving_unit_value = 0.0
        formatted_weaving = f"<div style='text-align: center;'>{weaving_costing_amount:,}<br><span style='color: green;'>{weaving_unit_value:.2f}</span></div>"
        row["weaving_costing_amount"] = formatted_weaving
        total_cost += weaving_costing_amount
        total_export += weaving_unit_value

       
        # Process Dyeing Cost
        dyeing_costing_amount = row.get("dyeing_costing_amount") or 0
        if export_lbs > 0:
            dyeing_unit_value = dyeing_costing_amount / export_lbs
        else:
            dyeing_unit_value = 0.0
        formatted_dyeing = f"<div style='text-align: center;'>{dyeing_costing_amount:,}<br><span style='color: green;'>{dyeing_unit_value:.2f}</span></div>"
        row["dyeing_costing_amount"] = formatted_dyeing
        total_cost += dyeing_costing_amount
        total_export += dyeing_unit_value

        
        # Process Stitching Cost
        stitching_costing_amount = row.get("stitching_costing_amount") or 0
        if export_lbs > 0:
            stitching_unit_value = stitching_costing_amount / export_lbs
        else:
            stitching_unit_value = 0.0
        formatted_stitching = f"<div style='text-align: center;'>{stitching_costing_amount:,}<br><span style='color: green;'>{stitching_unit_value:.2f}</span></div>"
        row["stitching_costing_amount"] = formatted_stitching
        total_cost += stitching_costing_amount
        total_export += stitching_unit_value

        
        # Process Accessory Cost
        accessory_costing_amount = row.get("accessory_costing_amount") or 0
        if export_lbs > 0:
            accessory_unit_value = accessory_costing_amount / export_lbs
        else:
            accessory_unit_value = 0.0
        formatted_accessory = f"<div style='text-align: center;'>{accessory_costing_amount:,}<br><span style='color: green;'>{accessory_unit_value:.2f}</span></div>"
        row["accessory_costing_amount"] = formatted_accessory
        total_cost += accessory_costing_amount
        total_export += accessory_unit_value

        
        # Process Expense Cost
        expense_costing_amount = row.get("expense_costing_amount") or 0
        if export_lbs > 0:
            expense_unit_value = expense_costing_amount / export_lbs
        else:
            expense_unit_value = 0.0
        formatted_expense = f"<div style='text-align: center;'>{expense_costing_amount:,}<br><span style='color: green;'>{expense_unit_value:.2f}</span></div>"
        row["expense_costing_amount"] = formatted_expense
        total_cost += expense_costing_amount
        total_export += expense_unit_value


        # Calculate Total Revenue
        export_sale = row.get("export_sale") or 0
        rebate = row.get("rebate") or 0
        local_sales = row.get("local_sales") or 0
        total_revenue = export_sale + rebate + local_sales
        formatted_total_revenue = f"<div style='text-align: center;'>{total_revenue:,}</div>"
        row["total_revenue"] = formatted_total_revenue


        # Calculate On Order and Per Lbs
        on_order = total_revenue - total_cost
        per_lbs = on_order / export_lbs if export_lbs > 0 else 0.0

        formatted_on_order = f"<div style='text-align: center; color: blue;'>{on_order:,}</div>"
        formatted_per_lbs = f"<div style='text-align: center; color: blue;'>{per_lbs:.2f}</div>"

        row["on_order"] = formatted_on_order
        row["per_lbs"] = formatted_per_lbs

    # After the loop, set the total costing
    formatted_total_cost = f"<div style='text-align: center;'>{total_cost:,}<br><span style='color: green;'>{total_export:.2f}</span></div>"
    for row in data:
        row["total_costing"] = formatted_total_cost

    return data
