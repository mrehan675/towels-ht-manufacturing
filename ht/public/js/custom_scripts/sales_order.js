
// CREAte Custom button only in Sales ORder Form
frappe.ui.form.on('Sales Order', {
    // refresh: function(frm) {
    //   const document_name = frm.doc.name ;
    //   sl_doc  = frappe.get_last_doc('Budgeting', filters={'sale_order': document_name});
    //   console.log("SL DOC");
    //   console.log(sl_doc);b
    //   if (!sl_doc){
    //     if (frm.doc.docstatus <= 1 ) {
    //         frm.add_custom_button(__('Create Budget Entry'), function() {
    //             createBudgetEntry(frm.doc);
                
    //         }).addClass('btn-primary');
    //         frm.custom_button_added = true;
             
    //     }
    //   }
        
    // },
    refresh: function(frm) {
        const document_name = frm.doc.name;
        let sl_doc;

        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Budgeting',
                filters: {
                    'sales_order': document_name
                },
                fields: ['sales_order'],
                order_by: 'creation desc',
                limit: 1
            },
            callback: function(response) {
                if (response.message && response.message.length > 0) {
                    sl_doc = response.message[0];
                    console.log("SL DOC", sl_doc);
                }

                // if (!sl_doc) {
                //     if (frm.doc.docstatus <= 1) {
                //         frm.add_custom_button(__('Create Budget Entry'), function() {
                //             createBudgetEntry(frm.doc);
                //         }).addClass('btn-primary');
                //         frm.custom_button_added = true;
                //     }
                // }

                //comment above code for testing purpose
                
                    if (frm.doc.docstatus <= 1) {
                        frm.add_custom_button(__('Create Budget Entry'), function() {
                            createBudgetEntry(frm.doc);
                        }).addClass('btn-primary');
                        frm.custom_button_added = true;
                    }
            
            }
        });



        //Filter Parent item field based
        frm.set_query("parent_item", function() {
			return {
				filters: [
					["has_variants", "=", "1"],
                    ["item_group","=","Finished Goods"]
				]
			}
		});
    },
    
    total_parent_qty(frm) {
        frm.set_value("total_secondary_qty", frm.doc.total_parent_qty*frm.doc.cut_length);
        frm.refresh_field("total_secondary_qty");
    },
    
    // Cut length is applicable on Secondary Qty in Meters
    cut_length(frm) {
        frm.set_value("total_secondary_qty", frm.doc.total_parent_qty*frm.doc.cut_length);
        frm.refresh_field("total_secondary_qty");
    },

    //Greigh KGS  formula based on Weight Measuring Unit (GM/MTR) ETC
    greigh_weight(frm) {
        griegh_kgs_cal(frm);

    },
    total_secondary_qty_with_b_percent(frm) {
        griegh_kgs_cal(frm);

    },



    

    



    
    // Raw Material paret Item Link field filter work (fetch items name from above item table)
    // refresh: function(frm) {
    //     frm.fields_dict["sales_order_raw_material"].grid.get_field("parent_item").get_query = function(doc, cdt, cdn) {
    //         // Get a list of unique parent items from the "budgeting_item" child table
    //         var uniqueParentItems = [];
    //         // Initialize itemQtyMap to store the total quantity
    //         var itemQtyMap = {};
    //         frm.doc.items.forEach(function(item) {
    //             if (item.item_code) {
    //                 if (itemQtyMap[item.item_code] === undefined) {
    //                     itemQtyMap[item.item_code] = 0;
    //                 }
    //                 itemQtyMap[item.item_code] += item.qty;
    //                 uniqueParentItems.push(item.item_code);
    //             }
    //         });
    //         console.log("TY");
    //         console.log(itemQtyMap);

    //         // Return a filter for the "parent_item" field in "rawmaterial_yarn_items" based on the unique parent items
    //         return {
    //             filters: [
    //                 ["Item", "name", "in", uniqueParentItems]
    //             ]
    //         };
    //     };
    // }
    
});


function griegh_kgs_cal(frm){
    
    if (frm.doc.weight_measuring_unit == "GM/MTR"){
        
        console.log("Weight Measuring Unit");
        console.log(frm.doc.weight_measuring_unit);

        //Greigh Weight*total Secondary Qty with B%(Parent Item)/1000
        var GreighKgs = (frm.doc.greigh_weight * frm.doc.total_secondary_qty_with_b_percent  )/ (1000) ;
        console.log(GreighKgs);
        frm.set_value("greigh_kgs",GreighKgs);
        frm.refresh_field("greigh_kgs");

    }
    if (frm.doc.weight_measuring_unit == "GM/PC"){
         // Greigh weight/1000*Total Quantity (Parent Item) with B%
         //Total Parent Qty with B Percent Field Name used in formula 
         var GreighKgs = (frm.doc.greigh_weight )/(1000) * (frm.doc.total_parent_qty_with_b_percent) ;
         console.log(GreighKgs);
        frm.set_value("greigh_kgs",GreighKgs);
        frm.refresh_field("greigh_kgs");

    }

}





// frappe.ui.form.on('Sales Order Raw Material', {
//     parent_item: function(frm, cdt, cdn) {
//         console.log("Sales Order Item");
//         var child = locals[cdt][cdn];
//         var parentItem = child.parent_item;
//         console.log("parent_item");
//         console.log(parentItem);
//         console.log(itemQtyMap[parentItem]);
       

//         // Set the quantity field in the rawmaterial_yarn_items table based on the selected parent item
//         if (itemQtyMap[parentItem] !== undefined) {
//             console.log("wn");
//             frappe.model.set_value(cdt, cdn, "qty", itemQtyMap[parentItem]);
//         }
//     }
// });


///////////END Button showing work


////////// Functionality on button Click//////////////
// function createbudgetentry(doc) {
//     var budgetEntry = frappe.model.get_new_doc('Budgeting');
//     budgetEntryItem.customer = doc.customer;
//     budgetEntryItem.sales_order = doc.name;
//     budgetEntryItem.shipment_date = doc.delivery_date;
//     budgetEntryItem.currency = doc.currency;
//     budgetEntryItem.order_receiving_date = doc.trnsaction_date;
    
//     budgetEntryItem.us_dollar = doc.total;
//     budgetEntryItem.exchange_rate = doc.conversion_rate;
//     budgetEntryItem.total_amount_pkr = doc.base_total;

    

//     budgetEntryItem.budgeting_item = []; // Initialize the items array
//     budgetEntryItem.rawmaterial_yarn_items = [];
    
//     try {
//         doc.items.forEach(function(item) {
//             var budgetEntryItem = frappe.model.add_child(budgetEntry, 'Budgeting Item', 'budgeting_item');

//             budgetEntryItem.item_code = item.item_code;
//             budgetEntryItem.delivery_date = item.delivery_date;
//             budgetEntryItem.item_name = item.item_name;
//             budgetEntryItem.description = item.description;
//             budgetEntryItem.qty = item.qty;
//             budgetEntryItem.uom = item.uom;
//             budgetEntryItem.stock_uom = item.stock_uom;
//             budgetEntryItem.conversion_factor = item.conversion_factor;
//             budgetEntryItem.picked_qty = item.picked_qty;
//             budgetEntryItem.stock_qty = item.stock_qty;
//             budgetEntryItem.price_list_rate = item.price_list_rate;
//             budgetEntryItem.base_price_list_rate = item.base_price_list_rate;
//             budgetEntryItem.margin_type = item.margin_type;
//             budgetEntryItem.discount_percentage = item.discount_percentage;
//             budgetEntryItem.discount_amount = item.discount_amount;
//             budgetEntryItem.rate = item.rate;
//             budgetEntryItem.base_rate = item.base_rate;
//             budgetEntryItem.amount = item.amount;
//             budgetEntryItem.base_amount = item.base_amount;
//             budgetEntryItem.warehouse = item.warehouse;
            
//             budgetEntryItem.b = item.b;
//             budgetEntryItem.net_weight = item.weight_per_unit;
            
            
            
            
//         });
//         //RAW MATERIAL TABLE WORK
//             doc.sales_order_raw_material.forEach(function(raw_item) {
//             var budgetEntryarnItem = frappe.model.add_child(budgetEntry, 'Sales Order Raw Material', 'rawmaterial_yarn_items');

//             budgetEntryarnItem.parent_item = raw_item.parent_item;
//             budgetEntryarnItem.qty = raw_item.qty;
//             budgetEntryarnItem.net_lbs = raw_item.net_lbs;
//             budgetEntryarnItem.loom_wastage = raw_item.loom_wastage;
//             budgetEntryarnItem.total_yarn_required = raw_item.total_yarn_required;
//             budgetEntryarnItem.raw_mat_item = raw_item.raw_mat_item;
//             budgetEntryarnItem.raw_mat_item_name = raw_item.raw_mat_item_name;
//             budgetEntryarnItem.consumption_ = raw_item.consumption_;
//             budgetEntryarnItem.consumption_lbs = raw_item.consumption_lbs;
//             budgetEntryarnItem.rate_per_lbs  = raw_item.rate_per_lbs;
//             budgetEntryarnItem.raw_material_amount = raw_item.raw_material_amount;
//             budgetEntryarnItem.net_weight = raw_item.net_weight;
           
            
//         }
//         );
        
//         frappe.route_options = { 'doc': budgetEntry };
//         frappe.set_route('Form', 'Budgeting', 'new-budgeting-1');
        
       
        
        
//     } catch (error) {
//         console.error('Error creating Budget entry:', error);
//     }
// }

/////////////////////////////////////////////////FETCH VARIANT BUTTON WORK///////////////////

// frappe.ui.form.on('Sales Order', {
//     refresh: function(frm) {
//         frm.add_custom_button(__('Fetch Variants'), function() {
//             var dialog = new frappe.ui.Dialog({
//                 title: __('Select Variants'),
//                 fields: [
//                     {
//                         fieldtype: 'Link',
//                         fieldname: 'parent_item',
//                         label: 'Parent Item',
//                         options: 'Item',
//                         reqd: 1
//                     },
//                     {
//                         fieldtype: 'HTML',
//                         fieldname: 'variants_html'
//                     }
//                 ],
//                 primary_action_label: __('Add Variants'),
//                 primary_action: function() {
//                     // Handle the selection of variants and add them to the item table
//                     var selectedVariants = [];
//                     // Use dialog.get_value('field_name') to get the selected parent item
//                     // Fetch variants based on the selected parent item and populate selectedVariants array

//                     // Example: Fetch and populate selectedVariants based on the selected parent item
//                     var parentItem = dialog.get_value('parent_item');
//                     // Implement fetching logic to populate selectedVariants

//                     // Add selected variants to the Sales Order item table
//                     selectedVariants.forEach(function(variant) {
//                         var row = frappe.model.add_child(frm.doc, 'items');
//                         row.item_code = variant.item_code;
//                         row.qty = 1; // You can set the quantity as per your requirements
//                     });

//                     dialog.hide();
//                     frm.refresh_field('items');
//                 }
//             });

//             dialog.show();
//         });
//     }
// });


/////////////////////////////////////////////16-11-23//Thursday///////////////////////////////////////////////////////

// """""""""""""" Script modified by Qadeer Rizvi since Dec 20, 2023 """"""""""""""


function createBudgetEntry(doc) {
    var budgetEntry = frappe.model.get_new_doc('Budgeting');
    budgetEntry.customer = doc.customer;
    budgetEntry.sales_order = doc.name;
    budgetEntry.shipment_date = doc.delivery_date;
    budgetEntry.currency = doc.currency;
    budgetEntry.order_receiving_date = doc.trnsaction_date;
    budgetEntry.us_dollar = doc.total;
    budgetEntry.exchange_rate = doc.conversion_rate;
    budgetEntry.total_amount_pkr = doc.base_total;
    budgetEntry.order_receiving_date = doc.po_date;
    budgetEntry.loom_type = doc.loom_type;
    budgetEntry.merchandiser_ = doc.merchandiser_;
    budgetEntry.work_order = doc.po_no;

    budgetEntry.budgeting_item = []; // Initialize the items array
    budgetEntry.rawmaterial_yarn_items = [];
    budgetEntry.parent_item_tab = [];
    try {
        doc.items.forEach(function(item) {
            var budgetEntryItem = frappe.model.add_child(budgetEntry, 'Budgeting Item', 'budgeting_item');

            budgetEntryItem.item_code = item.item_code;
            budgetEntryItem.delivery_date = item.delivery_date;
            budgetEntryItem.item_name = item.item_name;
            budgetEntryItem.description = item.description;
            budgetEntryItem.qty = item.qty;
            budgetEntryItem.uom = item.uom;
            budgetEntryItem.stock_uom = item.stock_uom;
            budgetEntryItem.conversion_factor = item.conversion_factor;
            budgetEntryItem.picked_qty = item.picked_qty;
            budgetEntryItem.stock_qty = item.stock_qty;
            budgetEntryItem.price_list_rate = item.price_list_rate;
            budgetEntryItem.base_price_list_rate = item.base_price_list_rate;
            budgetEntryItem.margin_type = item.margin_type;
            budgetEntryItem.discount_percentage = item.discount_percentage;
            budgetEntryItem.discount_amount = item.discount_amount;
            budgetEntryItem.rate = item.rate;
            budgetEntryItem.base_rate = item.base_rate;
            budgetEntryItem.amount = item.amount;
            budgetEntryItem.base_amount = item.base_amount;
            budgetEntryItem.warehouse = item.warehouse;

            budgetEntryItem.net_rate = item.net_rate;
            budgetEntryItem.net_amount = item.net_amount;


            
            
            // Map LBS Calculation fields
            
            budgetEntryItem.variant_of = item.variant_of;
            budgetEntryItem.net_weight = item.net_weight;
            budgetEntryItem.greigh_weight = item.greigh_weight;
            budgetEntryItem.weight_difference = item.weight_difference
            budgetEntryItem.weight_measuring_unit = item.weight_measuring_unit
            budgetEntryItem.total_secondary_qty = item.total_secondary_qty
            budgetEntryItem.total_seconday_qty_uom = item.total_seconday_qty_uom
            budgetEntryItem.total_parent_qty = item.total_parent_qty
            budgetEntryItem.total_parent_qty_uom = item.total_parent_qty_uom
            budgetEntryItem.b_percent = item.b_percent
            budgetEntryItem.total_secondary_qty_with_b_percent = item.total_secondary_qty_with_b_percent
            budgetEntryItem.total_parent_qty_with_b_percent = item.total_parent_qty_with_b_percent
            budgetEntryItem.loom_wastage = item.loom_wastage
            budgetEntryItem.parent_greigh_kgs = item.parent_greigh_kgs
            budgetEntryItem.parent_greigh_lbs = item.parent_greigh_lbs
            budgetEntryItem.total_final_lbs = item.total_final_lbs
            budgetEntryItem.secondary_qty = item.secondary_qty
            budgetEntryItem.qty_with_b_percent = item.qty_with_b_percent
            budgetEntryItem.secondary_qty_with_b_percent = item.secondary_qty_with_b_percent
            budgetEntryItem.secondary_to_standard_qty_ratio = item.secondary_to_standard_qty_ratio
            budgetEntryItem.greigh_kilograms = item.greigh_kilograms
            budgetEntryItem.lbs_greigh = item.lbs_greigh
            budgetEntryItem.final_lbs_ = item.final_lbs_
            budgetEntryItem.net_lbs = item.net_lbs
            
            // Vals of Weaving, Dyeing and Stitching
            budgetEntryItem.weave_qlty = item.weave_qlty
            budgetEntryItem.oh_rate = item.oh_rate
            budgetEntryItem.sh_rate = item.sh_rate
            budgetEntryItem.weaving_lbs = item.lbs
            budgetEntryItem.weaving_amount = item.weaving_amount

            
            budgetEntryItem.dye_qlty = item.dye_qlty
            budgetEntryItem.dye_rate = item.dye_rate
            budgetEntryItem.dye_waste_percentage = item.dye_waste_percentage
            budgetEntryItem.dye_lbs = item.dye_lbs
            budgetEntryItem.total_dyeing_amount = item.total_dyeing_amount
            
            budgetEntryItem.stiching_rate = item.stiching_rate
            budgetEntryItem.stitch_waste_qty = item.stitch_waste_qty
            budgetEntryItem.embroidery_rate = item.embroidery_rate
            budgetEntryItem.total_qty_with_waste = item.total_qty_with_waste
            budgetEntryItem.printing_rate = item.printing_rate
            budgetEntryItem.final_stich_rate = item.final_stich_rate
            budgetEntryItem.total_stitching_amount = item.total_stitching_amount  
            
            // Value of Prodcution field
            budgetEntryItem.b_percent_qty = item.b_percent_qty
            budgetEntryItem.qty_with_b_percent   = item.qty_with_b_percent
            
            // Change b_kgs and b_kgs_value formulas here 
            // budgetEntryItem.b_kgs   = ((item.total_parent_qty_with_b_percent) - (item.total_parent_qty)) *  (item.net_weight/1000)
            // budgetEntryItem.b_kgs_value  = (item.total_weaving_amount + item.total_yarn_amount ) * (item.b_percent /100)

            // b_kgs and b_kgs_value has been calculating in Sales order just setting in budegeting
            budgetEntryItem.b_kgs   = item.b_kgs
            budgetEntryItem.b_kgs_value  = item.b_kgs_value



            

            
            
            
        });
        //RAW MATERIAL TABLE WORK
            doc.sales_order_raw_material.forEach(function(raw_item) {
            var budgetEntryarnItem = frappe.model.add_child(budgetEntry, 'Sales Order Raw Material', 'rawmaterial_yarn_items');

            budgetEntryarnItem.parent_item = raw_item.parent_item;
            budgetEntryarnItem.qty = raw_item.qty;
            budgetEntryarnItem.net_lbs = raw_item.net_lbs;
            budgetEntryarnItem.loom_wastage = raw_item.loom_wastage;
            budgetEntryarnItem.component = raw_item.component
            budgetEntryarnItem.total_yarn_required = raw_item.total_yarn_required;
            budgetEntryarnItem.raw_mat_item = raw_item.raw_mat_item;
            budgetEntryarnItem.raw_mat_item_name = raw_item.raw_mat_item_name;
            budgetEntryarnItem.consumption_ = raw_item.consumption_;
            budgetEntryarnItem.consumption_lbs = raw_item.consumption_lbs;
            budgetEntryarnItem.rate_per_lbs  = raw_item.rate_per_lbs;
            budgetEntryarnItem.raw_material_amount = raw_item.raw_material_amount;
            budgetEntryarnItem.net_weight = raw_item.net_weight;
           
            
        }
        );

       // Parent Items Table
            doc.parent_items_table.forEach(function(item){   //doctype_name  //child table   //list   
                var parentItemTable = frappe.model.add_child(budgetEntry, 'Sales Order Item', 'parent_items_table');  //Working on IT LAst Saturday for sending data from sales order to budget entry /////////////////////////////////
                
                parentItemTable.item_code = item.item_code
                parentItemTable.delivery_date =     item.delivery_date
                parentItemTable.item_name = item.item_name
                parentItemTable.description = item.description
                parentItemTable.qty = item.qty
                parentItemTable.uom = item.uom
                parentItemTable.conversion_factor = item.conversion_factor
                parentItemTable.variant_of = item.variant_of

                parentItemTable.stock_uom = item.stock_uom;
                parentItemTable.picked_qty = item.picked_qty;
                parentItemTable.stock_qty = item.stock_qty;
                parentItemTable.price_list_rate = item.price_list_rate;
                parentItemTable.base_price_list_rate = item.base_price_list_rate;
                parentItemTable.margin_type = item.margin_type;
                parentItemTable.discount_percentage = item.discount_percentage;
                parentItemTable.discount_amount = item.discount_amount;
                parentItemTable.rate = item.rate;
                parentItemTable.base_rate = item.base_rate;
                parentItemTable.amount = item.amount;
                parentItemTable.base_amount = item.base_amount;
                parentItemTable.warehouse = item.warehouse;

                parentItemTable.net_rate = item.net_rate;
                parentItemTable.net_amount = item.net_amount;
                parentItemTable.b_value = item.b_value;






                
           
           
            
            
            
                ///////

                // weaving
                parentItemTable.weave_qlty = item.weave_qlty
                parentItemTable.oh_rate = item.oh_rate
                parentItemTable.sh_rate = item.sh_rate
                parentItemTable.lbs = item.lbs
                parentItemTable.weaving_amount = item.weaving_amount

                //Dyeing
                parentItemTable.dye_qlty = item.dye_qlty
                parentItemTable.dye_rate = item.dye_rate
                parentItemTable.dye_waste_percentage = item.dye_waste_percentage
                parentItemTable.dye_lbs = item.dye_lbs
                parentItemTable.total_dyeing_amount = item.total_dyeing_amount
                // Stitching
                parentItemTable.stiching_rate = item.stiching_rate
                parentItemTable.embroidery_rate = item.embroidery_rate
                parentItemTable.printing_rate = item.printing_rate
                parentItemTable.final_stich_rate = item.final_stich_rate
                parentItemTable.stitch_waste_qty = item.stitch_waste_qty
                parentItemTable.total_qty_with_waste = item.total_qty_with_waste
                parentItemTable.total_stitching_amount = item.total_stitching_amount

                //Parent Item Net weight DEtails
                parentItemTable.net_weight = item.net_weight
                parentItemTable.total_secondary_qty = item.total_secondary_qty
                parentItemTable.b_percent =  item.b_percent
                parentItemTable.loom_wastage = item.loom_wastage
                parentItemTable.greigh_weight = item.greigh_weight
                parentItemTable.total_seconday_qty_uom = item.total_seconday_qty_uom
                parentItemTable.total_secondary_qty_with_b_percent = item.total_parent_qty_with_b_percent
                parentItemTable.parent_greigh_kgs = item.parent_greigh_kgs
                parentItemTable.weight_difference = item.weight_difference
                parentItemTable.total_parent_qty = item.total_parent_qty
                parentItemTable.total_parent_qty_with_b_percent = item.total_parent_qty_with_b_percent
                parentItemTable.total_secondary_qty_with_b_percent = item.total_secondary_qty_with_b_percent
                parentItemTable.parent_greigh_lbs = item.parent_greigh_lbs
                parentItemTable.weight_measuring_unit = item.weight_measuring_unit
                parentItemTable.total_parent_qty_uom = item.total_parent_qty_uom
                parentItemTable.total_final_lbs = item.total_final_lbs
                parentItemTable.b_kgs = item.b_kgs
                parentItemTable.b_kgs_rate = item.b_kgs_rate
                parentItemTable.net_lbs = item.net_lbs
                parentItemTable.b_kgs_value = item.b_kgs_value
                parentItemTable.weave_waste_lbs = item.weave_waste_lbs
                parentItemTable.dye_waste_lbs = item.dye_waste_lbs
                

                //Net weight Details
                parentItemTable.secondary_qty = item.secondary_qty
                parentItemTable.secondary_qty_with_b_percent = item.secondary_qty_with_b_percent
                parentItemTable.greigh_kilograms = item.greigh_kilograms
                parentItemTable.lbs_greigh = item.lbs_greigh
                parentItemTable.qty_with_b_percent = item.qty_with_b_percent
                parentItemTable.secondary_to_standard_qty_ratio = item.secondary_to_standard_qty_ratio
                parentItemTable.final_lbs_ = item.final_lbs_
                parentItemTable.b_percent_qty = item.b_percent_qty
                

                
                parentItemTable.total_final_lbs = item.total_final_lbs
                parentItemTable.total_yarn_amount = item.total_yarn_amount
                parentItemTable.total_weaving_amount = item.total_weaving_amount
                parentItemTable.total_yarn_required = item.total_yarn_required


            });
        
        frappe.route_options = { 'doc': budgetEntry };
        frappe.set_route('Form', 'Budgeting', 'new-budgeting-1');
        
       
        
        
    } catch (error) {
        console.error('Error creating Budget entry:', error);
    }
}


frappe.ui.form.on('Sales Order', {
    
    // calculate weight difference on change of Net Weight
    net_weight(frm) {
      frm.set_value('weight_difference', Math.abs((frm.doc.net_weight*100/(frm.doc.greigh_weight || 1.0)-100)));
      frm.refresh_field("weight_difference")
    },
    
    // calculate weight difference on change of Greigh Weight
    greigh_weight(frm) {
      frm.set_value('weight_difference', Math.abs((frm.doc.net_weight*100/(frm.doc.greigh_weight || 1.0)-100)));
      frm.refresh_field("weight_difference")
    },
    
    // calculate Total Secondary Qty with B % on change of Total Secondary Qty
    total_secondary_qty(frm){
        var val = frm.doc.total_secondary_qty*frm.doc.b_percent/100 + frm.doc.total_secondary_qty;
        frm.set_value('total_secondary_qty_with_b_percent', val)
    },
    
    // calculate Total Secondary Qty with B % on change of Total Secondary Qty
    total_parent_qty(frm){
        var val = frm.doc.total_parent_qty*frm.doc.b_percent/100 + frm.doc.total_parent_qty;
        frm.set_value('total_parent_qty_with_b_percent', val)
    },
    
    // calculate Total Parent Qty with B% and Total Secondary Qty with B % on change of B%
    b_percent(frm){
        var val1 = frm.doc.total_secondary_qty*frm.doc.b_percent/100 + frm.doc.total_secondary_qty;
        frm.set_value('total_secondary_qty_with_b_percent', val1)
        
        var val2 = frm.doc.total_parent_qty*frm.doc.b_percent/100 + frm.doc.total_parent_qty;
        frm.set_value('total_parent_qty_with_b_percent', val2)
    },
    
    // Calculate Greigh Kgs and Greigh LBS on change of Loom wastage
    
    loom_wastage(frm){
        //Rehan Changing Greigh Kgs 
        // Comment greigh_kgs this field formula

        // var val1 = frm.doc.greigh_weight*frm.doc.total_secondary_qty_with_b_percent/1000;
        // frm.set_value("greigh_kgs", val1);
        // frm.refresh_field("greigh_kgs");

        
        var val2 = frm.doc.greigh_kgs*2.2046;
        frm.set_value("greigh_lbs", val2);
        frm.refresh_field("greigh_lbs");
        
        var val3 = frm.doc.greigh_lbs + frm.doc.greigh_lbs*frm.doc.loom_wastage/100;
        frm.set_value("final_lbs", val3);
        frm.refresh_field("final_lbs");
    },
    
    // Form Buttons 
    get_items_variant: function(frm){
        fetch_sales_order(frm);
    },
    clear_fields(frm){
        clear_parent_fields(frm);
    },
    parent_rows(frm){
        fetch_parent_items(frm);
    }
    
});


function fetch_parent_items(frm){

    console.log("chck parent");
    let matched_row = null;
            frm.doc.parent_items_table.forEach(function(row) {
                if (row.variant_of !== frm.doc.parent_item) {
                    matched_row = row;
                    console.log("matched_row",matched_row);

                }
            });

            if (matched_row) {
                // Set the parent form fields with the matched row's values
                frm.set_value("parent_item",matched_row.variant_of);
                frm.set_value("net_weight",matched_row.net_weight);
                frm.set_value("greigh_weight",matched_row.greigh_weight);
                frm.set_value("weight_difference",matched_row.weight_difference);
                frm.set_value("cut_length",matched_row.cut_length);
                frm.set_value("embroidery_rate",matched_row.embroidery_rate);
                frm.set_value("b_kgs_rate",matched_row.b_kgs_rate);
                frm.set_value("stitch_waste_qty",matched_row.stitch_waste_qty);
                frm.set_value("weight_measuring_unit",matched_row.weight_measuring_unit);
                frm.set_value("total_parent_qty",matched_row.total_parent_qty);
                frm.set_value("total_parent_qty_uom",matched_row.total_parent_qty_uom);
                frm.set_value("total_secondary_qty",matched_row.total_secondary_qty);
                frm.set_value("total_seconday_qty_uom",matched_row.total_seconday_qty_uom);
                frm.set_value("dye_rate",matched_row.dye_rate);
                frm.set_value("total_parent_qty_with_b_percent",matched_row.total_parent_qty_with_b_percent);
                frm.set_value("printing_rate",matched_row.printing_rate);
                frm.set_value("total_secondary_qty_with_b_percent",matched_row.total_secondary_qty_with_b_percent);
                frm.set_value("oh_rate",matched_row.oh_rate);
                frm.set_value("sh_rate",matched_row.sh_rate);
                frm.set_value("stitching_rate",matched_row.stiching_rate);
                frm.set_value("b_percent",matched_row.b_percent);
                frm.set_value("loom_wastage",matched_row.loom_wastage);
                frm.set_value("dye_waste_percentage",matched_row.dye_waste_percentage);
                frm.set_value("greigh_kgs",matched_row.greigh_kgs);
                frm.set_value("final_lbs",matched_row.final_lbs);
                // Set more fields as necessary

                // frappe.msgprint(__('Parent form fields updated from the child table.'));
            } else {
                frappe.msgprint(__('No matching rows found in parent_item_table.'));
            }
}



const fetch_sales_order=(frm)=>{
    if (frm.doc.parent_item) {
        frm.data = []
        let dialog = new frappe.ui.Dialog({
            title: __("Variants of the Item"),
            fields: [
                {
                    fieldtype: 'Data',
                    fieldname: 'item_name_filter',
                    label: __('Filter by Item Name'),
                    change: function () {
                        applyFilter(dialog, frm);
                    }
                },
                {
                    fieldname: "items", read_only: 1, label: 'Variants of the Item', fieldtype: "Table", cannot_add_rows: true, data: frm.data,
                    get_data: () => {
                        console.log("Checking get data");
                        return frm.data
                    },
                    fields: [
                        // {
                        //     fieldtype: 'Link',
                        //     fieldname: "item_code",
                        //     in_list_view: 1,
                        //     read_only: 1,
                        //     label: __('Item'),
                        //     columns: 2
                        // },
                        {
                            fieldtype: 'Data',
                            fieldname: "item_name",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Item Name'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Link',
                            fieldname: "item_group",
                            options:'Item Group',
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Item Group'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Link',
                            fieldname: "uom",
                            options: 'UOM',
                            in_list_view: 1,
                            read_only: 1,
                            label: __('UOM'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "qty",
                            read_only: 1,
                            in_list_view: 1,
                            columns: 1,
                            label: __('Qty'),
                             change: function () {
                                updateTotalQty(dialog);
                               console.log("Qty change");
                               
                            }
                        },
                        {
                            fieldtype: 'Check',
                            fieldname: "check",
                            label: __('Select'),
                            in_list_view: 1,
                            columns: 1,
                            change: function () {
                                updateTotalQty(dialog);
                               console.log("Select Chnage");
                               
                            }
                        },
                        {
                            fieldtype: 'Date',
                            fieldname: "delivery_date",
                            label: __('Delivery Date'),
                            in_list_view: 1,
                            columns: 2
                        },
                        {
                            fieldname : 'embroidery_rate',
                            fieldtype : 'Float',
                            label: __('Embroidery Rate'),
                            in_list_view : 1,
                            columns: 1,

                        },
                        {
                            fieldname : 'sh_rate',
                            fieldtype : 'Float',
                            label: __('SH Rate'),
                            in_list_view : 1,
                            columns: 1,
                        }  ,
                        {
                            fieldname : 'dye_waste_percentage',
                            fieldtype : 'Float',
                            label: __('Dye Waste Percentage'),
                            in_list_view : 1,
                            columns: 1,
                        }  ,
                        {
                            fieldname: 'cb1',
                            fieldtype: 'Column Break',
                            label: __(''),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'variant_of',
                            fieldtype: 'Link',
                            options: 'Link',
                            label: __('Variant of'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'net_weight',
                            fieldtype: 'Float',
                            label: __('Net Weight'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'greight_weight',
                            fieldtype: 'Float',
                            label: __('Greigh Weight'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'weight_difference',
                            fieldtype: 'Float',
                            label: __('Weight Difference'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'weight_measuring_unit',
                            fieldtype: 'Select',
                            options: ["LBS/DZ", "OZ/PC", "GM/MTR", "KG/YD"],
                            label: __('Weight Measuring Unit'),
                            in_list_view: 1,
                            columns: 1,
                        },
                         
                        {
                            fieldname : 'stitching_rate',
                            fieldtype : 'Float',
                            label: __('Stitching Rate'),
                            in_list_view : 1,
                            columns: 1
                        },
                        {
                            label: __('OH Rate'),
                            fieldname : 'oh_rate',
                            fieldtype: 'Float',
                            in_list_view : 1,
                            columns: 1
                        },
                        {
                            label: __('Stitch Waste Qty'),
                            fieldname : 'stitch_waste_qty',
                            fieldtype: 'Float',
                            in_list_view : 0,
                            columns: 1
                        },
                        {
                            fieldname: 'cb2',
                            fieldtype: 'Column Break',
                            label: __(''),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'total_secondary_qty',
                            fieldtype: 'Float',
                            label: __('Total Secondary Qty'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'total_secondary_qty_uom',
                            fieldtype: 'Link',
                            options: 'UOM',
                            label: __('Total Secondary Qty UOM'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'total_parent_qty',
                            fieldtype: 'Float',
                            label: __('Total Parent Qty'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'total_parent_qty_uom',
                            fieldtype: 'Link',
                            options: "UOM",
                            label: __('Total Parent Qty UOM'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'b_percent',
                            fieldtype: 'Percent',
                            label: __('B %'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            label: __('Printing Rate'),
                            fieldname: 'printing_rate',
                            fieldtype: 'Float',
                            in_list_view : 1,
                            columns: 1
                        },
                        {
                            label: __('Dye Rate'),
                            fieldname : 'dye_rate',
                            fieldtype: 'Float',
                            in_list_view : 1,
                            columns: 1
                        },
                        {
                            label: __('B Kgs Rate'),
                            fieldname : 'b_kgs_rate',
                            fieldtype: 'Float',
                            in_list_view : 0,
                            columns: 1
                        },
                        {
                            fieldname: 'cb3',
                            fieldtype: 'Column Break',
                            label: __(''),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'total_secondary_qty_with_b_percent',
                            fieldtype: 'Float',
                            label: __('Total Secondary Qty with B %'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'total_parent_qty_with_b_percent',
                            fieldtype: 'Float',
                            label: __('Total Secondary Qty'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'secondary_to_standard_qty_ratio',
                            fieldtype: 'Float',
                            label: __('Secondary to Standard Qty Ratio'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'loom_wastage',
                            fieldtype: 'Percent',
                            label: __('Loom Wastage'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'greigh_kgs',
                            fieldtype: 'Float',
                            label: __('Greigh Kgs'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'greigh_lbs',
                            fieldtype: 'Float',
                            label: __('Greigh LBS'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'final_lbs',
                            fieldtype: 'Float',
                            label: __('Final LBS'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldname: 'cut_length',
                            fieldtype: 'Float',
                            label: __('Cut Length'),
                            in_list_view: 0,
                            columns: 1,
                        }
                        
                    ]
                },
            
                {
                    fieldtype: 'Float',
                    fieldname: 'total_qty',
                    label: __('Total Qty'),
                    read_only: 1,
                    columns: 1,
                }
            ],
            primary_action_label: 'Get Items',
            primary_action(values) {
                if (values.items) {
                    console.log("Primary action")
                    updateTotalQty(dialog);
                    console.log(values.items)
                    let totalQty = 0;
                    for (let row of values.items) {
                        if(row.check ==1){

                            let child = frm.add_child('items', {qty: row.qty });
                            let cdt = child.doctype
                            let cdn = child.name
                            frappe.model.set_value(cdt,cdn,'item_code', row.item_code);
                            // set parent item in variant of by Qadeer Rizvi
                            frappe.model.set_value(cdt, cdn, 'variant_of', frm.doc.parent_item)
                            frappe.model.set_value(cdt,cdn,'qty', row.qty);
                            frappe.model.set_value(cdt,cdn,'delivery_date', row.delivery_date);
                            frappe.model.set_value(cdt,cdn, "net_weight", row.net_weight);
                            frappe.model.set_value(cdt,cdn, "greigh_weight", row.greight_weight);
                            frappe.model.set_value(cdt,cdn, "weight_difference", row.weight_difference);
                            frappe.model.set_value(cdt,cdn, "weight_measuring_unit", row.weight_measuring_unit);
                            frappe.model.set_value(cdt,cdn, "total_seconday_qty_uom", row.total_secondary_qty_uom);
                            frappe.model.set_value(cdt,cdn, "total_parent_qty_uom", row.total_parent_qty_uom);
                            frappe.model.set_value(cdt,cdn, "b_percent", row.b_percent);
                            frappe.model.set_value(cdt,cdn, "loom_wastage", row.loom_wastage);
                            frappe.model.set_value(cdt,cdn, "parent_greigh_kgs", row.greigh_kgs);
                            frappe.model.set_value(cdt,cdn, "parent_greigh_lbs", row.greigh_lbs);
                            frappe.model.set_value(cdt,cdn, "total_final_lbs", row.final_lbs);
                            frappe.model.set_value(cdt,cdn, "total_parent_qty", row.total_parent_qty);
                            frappe.model.set_value(cdt,cdn, "total_parent_qty_with_b_percent", row.total_parent_qty_with_b_percent);
                            frappe.model.set_value(cdt,cdn, "total_secondary_qty", row.total_secondary_qty);
                            frappe.model.set_value(cdt,cdn, "total_secondary_qty_with_b_percent", row.total_secondary_qty_with_b_percent);
                            frappe.model.set_value(cdt, cdn, "secondary_to_standard_qty_ratio", row.total_secondary_qty/(row.total_parent_qty_with_b_percent || 1.0))
                            
                            var secondaryQty = Math.round(row.total_secondary_qty*row.qty/(row.total_parent_qty || 1.0));
                            frappe.model.set_value(cdt, cdn, "secondary_qty", secondaryQty)    
                            frappe.model.set_value(cdt, cdn, "secondary_qty_with_b_percent", secondaryQty*row.b_percent/100 + secondaryQty)
                            frappe.model.set_value(cdt, cdn, "b_percent_qty", row.qty*row.b_percent/100)
                            frappe.model.set_value(cdt, cdn, "qty_with_b_percent", row.qty*row.b_percent/100 + row.qty)
                            
                            var rowGreighKgs = Math.round(row.greigh_kgs*row.qty/(row.total_parent_qty || 1.0));
                            var rowGreighLBS = rowGreighKgs*2.2046
                            var rowFinalLBS = rowGreighLBS + (rowGreighLBS*row.loom_wastage/100)
                            frappe.model.set_value(cdt, cdn, "greigh_kilograms", rowGreighKgs)
                            frappe.model.set_value(cdt, cdn, "lbs_greigh", rowGreighLBS)
                            frappe.model.set_value(cdt, cdn, "final_lbs_",  rowFinalLBS)
                            // totalQty += row.qty || 0;
                            
                            var rowFinalStichRate = row.embroidery_rate + row.stitching_rate + row.printing_rate
                            frappe.model.set_value(cdt,cdn,"embroidery_rate", row.embroidery_rate)
                            frappe.model.set_value(cdt,cdn,"stiching_rate",row.stitching_rate)
                            frappe.model.set_value(cdt,cdn,"printing_rate",row.printing_rate)
                            frappe.model.set_value(cdt,cdn, "final_stich_rate", rowFinalStichRate)
                            frappe.model.set_value(cdt,cdn, "stitch_waste_qty",row.stitch_waste_qty)
                            var rowTotalQtyWaste = row.qty + row.stitch_waste_qty
                            var rowTotalStitchingAmount = row.stitching_rate * row.total_parent_qty_with_b_percent
                            frappe.model.set_value(cdt,cdn,"total_qty_with_waste", rowTotalQtyWaste)
                            frappe.model.set_value(cdt,cdn,"total_stitching_amount", rowTotalStitchingAmount)
                            frappe.model.set_value(cdt,cdn,"dye_rate",row.dye_rate)
                            frappe.model.set_value(cdt,cdn,"oh_rate",row.oh_rate)
                            frappe.model.set_value(cdt,cdn,"sh_rate",row.sh_rate)
                            frappe.model.set_value(cdt,cdn,"dye_waste_percentage",row.dye_waste_percentage)
                            frappe.model.set_value(cdt,cdn,"b_kgs_rate",row.b_kgs_rate)

                         
                            
                           
                            

                                                        
                            // Based ON Weight Measuring Unit Field Calc


                            //  GM/MTR 

                            if (row.weight_measuring_unit== "GM/MTR"){
                                console.log("Enter in GM PER METER");
                                
                                // dye qlty value for calc
                                var rowDyeQlty = (row.net_weight * row.total_secondary_qty / row.total_parent_qty) / 1000 
                                frappe.model.set_value(cdt,cdn,"dye_qlty", rowDyeQlty)
                               

                                //weave qlty formula (Dye QLTY *B%)+ Dye Qlty (this formula has been changed) Below are new formula
                                // if GM/MTR=> Greight Weight*(Tot Secondary Qty with b% / Total Parent qty with b%)/1000

                                var rowWeaveQlty =  (row.greight_weight) * ((row.total_secondary_qty_with_b_percent/row.total_parent_qty_with_b_percent)/ 1000)
                                //frappe.model.set_value(cdt,cdn,"weave_qlty",rowWeaveQlty)
                                 frappe.model.set_value(cdt,cdn,"weave_qlty",rowWeaveQlty)
                                console.log("WEAVE QLTY 9");
                                console.log(rowWeaveQlty);

                                                                
                               
                                
                                // Dye Lbs calc
                                var rowDyeLbs = (row.total_parent_qty_with_b_percent) * (rowDyeQlty) * 2.2046
                                frappe.model.set_value(cdt,cdn,"dye_lbs",rowDyeLbs)
                                                                                            
                                // Weaving Lbs calc
                                var rowweaveLbs = (row.total_parent_qty_with_b_percent) * (rowWeaveQlty) * 2.2046
                                frappe.model.set_value(cdt,cdn,"lbs",rowweaveLbs)


                                //Weaving Amount
                                var rowWeavingAmount = rowweaveLbs * (row.oh_rate + row.sh_rate)
                                frappe.model.set_value(cdt,cdn,"weaving_amount", rowWeavingAmount)

                                 // Total Dyeing Amount Calc
                                 var rowTotalDyeAmount = row.dye_rate * rowDyeLbs
                                 frappe.model.set_value(cdt,cdn,"total_dyeing_amount", rowTotalDyeAmount)


                                //Calculating Net Lbs in Item vairant table over here
                                // //Net Lbs for gm/mtr= net weight*total secondary qty(parent item)/1000*2.2046
                                frappe.model.set_value(cdt, cdn, "net_lbs", (row.net_weight) * (row.total_secondary_qty/1000)* 2.2046);

                                //set cut length
                                frappe.model.set_value(cdt,cdn, "cut_length", row.cut_length);


                         
                            }

                            // GM/PC
                            if (row.weight_measuring_unit == "GM/PC"){

                                // Dye Qlty calculation 
                                var rowDyeQlty = row.net_weight / 1000
                                frappe.model.set_value(cdt,cdn,"dye_qlty", rowDyeQlty)

                                //weave qlty formula Greigh Weight/1000
                                 var rowWeaveQlty = row.greight_weight / 1000
                                //  console.log("rowWeave");
                                //  console.log(rowWeaveQlty);
                                 frappe.model.set_value(cdt,cdn,"weave_qlty",rowWeaveQlty)
 

                                
                                
                                 // Dye Lbs calc
                                var rowDyeLbs = (row.total_parent_qty_with_b_percent) * (rowDyeQlty) * 2.2046
                                frappe.model.set_value(cdt,cdn,"dye_lbs",rowDyeLbs)
                                                              
                                 // Weaving Lbs calc
                                var rowweaveLbs = (row.total_parent_qty_with_b_percent) * (rowWeaveQlty) * 2.2046
                                frappe.model.set_value(cdt,cdn,"lbs",rowweaveLbs)



                                //Weaving Amount
                                var rowWeavingAmount = rowweaveLbs * (row.oh_rate + row.sh_rate)
                                frappe.model.set_value(cdt,cdn,"weaving_amount", rowWeavingAmount)


                                 // Total Dyeing Amount Calc
                                 var rowTotalDyeAmount = row.dye_rate * rowDyeLbs
                                 frappe.model.set_value(cdt,cdn,"total_dyeing_amount", rowTotalDyeAmount)



                                //Net lbs for gm/PC=(Net weight*total quantity (parent item)/1000)*2.2046
                                frappe.model.set_value(cdt, cdn, "net_lbs", (row.net_weight) * (row.total_parent_qty/1000)* 2.2046);
                           


                            }
                            
                                                       


                            
                           
                           
                                                       
                        }
                    }
                    // Set the calculated total quantity in the dialog
                    // dialog.fields_dict.total_qty.set_value(totalQty);
                    
                }
                cur_frm.refresh_field('items')
                dialog.hide();
            }
        });
        
        

        

        frappe.call({
            async: false,
            method: "ht.utils.variant.setting_variant",
            args: {
                parent_item : cur_frm.doc.parent_item,
            },
            callback: function (r) {
                if (r.message) {
                    console.log("Enter in call back");
                    
                    for (let row of r.message) {
                        console.log("ITEM");
                        console.log(row.item_code);
                        frappe.db.get_doc('Item', row.item_code)
                        .then(itm_doc => {
                            setTimeout(() => {
                                dialog.fields_dict.items.df.data.push({
                                    "sales_order":frm.doc.sales_order,
                                    "item_code": row.item_code,
                                    "item_name": row.item_name,
                                    "item_group": row.item_group,
                                    'uom':row.stock_uom,
                                    "delivery_date":frm.doc.delivery_date,
                                    "variant_of": frm.doc.parent_item,
                                    "net_weight": frm.doc.net_weight,
                                    "greight_weight": frm.doc.greigh_weight,
                                    "weight_difference": frm.doc.weight_difference,
                                    "weight_measuring_unit": frm.doc.weight_measuring_unit,
                                    "total_secondary_qty_uom": frm.doc.total_seconday_qty_uom,
                                    "total_parent_qty_uom": frm.doc.total_parent_qty_uom,
                                    "b_percent": frm.doc.b_percent,
                                    "loom_wastage": frm.doc.loom_wastage,
                                    "greigh_kgs": frm.doc.greigh_kgs,
                                    "greigh_lbs": frm.doc.greigh_lbs,
                                    "final_lbs": frm.doc.final_lbs,
                                    "total_secondary_qty": frm.doc.total_secondary_qty,
                                    "total_secondary_qty_with_b_percent": frm.doc.total_secondary_qty_with_b_percent,
                                    "total_parent_qty": frm.doc.total_parent_qty,
                                    "total_parent_qty_with_b_percent": frm.doc.total_parent_qty_with_b_percent,
                                    "secondary_to_standard_qty_ratio": frm.doc.total_secondary_qty/(frm.doc.total_parent_qty_with_b_percent || 1.0),
                                    // Custom fields Additions
                                    "embroidery_rate": frm.doc.embroidery_rate,
                                    "sh_rate": frm.doc.sh_rate,
                                    "stitching_rate": frm.doc.stitching_rate,
                                    "oh_rate": frm.doc.oh_rate,
                                    "printing_rate":frm.doc.printing_rate,
                                    "dye_rate": frm.doc.dye_rate,
                                    "stitch_waste_qty" : frm.doc.stitch_waste_qty,
                                    "dye_waste_percentage" : frm.doc.dye_waste_percentage,
                                    "b_kgs_rate": frm.doc.b_kgs_rate,
                                    "cut_length": frm.doc.cut_length,
                                });
                                dialog.fields_dict.items.df.data = dialog.fields_dict.items.df.data.map(variant => {
                                    // Check if the item is already in the main item table (e.g., frm.doc.items)
                                    let existsInMainTable = frm.doc.items.some(item => item.item_name === variant.item_name);
                                    
                                    // If exists, mark the select checkbox
                                    if (existsInMainTable) {
                                        variant.check = 1;
                                        variant.disabled = true; // Add a flag to indicate the row should be frozen
                                                                           
                                    } else {
                                        variant.check = 0;
                                        variant.disabled = false; // Ensure editable if not exists
                                    }
                                
                                    return variant;
                                });
                                
                                frm.data = dialog.fields_dict.items.df.data;                                
                                dialog.fields_dict.items.grid.refresh();
                            }, 500);
                        });
                    }
                    dialog.show();
                    dialog.$wrapper.find('.modal-dialog').css("max-width", "80%");
                }
            }
        });

    }
    else {
        frappe.msgprint('Please Select Parent Item First');
    }
}

function updateTotalQty(dialog) {
    let totalQty = 0;
    const items = dialog.get_value('items');
    
    if (items && items.length > 0) {
        for (let row of items) {
            if (row.check == 1) {
                totalQty += row.qty || 0;
            }
        }
    }
    
    dialog.set_value('total_qty', totalQty);
}



const applyFilter = (dialog, frm) => {
    let filter_value = dialog.get_value('item_name_filter').toLowerCase();

    console.log("filter",filter_value);
    
    // Assume `frm.data` is your original dataset
    let filtered_data = frm.data.filter(row => {
        return !filter_value || row.item_name.toLowerCase().includes(filter_value);
    });

    console.log("filter_data",filtered_data);

    dialog.fields_dict.items.df.data = filtered_data;
    dialog.fields_dict.items.grid.refresh();

    updateTotalQty(dialog);
};



///////////////////////////////////////////////////////Testing////////////////////////////////////////////////////////////////////////////////////////



var itemQtyMap = {};  // Declare itemQtyMap in a global scope
 var comp_dict = {};
frappe.ui.form.on('Sales Order', {
    // Below Code check that Raw Material of Each parent Item Consumption is Equal to 100 %
    
    // before_save:function(frm){
    //     //  let comp_dict = {};
    //     frm.doc.sales_order_raw_material.forEach(function(item){
            
    //         if (item.parent_item){
                
    //             comp_dict[item.parent_item] += item.consumption_ 
    //         }
    //             });
    //              console.log("checking Component Dict");
    //             console.log(comp_dict[item.parent_item]);
        
    // },
    before_save: function (frm) {
    // Initialize comp_dict as an empty object
    let comp_dict = {};

    frm.doc.sales_order_raw_material.forEach(function (comp) {
        if (comp.parent_item) {
            // Check if the parent_item is already a key in comp_dict
            if (!comp_dict[comp.parent_item]) {
                // If not, initialize it with the current consumption_
                comp_dict[comp.parent_item] = comp.consumption_;
            } else {
                // If it exists, add the current consumption_ to the existing value
                comp_dict[comp.parent_item] += comp.consumption_;
            }
        }
    });

    // Log the comp_dict object
    console.log("Checking Component Dict");
    console.log(comp_dict);
    // Check if any value in comp_dict is less than 100
    const valuesLessThan100 = Object.values(comp_dict).some(value => value < 100);

    // If any value is less than 100, throw an error
    if (valuesLessThan100) {
        frappe.msgprint(__('Component consumption must be at least 100.'));
        frappe.validated = false;
    }
    
},

    // Raw Material paret Item Link field filter work (fetch items name from above item table)

    refresh: function(frm) {
        frm.fields_dict["sales_order_raw_material"].grid.get_field("parent_item").get_query = function(doc, cdt, cdn) {
            console.log("Parent item checking");
            // Get a list of unique parent items from the "budgeting_item" child table
            var uniqueParentItems = [];
            // Initialize itemQtyMap to store the total quantity
            // itemQtyMap = {};
            frm.doc.items.forEach(function(item) {
                if (item.item_code) {
                    console.log("E1");
                    if (itemQtyMap[item.item_code] === undefined) {
                        console.log("E2");
                        itemQtyMap[item.item_code] = 0;
                    }
                    itemQtyMap[item.item_code] = item.qty;
                    console.log("ITEM QTY CHECK");
                    console.log(itemQtyMap[item.item_code]);
                    uniqueParentItems.push(item.variant_of);
                }
            });
            console.log(itemQtyMap);

            // Return a filter for the "parent_item" field in "rawmaterial_yarn_items" based on the unique parent items
            return {
                filters: [
                    // remove by Qadeer Rizvi as we want to put parent item in this field
                    ["Item", "name", "in", uniqueParentItems]
                    
                ]
            };
        };
    }
});

frappe.ui.form.on('Sales Order Raw Material', {
    parent_item: function(frm, cdt, cdn) {
        console.log("Raw material item");
        var child = locals[cdt][cdn];
        var parentItem = child.parent_item;
        if (frm.doc.parent_item == child.parent_item){
            frappe.model.set_value(cdt, cdn, "total_yarn_required", frm.doc.final_lbs);
            frappe.model.set_value(cdt, cdn, "qty", frm.doc.total_parent_qty_with_b_percent);
            //calculating Net Lbs fro Raw Material Table

            // //Net Lbs for gm/mtr= net weight*total secondary qty(parent item)/1000*2.2046            
            // if (frm.doc.weight_measuring_unit =="GM/MTR" ){
            //  frappe.model.set_value(cdt, cdn, "net_lbs", (frm.doc.net_weight) * (frm.doc.total_secondary_qty/1000)* 2.2046);
            // }

            // //Net lbs for gm/PC=(Net weight*total quantity (parent item)/1000)*2.2046
            // if (frm.doc.weight_measuring_unit == "GM/PC"){
            //  frappe.model.set_value(cdt, cdn, "net_lbs", (frm.doc.net_weight) * (frm.doc.total_parent_qty/1000)* 2.2046);
            // }
        }
        // Set the quantity field in the rawmaterial_yarn_items table based on the selected parent item
        if (itemQtyMap[parentItem] !== undefined) {
            console.log("ssssssssssssssss");
            console.log("wn");
            frappe.model.set_value(cdt, cdn, "qty", itemQtyMap[parentItem]);
        }
    }
});


///////On field Calculation for Sale Order Item Table/////////////////////

frappe.ui.form.on('Sales Order',{
    validate: function(frm, cdt, cdn) {
        
        //Setup item qty to total qty in pcs field
        frm.doc.items.forEach(function(item) {
            console.log("enter in after save");
            
            item.total_qty_in_pcs = item.qty;
           
        });
        frm.refresh_field('items');
        
    }
    
});
frappe.ui.form.on('Sales Order Item',{
    greigh_weight_gmmt: function(frm,cdt,cdn){
        greigh_weight_gmmt(frm,cdt,cdn);
        greigh_kgs(frm,cdt,cdn);
    },
     net_weight_gmmt: function(frm,cdt,cdn){
        net_weight_gmmt(frm,cdt,cdn);
    },
     qty: function(frm,cdt,cdn){
        qty(frm,cdt,cdn);
        
        
        // LBS Calculations on change of Variant Item Qty in items table
        // Script modified by Qadeer Rizvi
        // row = locals[cdt][cdn]
        // var secondaryQty = Math.round(row.total_secondary_qty*row.qty/(row.doc.total_parent_qty || 1.0));
        // frappe.model.set_value(cdt, cdn, "secondary_qty", secondaryQty)    
        // frappe.model.set_value(cdt, cdn, "secondary_qty_with_b_percent", secondaryQty*row.b_percent/100 + secondaryQty)
        // frappe.model.set_value(cdt, cdn, "qty_with_b_percent", row.qty*row.b_percent/100 + row.qty)
        
        // var rowGreighKgs = Math.round(row.parent_greigh_kgs*row.qty/(row.total_parent_qty || 1.0));
        // var rowGreighLBS = rowGreighKgs*2.2046
        // var rowFinalLBS = rowGreighLBS + (rowGreighLBS*row.loom_wastage/100)
        // frappe.model.set_value(cdt, cdn, "greigh_kilograms", rowGreighKgs)
        // frappe.model.set_value(cdt, cdn, "lbs_greigh", rowGreighLBS)
        // frappe.model.set_value(cdt, cdn, "final_lbs_",  rowFinalLBS)
    },
     b: function(frm,cdt,cdn){
        b(frm,cdt,cdn);
        total_qty_in_pcs_with_b(frm,cdt,cdn);
        mtrspcs(frm,cdt,cdn);
        greigh_kgs(frm,cdt,cdn);
        greigh_lbs(frm,cdt,cdn);
        loom_wastage(frm,cdt,cdn);
        
    },
    loom_wastage : function(frm,cdt,cdn){
        final_lbs(frm,cdt,cdn);
        
    },
    
    
    // client script added by Qadeer Rizvi for copying one row vals to all variants linked to same Variant of
    // copy_vals: function(frm, cdt, cdn) {
    //     // Get the current row
    //     var row = locals[cdt][cdn];

    //     // Iterate through each row in the items table
    //     frm.doc.items.forEach(function(item) {
    //         // Check if the item is not the current row and has the same variant
    //         if (item.name !== row.name && item.variant_of === row.variant_of) {
    //             // Copy the value from the current row to the other row with the same variant
                
    //             frappe.model.set_value(cdt, item.name, 'net_weight_gmmt', row.net_weight_gmmt);
    //             frappe.model.set_value(cdt, item.name, 'greigh_weight', row.greigh_weight);
    //             frappe.model.set_value(cdt, item.name, 'weight_difference', row.weight_difference);
    //             frappe.model.set_value(cdt, item.name, 'total_meters', row.total_meters);
    //             frappe.model.set_value(cdt, item.name, 'total_qty_in_pcs', row.total_qty_in_pcs);
    //             frappe.model.set_value(cdt, item.name, 'total_mtrs_with_b', row.total_mtrs_with_b);
    //             frappe.model.set_value(cdt, item.name, 'total_qty_in_pcs_with_b', row.total_qty_in_pcs_with_b);
    //             frappe.model.set_value(cdt, item.name, 'mtrspcs', row.mtrspcs);
    //             frappe.model.set_value(cdt, item.name, 'b', row.b);
    //             frappe.model.set_value(cdt, item.name, 'greigh_kgs', row.greigh_kgs);
    //             frappe.model.set_value(cdt, item.name, 'final_lbs', row.final_lbs);
    //             frappe.model.set_value(cdt, item.name, 'loom_wastage', row.loom_wastage);
                
    //             frappe.model.set_value(cdt, item.name, 'b_', row.b_);
    //             frappe.model.set_value(cdt, item.name, 'b_qty', row.b_qty);
    //             frappe.model.set_value(cdt, item.name, 'total_qty_with_b', row.total_qty_with_b);
    //             frappe.model.set_value(cdt, item.name, 'b_kgs', row.b_kgs);
    //             frappe.model.set_value(cdt, item.name, 'b_kgs_rate', row.b_kgs_rate);
    //             frappe.model.set_value(cdt, item.name, 'b_kgs_value', row.b_kgs_value);
    //             frappe.model.set_value(cdt, item.name, 'oh_rate', row.oh_rate);
    //             frappe.model.set_value(cdt, item.name, 'sh_rate', row.sh_rate);
    //             frappe.model.set_value(cdt, item.name, 'lbs', row.lbs);
    //             frappe.model.set_value(cdt, item.name, 'dye_waste_percentage', row.dye_waste_percentage);
    //             frappe.model.set_value(cdt, item.name, 'dye_lbs', row.dye_lbs);
    //             frappe.model.set_value(cdt, item.name, 'total_dyeing_amount', row.total_dyeing_amount);
    //             frappe.model.set_value(cdt, item.name, 'stiching_rate', row.stiching_rate);
    //             frappe.model.set_value(cdt, item.name, 'embroidery_rate', row.embroidery_rate);
    //             frappe.model.set_value(cdt, item.name, 'total_dyeing_amount', row.total_dyeing_amount);
    //             frappe.model.set_value(cdt, item.name, 'printing_rate', row.printing_rate);
    //             frappe.model.set_value(cdt, item.name, 'final_stich_rate', row.final_stich_rate);
    //             frappe.model.set_value(cdt, item.name, 'stitch_waste_qty', row.stitch_waste_qty);
    //             frappe.model.set_value(cdt, item.name, 'total_qty_with_waste', row.total_qty_with_waste);
    //             frappe.model.set_value(cdt, item.name, 'total_stitching_amount', row.total_stitching_amount);
                
    //         }
    //     });
    // }
    
    
});

var greigh_weight_gmmt = function (frm,cdt,cdn){
    console.log('griegh');
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt,cdn,"weight_difference", child.net_weight_gmmt / child.greigh_weight_gmmt);
};

var net_weight_gmmt = function (frm,cdt,cdn){
    console.log('griegh');
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt,cdn,"weight_difference", child.net_weight_gmmt / child.greigh_weight_gmmt);
};

var qty = function (frm,cdt,cdn){
    console.log('total_qty_in_pcs');
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt,cdn,"total_qty_in_pcs", child.qty );
};

var b = function (frm,cdt,cdn){
    console.log('total_qty_in_pcs');
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt,cdn,"total_mtrs_with_b", child.total_mtrs * (child.b / 100) + child.total_mtrs );
};

var total_qty_in_pcs_with_b = function (frm,cdt,cdn){
    console.log('total_qty_in_pcs');
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt,cdn,"total_qty_in_pcs_with_b", child.qty * (child.b / 100) + child.qty );
};

var mtrspcs = function (frm,cdt,cdn){
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt,cdn,"mtrspcs", (child.total_mtrs * (child.b / 100) + child.total_mtrs) / (child.qty * (child.b / 100) + child.qty) );
};

var greigh_kgs = function (frm,cdt,cdn){
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt,cdn,"greigh_kgs", (child.greigh_weight_gmmt / 1000) * child.total_mtrs_with_b  );
};

var greigh_lbs = function (frm,cdt,cdn){
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt,cdn,"greigh_lbs", child.greigh_kgs * 2.2046 );
};

// var final_lbs = function (frm,cdt,cdn){
//     var child = locals[cdt][cdn];
//     frappe.model.set_value(cdt,cdn,"final_lbs", (child.greigh_lbs) + ((child.greigh_lbs) * (loom_wastage /100))   );
// };



frappe.ui.form.on("Sales Order Item", {
    greigh_lbs: function(frm,cdt, cdn){
        final_lbs(frm, cdt, cdn);
        
    },
    loom_wastage: function(frm, cdt, cdn){
        final_lbs(frm, cdt, cdn);
        
    }
    
});
var final_lbs = function(frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "final_lbs", child.greigh_lbs + (child.greigh_lbs * (child.loom_wastage / 100)) );
    // frappe.model.set_value(cdt, cdn, “z”, child.p / cur_frm.doc.no_of_students);
};




frappe.ui.form.on("Sales Order Item", {
    b_: function(frm,cdt, cdn){
        b_qty(frm, cdt, cdn);
        
    },
    qty: function(frm, cdt, cdn){
        b_qty(frm, cdt, cdn);
        
    }
    
});
var b_qty = function(frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "final_lbs", (child.b_qty * (child.b_ / 100)) );
    // frappe.model.set_value(cdt, cdn, “z”, child.p / cur_frm.doc.no_of_students);
};



////////////////////////////Add ROW WORKING START From here//////////////////////////

// frappe.ui.form.on('Sales Order Raw Material', {
//     component: function(frm) {
//         console.log("Component work");
//         // Your child table fieldname
//         var childTable = "sales_order_raw_material";

//         // Iterate through each row in the child table
//         frm.doc[childTable].forEach(function(row) {
//             // Check if the component name is "ground"
//             if (row.component == "Ground") {
//                 console.log("enter in ground");
//                 // Add two rows with the specified values
//                  addRow(frm, childTable, { parent_item: row.parent_item, component:"Pile" });
//                 addRow(frm, childTable, { component: "Weft", parent_item: row.parent_item });
//             }
//         });
//     }
// });

// // Function to add a row to the specified child table
// function addRow(frm, childTable, values) {
//     console.log("values");
//     console.log(values);
//     // var row = frappe.model.add_child(frm.doc, childTable);
//     // frappe.model.set_value(row.doctype, row.name, values);
    
//     var childTable = cur_frm.add_child(childTable);
//     childTable.component= values.component ;
//     childTable.parent_item = values.parent_item ;
//     // frappe.model.set_value(childTable.doctype, childTable.name, values);
//     //frappe.model.set_value(childTable.doctype, childTable.name, values.parent_item);
   

//     cur_frm.refresh_fields(childTable);
    
// }


frappe.ui.form.on('Sales Order Raw Material', {
    // Raw MAterial Amount Cal
    rate_per_lbs: function (frm,cdt,cdn){
        raw_mat_amount(frm,cdt,cdn);
    },
    parent_item: function(frm, cdt, cdn) {
        console.log("Parent Item selected");

        // Your child table fieldname
        var childTable = "sales_order_raw_material";

        // Get the selected parent_item
        var selectedParentItem = locals[cdt][cdn].parent_item;
        // Get the current row being edited
        var currentRow = locals[cdt][cdn];

        // Check if the selected parent_item already exists in the child table
        var parentItemExists = frm.doc[childTable].some(function(row) {
            return row.parent_item === selectedParentItem  && row.name !== currentRow.name;
        });

        // If the selected parent_item does not exist, add rows
        if (!parentItemExists) {
            console.log("Parent Item does not exist in child table. Adding rows.");
            // Set the component of the current row to "Ground"
            frappe.model.set_value(currentRow.doctype, currentRow.name, { component: "Ground" });

            // Add rows with the specified values
            addRow(frm, childTable, { parent_item: selectedParentItem, component: "Pile" });
            addRow(frm, childTable, { parent_item: selectedParentItem, component: "Weft" });
        } else {
            console.log("Parent Item already exists in child table. Rows will not be added.");
        }
    }
});

// Add Row
function addRow(frm, childTable, values) {
    console.log("Adding row with values:", values);

    var childTableRow = frappe.model.add_child(frm.doc, childTable);
    frappe.model.set_value(childTableRow.doctype, childTableRow.name, values);
    cur_frm.refresh_fields(childTable);
}
// Calcualte Raw material Amount
function raw_mat_amount(frm,cdt,cdn){
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt,cdn,"raw_material_amount",child.rate_per_lbs * child.consumption_lbs)
    
}

function clear_parent_fields(frm){
    frm.set_value("parent_item",'');
    frm.set_value("net_weight",'');
    frm.set_value("greigh_weight",'');
    frm.set_value("weight_difference",'');
    frm.set_value("cut_length",'');
    frm.set_value("embroidery_rate",'');
    frm.set_value("b_kgs_rate",'');
    frm.set_value("stitch_waste_qty",'');
    frm.set_value("weight_measuring_unit",'');
    frm.set_value("total_parent_qty",'');
    frm.set_value("total_parent_qty_uom",'');
    frm.set_value("total_secondary_qty",'');
    frm.set_value("total_seconday_qty_uom",'');
    frm.set_value("dye_rate",'');
    frm.set_value("total_parent_qty_with_b_percent",'');
    frm.set_value("printing_rate",'');
    frm.set_value("total_secondary_qty_with_b_percent",'');
    frm.set_value("oh_rate",'');
    frm.set_value("sh_rate",'');
    frm.set_value("stitching_rate",'');
    frm.set_value("b_percent",'');
    frm.set_value("loom_wastage",'');
    frm.set_value("dye_waste_percentage",'');
    frm.set_value("greigh_kgs",'');
    frm.set_value("final_lbs",'');
}


