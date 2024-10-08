import frappe
import json
from console import console


#Weaving and Yarn PO 
#Sales Order (Main Item Table)
@frappe.whitelist()
def fetch_variant_into_raw(sales_order_no,purchase_type):
    
    data = []
    query = []


    if purchase_type == 'Stitching Service' or purchase_type == 'Stitching Bathrobe  Service':
        console("back dye method").log()
        query = frappe.db.sql(
            """
               select 
                    parent.variant_of,
                    parent.parentfield,
                    parent.item_code,
                    parent.qty,
                    parent.b_percent,
                    parent.item_name,
                    parent.description,
                    parent.net_weight,
                    parent.weight_measuring_unit,
                    parent.greigh_weight,
                    parent.total_parent_qty_with_b_percent
                    
                    
                    
                    from  `tabSales Order Item` as parent
                    
                    where
                    parent.parent = %s and parent.parentfield = 'items'                
    
            """,(sales_order_no,), as_dict=1)
        
        console(query).log()

    for row in query:
        if purchase_type == "Stitching Service" or purchase_type == 'Stitching Bathrobe  Service':
            console("stiti").log()
            console(row).log()
            data.append(row)

    return data

@frappe.whitelist()
def setting_items(sales_order_no,purchase_type):
    console("enter in setting").log()
    data = []
    query = []
   

    if purchase_type == 'Weaving Service':

        query = frappe.db.sql(
            """
                select 
                    parent.name,
                    parent.variant_of,
                    parent.parentfield,
                    parent.item_code,
                    parent.item_name,
                    parent.description,
                    parent.net_weight,
                    parent.weight_measuring_unit,
                    parent.greigh_weight,
                    parent.total_parent_qty_with_b_percent,
                    parent.total_parent_qty_with_b_percent,
                    parent.total_secondary_qty_with_b_percent,
                    parent.order_placed_qty,
                    parent.cut_length
                    

                    
                    from  `tabSales Order Item` as parent
                    
                    where
                        parent.parent =%s and parentfield = 'parent_items_table' 
                    
    
            """,(sales_order_no,), as_dict=1)
    

    if purchase_type == 'Dying Service' or purchase_type == 'Stitching Service' or purchase_type == 'Stitching Bathrobe  Service':
        
        console("back dye method").log()
        query = frappe.db.sql(
            """
               select 
                    parent.name,
                    parent.variant_of,
                    parent.parentfield,
                    parent.item_code,
                    parent.qty,
                    parent.b_percent,
                    parent.item_name,
                    parent.description,
                    parent.net_weight,
                    parent.weight_measuring_unit,
                    parent.greigh_weight,
                    parent.total_parent_qty_with_b_percent,
                    parent.qty_with_b_percent,
                    parent.order_placed_qty,
                    parent.cut_length

                    
                    
                    
                    from  `tabSales Order Item` as parent
                    
                    where
                    parent.parent = %s and parent.parentfield = 'items'                
    
            """,(sales_order_no,), as_dict=1)

    
    
    for row in query:
       
        if purchase_type == "Weaving Service":
            variant = row.get("variant_of")
            item = frappe.db.sql(""" Select * from `tabItem` where variant_of=%s and item_group='Semi Finished Goods' """,(variant,),as_dict=1)
            if item:
              
                row["item_code"] = item[0]["item_code"]
                row["item_name"] = item[0]["item_name"]           
                
                data.append(row)
                
        
        if purchase_type == "Dying Service":
            console("back for dyig service").log()
            # console("row",row).log()
               
            
            data.append(row)

        if purchase_type == "Stitching Service" or purchase_type == 'Stitching Bathrobe  Service':
            console("Stitiching service if").log()
            
            
            name = frappe.db.get_value("Item", {'variant_of': row.variant_of , 'item_colour_variant': row.item_code},['name'])
            console("name").log()
            console(name).log()

            if name:
                console("if name").log()
                variant_item = frappe.db.get_value("Item Variant Attribute",{'parent': name, 'variant_of': row.variant_of, 'attribute_value': 'Stitching'}, ['parent'])
                console(variant_item).log()
                if variant_item:
                    console("if varinat item").log()
                    orginal_item = row.item_code
                    row["orginal_item"] = orginal_item
                    row["item_code"] = variant_item
                    row["item_name"] = variant_item
                    console("rpow").log()
                    console(row).log()
                    data.append(row)
        

            
            

    return data




@frappe.whitelist()
def fetch_parent_items_of_so(sales_order_no,purchase_type):
    grey_item = []
    query = []
    
    
    if purchase_type == 'Dying Service':
        console("back dye method").log()
        query = frappe.db.sql(
            """
               select 
                    parent.variant_of,
                    parent.parentfield,
                    parent.item_code,
                    parent.item_name,
                    parent.total_parent_qty,
                    parent.total_parent_qty_with_b_percent,
                    parent.b_percent,
                    parent.greigh_weight
                    
                    
                    from  `tabSales Order Item` as parent
                    
                    where
                    parent.parent = %s and parent.parentfield = 'parent_items_table'                
    
            """,(sales_order_no,), as_dict=1)
        
    
    for row in query:

        if purchase_type == 'Dying Service':
            variant = row.get("variant_of")
            item = frappe.db.sql(""" Select * from `tabItem` where variant_of=%s and item_group='Semi Finished Goods' """,(variant,),as_dict=1)
            if item:
                # row.get("item_name") = item.item_name
                row["item_code"] = item[0]["item_code"]
                row["item_name"] = item[0]["item_name"]
                grey_item.append(row)

    return grey_item


#For Weaving PO 
#Sales Order (Raw Material Table)
@frappe.whitelist()
def fetch_raw_material_items(sales_order_no,purchase_type):
    raw = []
    raw_list = []
    
    raw_list =frappe.db.sql( """ 
            Select
                            
                raw.name,            
                raw.parent_item,
                raw.raw_mat_item,
                raw.raw_mat_item_name,
                raw.undye_raw_item,
                raw.undye_raw_item_name,
                raw.component,
                raw.consumption_,
                raw.consumption_lbs,
                raw.rate_per_lbs,
                raw.order_placed_qty
                

                from  `tabSales Order Raw Material` as raw 

 
                where
                  raw.parent =%s 
                
   
        """,(sales_order_no,),as_dict=1)

    for row in raw_list:

        #weaving po raw material work
        if purchase_type == "Weaving Service":
            variant = row.get("parent_item")
            item = frappe.db.sql(""" Select * from `tabItem` where variant_of=%s and item_group='Semi Finished Goods' 
                """,(variant,),as_dict=1)
            if item:
                # console(row.get("item_code")).log()            
                # row.get("item_code") = item.item_code
                # row.get("item_name") = item.item_name
                row["parent_item"] = item[0]["item_code"]
                raw.append(row)
            #end of weaving po work    
        
        # Dye Yarn Po work 
        if purchase_type == "Yarn Dying":
                console("yarn",row).log()
                raw.append(row)
            #end of weaving po work           

    return raw



# Setting Place order Qty in Sales Order
def set_placed_order_qty(doc, method):
    
    for item in doc.items:
        if item.purchase_type == 'Yarn Dying':
            console("enter sales place").log()
            sales_order_raw = frappe.get_doc("Sales Order Raw Material", item.so_row_name)

            sales_order_raw.order_placed_qty += item.qty or 0
            
            # Update the Sales Invoice
            sales_order_raw.save(ignore_permissions=True) 
        
        if item.purchase_type == 'Dying Service' or item.purchase_type == 'Stitching Service' or item.purchase_type == 'Weaving Service':
            console("enter services").log()
            sales_order_raw = frappe.get_doc("Sales Order Item", item.so_row_name)

            sales_order_raw.order_placed_qty += item.qty or 0
            
            # Update the Sales Invoice
            sales_order_raw.save(ignore_permissions=True) 












########################################### Purchase Receipt ##############


@frappe.whitelist()
def fetch_pr_yarn_field(purchase_receipt_no):
    console(purchase_receipt_no).log()



    pr_value = frappe.db.get_list("Purchase Receipt Item", {"parent": purchase_receipt_no},["parent","name","item_code","purchase_order_item","purchase_order","yarn_brand"])
    console("receipt method").log()
    
    for row in pr_value:
  
        if row.get("purchase_order_item"): 
            console("enter iun dd first if").log()
            console(row["purchase_order_item"]).log()

       
            po_value = frappe.get_doc("Purchase Order Item", row["purchase_order_item"] )
           # frappe.db.set_value('Purchase Receipt Item',row["name"],'yarn_brand', po_value.brand_)

            frappe.db.set_value('Purchase Receipt Item',row["name"], {
                'yarn_brand': po_value.brand_,
                'yarn_color': po_value.color})


            
           
            console("dfdf").log()
            console(row["yarn_brand"]).log()
            console("po_value").log()
            
            console(po_value.name).log()
    
    frappe.db.commit()

    return purchase_receipt_no
        
        
   
        
        
        
        
        
        
        
        
        
        
        
        #     console("po_value").log()
        #     console(po_value.brand_).log()

        #     #set pr item value
        #     for po_item in po_value:
        #         if po_item:
        #             console("enter in po_value iffff").log()
        #             console(po_value.brand_).log()
        #             pr_item_doc = frappe.get_doc({"Purchase Receipt Item", "b074f350ba"})
        #             console("pr_item_doc.yarn_brand").log()
        #             console(pr_item_doc.yarn_brand).log()

        #             pr_item_doc.yarn_brand = "er44r"
                    
        #             frappe.db.set_value('Purchase Receipt Item', "b074f350ba",'yarn_brand', "1234")
        #             # frappe.db.set_value("Purchase Receipt Item", pr_item_name, "yarn_brand", pr_item_yarn_brand)
        #             frappe.db.commit()
                







                # frappe.db.set_value('Purchase Receipt Item', row.name, {'yarn_brand': po_value.brand_})
                # frappe.db.commit()

        

        
    



    # for row in pr_value:
    #     po_value = frappe.get_doc("Purchase Order Item", filters={"parent": row.purchase_order,"item_code":row.item_code}, fields=[""])

 




  
                

# @frappe.whitelist()
# def fetch_raw_material_items(sales_order_no):
#     raw = []
#     raw_list =frappe.db.sql( """ 
#             Select
#                 parent.parent,
#                 parent.variant_of,
#                 parent.parentfield,
#                 parent.item_code,
#                 parent.item_name,
#                 parent.description,
#                 parent.uom,
#                 raw.raw_mat_item,
#                 raw.raw_mat_item_name,
#                 raw.component,
#                 raw.consumption_,
#                 raw.consumption_lbs,
#                 raw.rate_per_lbs
                

#                 from  `tabSales Order Item` as parent
#                 join  `tabSales Order Raw Material` as raw on parent.parent = raw.parent and  parent.variant_of = raw.parent_item and parent.parentfield = 'items'  
 
#                 where
#                     raw.parent =%s
                
   
#         """,(sales_order_no,),as_dict=1)

#     for row in raw_list:
#         raw.append(row);

#     return raw



# import frappe
# import json
# from console import console

# @frappe.whitelist()
# def setting_items(sales_order_no):
#     console("enter in setting").log()
#     data = []
#     # console("Parent Items").log()
#     # console(parent_item).log()

#     # result = frappe.db.get_list('Item',
#     #                             filters={
#     #                                 'variant_of': parent_item
#     #                             },
#     #                             fields=['*'],
#     #                             order_by='idx')

#     query = frappe.db.sql(
#         """
#             select 
#                 parent.parent,
#                 parent.variant_of,
#                 parent.parentfield,
#                 parent.item_code,
#                 parent.item_name,
#                 parent.description,
#                 parent.net_weight,
#                 parent.weight_measuring_unit,
#                 parent.greigh_weight,
#                 parent.total_parent_qty,
#                 raw.raw_mat_item,
#                 raw.raw_mat_item_name,
#                 raw.component,
#                 raw.consumption_,
#                 raw.consumption_lbs,
#                 raw.rate_per_lbs
                

                
#                 from  `tabSales Order Item` as parent
#                 join `tabSales Order Raw Material` as raw on parent.parent = raw.parent and parent.variant_of = raw.parent_item and parent.parentfield = 'parent_items_table'
                
#                 where
#                     parent.parent =%s
                
   
#         """,(sales_order_no,), as_dict=1)
#     # console("RESULT").log()
#     # console(result).log()
#     for row in query:
#         console("row",row)
#         data.append(row)

#     return data
