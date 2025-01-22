import frappe
import json
from console import console
from frappe import _

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
                    
                    order by   parent.variant_of             
    
            """,(sales_order_no,), as_dict=1)
        
        console(query).log()

    for row in query:
        if purchase_type == "Stitching Service" or purchase_type == 'Stitching Bathrobe  Service':
            console("stiti").log()
            console(row).log()
            dy_item_code = row.get("item_code").replace("-ST", "-DY")

            variant = row.get("variant_of")
            item_code = row.get("item_code")
            item = frappe.db.sql(""" Select * from `tabItem` where variant_of=%s and item_code=%s and item_group='Finished Goods' """,(variant,dy_item_code),as_dict=1)
            
            console("item",item).log()
            
            if item:
            
               
              
                row["item_code"] = item[0]["item_code"]
                row["item_name"] = item[0]["item_name"]
                row["description"] = item[0]["description"]
                data.append(row)
            
            else:
                console("elsssss").log()

               
                frappe.throw(_("Item Code not found. Please ensure the Dying item exists in Item Master: <b>{0}</b>").format(dy_item_code))

                

    return data

@frappe.whitelist()
def setting_items(sales_order_no,purchase_type):
    if not sales_order_no or not purchase_type:
        frappe.throw("Both 'sales_order_no' and 'purchase_type' are required parameters.")

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
                    

                    
                    from  `tabParent Sales Order Item` as parent
                    
                    where
                        parent.parent =%s and parentfield = 'parent_items_tables' 
                    
                    order by parent.variant_of
    
            """,(sales_order_no,), as_dict=1)
    

    if purchase_type == 'Dying Service' or purchase_type == 'Stitching Service' or purchase_type == 'Stitching Bathrobe  Service':
        
        console("back dye method").log()
        console("New check").log()
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
                    parent.cut_length,
                    parent.secondary_qty_with_b_percent

                    
                    
                    
                    from  `tabSales Order Item` as parent
                    
                    where
                    parent.parent = %s and parent.parentfield = 'items'  
                    
                    order by parent.variant_of              
    
            """,(sales_order_no,), as_dict=1)
        console("QQ",query).log()

    
    
    for row in query:
       
        if purchase_type == "Weaving Service":
            variant = row.get("variant_of")
            item = frappe.db.sql(""" Select * from `tabItem` where variant_of=%s and item_group='Semi Finished Goods' """,(variant,),as_dict=1)
            
            
            if item:
              
                row["item_code"] = item[0]["item_code"]
                row["item_name"] = item[0]["item_name"]
                
                #Working for Order placed Qty
                query = """
                SELECT 
                    poi.item_code,
                    SUM(poi.qty) AS order_placed_total_qty
                FROM 
                    `tabPurchase Order Item` AS poi
                JOIN 
                    `tabPurchase Order` AS po
                ON 
                    poi.parent = po.name
                WHERE 
                    po.purchase_type = %(purchase_type)s
                    AND po.sales_order = %(sales_order)s
                    AND po.docstatus = 1
                    AND poi.item_code = item_code
                    
                GROUP BY 
                    poi.item_code;
                """
               
                result = frappe.db.sql(query, {"purchase_type": purchase_type, "sales_order": sales_order_no,"item_code":item[0]["item_code"]}, as_dict=True)

                if result and result[0].get("item_code") == item[0]["item_code"]:
                   
                    row["order_placed_qty"] = result[0]["order_placed_total_qty"]
                else:
                        row["order_placed_qty"] = 0
                
                data.append(row)
                
        
        if purchase_type == "Dying Service" :
            console("back for dyig service").log()
            # Replace '-ST' with '-DY' in the item_code
            dy_item_code = row.get("item_code").replace("-ST", "-DY")

            variant = row.get("variant_of")
            item_code = row.get("item_code")
            item = frappe.db.sql(""" Select * from `tabItem` where variant_of=%s and item_code=%s and item_group='Finished Goods' """,(variant,dy_item_code),as_dict=1)
            
            console("item",item).log()
            
            if item:
                console("enter").log()
              
                row["item_code"] = item[0]["item_code"]
                row["item_name"] = item[0]["item_name"]
                row["description"] = item[0]["description"]
            
            else:
                console("elsssss").log()

               
                frappe.throw(_("Item Code not found. Please ensure the Dying item exists in Item Master: <b>{0}</b>").format(dy_item_code))


                

            # console("row",row).log()
            item_code = row.get("item_code")
            paren_item = row.get("variant_of")
            console("item nn",item_code).log()


            #Working for Order placed Qty
            query = """
            SELECT 
                poi.item_code,
                SUM(poi.qty) AS order_placed_total_qty
            FROM 
                `tabPurchase Order Item` AS poi
            JOIN 
                `tabPurchase Order` AS po
            ON 
                poi.parent = po.name
            WHERE 
                po.purchase_type = %(purchase_type)s
                AND po.sales_order = %(sales_order)s
                AND po.docstatus = 1
                AND poi.item_code = item_code
                AND poi.parent_item = parent_item
                
            GROUP BY 
                poi.item_code;
            """
            
            result = frappe.db.sql(query, {"purchase_type": purchase_type, "sales_order": sales_order_no,"item_code":item[0]["item_code"],"parent_item":paren_item}, as_dict=True)
            console("REsult",result).log()

            if result and result[0].get("item_code") == item[0]["item_code"]:
                
                row["order_placed_qty"] = result[0]["order_placed_total_qty"]
            
            else:
                        row["order_placed_qty"] = 0

               
            
            data.append(row)
            
        if purchase_type == "Stitching Service" or purchase_type == 'Stitching Bathrobe  Service':
            console("Stitiching service if").log()
            dye_raw_material = row.get("item_code").replace("-ST", "-DY")
            row["orginal_item"] = dye_raw_material

            
            
            
            # name = frappe.db.get_value("Item", {'variant_of': row.variant_of , 'item_colour_variant': row.item_code},['name'])
            # console("name").log()
            # console(name).log()

            # if name:
            #     console("if name").log()
            #     variant_item = frappe.db.get_value("Item Variant Attribute",{'parent': name, 'variant_of': row.variant_of, 'attribute_value': 'Stitching'}, ['parent'])
            #     console(variant_item).log()
            #     if variant_item:
            #         console("if varinat item").log()
            #         orginal_item = row.item_code
            #         row["orginal_item"] = orginal_item
            #         row["item_code"] = variant_item
            #         row["item_name"] = variant_item
            #         console("rpow").log()
            #         console(row).log()
            #         console("variant_item",variant_item).log()
                    
                    
            #Working for Order placed Qty##################################
            query = """
            SELECT 
                poi.item_code,
                SUM(poi.qty) AS order_placed_total_qty
            FROM 
                `tabPurchase Order Item` AS poi
            JOIN 
                `tabPurchase Order` AS po
            ON 
                poi.parent = po.name
            WHERE 
                po.purchase_type = %(purchase_type)s
                AND po.sales_order = %(sales_order)s
                AND po.docstatus = 1
                AND poi.item_code = item_code
                
            GROUP BY 
                poi.item_code;
            """
            
            result = frappe.db.sql(query, {"purchase_type": purchase_type, "sales_order": sales_order_no,"item_code":row.item_code}, as_dict=True)
            console("REsult",result).log()

            if result and result[0].get("item_code") == row.item_code:
                
                row["order_placed_qty"] = result[0]["order_placed_total_qty"]
            else:
                row["order_placed_qty"] = 0

            
            data.append(row)


        # if purchase_type == "Stitching Service" or purchase_type == 'Stitching Bathrobe  Service':
        #     console("Stitiching service if").log()
        #     console("row.item_code",row.item_code).log()
        #     row.item_code = row.get("item_code").replace("-ST", "")

            
        #     name = frappe.db.get_value("Item", {'variant_of': row.variant_of , 'item_colour_variant': row.item_code},['name'])
        #     console("name").log()
        #     console(name).log()
            
            

        #     if name:
        #         console("if name").log()
        #         variant_item = frappe.db.get_value("Item Variant Attribute",{'parent': name, 'variant_of': row.variant_of, 'attribute_value': 'Stitching'}, ['parent'])
        #         console(variant_item).log()
        #         if variant_item:
        #             console("if varinat item").log()
        #             orginal_item = row.item_code
        #             console("orginal_item",orginal_item).log()
        #             row["orginal_item"] = orginal_item
        #             row["item_code"] = variant_item
        #             row["item_name"] = variant_item
        #             console("rpow").log()
        #             console(row).log()
        #             console("variant_item",variant_item).log()
                    
        #             #Working for Order placed Qty
        #             query = """
        #             SELECT 
        #                 poi.item_code,
        #                 SUM(poi.qty) AS order_placed_total_qty
        #             FROM 
        #                 `tabPurchase Order Item` AS poi
        #             JOIN 
        #                 `tabPurchase Order` AS po
        #             ON 
        #                 poi.parent = po.name
        #             WHERE 
        #                 po.purchase_type = %(purchase_type)s
        #                 AND po.sales_order = %(sales_order)s
        #                 AND po.docstatus = 1
        #                 AND poi.item_code = item_code
                       
        #             GROUP BY 
        #                 poi.item_code;
        #             """
                    
        #             result = frappe.db.sql(query, {"purchase_type": purchase_type, "sales_order": sales_order_no,"item_code":variant_item}, as_dict=True)
        #             console("REsult",result).log()

        #             if result and result[0].get("item_code") == variant_item:
                        
        #                 row["order_placed_qty"] = result[0]["order_placed_total_qty"]
        #             else:
        #                 row["order_placed_qty"] = 0

                    
        #             data.append(row)
        

            
            
    console("DATA",data).log()
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
                    
                    
                    from  `tabParent Sales Order Item` as parent
                    
                    where
                    parent.parent = %s and parent.parentfield = 'parent_items_tables' 
                    
                    order by   parent.variant_of             
    
            """,(sales_order_no,), as_dict=1)
        
        console("Query one",query).log()
        
    
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
    console("sss").log()
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
                
                order by raw.parent_item
                
   
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
                
                variant = row.get("parent_item")
                item_code = row.get("raw_mat_item")
                
                #Working for Order placed Qty
                query = """
                SELECT 
                    poi.item_code,
                    SUM(poi.qty) AS order_placed_total_qty
                FROM 
                    `tabPurchase Order Item` AS poi
                JOIN 
                    `tabPurchase Order` AS po
                ON 
                    poi.parent = po.name
                WHERE 
                    po.purchase_type = %(purchase_type)s
                    AND po.sales_order = %(sales_order)s
                    AND po.docstatus = 1
                    AND poi.item_code = item_code
                    And poi.parent_item = parent_item
                    
                GROUP BY 
                    poi.item_code;
                """
               
                result = frappe.db.sql(query, {"purchase_type": purchase_type, "sales_order": sales_order_no,"item_code":item_code,"parent_item" : variant}, as_dict=True)

                if result and result[0].get("item_code") == item_code:
                   
                    row["order_placed_qty"] = result[0]["order_placed_total_qty"]
                
                else:
                        row["order_placed_qty"] = 0
                
                raw.append(row)
                      

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
