

function update_qty_label(frm) {
    // Check the value of purchase_type
    var purchase_type = frm.doc.purchase_type;
    
    // Determine the new label
    var new_label = purchase_type === "Dying Service" ? "Qty in pcs" : "Quantity";
    var new_label1 = purchase_type === "Dying Service" ? "Quantity" : "Qty in pcs";


    // Set the new label for the 'qty' field in the child table
    frm.fields_dict['items'].grid.update_docfield_property('qty', 'label', new_label);
    frm.fields_dict['items'].grid.update_docfield_property('qty_in_pcs', 'label', new_label1);

}


var variant_dict = {}  //initialize dictionary for po main item table
var dying_services_dict = {}


frappe.ui.form.on("Purchase Order", {
	setup: function(frm) {
		frm.set_query("purchase_type", function() {
			return {
				filters: [
					["Order Type","type", "in", ["Purchase Order"]]
				]
			}
		});
	},
    onload: function(frm) {
        frm.fields_dict['items'].grid.wrapper.on('change', 'purchase_type', function() {
            // Update the label of the 'qty' field in the child table
            update_qty_label(frm);
        });

        // Call the function initially to set the correct label
        update_qty_label(frm);
    },
    refresh: function(frm){
        update_qty_label(frm);

    },

    purchase_type: function(frm) {
        // Update the label when purchase_type changes
        update_qty_label(frm);
    }
});


frappe.ui.form.on('Purchase Order', {


    before_submit: function(frm){
        set_job_no_in_table(frm);
        
        
    },  
    purchase_type : function(frm){
        
        frm.set_value('purpose',frm.doc.purchase_type);
        
        // Yarn Purchase Order Work
        if (frm.doc.purchase_type == 'Yarn Purchase'){
         frm.fields_dict['items'].grid.remove_all();
         set_purchase_order_type(frm);
        }

        else{
           frm.fields_dict['items'].grid.remove_all();
            set_purchase_order_type_weaving_service(frm);
            frm.set_value("is_subcontracted", 'Yes');

        }
        // // Weaving Service Work
        // else if (frm.doc.purchase_type == 'Weaving Service'){
        //  frm.fields_dict['items'].grid.remove_all();
        //  set_purchase_order_type_weaving_service(frm);
        //  frm.set_value("is_subcontracted", 'Yes');
        // }
        // else if (frm.doc.purchase_type == 'Dying Service'){
        //     frm.fields_dict['items'].grid.remove_all();
        //     set_purchase_order_type_weaving_service(frm);
        //     frm.set_value("is_subcontracted", 'Yes');
        // }
        // else if (frm.doc.purchase_type == 'Stitching Service' || frm.doc.purchase_type == 'Stitching Bathrobe  Service' ){
        //     frm.fields_dict['items'].grid.remove_all();
        //     set_purchase_order_type_weaving_service(frm);
        //     frm.set_value("is_subcontracted", 'Yes')
        // }
       
        // // frm.set_df_property('purpose', 'label', __('Item'));
       
         
    },
    items_on_form_rendered: function(frm) {
        if (frm.doc.purchase_type == 'Yarn Purchase'){
            set_purchase_order_type(frm);
        }
        else{
            set_purchase_order_type_weaving_service(frm);
        }
        // Weaving Service Work
        // else if (frm.doc.purchase_type == 'Weaving Service'){
        //  set_purchase_order_type_weaving_service(frm);
        // }
        // else if (frm.doc.purchase_type == 'Dying Service'){
        //     set_purchase_order_type_weaving_service(frm);
        // }
        // else if (frm.doc.purchase_type == 'Stitching Service' || frm.doc.purchase_type == 'Stitching Bathrobe  Service'){
        //      set_purchase_order_type_weaving_service(frm);
           
        // }
        
    },
    validate: function(frm) {

        // set_item_color(frm);

        frm.set_value("po_name", frm.doc.name)
         //Yarn PO
        if (frm.doc.purchase_type == 'Yarn Purchase'){
            set_purchase_order_type(frm);
        }
        else{
            set_purchase_order_type_weaving_service(frm);
        }
        // Weaving Service Work
        // else if (frm.doc.purchase_type == 'Weaving Service'){
        //  set_purchase_order_type_weaving_service(frm);
        // }
        // // Dying Service
        // else if (frm.doc.purchase_type == 'Dying Service'){
        //    set_purchase_order_type_weaving_service(frm);
        //    }
        // else if (frm.doc.purchase_type == 'Stitching Service' || frm.doc.purchase_type == 'Stitching Bathrobe  Service'){
        //     set_purchase_order_type_weaving_service(frm);
        // }
           
    },
    onload: function(frm){
          if (frm.doc.purchase_type == 'Yarn Purchase'){
            set_purchase_order_type(frm);
        }
        else{
            set_purchase_order_type_weaving_service(frm);
        }
        // Weaving Service Work
        // else if (frm.doc.purchase_type == 'Weaving Service'){
        //  set_purchase_order_type_weaving_service(frm);
        
        // }
        // // Dying Service
        // else if (frm.doc.purchase_type == 'Dying Service'){
        //     set_purchase_order_type_weaving_service(frm);
           
        // }
        // else if (frm.doc.purchase_type == 'Stitching Service' || frm.doc.purchase_type == 'Stitching Bathrobe  Service'){
        //     set_purchase_order_type_weaving_service(frm);
        // }


    },
    // after_save: async function(frm) {
    //     console.log("enter in after_save");
    //     if (!is_setting_color) {
    //         is_setting_color = true;
    //         await set_item_color(frm);
    //         await frm.save();
    //         is_setting_color = false;
    //     }
    // },
 //   after_save:function(frm){
        // console.log("enter in after_save");
        // if (!is_setting_color) {
        //     is_setting_color = true;
        //      set_item_color(frm);   
        //      frm.save();
        //     is_setting_color = false;
        // }
        // if (frm.doc.purchase_type == 'Yarn Purchase'){
        //     set_purchase_order_type(frm);
        //     // set_item_color(frm);
        // }
        // else if (frm.doc.purchase_type == 'Yarn Dying' ){
            
        //     // set_item_color(frm);
        // }
        // else if (frm.doc.purchase_type == 'Dying Service') {
        //     frm.doc.items.forEach(function(row) {
        //         frappe.model.set_value(row.doctype, row.name, "uom", "lbs");
        //     });
        //     // set_item_color(frm);
        // }
        // else{
        //     // set_item_color(frm);
        // }
        
       
        // else if (frm.doc.purchase_type == 'Weaving Service' ){
            
        //     set_item_color(frm);
        // }
        // else if (frm.doc.purchase_type == 'Stitching Service' ){
         
        //     set_item_color(frm);
        // }
        // else if (frm.doc.purchase_type == 'Stitching Bathrobe  Service' ){
            
        //     set_item_color(frm);
        // }
   
 //   },
    
    get_item_from_sales_order: function(frm){
        // frm.fields_dict['items'].grid.remove_all();
        // frm.fields_dict['supplied_items'].grid.remove_all();
        
        //check purchase type to open dialoge box
        if (frm.doc.purchase_type == 'Yarn Dying'){
            //fetch so yarn dye raw material
            fetch_so_yarn_dyeing(frm)

        }
        else if(frm.doc.purchase_type == 'Dying Service'){
            
            fetch_so_dying_service(frm)
        }
        else if(frm.doc.purchase_type == 'Stitching Service' || frm.doc.purchase_type == 'Stitching Bathrobe  Service'){
           
            stitching_service(frm)
        }
        else{
        
            fetch_sales_order(frm);
        }
    },
    before_save:function(frm){


        // before_save:function(frm) {
            console.log("tttttttttttttttt");
            if (!is_setting_color) {
                console.log("llllllllll");
                is_setting_color = true;
                 set_item_color(frm);
                //  frm.save();
                is_setting_color = false;
            }
            // frm.save();
        // }
    //  set_item_color(frm);
        
        // calling global dict
        let variant_dict = {};
        var varinat_total_lbs = 0;
        var req_qty_qty = 0;

        

        //first check purchase_type = Weaving service
        if (frm.doc.purchase_type == 'Weaving Service'){
            set_weave_value_after_save(frm,variant_dict,varinat_total_lbs)
                  
        }
        else if (frm.doc.purchase_type == 'Dying Service'){
            set_dye_value_after_save(frm,variant_dict,req_qty_qty)

        }
        else if (frm.doc.purchase_type == 'Stitching Service' || frm.doc.purchase_type == 'Stitching Bathrobe  Service'){
            set_stitch_value_after_save(frm,variant_dict,req_qty_qty)
            
            // if(frm.doc.purchase_type == 'Stitching Bathrobe  Service'){
            //     set_consumption_meter(frm)
            // }

        }
        // if (frm.doc.purchase_type == 'Yarn Dying' || frm.doc.purchase_type == 'Yarn Purchase' || frm.doc.purchase_type == 'Weaving Service' || frm.doc.purchase_type == 'Dying Service' || frm.doc.purchase_type == 'Stitching Service' || frm.doc.purchase_type == 'Stitching Bathrobe  Service'  ){
        //     console.log("color yarn");
        //     set_item_color(frm);
        // }
       
    }
 


    });
    
    frappe.ui.form.on('Purchase Order Item',{
        //qty_in_pcs replace with qty
        // qty: function(frm,cdt,cdn){

        //     // if (frm.doc.purchase_type == 'Dying Service'){
        //     //     console.log("enter in dfdfd");
        //     //     cal_dying_service_lbs_qty(frm,cdt,cdn)
        //     // }
        

        // },
    
        bag_ctn: function(frm,cdt,cdn){
            // var child = locals[cdt][cdn];
          
            // frappe.model.set_value(cdt,cdn,'qty',child.bag_ctn * child.lbs_bag);
            cal_yarn_quantity(frm,cdt,cdn);
            cal_yarn_amount(frm, cdt, cdn);
        },
        lbs_bag: function(frm,cdt,cdn){
         
            cal_yarn_quantity(frm,cdt,cdn);
            cal_yarn_amount(frm, cdt, cdn);
            
        },
        qty:function(frm,cdt,cdn){
            if (frm.doc.purchase_type == 'Yarn Purchase'){
            cal_yarn_amount(frm,cdt,cdn);
            }
            else if (frm.doc.purchase_type == 'Dying Service'){
                console.log("enter in dfdfd");
                cal_dying_service_lbs_qty(frm,cdt,cdn)
            }
            else if (frm.doc.purchase_type == 'Weaving Service'){
               
                cal_weaving_rate(frm, cdt, cdn);
                set_finish_lbs(frm,cdt,cdn);
                set_greigh_lbs(frm,cdt,cdn);
                set_gross_lbs(frm,cdt,cdn);
            }
            else if (frm.doc.purchase_type == 'Stitching Bathrobe  Service'){
                console.log("ebathrobe");
                cal_consumption_meter(frm,cdt,cdn)

            }
        },
        cut_length:function(frm,cdt,cdn){
            if (frm.doc.purchase_type == 'Stitching Bathrobe  Service'){
                cal_consumption_meter(frm,cdt,cdn)

            }
        },
        rate:function(frm,cdt,cdn){
           // cal_yarn_amount(frm,cdt,cdn);
           if (frm.doc.purchase_type == 'Yarn Purchase'){
             cal_yarn_amount(frm, cdt, cdn);
           }
           
        },
        finish_lbs:function(frm,cdt,cdn){
            // cal_yarn_amount(frm,cdt,cdn);
            
            if (frm.doc.purchase_type == 'Weaving Service'){
                let child = locals[cdt][cdn]
                frappe.model.set_value(cdt,cdn,"net_weight",child.finish_lbs)
             
           }
         },
        loom_wastage:function(frm,cdt,cdn){
            // cal_yarn_amount(frm,cdt,cdn);
            set_gross_lbs(frm, cdt, cdn);
           
         }
        
         
        
        
    });


    
    function set_consumption_meter(frm){
   
        frm.doc.items.forEach(function(row){

        if (frm.doc.purchase_type == 'Stitching Bathrobe  Service'){
        
        
        
            if (row.qty & row.cut_length){
            console.log("consumption meter");
           
                
            var consumption_meter = row.qty *  row.cut_length;
            frappe.model.set_value(cdt,cdn,"consumption_meter", consumption_meter);


            }
           

        }
        
        else{
            frappe.msgprint(__('Missing Values Either Qunatity or Cutlength'));

        }
    });

    }

    function cal_consumption_meter(frm,cdt,cdn){

        if (frm.doc.purchase_type == 'Stitching Bathrobe  Service'){
           
            let child = locals[cdt][cdn]
            var consumption_meter = child.qty *  child.cut_length;
            frappe.model.set_value(cdt,cdn,"consumption_meter", consumption_meter);

        }
    }

    function cal_dying_service_lbs_qty(frm,cdt,cdn){
        // setTimeout(function(){
            if (frm.doc.purchase_type == 'Dying Service'){
                let child = locals[cdt][cdn]
                var qty_w_b_percent = child.qty *  (1 + child.b_percent/100)

                frappe.model.set_value(cdt,cdn,"qty_in_pcs", (child.finish_weight * child.qty) / 1000 * 2.2046)   // in lbs
                frappe.model.set_value(cdt,cdn,"qty_in_kgs", (child.finish_weight * child.qty) / 1000  )  // kgs


                // frappe.model.set_value(cdt,cdn,"qty_in_pcs", (child.finish_weight * qty_w_b_percent) / 1000 * 2.2046)   // in lbs
                // frappe.model.set_value(cdt,cdn,"qty_in_kgs", (child.finish_weight * qty_w_b_percent) / 1000  )  // kgs
                frappe.model.set_value(cdt,cdn,"uom", 'pcs' )  

            }
        // }, 100);
    }

    function set_gross_lbs(frm, cdt, cdn) {
        setTimeout(function() {
            if (frm.doc.purchase_type == 'Weaving Service'){
                let child = locals[cdt][cdn]
                // frappe.model.set_value(cdt,cdn,"gross_lbs",child.greigh_weigh_unit * child.qty * 2.2046 * child.loom_wastage) chnged to newone
                frappe.model.set_value(cdt,cdn,"gross_lbs",child.greigh_lbs * (1+ child.loom_wastage/100));

     
            }
        }, 100); // Adjust the delay time as needed
    }
    
    
    function cal_yarn_amount(frm, cdt, cdn) {
        setTimeout(function() {
            var child = locals[cdt][cdn];
            var amount = (child.qty / 10) * child.rate;
            frappe.model.set_value(cdt, cdn, 'amount', amount);
        }, 100); // Adjust the delay time as needed
    }
    function cal_weaving_rate(frm, cdt, cdn) {
        setTimeout(function() {
            var child = locals[cdt][cdn];
            var amount = child.qty  * child.rate_per_lbs;
           
           
            frappe.model.set_value(cdt, cdn, 'rate',  child.rate_per_lbs);
            frappe.model.set_value(cdt, cdn, 'amount', amount);
            
        }, 100); // Adjust the delay time as needed
    }
   
   // Commenting this function due to logic change and its not require any more
    // function set_rate_per_lbs(frm, cdt, cdn) {
    //     setTimeout(function() {
    //         var child = locals[cdt][cdn];
          
    //         console.log("amount",child.amount);
    //         frappe.model.set_value(cdt, cdn, 'rate_per_lbs',  child.rate);
            
    //     }, 500); // Adjust the delay time as needed
    // }

    function set_finish_lbs(frm, cdt, cdn) {
        setTimeout(function() {
            var child = locals[cdt][cdn];
          
            frappe.model.set_value(cdt, cdn, 'finish_lbs',  (child.finish_weight_unit * child.qty * 2.2046)/1000);
            
        }, 100); // Adjust the delay time as needed
    }
    
    function set_greigh_lbs(frm, cdt, cdn) {
        setTimeout(function() {
            var child = locals[cdt][cdn];
          
            frappe.model.set_value(cdt, cdn, 'greigh_lbs',  (child.qty * child.greigh_weigh_unit * 2.2046)/1000);
            
        }, 100); // Adjust the delay time as needed
    }
    
    
    function cal_yarn_quantity(frm,cdt,cdn){
        var child = locals[cdt][cdn];
            
            frappe.model.set_value(cdt,cdn,'qty',child.bag_ctn * child.lbs_bag);
    }
    
    
    
     
    
    // This function is for Yarn Purchase order
    function set_purchase_order_type(frm) {
    // 	if(frm.doc.purchase_type){
    // 	    console.log("PO Setting");
    // 		erpnext.utils.copy_value_in_all_rows(frm.doc, frm.doc.doctype, frm.doc.name, "items", "purchase_type");
    // 	}
    
        frm.doc.items.forEach(function(item) {
            //change chidl table Label 
             var child_field_item = frappe.meta.get_docfield(item.doctype, 'item_code', frm.docname);
             var child_field_rate = frappe.meta.get_docfield(item.doctype, 'rate', frm.docname);
             if (child_field_item) {
                child_field_item.label = __('Yarn Item');
                child_field_rate.label = __('Rate Per 10 Lbs');
                 $(`.grid-row[data-idx="${item.idx}"] [data-fieldname="item_code"] .control-label`).text(__('Yarn Item'));
                 $(`.grid-row[data-idx="${item.idx}"] [data-fieldname="rate"] .control-label`).text(__('Rate Per 10 Lbs'));
            }
            
            
            //Set Value in child table 
            frappe.model.set_value(item.doctype,item.name,'purchase_type', frm.doc.purchase_type);
            frm.refresh_field('items');
             frm.refresh();
    
        });
    }
    
    // Weaving Service PO function 
    function set_purchase_order_type_weaving_service(frm) {
    // 	if(frm.doc.purchase_type){
    // 	    console.log("PO Setting");
    // 		erpnext.utils.copy_value_in_all_rows(frm.doc, frm.doc.doctype, frm.doc.name, "items", "purchase_type");
    // 	}
    
        frm.doc.items.forEach(function(item) {
                    //Set Value in child table 
            frappe.model.set_value(item.doctype,item.name,'purchase_type', frm.doc.purchase_type);
            // frm.refresh_field('items');
            // frm.refresh();
            
    
        });
        frm.refresh_field('items');
        frm.refresh();
    }

    




    // dying service
    function set_dye_value_after_save(frm,variant_dict,varinat_total_lbs){
        
    
        // apply loop to store po item table value in define dict
        frm.doc.items.forEach(function (vat){
    
            if (vat.item_code){
                
                if(!variant_dict[vat.item_code]){
    
                    var greigh_weigh_unit =  vat.greigh_weigh_unit;
                    var qty = vat.qty;
                    var loom_wastage = vat.loom_wastage; 
    
                    var cal_total_kgs =  (greigh_weigh_unit / 1000) * qty * 2.2046 * (1 + loom_wastage/100)
                    varinat_total_lbs +=  cal_total_kgs ;
    
                    
                    // variant_dict[vat.item_code] = vat.total_parent_qty
                    variant_dict[vat.item_code] = {
                        'greigh_weigh_unit': vat.greigh_weigh_unit,
                        'qty': vat.qty,
                        'loom_wastage' : vat.loom_wastage
                    };
                    
                    vat.total_lbs = cal_total_kgs;
                }
    
            }
           
        
    
        });
        frm.set_value("total_lbs",varinat_total_lbs);
    
        //setting required values in raw material
        frm.doc.supplied_items.forEach(function (raw){      
            
            if (frm.doc.is_subcontracted == 'Yes'){
               
    
                if (raw.main_item_code in variant_dict) {
    
                    var greigh_weigh_unit = variant_dict[raw.main_item_code].greigh_weigh_unit;
                    var qty = variant_dict[raw.main_item_code].qty;
                    var loom_wastage = variant_dict[raw.main_item_code].loom_wastage; 
    
                    var cal_total_kgs =  (greigh_weigh_unit / 1000) * qty * 2.2046 * (1 + loom_wastage/100)
                    var req_qty = cal_total_kgs * raw.consumption/100;
                    raw.required_qty = req_qty
                    
                }
            }
    
        });
            
        }
    


    function set_stitch_value_after_save(frm,variant_dict,req_qty_qty){
        
        frm.doc.items.forEach(function(row){

            if (row.orginal_item){
                console.log("enter in original Item");
                if(!variant_dict[row.orginal_item]){
                    
                    // Required Qty = ((Variant Quantity * (1 + B%)) * (Net Weight / 1000 )) * 2.2046
                    req_qty_qty = row.qty * (row.finish_weight / 1000 ) * 2.2046
                    

                    variant_dict[row.orginal_item] = {
                        'required_qty': req_qty_qty,
                        
                    };

                }
               

            }
            
            else{
                frappe.msgprint(__('Missing Original Item Value'));

            }
        });


        frm.doc.supplied_items.forEach(function (raw){      
        
            if (frm.doc.is_subcontracted == 'Yes'){
               
               
    
                if (raw.rm_item_code in variant_dict) {
                   
                   
                    raw.required_qty = variant_dict[raw.rm_item_code].required_qty;
                   
                    
                }
            }
    
        });

        


    }

    function set_job_no_in_table(frm){
        frm.doc.items.forEach(function(row){
            console.log("before submit");
            frappe.model.set_value(row.doctype,row.name,"job_no",frm.doc.job_number);

        });
        frm.refresh_field('items');

    }


    function set_weave_value_after_save(frm,variant_dict,varinat_total_lbs){      

    // apply loop to store po item table value in define dict
    frm.doc.items.forEach(function (vat){

        if (vat.item_code){
            
            if(!variant_dict[vat.item_code]){

                var greigh_weigh_unit =  vat.greigh_weigh_unit;
                var qty = vat.qty;
                var loom_wastage = vat.loom_wastage; 

                var cal_total_kgs =  (greigh_weigh_unit / 1000) * qty * 2.2046 * (1 + loom_wastage/100)
                varinat_total_lbs +=  cal_total_kgs ;

                
                // variant_dict[vat.item_code] = vat.total_parent_qty
                variant_dict[vat.item_code] = {
                    'greigh_weigh_unit': vat.greigh_weigh_unit,
                    'qty': vat.qty,
                    'loom_wastage' : vat.loom_wastage
                };
                
                vat.total_lbs = cal_total_kgs;
            }

        }
       
    

    });
    frm.set_value("total_lbs",varinat_total_lbs);

    //setting required values in raw material
    frm.doc.supplied_items.forEach(function (raw){      
        
        if (frm.doc.is_subcontracted == 'Yes'){
           

            if (raw.main_item_code in variant_dict) {

                var greigh_weigh_unit = variant_dict[raw.main_item_code].greigh_weigh_unit;
                var qty = variant_dict[raw.main_item_code].qty;
                var loom_wastage = variant_dict[raw.main_item_code].loom_wastage; 

                var cal_total_kgs =  (greigh_weigh_unit / 1000) * qty * 2.2046 * (1 + loom_wastage/100)
                var req_qty = cal_total_kgs * raw.consumption/100;
                raw.required_qty = req_qty
                
               
            }
        }

    });
        
    }


    //setting color 

    // function set_item_color(frm) {
    //     console.log("entering color method");

     
    //     frm.doc.items.forEach(function(vat) {
    //         console.log("for");
    //         if (vat.item_code) {
    //             frappe.db.get_value("Item", vat.item_code, "color")
    //                 .then(function(response) {                        
    //                     var color = response.message.color;
    //                     console.log("color:", color);
    //                     // Set the color value in the corresponding row of the child table
    //                     vat.color = color;                        
    //                     //frm.refresh_field("items"); // Refresh the child table to reflect the changes
                      
    //                 })
                   
    //         }
    //     });
    // }

    // let is_setting_color = false;

    // async function set_item_color(frm) {
        
    
    //     for (const vat of frm.doc.items) {
          
    //         if (vat.item_code) {
    //             const response = await frappe.db.get_value("Item", vat.item_code, "color");
                

    //             if (!response.message || !response.message.color) {
               
    //                 const variantResponse = await frappe.db.get_list("Item Variant Attribute", {
    //                     filters: {
    //                         "parent": vat.item_code,
    //                         "attribute": "Colour"
    //                     },
    //                     fields: ["attribute_value"]
    //                 });
                    
    //                 if (variantResponse && variantResponse.length > 0) {
    //                     const color = variantResponse[0].attribute_value;
                        
    //                     // Set the color value in the corresponding row of the child table
    //                     vat.color = color;
    //                     frappe.model.set_value(vat.doctype, vat.name, "color", color);

    //                     //frm.refresh_field("items"); // Refresh the child table to reflect the changes
    //                 }

    //                 const response_parent = await frappe.db.get_value("Item", vat.item_code, "variant_of");
    //                 if (response_parent){
    //                     console.log("variant off");
    //                     const variant = response_parent.message.variant_of;
    //                     vat.variant_of = variant ;
    //                     frappe.model.set_value(vat.doctype, vat.name, "variant_of", variant);


    //                 }

    //             } else {
    //                 const color = response.message.color;
                    
    //                 // Set the color value in the corresponding row of the child table
    //                 vat.color = color;
    //                 frappe.model.set_value(vat.doctype, vat.name, "color", color);
    //                 //frm.refresh_field("items"); // Refresh the child table to reflect the changes
    //             }
    //         }
    //     }
    //     frm.refresh_field("items");
    // }



    /////////////////////////////////////////////////////

let is_setting_color = false;

async function set_item_color(frm) {
    const promises = frm.doc.items.map(async (vat) => {

        if (!vat.color || !vat.variant_of) {
            console.log("ppppppppppppppppp");
            let response = await frappe.db.get_value("Item", vat.item_code, "color");

            if (!response.message || !response.message.color) {
                let variantResponse = await frappe.db.get_list("Item Variant Attribute", {
                    filters: {
                        "parent": vat.item_code,
                        "attribute": "Colour"
                    },
                    fields: ["attribute_value"]
                });

                if (variantResponse && variantResponse.length > 0) {
                    const color = variantResponse[0].attribute_value;
                    frappe.model.set_value(vat.doctype, vat.name, "color", color);
                }

                response = await frappe.db.get_value("Item", vat.item_code, "variant_of");
                if (response && response.message && response.message.variant_of) {
                    const variant = response.message.variant_of;
                    frappe.model.set_value(vat.doctype, vat.name, "variant_of", variant);
                }
            } else {
                const color = response.message.color;
                frappe.model.set_value(vat.doctype, vat.name, "color", color);
            }
        }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // Refresh the form to show updated values
    frm.refresh_field("items");
}

// frappe.ui.form.on("Purchase Order", {
//     before_save:function(frm) {
//         console.log("tttttttttttttttt");
//         if (!is_setting_color) {
//             console.log("llllllllll");
//             is_setting_color = true;
//              set_item_color(frm);
//             //  frm.save();
//             is_setting_color = false;
//         }
//         // frm.save();
//     }
// });

    

// Following method is used to fetch Sales order Item

const fetch_sales_order=(frm)=>{
    if (frm.doc.sales_order && frm.doc.purchase_type) {
        frm.data = []
        
        let dialog = new frappe.ui.Dialog({
            title: __("Sales Order"),
            fields: [
                {
                    fieldname: "items", read_only: 1, label: 'Sales Order Items', fieldtype: "Table", cannot_add_rows: true, data: frm.data,
                    get_data: () => {
                        return frm.data
                    },
                    fields: [
                        
                        {
                            fieldtype: 'Data',
                            fieldname: "parent_item_name",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Parent Item'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "item_code",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Item Code'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "item_name",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Item Name'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "description",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Description'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "net_weight",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Finish Weight/Unit'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "weight_measuring_unit",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('UOM'),
                            columns: 2,
                            description: "Greigh Weigh UOM"
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "greigh_weight",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Greigh Weigh/Unit'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "total_parent_qty_with_b_percent",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('T Parent Pcs Qty'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "total_secondary_qty_with_b_percent",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('T Parent Mtr Qty'),
                            columns: 2,
                            onchange: function(e) {
                               console.log(this.value);
                            }
                            
                        },
                        {
                            fieldtype: 'Check',
                            fieldname: "check",
                            in_list_view: 1,
                            read_only: 0,
                            label: __('Select'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "sales_order_qty", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Sales Order Qty'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "order_place_qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Order Place Qty'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "balance_qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Balance Qty'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "so_row_name",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('So Row Name'),
                            columns: 2
                        }
                    ]
                }
            ],
            primary_action_label: 'Get Items',
            primary_action(values) {
                if (values.items) {
                    for (let row of values.items) {
                        if (row.check == 1) {
                            setTimeout(function () {
                                let child = frm.add_child('items');
                                let cdt = child.doctype
                                let cdn = child.name
                                frappe.model.set_value(cdt, cdn, 'item_code', row.item_code);
                                frappe.model.set_value(cdt, cdn, 'item_name', row.item_name);
                                frappe.model.set_value(cdt, cdn, 'description', row.description);
                                frappe.model.set_value(cdt, cdn, 'uom', "lbs");
                                frappe.model.set_value(cdt, cdn, 'parent_item', row.parent_item_name);
                                frappe.model.set_value(cdt, cdn, 'finish_weight_unit', row.net_weight);
                                frappe.model.set_value(cdt, cdn, 'finish_weight_uom', row.weight_measuring_unit);
                                frappe.model.set_value(cdt, cdn, 'greigh_weigh_unit', row.greigh_weight);
                                frappe.model.set_value(cdt, cdn, 'greigh_weigh_uom', row.weight_measuring_unit);
                                if (frm.doc.purchase_type == "Weaving Service" && row.weight_measuring_unit == "GM/MTR"){
                                    frappe.model.set_value(cdt, cdn, 'total_parent_qty', row.total_secondary_qty_with_b_percent);
                                }
                                else{
                                    frappe.model.set_value(cdt, cdn, 'total_parent_qty', row.total_parent_qty_with_b_percent);

                                }
                                frappe.model.set_value(cdt, cdn, 'so_row_name', row.so_row_name);

                            }, 1000);
                        }
                    }

                    frappe.call({
                        method: "ht.utils.purchase_order.fetch_raw_material_items",
                        args: {
                            sales_order_no: cur_frm.doc.sales_order,
                            purchase_type: cur_frm.doc.purchase_type
                        },
                        callback: (r) => {
                            if (r.message) {
                                for (let row of r.message) {
                                    let child = frm.add_child('supplied_items');
                                    let cdt = child.doctype
                                    let cdn = child.name
                                    frappe.model.set_value(cdt, cdn, "main_item_code", row.parent_item);
                                    frappe.model.set_value(cdt, cdn, "item_code", row.item_code);
                                    frappe.model.set_value(cdt, cdn, "description", row.uom);
                                    frappe.model.set_value(cdt, cdn, "rm_item_code", row.raw_mat_item);
                                    frappe.model.set_value(cdt, cdn, "rate", row.rate_per_lbs);
                                    frappe.model.set_value(cdt, cdn, "actual_qty", row.consumption_lbs);
                                    frappe.model.set_value(cdt, cdn, "component", row.component);
                                    frappe.model.set_value(cdt, cdn, "consumption", row.consumption_);
                                }
                            }
                        }
                    });
                }
                cur_frm.refresh_field('items')
                dialog.hide();
            }
        });

        frappe.call({
            async: false,
            method: "ht.utils.purchase_order.setting_items",
            args: {
                sales_order_no: cur_frm.doc.sales_order,
                purchase_type: cur_frm.doc.purchase_type
            },
            callback: function (r) {
                if (r.message) {
                    for (let row of r.message) {
                        
                        
                        frappe.db.get_doc('Item', row.item_code)                        
                            .then(itm_doc => {
                                setTimeout(() => {
                                    let total_qty = 0;
                                    //mtr
                                    if (row.cut_length && cur_frm.doc.purchase_type === "Weaving Service" && row.weight_measuring_unit === "GM/MTR") {
                                        console.log("total mtr");
                                        total_qty = row.total_secondary_qty_with_b_percent;
                                    }
                                    // //pcs
                                    // if (cur_frm.doc.purchase_type === "Weaving Service" && row.weight_measuring_unit != "GM/MTR") {
                                    //     console.log("total pcs")
                                        
                                    //     total_qty = row.total_parent_qty_with_b_percent;
                                    // }
                                    
                                    // //not weaving
                                    else{
                                        console.log("total parent");
                                        total_qty = row.total_parent_qty_with_b_percent;
                                    }
                                    dialog.fields_dict.items.df.data.push({
                                        "check": 0,
                                        "parent_item_name": row.variant_of,
                                        "item_code": row.item_code,
                                        "item_name": row.item_name,
                                        "description": row.description,
                                        "net_weight": row.net_weight,
                                        "weight_measuring_unit": row.weight_measuring_unit,
                                        "greigh_weight": row.greigh_weight,
                                        "total_parent_qty_with_b_percent": row.total_parent_qty_with_b_percent, //pcs qty
                                        "total_secondary_qty_with_b_percent": total_qty === row.total_secondary_qty_with_b_percent ? total_qty : 0,//meter qty
                                        // "sales_order_qty" :  frm.doc.purchase_type === "Weaving Service" ? row.total_parent_qty_with_b_percent : row.qty_with_b_percent,
                                        "sales_order_qty" : total_qty, // pcs or mtr
                                        "order_place_qty":row.order_placed_qty || 0,
                                        "balance_qty":((total_qty) - (row.order_placed_qty)) || 0,
                                        "so_row_name": row.name

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

    } else {
        frappe.msgprint('Please Select Purchase Order First and Purchase Type');
    }
}






///////////////////////////////Dying Service ///////////////////////////////
const fetch_so_dying_service = (frm) => {
    if (frm.doc.sales_order && frm.doc.purchase_type) {
        frm.data = [];
        let dialog = new frappe.ui.Dialog({
            title: __("Sales Order"),
            fields: [
                {
                    fieldname: "items",
                    read_only: 1,
                    label: 'Sales Order Items',
                    fieldtype: "Table",
                    cannot_add_rows: true,
                    data: frm.data,
                    get_data: () => {
                        return frm.data;
                    },
                    fields: [
                        { fieldtype: 'Data', fieldname: "parent_item_name", in_list_view: 1, read_only: 1, label: __('Parent Item'), columns: 2 },
                        { fieldtype: 'Data', fieldname: "item_code", in_list_view: 1, read_only: 1, label: __('Item Code'), columns: 2 },
                        { fieldtype: 'Data', fieldname: "item_name", in_list_view: 0, read_only: 1, label: __('Item Name'), columns: 2 },
                        { fieldtype: 'Data', fieldname: "description", in_list_view: 0, read_only: 1, label: __('Description'), columns: 2 },
                        { fieldtype: 'Check', fieldname: "check", label: __('Select'), in_list_view: 1, columns: 1 },
                        { fieldtype: 'Data', fieldname: "qty", in_list_view: 1, read_only: 1, label: __('Qty'), columns: 2 },
                        { fieldtype: 'Data', fieldname: "uom", in_list_view: 0, read_only: 1, label: __('UOM'), columns: 2 },
                        { fieldtype: 'Data', fieldname: "qty_in_pcs", in_list_view: 0, read_only: 1, label: __('Qty in Pcs'), columns: 1 },
                        { fieldtype: 'Data', fieldname: "qty_in_kgs", in_list_view: 0, read_only: 1, label: __('Qty in Kgs'), columns: 1 },
                        { fieldtype: 'Data', fieldname: "finish_weight", in_list_view: 0, read_only: 1, label: __('Finish Weight'), columns: 2 },
                        { fieldtype: 'Data', fieldname: "weight_measuring_unit", in_list_view: 0, read_only: 1, label: __('Weight Measuring Unit'), columns: 2 },
                        { fieldtype: 'Float', fieldname: "b_percent", in_list_view: 0, read_only: 1, label: __('B Percent'), columns: 2 },
                        { fieldtype: 'Float',fieldname: "dying_sales_order_qty", in_list_view: 1,read_only: 1,label: __('Sales Order Qty'), columns: 1},                            
                        { fieldtype: 'Float',fieldname: "dying_order_place_qty",in_list_view: 1,read_only: 1,label: __('Order Place Qty'),columns: 1},
                        { fieldtype: 'Float',fieldname: "dying_balance_qty",in_list_view: 1,read_only: 1,label: __('Balance Qty'),columns: 1},
                        { fieldtype: 'Data', fieldname: "so_row_name", in_list_view: 0, read_only: 1, label: __('So Row Name'), columns: 2 },
                          
                            
                           
                    

                    ]
                }
            ],
            primary_action_label: 'Get Items',
            primary_action(values) {
                if (values.items) {
                    let po_check_itemslist = [];
                    for (let row of values.items) {
                        if (row.check == 1) {
                            po_check_itemslist.push(row.parent_item_name);
                            let child = frm.add_child('items');
                            let cdt = child.doctype;
                            let cdn = child.name;

                            frappe.model.set_value(cdt, cdn, 'parent_item', row.parent_item_name);
                            frappe.model.set_value(cdt, cdn, 'item_code', row.item_code);
                            frappe.model.set_value(cdt, cdn, 'item_name', row.item_name);
                            frappe.model.set_value(cdt, cdn, 'description', row.description);
                            frappe.model.set_value(cdt, cdn, 'uom', row.uom);
                            frappe.model.set_value(cdt, cdn, 'qty', row.qty_in_pcs);
                            frappe.model.set_value(cdt, cdn, 'qty_in_pcs', row.qty);

                            //last code
                            // frappe.model.set_value(cdt, cdn, 'qty', row.qty);
                            // frappe.model.set_value(cdt, cdn, 'qty_in_pcs', row.qty_in_pcs);
                            
                            frappe.model.set_value(cdt, cdn, 'qty_in_kgs', row.qty_in_kgs);
                            frappe.model.set_value(cdt, cdn, 'finish_weight', row.finish_weight);
                            frappe.model.set_value(cdt, cdn, 'weight_measuring_unit', row.weight_measuring_unit);
                            frappe.model.set_value(cdt, cdn, 'b_percent', row.b_percent);
                            frappe.model.set_value(cdt, cdn, 'so_row_name', row.so_row_name);

                        }
                    }

                    frappe.call({
                        method: "ht.utils.purchase_order.fetch_parent_items_of_so",
                        args: {
                            sales_order_no: cur_frm.doc.sales_order,
                            purchase_type: cur_frm.doc.purchase_type
                        },
                        callback: (r) => {
                            if (r.message) {
                                for (let row of r.message) {
                                    if (po_check_itemslist.includes(row.variant_of)) {
                                        let child = frm.add_child('supplied_items');
                                        let cdt = child.doctype;
                                        let cdn = child.name;
                                        let req_qty = ((row.greigh_weight) * (row.total_parent_qty_with_b_percent / 1000) * 2.2046);
                                        
                                        frappe.model.set_value(cdt, cdn, "main_item_code", row.variant_of);
                                        frappe.model.set_value(cdt, cdn, "rm_item_code", row.item_code);
                                        frappe.model.set_value(cdt, cdn, "required_qty", req_qty);
                                    }
                                }
                            }
                        }
                    });

                    cur_frm.refresh_field('items');
                    dialog.hide();
                }
            }
        });

        frappe.call({
            async: false,
            method: "ht.utils.purchase_order.setting_items",
            args: {
                sales_order_no: cur_frm.doc.sales_order,
                purchase_type: cur_frm.doc.purchase_type
            },
            callback: function (r) {
                if (r.message) {
                    for (let row of r.message) {
                        frappe.db.get_doc('Item', row.item_code).then(itm_doc => {
                            setTimeout(() => {
                                let qty_in_kgs = 0;
                                let qty = 0;
                                //Qty in kgs=Qty in PCs(finish weight/1000) finish weight == net weight
                                //	Quantity=Qty in PCs(finish weight/1000)*2.2046
                                if (row.cut_length && cur_frm.doc.purchase_type === "Dying Service" && row.weight_measuring_unit === "GM/MTR") {
                                    //If bathrobe item
                                    console.log("enter in js dying service if");
                                    //new_weight is finish_weight
                                    
                                    qty_in_kgs = (row.net_weight/1000);
                                    qty = (row.net_weight/1000)* 2.2046;
                                    
                                }
                                else{
                                    // Normal towel item 
                                    qty_in_kgs =  ((row.qty * (1 + row.b_percent / 100)) * (row.net_weight / 1000));
                                    qty = ((row.qty * (1 + row.b_percent / 100)) * (row.net_weight / 1000)) * 2.2046;

                                }

                                dialog.fields_dict.items.df.data.push({
                                    "so_row_name":row.name,
                                    "parent_item_name": row.variant_of,
                                    "item_code": row.item_code,
                                    "item_name": row.item_name,
                                    "description": row.description,
                                    // "qty": ((row.qty * (1 + row.b_percent / 100)) * (row.net_weight / 1000)) * 2.2046, // in lbs
                                    // "qty_in_kgs": ((row.qty * (1 + row.b_percent / 100)) * (row.net_weight / 1000)), // in kgs

                                    "qty": qty, // in lbs
                                    "qty_in_kgs": qty_in_kgs, // in kgs
                                    "qty_in_pcs": row.qty * (1 + row.b_percent / 100), // in pcs
                                    "uom": 'lbs',
                                    "finish_weight": row.net_weight,
                                    "weight_measuring_unit": row.weight_measuring_unit,
                                    "b_percent": row.b_percent,
                                    "dying_sales_order_qty": row.qty_with_b_percent,
                                    "dying_order_place_qty": row.order_placed_qty || 0,
                                    "dying_balance_qty": ((row.qty_with_b_percent) - (row.order_placed_qty)) || 0

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

    } else {
        frappe.msgprint('Please Select Sales Order First and Purchase type');
    }
}





/////////////////////////////////Stitching Service///////////////////////////////////////

const stitching_service = (frm) => {
    if (frm.doc.sales_order && frm.doc.purchase_type) {
        frm.data = []
        let dialog = new frappe.ui.Dialog({
            title: __("Sales Order"),
            fields: [
                {
                    fieldname: "items", read_only: 1, label: 'Sales Order Items', fieldtype: "Table", cannot_add_rows: true, data: frm.data,
                    get_data: () => {
                        return frm.data
                    },
                    fields: [
                        { fieldtype: 'Data', fieldname: "parent_item_name", in_list_view: 1, read_only: 1, label: __('Parent Item'), columns: 1 },
                        { fieldtype: 'Data', fieldname: "item_code", in_list_view: 1, read_only: 1, label: __('Item Code'), columns: 2 },
                        { fieldtype: 'Data', fieldname: "item_name", in_list_view: 0, read_only: 1, label: __('Item Name'), columns: 1 },
                        { fieldtype: 'Data', fieldname: "description", in_list_view: 0, read_only: 1, label: __('Description'), columns: 2 },
                        { fieldtype: 'Check', fieldname: "check", label: __('Select'), in_list_view: 1, columns: 1 },
                        { fieldtype: 'Data', fieldname: "qty", in_list_view: 1, read_only: 1, label: __('Qty'), columns: 2 },
                        { fieldtype: 'Data', fieldname: "uom", in_list_view: 0, read_only: 1, label: __('UOM'), columns: 2 },
                        { fieldtype: 'Data', fieldname: "qty_in_pcs", in_list_view: 0, read_only: 1, label: __('Qty in Pcs'), columns: 1 },
                        { fieldtype: 'Data', fieldname: "qty_in_kgs", in_list_view: 0, read_only: 1, label: __('Qty in Kgs'), columns: 1 },
                        { fieldtype: 'Data', fieldname: "finish_weight", in_list_view: 0, read_only: 1, label: __('Finish Weight'), columns: 2 },
                        { fieldtype: 'Data', fieldname: "weight_measuring_unit", in_list_view: 0, read_only: 1, label: __('Weight Measuring Unit'), columns: 2 },
                        { fieldtype: 'Float', fieldname: "b_percent", in_list_view: 0, read_only: 1, label: __('B Percent'), columns: 2 },
                        { fieldtype: 'Data', fieldname: "orginal_item", in_list_view: 0, read_only: 1, label: __('Original Item'), columns: 2 },
                        
                        { fieldtype: 'Data', fieldname: "cut_length", in_list_view: 0, read_only: 0, label: __('Cut Length'), columns: 2 },
                        { fieldtype: 'Float',fieldname: "stitch_sales_order_qty", in_list_view: 1,read_only: 1,label: __('Sales Order Qty'), columns: 1},                            
                        { fieldtype: 'Float',fieldname: "stitch_order_place_qty",in_list_view: 1,read_only: 1,label: __('Order Place Qty'),columns: 1},
                        { fieldtype: 'Float',fieldname: "stitch_balance_qty",in_list_view: 1,read_only: 1,label: __('Balance Qty'),columns: 1},
                        { fieldtype: 'Data', fieldname: "so_row_name", in_list_view: 0, read_only: 1, label: __('So Row Name'), columns: 2 },
                          
                        
                   
                   
                    ]
                }
            ],
            primary_action_label: 'Get Items',
            primary_action(values) {
                if (values.items) {
                    let po_check_itemslist = [];
                    for (let row of values.items) {
                        if (row.check == 1) {
                            po_check_itemslist.push(row.orginal_item);
                            let child = frm.add_child('items');
                            let cdt = child.doctype;
                            let cdn = child.name;

                            frappe.model.set_value(cdt, cdn, 'parent_item', row.parent_item_name);
                            frappe.model.set_value(cdt, cdn, 'item_code', row.item_code);
                            frappe.model.set_value(cdt, cdn, 'item_name', row.item_name);
                            frappe.model.set_value(cdt, cdn, 'description', row.description);
                            frappe.model.set_value(cdt, cdn, 'uom', row.uom);
                            frappe.model.set_value(cdt, cdn, 'qty', row.qty);
                            frappe.model.set_value(cdt, cdn, 'qty_in_pcs', row.qty_in_pcs);
                            frappe.model.set_value(cdt, cdn, 'qty_in_kgs', row.qty_in_kgs);
                            frappe.model.set_value(cdt, cdn, 'finish_weight', row.finish_weight);
                            frappe.model.set_value(cdt, cdn, 'weight_measuring_unit', row.weight_measuring_unit);
                            frappe.model.set_value(cdt, cdn, 'b_percent', row.b_percent);
                            frappe.model.set_value(cdt, cdn, 'orginal_item', row.orginal_item);
                            frappe.model.set_value(cdt, cdn, 'so_row_name', row.so_row_name);
                            frappe.model.set_value(cdt, cdn, 'cut_length', row.cut_length);

                        }
                    }

                    frappe.call({
                        method: "ht.utils.purchase_order.fetch_variant_into_raw",
                        args: {
                            sales_order_no: cur_frm.doc.sales_order,
                            purchase_type: cur_frm.doc.purchase_type
                        },
                        callback: (r) => {
                            if (r.message) {
                                for (let row of r.message) {
                                    if (po_check_itemslist.includes(row.item_code)) {
                                        console.log("enter in supplied item");
                                        let child = frm.add_child('supplied_items');
                                        let cdt = child.doctype;
                                        let cdn = child.name;
                                        // let req_qty = ((row.qty) * (1 + (row.b_percent / 100))) * (row.net_weight / 1000) * 2.2046;  # Chaning in formula on request of najam
                                        
                                        // setting new formula for req_qty
                                        let req_qty = ((row.qty) * (1 + (row.b_percent / 100)));

                                        let req_qty_lbs = ((row.qty) * (1 + (row.b_percent / 100))) * (row.net_weight / 1000) * 2.2046;

                                        frappe.model.set_value(cdt, cdn, "main_item_code", row.variant_of);
                                        frappe.model.set_value(cdt, cdn, "rm_item_code", row.item_code);
                                        frappe.model.set_value(cdt, cdn, "required_qty", req_qty);
                                        frappe.model.set_value(cdt,cdn, "required_qty_lbs", req_qty_lbs );
                                    }
                                }
                            }
                        }
                    });

                    cur_frm.refresh_field('items');
                    dialog.hide();
                }
            }
        });

        frappe.call({
            async: false,
            method: "ht.utils.purchase_order.setting_items",
            args: {
                sales_order_no: cur_frm.doc.sales_order,
                purchase_type: cur_frm.doc.purchase_type
            },
            callback: function (r) {
                if (r.message) {
                    for (let row of r.message) {
                        frappe.db.get_doc('Item', row.item_code).then(itm_doc => {
                            setTimeout(() => {
                                dialog.fields_dict.items.df.data.push({
                                    "parent_item_name": row.variant_of,
                                    "item_code": row.item_code,
                                    "item_name": row.item_name,
                                    "description": row.description,
                                    "qty": (row.qty * (1 + row.b_percent / 100)), // in lbs
                                    "qty_in_pcs": row.qty, // in pcs
                                    "qty_in_kgs": ((row.qty * (1 + row.b_percent / 100)) * (row.net_weight / 1000)), // in kgs
                                    "uom": 'lbs',
                                    "finish_weight": row.net_weight,
                                    "cut_length": row.cut_length,
                                    "weight_measuring_unit": row.weight_measuring_unit,
                                    "b_percent": row.b_percent,
                                    "orginal_item": row.orginal_item,
                                    "so_row_name": row.name,
                                    "stitch_sales_order_qty" : row.qty_with_b_percent,
                                    "stitch_order_place_qty" : row.order_placed_qty || 0,
                                    "stitch_balance_qty"   : ((row.qty_with_b_percent) - (row.order_placed_qty)) || 0


                                });
                                frm.data = dialog.fields_dict.items.df.data;
                                dialog.fields_dict.items.grid.refresh();
                            }, 500);
                        });
                    }
                    dialog.show();
                    dialog.$wrapper.find('.modal-dialog').css("max-width", "90%");
                }
            }
        });
    } else {
        frappe.msgprint('Please Select Sales Order First and Purchase type');
    }
}






/////////////////////////////////////////////////Yarn dyeing dialogue box///////////////////////////////////////////////

const fetch_so_yarn_dyeing = (frm) => {
    if (frm.doc.sales_order && frm.doc.purchase_type) {
        frm.data = [];
        let dialog = new frappe.ui.Dialog({
            title: __("Sales Order"),
            fields: [
                {
                    fieldname: "items",
                    read_only: 1,
                    label: 'Sales Order Items',
                    fieldtype: "Table",
                    cannot_add_rows: true,
                    data: frm.data,
                    get_data: () => {
                        return frm.data;
                    },
                    fields: [
                        {
                            fieldtype: 'Data',
                            fieldname: "parent_item_name",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Parent Item'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "dye_raw_mat_item_code",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Item Code'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "dye_raw_mat_item_name",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Item Name'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "dye_raw_item_description",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Description'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Check',
                            fieldname: "check",
                            label: __('Select'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "dye_consumption_lbs",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Qty'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "yarn_sales_order_qty", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Sales Order Qty'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "yarn_order_place_qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Order Place Qty'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "yarn_balance_qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Balance Qty'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "so_row_name",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('So Row Name'),
                            columns: 2
                        }
                    ]
                }
            ],
            primary_action_label: 'Get Items',
            primary_action(values) {
                if (values.items) {
                    let po_check_itemslist = [];
                    for (let row of values.items) {
                        if (row.check == 1) {
                            let child = frm.add_child('items');
                            let cdt = child.doctype;
                            let cdn = child.name;

                            po_check_itemslist.push(row.dye_raw_mat_item_code);

                            frappe.model.set_value(cdt, cdn, 'parent_item', row.parent_item_name);
                            frappe.model.set_value(cdt, cdn, 'item_code', row.dye_raw_mat_item_code);
                            frappe.model.set_value(cdt, cdn, 'item_name', row.dye_raw_mat_item_name);
                            frappe.model.set_value(cdt, cdn, 'description', row.dye_raw_item_description);
                            frappe.model.set_value(cdt, cdn, 'uom', "lbs");
                            frappe.model.set_value(cdt, cdn, 'qty', row.dye_consumption_lbs);
                            frappe.model.set_value(cdt, cdn, 'so_row_name', row.so_row_name);
                        }
                    }

                    frappe.call({
                        method: "ht.utils.purchase_order.fetch_raw_material_items",
                        args: {
                            sales_order_no: cur_frm.doc.sales_order,
                            purchase_type: cur_frm.doc.purchase_type
                        },
                        callback: (r) => {
                            if (r.message) {
                                for (let row of r.message) {
                                    if (po_check_itemslist.includes(row.raw_mat_item)) {
                                        let child = frm.add_child('supplied_items');
                                        let cdt = child.doctype;
                                        let cdn = child.name;

                                        frappe.model.set_value(cdt, cdn, "main_item_code", row.raw_mat_item);
                                        frappe.model.set_value(cdt, cdn, "rm_item_code", row.undye_raw_item);
                                        frappe.model.set_value(cdt, cdn, "rate", row.rate_per_lbs);
                                        frappe.model.set_value(cdt, cdn, "required_qty", row.consumption_lbs);
                                        frappe.model.set_value(cdt, cdn, "component", row.component);
                                        frappe.model.set_value(cdt, cdn, "consumption", row.consumption_);
                                    }
                                }
                            }
                        }
                    });

                    cur_frm.refresh_field('items');
                    dialog.hide();
                }
            }
        });

        frappe.call({
            async: false,
            method: "ht.utils.purchase_order.fetch_raw_material_items",
            args: {
                sales_order_no: cur_frm.doc.sales_order,
                purchase_type: cur_frm.doc.purchase_type
            },
            callback: function (r) {
                if (r.message) {
                    for (let row of r.message) {
                        frappe.db.get_doc('Item', row.raw_mat_item)
                            .then(itm_doc => {
                                setTimeout(() => {
                                    dialog.fields_dict.items.df.data.push({
                                        "so_row_name": row.name,
                                        "parent_item_name": row.parent_item,
                                        "dye_raw_mat_item_code": row.raw_mat_item,
                                        "dye_raw_mat_item_name": row.raw_mat_item_name,
                                        "dye_raw_item_description": row.raw_mat_item_name,
                                        "dye_consumption_lbs": row.consumption_lbs,
                                        "yarn_sales_order_qty": row.consumption_lbs,
                                        "yarn_order_place_qty": row.order_placed_qty || 0,
                                        "yarn_balance_qty": ((row.consumption_lbs) - (row.order_placed_qty)) || 0
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

    } else {
        frappe.msgprint('Please Select Sales Order First and Purchase type');
    }
}








