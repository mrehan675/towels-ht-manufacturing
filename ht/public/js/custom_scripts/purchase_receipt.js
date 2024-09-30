
frappe.ui.form.on("Purchase Receipt Item",{

    lbs:function(frm,cdt,cdn){
        var child = locals[cdt][cdn];
        if (frm.doc.receipt_type=='Yarn Dying Purchase Receipt'){
        cal_total_lbs(child);
        }
    },
    moist_allow_percent:function(frm,cdt,cdn){
        var child = locals[cdt][cdn];
        if (frm.doc.receipt_type=='Yarn Dying Purchase Receipt'){
        cal_total_lbs(child);
        }
    },
    waste_allow_percent:function(frm,cdt,cdn){
        var child = locals[cdt][cdn];
        if (frm.doc.receipt_type=='Yarn Dying Purchase Receipt'){
        cal_total_lbs(child);
        }
    },
    cut_length:function(frm,cdt,cdn){
        console.log("ddddddd");
        // set_dying_receipt_value(frm);

        var child = locals[cdt][cdn];
        
        calculate_lbs_stitching(frm,child);

    
    },
    a_qty:function(frm,cdt,cdn){
        var child = locals[cdt][cdn];
        weave_receipt(frm);
        b_percent(frm);
        if (frm.doc.receipt_type == 'Stitching Purchase Receipt' || 'Bathrobe Purchase Receipt') {
            sum_A_B_C(child);
            }
    },
    b_qty:function(frm,cdt,cdn){
        var child = locals[cdt][cdn];
        weave_receipt(frm);
        b_percent(frm);
        if (frm.doc.receipt_type == 'Stitching Purchase Receipt'|| 'Bathrobe Purchase Receipt') {
            sum_A_B_C(child);
            }
    },
    c_qty:function(frm,cdt,cdn){
        var child = locals[cdt][cdn];
        if (frm.doc.receipt_type == 'Stitching Purchase Receipt' || 'Bathrobe Purchase Receipt') {
        sum_A_B_C(child);
        }
    },
    kgs:function(frm,cdt,cdn){

        const child = locals[cdt][cdn];
        console.log("kgggggg", frm.doc.receipt_type);
        console.log("Child doc: ", child);

        if (frm.doc.receipt_type == 'Yarn Dying Purchase Receipt') {
            cal_netlbs(frm, child);
        }
        
        if (frm.doc.receipt_type == 'Weaving Purchase Receipt'){
            average_gm(frm);
        }
       
    },
    qty: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];

        // Check if the receipt type is 'Dying Purchase Receipt'
        if (frm.doc.receipt_type == 'Dying Purchase Receipt') {
            calculate_kg_lbs(child);
        }
    },
    actual_kg: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];

        // Check if the receipt type is 'Dying Purchase Receipt'
        if (frm.doc.receipt_type == 'Dying Purchase Receipt') {
            calculate_kg_lbs(child);
        }
    },
    bag_ctn:function(frm, cdt,cdn){
        var child = locals[cdt][cdn];
        cal_accepted(child);
        

    },
    lbs_bag:function(frm, cdt,cdn){
        var child = locals[cdt][cdn];
        cal_accepted(child);
        

    }
    
});

function cal_accepted(child){
    var bag_ctn = child.bag_ctn || 0;
        var lbs_bag = child.lbs_bag || 0;

        // Calculate the value of kgs using the formula (Finish Wt * pcs) / 1000
        var accepted_qty = (bag_ctn * lbs_bag);

        // Set the value of kgs field in the child table
        frappe.model.set_value(child.doctype, child.name, "qty", accepted_qty);

}

function cal_total_lbs(child){

    try{        
       
        var lbs = parseFloat(child.lbs) || 0;
        var moist = parseFloat(child.moist_allow_percent) || 0;
        var waste = parseFloat(child.waste_allow_percent) || 0;
        
        // Calculate the value of kgs using the formula (Finish Wt * pcs) / 1000
        var total =  (lbs) + (moist) + (waste);

        if (!lbs==0 && !moist == 0 && !waste==0){
        // Set the value of kgs field in the child table
        frappe.model.set_value(child.doctype, child.name, "total_lbs", total);
        }


    }
    catch(error){
        console.error("An error occurred:", error);
    }
}



function sum_A_B_C(child){

    try{        
       
        var a_qty = parseFloat(child.a_qty) || 0;
        var b_qty = parseFloat(child.b_qty) || 0;
        var c_qty = parseFloat(child.c_qty) || 0;
        
        // Calculate the value of kgs using the formula (Finish Wt * pcs) / 1000
        var total =  (a_qty) + (b_qty) + (c_qty);

        if (!a_qty==0 && !b_qty == 0 && !c_qty==0){
        // Set the value of kgs field in the child table
        frappe.model.set_value(child.doctype, child.name, "total", total);
        }


    }
    catch(error){
        console.error("An error occurred:", error);
    }
}

function calculate_kg_lbs(child){

    try{        
       
        var finish_wt = child.finish_weight_unit || 0;
        var pcs = child.qty || 0;

        // Calculate the value of kgs using the formula (Finish Wt * pcs) / 1000
        var kgs = (finish_wt * pcs) / 1000;

        // Set the value of kgs field in the child table
        frappe.model.set_value(child.doctype, child.name, "kgs", kgs);
        frappe.model.set_value(child.doctype, child.name, "lbs", kgs * 2.2046);


    }
    catch(error){
        console.error("An error occurred:", error);
    }
}

function cal_netlbs(frm, child){
    try{
        
            console.log("enter in net lbs cal");
            //lbs =net kgs * 2.2046/editable/direct data field
            var net_kgs = child.kgs * 2.2046;
            console.log(net_kgs);
            frappe.model.set_value(child.doctype, child.name, "lbs", net_kgs);



    }
    catch(error){ console.error("An error occurred:", error);}
}  

function calculate_lbs_stitching(frm,child){
    console.log("enter in cal method");
    

    try{   
        if (!child.kgs == 0 || !child.lbs ==0 ){
            console.log("enter in try if");

            console.log("finish_weight_unit",child.finish_weight_unit);
       
            var finish_wt = child.finish_weight_unit || 0;
            var pcs = child.qty || 0;

        // Calculate the value of kgs using the formula (Finish Wt * pcs) / 1000
        if (frm.doc.receipt_type == 'Stitching Purchase Receipt'){
            var lbs = (finish_wt * pcs) * 2.2046;
            var kgs = (finish_wt * pcs) ;
            // Set the value of kgs field in the child table
            frappe.model.set_value(child.doctype, child.name, "lbs", lbs);
            frappe.model.set_value(child.doctype, child.name, "kgs", kgs);

        }
        if (frm.doc.receipt_type == 'Bathrobe Purchase Receipt'){
            console.log("Bathrobe");
            // if (!child.lbs || child.lbs == 0){
                console.log("lbs cal",child.lbs);
                console.log("finish_wt",finish_wt);
                console.log("pcs",pcs);
            
                var lbs = (finish_wt * pcs) * 2.2046;
                console.log("lbs",lbs);
                frappe.model.set_value(child.doctype, child.name, "lbs", lbs);
            //}
            //if (child.cut_length){
                console.log("cut length", child.cut_length);
                var kgs = (finish_wt * pcs)  * child.cut_length;  
                console.log("kgs",kgs);
                frappe.model.set_value(child.doctype, child.name, "kgs", kgs);

                var meter_consumption = pcs * child.cut_length;  
                console.log("meter_consumption",meter_consumption);
                frappe.model.set_value(child.doctype, child.name, "consumption_meter", meter_consumption);

            //}

            

           
            
        }

                
    }
    }
    catch(error){
        console.error("An error occurred:", error);
    }
}

frappe.ui.form.on("Purchase Receipt", {

    // refresh:function(frm){

    
    //         frappe.call( {
    //             method: "frappe.client.get_list",
    //             args: {
    //                 'doctype': "Register",
    //                 'filters': { 
    //                 register_type: "to",
    //                 receipt_type: frm.doc.receipt_type},
    //                 'fields': [
    //                     'register_name'
    //                 ]
    //             },
    //             callback: function( r ) {
    //                 if ( r.message ) {
    //                     let arrayKokab = [];
    //                     for ( let i = 0; i < r.message.length; i++ ) {
    //                         var name = r.message[ i ].register_name;
    //                         arrayKokab.push( name );
    //                     }
    //                     let unikKokab = [ ...new Set( arrayKokab.sort() ) ];
    //                     frm.set_df_property( 'test', 'options', unikKokab );
    //                 }
    //             }
    //         } );
        

    // },
    refresh: function(frm){
        if (!frm.is_new()) {
        fetch_grn_items(frm);
        }
    },
    //button
    get_item_from_po: function(frm){
        
        if (frm.doc.receipt_type == 'Yarn Purchase Receipt'){
            
            console.log("enter in yarn eceipt");
            fetch_po_for_yarn_purchase_receipt(frm)

        }
        else if (frm.doc.receipt_type == 'Weaving Purchase Receipt'){
            fetch_po_for_weaving_purchase_receipt(frm)

        }
        else if (frm.doc.receipt_type == 'Accessories Purchase Receipt'){
            fetch_po_for_accessories_purchase_receipt(frm)

        }
        else if(frm.doc.receipt_type == 'Yarn Dying Purchase Receipt'){
            fetch_po_yarn_dying_po_pr(frm)
        }
        else if(frm.doc.receipt_type == 'Dying Purchase Receipt'){
            fetch_po_dying_purchase_receipt(frm)
        }
        else if(frm.doc.receipt_type == 'Bathrobe Purchase Receipt' || frm.doc.receipt_type == 'Stitching Purchase Receipt' ){
            fetch_po_stitching_bathrobe_purchase_receipt(frm)
            //Stitching Bathrobe  Service
        }
        else{
            frappe.throw("Please Select Receipt Type")
        }

       
    },
    //buttom
    fetch_po_items: function(frm){
        fetch_po_supplied_items(frm);
    },
    supplier: function(frm) {
        if (frm.doc.supplier) {
            // Fetch the linked warehouse for the selected supplier
            frappe.call({
                method: 'frappe.client.get_value',
                args: {
                    'doctype': 'Warehouse',
                    'filters': {
                        'warehouse_name': frm.doc.supplier
                    },
                    'fieldname': 'name'
                },
                callback: function(r) {
                    if (r.message) {
                        console.log("r mesage");
                        console.log(r.message.name);
                        frm.set_value('supplier_warehouse', r.message.name);
                    } else {
                        frappe.msgprint(__('No warehouse found for the selected supplier.'));
                    }
                }
            });
        }
    },
    auto_stock_transfer:function(frm){
        console.log("enter in auto stock ");
        if (frm.doc.auto_stock_transfer) {
            console.log("enter pss iff");
            // Clear the purchase_order field
            frm.set_value('purchase_order', '');
        }
    },

    onload:function(frm){
        console.log("fg");
        set_link_query(frm);

    
    },
	setup: function(frm) {
		frm.set_query("receipt_type", function() {
			return {
				filters: [
					["Order Type","type", "in", ["Purchase Receipt"]]
				]
			}
		});

        frm.set_query("po_type", function() {
			return {
				filters: [
					["Order Type","type", "in", ["Purchase Order"]]
				]
			}
		});
      
        
	},
    
    after_save:function(frm){
        console.log("llllllll");
        console.log(frm.doc.purchase_order);

        if (frm.doc.auto_stock_transfer) {

        // Comment stock entry creation work due to Get PO dialogue work.
        // _make_rm_stock_entry(frm);
        function _make_rm_stock_entry(frm) {
            console.log(frm.doc.purchase_order);
            console.log(cur_frm.doc.purchase_order);
            console.log('make stock entry');
            
            console.log("purchase_order");
            frappe.call({
                method:"ht.utils.purchase_receipt.make_rm_stock_entry",
                args: {
                    purchase_order: frm.doc.purchase_order,
                    items: frm.doc.items
                }
                ,
                callback: function(r) {
                    var doclist = frappe.model.sync(r.message);
                    //frappe.set_route("Form", doclist[0].doctype, doclist[0].name);
                }
            });
        }
    }

        if (frm.doc.receipt_type == 'Yarn Purchase Receipt'){
            yarn_receipt(frm);
        }
        else if (frm.doc.receipt_type == 'Weaving Purchase Receipt'){
            weave_receipt(frm);
            b_percent(frm);
            average_gm(frm);
        }
        else if (frm.doc.receipt_type == 'Dying Purchase Receipt'){         
            
            frm.doc.items.forEach(function(child) {
                calculate_kg_lbs(child);
            });
        }
        else if (frm.doc.receipt_type == 'Stitching Purchase Receipt'){
           
            
            frm.doc.items.forEach(function(child) {
                console.log("-----------");
                calculate_lbs_stitching(child);
                
            });
        } 
        
        
        

    },
    receipt_type:function(frm){
        console.log("enter in receipt event");
        set_purchase_receipt_type(frm);
        console.log("ddd");
        set_link_query (frm);

        let po_types = set_po_based_on_pr_type(frm.doc.receipt_type);

        frm.set_query("po_name", function() {
            if (po_types) {
            return {
                filters: {
                    "purchase_type": po_types,
                    "supplier":frm.doc.supplier,
                    "job_number":frm.doc.job_number
                }
            }
        }
        });
        
    },

    validate:function(frm){

        if (frm.doc.receipt_type == 'Yarn Purchase Receipt' || frm.doc.receipt_type == 'Weaving Purchase Receipt' || frm.doc.receipt_type == 'Dying Purchase Receipt' || frm.doc.receipt_type=='Stitching Purchase Receipt'){
            set_purchase_receipt_type(frm);
        }
       
        

    },

    before_save:function(frm){

        if (frm.doc.receipt_type == 'Yarn Purchase Receipt' || frm.doc.receipt_type == 'Weaving Purchase Receipt' || frm.doc.receipt_type == 'Dying Purchase Receipt' || frm.doc.receipt_type == 'Stitching Purchase Receipt' || frm.doc.receipt_type == 'Bathrobe Purchase Receipt' || frm.doc.receipt_type == 'Yarn Dying Purchase Receipt'){
            
            set_purchase_receipt_type(frm);

            if (frm.doc.receipt_type == 'Dying Purchase Receipt'){
                console.log("enter in before save");
                
                set_dying_receipt_value(frm);
                
            } 
            else if (frm.doc.receipt_type == 'Stitching Purchase Receipt'){
                console.log("enter in before save");
                
                set_dying_receipt_value(frm);
                
            } 
            else if (frm.doc.receipt_type == 'Bathrobe Purchase Receipt'){
                console.log("enter in before save");
                
                set_dying_receipt_value(frm);
                
            }
            else if (frm.doc.receipt_type == 'Yarn Dying Purchase Receipt'){
                console.log("enter in before save");
                
                set_dying_receipt_value(frm);
                
            }  
    
        }
    
       
    
        

    },
    receipt_type_on_form_rendered:function(frm) {
        console.log("enter in render fomr");
        
        if (frm.doc.receipt_type == 'Yarn Purchase Receipt' || frm.doc.receipt_type == 'Weaving Purchase Receipt' || frm.doc.receipt_type == 'Dying Purchase Receipt' || frm.doc.receipt_type == 'Stitching Purchase Receipt'){
            set_purchase_receipt_type(frm);
        }

    }

});




function set_po_based_on_pr_type(receipt_type) {
    let po_types = ""; 
    
    if (receipt_type == "Dying Purchase Receipt") {
        po_types = "Dying Service";
    } 
    else if (receipt_type == "Accessories Purchase Receipt") {
        po_types = "Accessories";
    } 
    else if (receipt_type == "Bathrobe Purchase Receipt") {
        po_types = "Stitching Bathrobe Service";
    } 
    else if (receipt_type == "Stitching Purchase Receipt") {
        po_types = "Stitching Service";
    } 
    else if (receipt_type == "Weaving Purchase Receipt") {
        po_types = "Weaving Service";
    } 
    else if (receipt_type == "Yarn Dying Purchase Receipt") {
        po_types = "Yarn Dying";
    } 
    else if (receipt_type == "Yarn Purchase Receipt") {
        po_types = "Yarn Purchase";
    }

    return po_types;
}    
    
function fetch_grn_items(frm) {

        console.log("enter in items ss");
    frappe.call({
        method: "ht.utils.purchase_receipt.set_child_itemlist",
        args: {
            "pr_name": frm.doc.name
        },
        callback: function(response) {
            if (response.message) {
                // Clear the current options of the select field
                // frm.clear_table('grn_item');
                
                // Dynamically add item_code options
                let item_codes = response.message;

                // Set the options of the grn_item select field
                frm.set_df_property('grn_item', 'options', item_codes.join('\n'));
                
                // Alternatively, you can loop and add each option (if needed)
                /*
                item_codes.forEach(function(item_code) {
                    frm.add_custom_option('grn_item', item_code);
                });
                */
                frm.refresh_field('grn_item'); // Refresh the field to apply the changes
            }
        }
    });



}



async function set_dying_receipt_value(frm){

    try{
        
        for(const row of frm.doc.items){
            
            if (!row.finish_weight_unit || !row.finish_weight_uom || !row.yarn_color) {

            const response = await frappe.db.get_list("Purchase Order Item", {
                fields: ["finish_weight", "f_weight_uom","color",'brand'],  
                filters: { parent: row.purchase_order , name:row.purchase_order_item}  
                });
            
            if (response) {

                
                
                const poItem = response[0];
                // console.log("poitem",poItem);

                
                const finishWeight = poItem.finish_weight;
                const f_weight_uom = poItem.f_weight_uom;
                const color = poItem.color;
                const brand = poItem.brand;
                

               
                frappe.model.set_value(row.doctype, row.name, "finish_weight_unit", finishWeight);
                frappe.model.set_value(row.doctype, row.name, "finish_weight_uom", f_weight_uom);
                frappe.model.set_value(row.doctype, row.name, "yarn_color", color);
                frappe.model.set_value(row.doctype, row.name, "yarn_brand", brand);



            }
        }
    }
        
    }
    catch(error){
        console.error("An error occurred:", error);
    }

}

function average_gm(frm){

    try{

        frm.doc.items.forEach(function(child){

            frappe.model.set_value(child.doctype, child.name, "avg_gm_per_pc", null);
            if (child.kgs){
                if (child.a_qty && child.b_qty){                
                    var avg_gm_per_pc =  (child.kgs)/(child.a_qty + child.b_qty + child.c_qty) * 1000;               
                    frappe.model.set_value(child.doctype, child.name, "avg_gm_per_pc", avg_gm_per_pc);
                }  
            }  
            
        });
    }

    catch(error){
        console.error("An error occurred:", error);
    }

}




function b_percent(frm){

    try{

        frm.doc.items.forEach(function(child){

            frappe.model.set_value(child.doctype, child.name, "_b_percent", null);
            if (child.a_qty && child.b_qty){                
                var b_percent =  (child.b_qty)/(child.a_qty + child.b_qty) * 100;              
                frappe.model.set_value(child.doctype, child.name, "_b_percent", b_percent);
            }    
            
        });
    }

    catch(error){
        console.error("An error occurred:", error);
    }

}

function weave_receipt(frm){

    try{  
    
        frm.doc.items.forEach(function(child){

            frappe.model.set_value(child.doctype, child.name, "lbs", null);

            if (child.a_qty && child.b_qty){
                console.log("pass first if");
                if (child.greigh_weigh_unit && child.loom_wastage){
                var lbs =  (child.a_qty + child.b_qty) * (child.greigh_weigh_unit/1000 ) * 2.2046 * (child.loom_wastage);
                console.log("lbs",lbs);
                frappe.model.set_value(child.doctype, child.name, "lbs", lbs);
            
            }
            }

            
        });
    }
    catch (error){
        console.error("An error occurred:", error);
    }
}




function yarn_receipt(frm) {
    console.log("before");
    var purchase_receipt_no = frm.doc.name;
    
  
    frappe.call({
        method: "ht.fetch_so.fetch_pr_yarn_field",
        args: {
            purchase_receipt_no : purchase_receipt_no
            
        },
        callback: function(response) {
            if (response.message) {
                console.log("call back successfully");
                
                ///////////////needs to check/////
                frm.refresh_field('items');
                frm.reload_doc();
                //cur_frm.fields_dict['Quality Inspection(s)'].refresh();
            }
            
        },
        error: function(err) {
            console.error("An error occurred:", err);
            // Handle the error here, if needed
        }
    });
  
}

function set_purchase_receipt_type(frm) {        
    
    try{
        console.log("dsdsdsds");
    frm.doc.items.forEach(function(item) {
        
        frappe.model.set_value(item.doctype,item.name,'purchase_type', frm.doc.receipt_type);


        ///////////needs to check this
        frm.refresh_field('items');
        frm.refresh();

    });
    }
    catch (error){
        console.error("An error occurred:", error);
    }
}

function set_link_query(frm){
    console.log("query");
    console.log(frm.doc.receipt_type);

    // frm.set_query("register_to", function() {
    //     return {
    //         query: "ht.api.filter_user",
    //         filters: {
    //             register_type: "to",
    //             receipt_type: frm.doc.receipt_type
    //         }
    //     };
        
    // });
    frappe.call( {
        method: "frappe.client.get_list",
        args: {
            'doctype': "Register",
            'filters': { 
            register_type: "to",
            receipt_type: frm.doc.receipt_type},
            'fields': [
                'register_name'
            ]
        },
        callback: function( r ) {
            if ( r.message ) {
                let option_list = [];
                for ( let i = 0; i < r.message.length; i++ ) {
                    var name = r.message[ i ].register_name;
                    option_list.push( name );
                }
                let register_to_options = [ ...new Set( option_list.sort() ) ];
                register_to_options.unshift("");
                frm.set_df_property( 'register_to', 'options', register_to_options );
            }
        }
    } );

    frappe.call( {
        method: "frappe.client.get_list",
        args: {
            'doctype': "Register",
            'filters': { 
                register_type: "from",
                receipt_type: frm.doc.receipt_type},
            'fields': [
                'register_name'
            ]
        },
        callback: function( r ) {
            if ( r.message ) {
                let option_list = [];
                for ( let i = 0; i < r.message.length; i++ ) {
                    var name = r.message[ i ].register_name;
                    option_list.push( name );
                }
                let register_from_options = [ ...new Set( option_list.sort() ) ];
                register_from_options.unshift("");
                
                frm.set_df_property( 'register_from', 'options', register_from_options );
            }
        }
    } );
} 



////////////////////////////////////////Auto Stock Entry Work//////////////////
   
const fetch_po_supplied_items = (frm) => {
    if (frm.doc.stock_supplier_ && frm.doc.po_type) {
        
        frm.data = [];
        let dialog = new frappe.ui.Dialog({
            title: __("Auto Stock Entry"),
        

            fields: [
                {
                    fieldtype: 'Data',
                    fieldname: 'item_name',
                    read_only: 1,
                    columns: 1,
                    label: __('Item Name'),
                    default: frm.doc.grn_item
                },
                {
                    fieldtype: 'Column Break'  // This adds the column break
                },
                {
                    fieldtype: 'Float',
                    fieldname: 'qty',
                    read_only: 1,
                    columns: 1,
                    label: __('Qty')
                },
                {
                    fieldtype: 'Section Break'  // This adds the column break
                },
                {
                    fieldname: "items",
                    read_only: 1,
                    label: 'Purchase Order Supplied Items',
                    fieldtype: "Table",
                    cannot_add_rows: true,
                    data: frm.data,
                    get_data: () => {
                        return frm.data;
                    },
                    fields: [
                        {
                            fieldtype: 'Data',
                            fieldname: "po_name", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('PO No'),
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
                            fieldname: "finish_weight_unit",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Finish Weight'),
                            columns: 1
                        },
            
                        {
                            fieldtype: 'Data',
                            fieldname: "required_qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Required Qty'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "supplied_qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Supplied Qty'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Check',
                            fieldname: "check",
                            label: __('Select'),
                            in_list_view: 1,
                            columns: 1,
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
                            fieldname: "item_row_name", 
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Row Name'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "parent_item_code",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Parent Item'),
                            columns: 2
                        },
                        
                    ]
                }
            ],
            primary_action_label: 'Create Stock Entry',
            primary_action(values) {
                if (values.items) {
                    let po_check_itemslist = [];
                    for (let row of values.items) {
                        if (row.check == 1) {
                            let child = frm.add_child('items');
                            let cdt = child.doctype;
                            let cdn = child.name;

                            // po_check_itemslist.push(row.dye_raw_mat_item_code);po_name
                           
                            frappe.model.set_value(cdt, cdn, 'purchase_order_item', row.item_row_name);
                            frappe.model.set_value(cdt, cdn, 'purchase_order', row.po_name);
                            frappe.model.set_value(cdt, cdn, 'item_code', row.item_code);
                            frappe.model.set_value(cdt, cdn, 'item_name', row.item_name);
                            frappe.model.set_value(cdt, cdn, 'description', row.description);


                            frappe.model.set_value(cdt, cdn, 'fancy', row.fancy);
                            frappe.model.set_value(cdt, cdn, 'qty', row.balance_qty);
                            setTimeout(function() {
                                frappe.model.set_value(cdt, cdn, 'rate', row.rate);
                                frappe.model.set_value(cdt, cdn, 'price_list_rate', row.rate);
                            }, 1500); // Delay of 1000 milliseconds
                            

                            frappe.model.set_value(cdt, cdn, 'greigh_weigh_unit', row.greigh_weigh_unit);
                            frappe.model.set_value(cdt, cdn, 'finish_weight_unit', row.finish_weight_unit);

                        }
                    }



                    cur_frm.refresh_field('items');
                    dialog.hide();
                }
            }
        });
       
        
       
        frappe.call({
            async: false,
            method: "ht.utils.purchase_receipt.fetch_supplied_items",
            args: {
                stock_supplier: cur_frm.doc.stock_supplier_,
                po_type: cur_frm.doc.po_type
                
            },
            callback: function (r) {
                if (r.message) {
                    for (let row of r.message) {
                        console.log("ROw",row);
                        // frappe.db.get_doc('Item', row.raw_mat_item)
                            // .then(itm_doc => {
                                setTimeout(() => {
                                    dialog.fields_dict.items.df.data.push({
                                        "po_name":row.parent,
                                        "item_row_name": row.name,
                                        // "po_date": row.po_date,                                       
                                        "parent_item_code":row.main_item_code,
                                        "item_code": row.rm_item_code,
                                        "required_qty": row.required_qty,
                                        "supplied_qty": row.supplied_qty,
                                        "finish_weight_unit": row.finish_weight_unit,
                                        "balance_qty": ((row.required_qty) - (row.supplied_qty)) || 0
                                    });
                                    frm.data = dialog.fields_dict.items.df.data;
                                    dialog.fields_dict.items.grid.refresh();
                                }, 500);
                            // });
                    }
                    dialog.show();
                    dialog.$wrapper.find('.modal-dialog').css("max-width", "80%");
                }
            }
        });

    } else {
        frappe.msgprint('Please Select Supplier / Job No and Purchase type');
    }
}








//////////////////////////////////////////////      YARN PURCHASE RECEIPT /////
const fetch_po_for_yarn_purchase_receipt = (frm) => {
    if (frm.doc.supplier && frm.doc.receipt_type) {
        if(frm.doc.receipt_type == "Yarn Purchase Receipt"){
           var po_type = "Yarn Purchase" 
        }
        frm.data = [];
        let dialog = new frappe.ui.Dialog({
            title: __("Purchase Order"),
            fields: [
                {
                    fieldname: "items",
                    read_only: 1,
                    label: 'Purchase Order Items',
                    fieldtype: "Table",
                    cannot_add_rows: true,
                    data: frm.data,
                    get_data: () => {
                        return frm.data;
                    },
                    fields: [
                        {
                            fieldtype: 'Data',
                            fieldname: "po_name", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('PO No'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Date',
                            fieldname: "po_date", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('PO Date'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "item_code",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Count'),
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
                            fieldname: "decription",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Description'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "brand",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Brand'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Order Qty'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "rate",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Rate'),
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
                            fieldtype: 'Float',
                            fieldname: "total_received_qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Total Received Qty'),
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
                            fieldname: "color",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Color'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "rate_per_lbs",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Rate/10Lbs'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "item_row_name",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Item Row'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "bag_ctn",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Bag-Ctn'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "lbs_bag",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Lbs / Bag'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "uom",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Uom'),
                            columns: 1
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

                            // po_check_itemslist.push(row.dye_raw_mat_item_code);po_name
                           
                            frappe.model.set_value(cdt, cdn, 'purchase_order_item', row.item_row_name);
                            frappe.model.set_value(cdt, cdn, 'purchase_order', row.po_name);
                            frappe.model.set_value(cdt, cdn, 'item_code', row.item_code);
                            frappe.model.set_value(cdt, cdn, 'item_name', row.item_name);
                            frappe.model.set_value(cdt, cdn, 'description', row.description);


                            frappe.model.set_value(cdt, cdn, 'brand', row.brand);
                            frappe.model.set_value(cdt, cdn, 'qty', row.qty);
                            
                            setTimeout(function() {
                                frappe.model.set_value(cdt, cdn, 'rate', row.rate);
                                frappe.model.set_value(cdt, cdn, 'price_list_rate', row.rate);
                            }, 1000); // Delay of 1000 milliseconds


                            frappe.model.set_value(cdt, cdn, 'color', row.color);
                            frappe.model.set_value(cdt, cdn, 'rate_10_lbs', row.rate_per_lbs);

                            frappe.model.set_value(cdt, cdn, 'bag_ctn', row.bag_ctn);
                            frappe.model.set_value(cdt, cdn, 'lbs_bag', row.lbs_bag);
                            frappe.model.set_value(cdt, cdn, 'uom', row.uom);


                        }
                    }



                    cur_frm.refresh_field('items');
                    dialog.hide();
                }
            }
        });

        frappe.call({
            async: false,
            method: "ht.utils.purchase_receipt.fetch_yarn_items",
            args: {
                // job_no: cur_frm.doc.job_number,
                supplier: cur_frm.doc.supplier,
                purchase_type: po_type
            },
            callback: function (r) {
                if (r.message) {
                    for (let row of r.message) {
                        console.log("ROw",row);
                        // frappe.db.get_doc('Item', row.raw_mat_item)
                            // .then(itm_doc => {
                                setTimeout(() => {
                                    dialog.fields_dict.items.df.data.push({
                                        "po_name":row.purchase_order,
                                        "item_row_name": row.item_row_name,
                                        "po_date": row.po_date,
                                        "item_code": row.item_code,
                                        "item_name": row.item_name,
                                        "description":row.description,
                                        "brand": row.brand,
                                        "qty": row.qty,
                                        "rate": row.rate,
                                        "total_received_qty": row.received_qty,
                                        "rate_per_lbs": row.rate_per_10lbs,
                                        "balance_qty": ((row.qty) - (row.received_qty)) || 0,
                                        "bag_ctn":row.bag_ctn,
                                        "lbs_bag":row.lbs_bag,
                                        "uom":row.uom
                                    });
                                    frm.data = dialog.fields_dict.items.df.data;
                                    dialog.fields_dict.items.grid.refresh();
                                }, 500);
                            // });
                    }
                    dialog.show();
                    dialog.$wrapper.find('.modal-dialog').css("max-width", "80%");
                }
            }
        });

    } else {
        frappe.msgprint('Please Select Supplier / Job No and Purchase type');
    }
}



/////////////////////////////////////////////////////  Weaving PO Fetch Work////////////



    
const fetch_po_for_weaving_purchase_receipt = (frm) => {
    if (frm.doc.supplier && frm.doc.receipt_type && frm.doc.job_number) {
        if(frm.doc.receipt_type == "Weaving Purchase Receipt"){
           var po_type = "Weaving Service" 
        }
        frm.data = [];
        let dialog = new frappe.ui.Dialog({
            title: __("Purchase Order"),
            fields: [
                {
                    fieldname: "items",
                    read_only: 1,
                    label: 'Purchase Order Items',
                    fieldtype: "Table",
                    cannot_add_rows: true,
                    data: frm.data,
                    get_data: () => {
                        return frm.data;
                    },
                    fields: [
                        {
                            fieldtype: 'Data',
                            fieldname: "po_name", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('PO No'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Date',
                            fieldname: "po_date", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('PO Date'),
                            columns: 1
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
                            fieldname: "decription",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Description'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Order Qty'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "rate",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Rate'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Check',
                            fieldname: "check",
                            label: __('Select'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "total_received_qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Total Received Qty'),
                            columns: 2
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
                            fieldname: "fancy",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Fancy'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "greigh_weigh_unit",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Greigh Weigh Unit'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "finish_weight_unit",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Finish Weight Unit'),
                            columns: 1
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

                            // po_check_itemslist.push(row.dye_raw_mat_item_code);po_name
                           
                            frappe.model.set_value(cdt, cdn, 'purchase_order_item', row.item_row_name);
                            frappe.model.set_value(cdt, cdn, 'purchase_order', row.po_name);
                            frappe.model.set_value(cdt, cdn, 'item_code', row.item_code);
                            frappe.model.set_value(cdt, cdn, 'item_name', row.item_name);
                            frappe.model.set_value(cdt, cdn, 'description', row.description);


                            frappe.model.set_value(cdt, cdn, 'fancy', row.fancy);
                            frappe.model.set_value(cdt, cdn, 'qty', row.balance_qty);
                            setTimeout(function() {
                                frappe.model.set_value(cdt, cdn, 'rate', row.rate);
                                frappe.model.set_value(cdt, cdn, 'price_list_rate', row.rate);
                            }, 1500); // Delay of 1000 milliseconds
                            

                            frappe.model.set_value(cdt, cdn, 'greigh_weigh_unit', row.greigh_weigh_unit);
                            frappe.model.set_value(cdt, cdn, 'finish_weight_unit', row.finish_weight_unit);

                        }
                    }



                    cur_frm.refresh_field('items');
                    dialog.hide();
                }
            }
        });

        frappe.call({
            async: false,
            method: "ht.utils.purchase_receipt.fetch_weave_items",
            args: {
                job_no: cur_frm.doc.job_number,
                supplier: cur_frm.doc.supplier,
                purchase_type: po_type
            },
            callback: function (r) {
                if (r.message) {
                    for (let row of r.message) {
                        console.log("ROw",row);
                        // frappe.db.get_doc('Item', row.raw_mat_item)
                            // .then(itm_doc => {
                                setTimeout(() => {
                                    dialog.fields_dict.items.df.data.push({
                                        "po_name":row.purchase_order,
                                        "item_row_name": row.item_row_name,
                                        "po_date": row.po_date,
                                        "item_code": row.item_code,
                                        "item_name": row.item_name,
                                        "description":row.description,
                                        "fancy": row.fancy,
                                        "qty": row.qty,
                                        "rate":row.rate,
                                        "total_received_qty": row.received_qty,
                                        "greigh_weigh_unit": row.greigh_weigh_unit,
                                        "finish_weight_unit": row.finish_weight_unit,
                                        "balance_qty": ((row.qty) - (row.received_qty)) || 0
                                    });
                                    frm.data = dialog.fields_dict.items.df.data;
                                    dialog.fields_dict.items.grid.refresh();
                                }, 500);
                            // });
                    }
                    dialog.show();
                    dialog.$wrapper.find('.modal-dialog').css("max-width", "80%");
                }
            }
        });

    } else {
        frappe.msgprint('Please Select Supplier / Job No and Purchase type');
    }
}
    

/////////////////////////////////////////////////     Accessories    ////////////////////////////



const fetch_po_for_accessories_purchase_receipt = (frm) => {
    if (frm.doc.supplier && frm.doc.receipt_type && frm.doc.job_number) {
        if(frm.doc.receipt_type == "Accessories Purchase Receipt"){
           var po_type = "Accessories" 
        }
        frm.data = [];
        let dialog = new frappe.ui.Dialog({
            title: __("Purchase Order"),
            fields: [
                {
                    fieldname: "items",
                    read_only: 1,
                    label: 'Purchase Order Items',
                    fieldtype: "Table",
                    cannot_add_rows: true,
                    data: frm.data,
                    get_data: () => {
                        return frm.data;
                    },
                    fields: [
                        {
                            fieldtype: 'Data',
                            fieldname: "po_name", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('PO No'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "job_no", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Job No'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "category",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Category'),
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
                            fieldname: "uom",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Uom'),
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
                            fieldname: "decription",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Description'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Order Qty'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "rate",
                            in_list_view: 0 ,
                            read_only: 1,
                            label: __('Rate'),
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
                            fieldtype: 'Float',
                            fieldname: "total_received_qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Total Received Qty'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "balance_qty", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Balance Qty'),
                            columns: 1
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

                            // po_check_itemslist.push(row.dye_raw_mat_item_code);po_name
                           
                            frappe.model.set_value(cdt, cdn, 'purchase_order_item', row.item_row_name);
                            frappe.model.set_value(cdt, cdn, 'purchase_order', row.po_name);
                            frappe.model.set_value(cdt, cdn, 'job_no', row.job_no);

                            frappe.model.set_value(cdt, cdn, 'item_code', row.item_code);
                            frappe.model.set_value(cdt, cdn, 'item_name', row.item_name);
                            frappe.model.set_value(cdt, cdn, 'description', row.description);
                            frappe.model.set_value(cdt, cdn, 'uom', row.uom);
                            
                            frappe.model.set_value(cdt, cdn, 'category', row.category);
                            frappe.model.set_value(cdt, cdn, 'qty', row.balance_qty);

                            setTimeout(function() {
                                frappe.model.set_value(cdt, cdn, 'rate', row.rate);
                                frappe.model.set_value(cdt, cdn, 'price_list_rate', row.rate);
                            }, 1000); // Delay of 1000 milliseconds

                            
                        }
                    }



                    cur_frm.refresh_field('items');
                    dialog.hide();
                }
            }
        });

        frappe.call({
            async: false,
            method: "ht.utils.purchase_receipt.fetch_accessories_items",
            args: {
                job_no: cur_frm.doc.job_number,
                supplier: cur_frm.doc.supplier,
                purchase_type: po_type
            },
            callback: function (r) {
                if (r.message) {
                    for (let row of r.message) {
                        console.log("ROw",row);
                        // frappe.db.get_doc('Item', row.raw_mat_item)
                            // .then(itm_doc => {
                                setTimeout(() => {
                                    dialog.fields_dict.items.df.data.push({
                                        "po_name":row.purchase_order,
                                        "item_row_name": row.item_row_name,
                                        "po_date": row.po_date,
                                        "item_code": row.item_code,
                                        "item_name": row.item_name,
                                        "description":row.description,
                                        "category": row.category,
                                        "qty": row.qty,
                                        "rate": row.rate,
                                        "total_received_qty": row.received_qty,
                                        "job_no": row.job_no,
                                        "uom": row.uom,
                                        "balance_qty": ((row.qty) - (row.received_qty)) || 0
                                    });
                                    frm.data = dialog.fields_dict.items.df.data;
                                    dialog.fields_dict.items.grid.refresh();
                                }, 500);
                            // });
                    }
                    dialog.show();
                    dialog.$wrapper.find('.modal-dialog').css("max-width", "80%");
                }
            }
        });

    } else {
        frappe.msgprint('Please Select Supplier / Job No and Purchase type');
    }
}
    






///////////////////////////////Yarn Dying Purchase Receipt  ///////////////////

const fetch_po_yarn_dying_po_pr = (frm) => {
    if (frm.doc.supplier && frm.doc.receipt_type && frm.doc.job_number) {
        if(frm.doc.receipt_type == "Yarn Dying Purchase Receipt"){
           var po_type = "Yarn Dying" 
        }
  
        frm.data = [];
        let dialog = new frappe.ui.Dialog({
            title: __("Purchase Order"),
            fields: [
                {
                    fieldname: "items",
                    read_only: 1,
                    label: 'Purchase Order Items',
                    fieldtype: "Table",
                    cannot_add_rows: true,
                    data: frm.data,
                    get_data: () => {
                        return frm.data;
                    },
                    fields: [
                        {
                            fieldtype: 'Data',
                            fieldname: "po_name", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('PO No'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "job_no", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Job No'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "color",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Color'),
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
                            fieldname: "uom",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Uom'),
                            columns: 1
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
                            fieldname: "decription",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Description'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Order Qty'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "rate",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Rate'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Check',
                            fieldname: "check",
                            label: __('Select'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "total_received_qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Total Received Qty'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "balance_qty", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Balance Qty'),
                            columns: 1
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

                            // po_check_itemslist.push(row.dye_raw_mat_item_code);po_name
                           
                            frappe.model.set_value(cdt, cdn, 'purchase_order_item', row.item_row_name);
                            frappe.model.set_value(cdt, cdn, 'purchase_order', row.po_name);
                            frappe.model.set_value(cdt, cdn, 'job_no', row.job_no);

                            frappe.model.set_value(cdt, cdn, 'item_code', row.item_code);
                            frappe.model.set_value(cdt, cdn, 'item_name', row.item_name);
                            frappe.model.set_value(cdt, cdn, 'description', row.description);
                            frappe.model.set_value(cdt, cdn, 'uom', row.uom);
                            
                            frappe.model.set_value(cdt, cdn, 'category', row.category);
                            frappe.model.set_value(cdt, cdn, 'qty', row.balance_qty);
                            setTimeout(function() {
                                frappe.model.set_value(cdt, cdn, 'rate', row.rate);
                                frappe.model.set_value(cdt, cdn, 'price_list_rate', row.rate);
                            }, 1000); // Delay of 1000 milliseconds

                            
                        }
                    }



                    cur_frm.refresh_field('items');
                    dialog.hide();
                }
            }
        });

        frappe.call({
            async: false,
            method: "ht.utils.purchase_receipt.fetch_yarn_dying_items",
            args: {
                job_no: cur_frm.doc.job_number,
                supplier: cur_frm.doc.supplier,
                purchase_type: po_type
            },
            callback: function (r) {
                if (r.message) {
                    for (let row of r.message) {
                        console.log("ROw",row);
                        // frappe.db.get_doc('Item', row.raw_mat_item)
                            // .then(itm_doc => {
                                setTimeout(() => {
                                    dialog.fields_dict.items.df.data.push({
                                        "po_name":row.purchase_order,
                                        "item_row_name": row.item_row_name,
                                        "po_date": row.po_date,
                                        "item_code": row.item_code,
                                        "item_name": row.item_name,
                                        "description":row.description,
                                        "color": row.color,
                                        "qty": row.qty,
                                        "rate":row.rate,
                                        "total_received_qty": row.received_qty,
                                        "job_no": row.job_no,
                                        "uom": row.uom,
                                        "balance_qty": ((row.qty) - (row.received_qty)) || 0
                                    });
                                    frm.data = dialog.fields_dict.items.df.data;
                                    dialog.fields_dict.items.grid.refresh();
                                }, 500);
                            // });
                    }
                    dialog.show();
                    dialog.$wrapper.find('.modal-dialog').css("max-width", "80%");
                }
            }
        });

    } else {
        frappe.msgprint('Please Select Supplier / Job No and Purchase type');
    }
}
    




/////////////////////////////////////////////////Dying Purchase Receipt//////////////////////
const fetch_po_dying_purchase_receipt = (frm) => {
    if (frm.doc.supplier && frm.doc.receipt_type && frm.doc.job_number) {
        if(frm.doc.receipt_type == "Dying Purchase Receipt"){
           var po_type = "Dying Service" 
        }
  
        frm.data = [];
        let dialog = new frappe.ui.Dialog({
            title: __("Purchase Order"),
            fields: [
                {
                    fieldname: "items",
                    read_only: 1,
                    label: 'Purchase Order Items',
                    fieldtype: "Table",
                    cannot_add_rows: true,
                    data: frm.data,
                    get_data: () => {
                        return frm.data;
                    },
                    fields: [
                        {
                            fieldtype: 'Data',
                            fieldname: "po_name", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('PO No'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "job_no", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Job No'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "color",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Color'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "item_code",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Item Code'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "uom",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Uom'),
                            columns: 1
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
                            fieldname: "decription",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Description'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "qty_in_pcs",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Order Qty'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "rate",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Rate'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Check',
                            fieldname: "check",
                            label: __('Select'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "total_received_qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Total Received Qty'),
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
                            fieldname: "fancy", 
                            in_list_view: 0,
                            read_only: 0,
                            label: __('Fancy'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "finish_weight", 
                            in_list_view: 0,
                            read_only: 0,
                            label: __('Finish Weight'),
                            columns: 1
                        },
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

                            // po_check_itemslist.push(row.dye_raw_mat_item_code);po_name
                           
                            frappe.model.set_value(cdt, cdn, 'purchase_order_item', row.item_row_name);
                            frappe.model.set_value(cdt, cdn, 'purchase_order', row.po_name);
                            frappe.model.set_value(cdt, cdn, 'job_no', row.job_no);

                            frappe.model.set_value(cdt, cdn, 'item_code', row.item_code);
                            frappe.model.set_value(cdt, cdn, 'item_name', row.item_name);
                            frappe.model.set_value(cdt, cdn, 'description', row.description);
                            frappe.model.set_value(cdt, cdn, 'uom', row.uom);                            
                            frappe.model.set_value(cdt, cdn, 'fancy', row.fancy);
                            frappe.model.set_value(cdt, cdn, 'yarn_color', row.color);
                            frappe.model.set_value(cdt, cdn, 'qty', row.qty_in_pcs);
                            frappe.model.set_value(cdt, cdn, 'finish_weight_unit', row.finish_weight);
                            setTimeout(function() {
                                frappe.model.set_value(cdt, cdn, 'rate', row.rate);
                                frappe.model.set_value(cdt, cdn, 'price_list_rate', row.rate);
                            }, 1000); // Delay of 1000 milliseconds

                            
                        }
                    }



                    cur_frm.refresh_field('items');
                    dialog.hide();
                }
            }
        });

        frappe.call({
            async: false,
            method: "ht.utils.purchase_receipt.fetch_dying_service_items",
            args: {
                job_no: cur_frm.doc.job_number,
                supplier: cur_frm.doc.supplier,
                purchase_type: po_type
            },
            callback: function (r) {
                if (r.message) {
                    for (let row of r.message) {
                        console.log("ROw",row);
                        // frappe.db.get_doc('Item', row.raw_mat_item)
                            // .then(itm_doc => {
                                setTimeout(() => {
                                    dialog.fields_dict.items.df.data.push({
                                        "po_name":row.purchase_order,
                                        "item_row_name": row.item_row_name,
                                        "po_date": row.po_date,
                                        "item_code": row.item_code,
                                        "item_name": row.item_name,
                                        "description":row.description,
                                        "finish_weight": row.finish_weight,
                                        "fancy": row.fancy,                             
                                        "color": row.color,
                                        "qty_in_pcs": row.qty_in_pcs,
                                        "rate":row.rate,
                                        "job_no": row.job_no,
                                        "uom": row.uom,
                                        "total_received_qty": row.received_qty,                                        
                                        "balance_qty": ((row.qty_in_pcs) - (row.received_qty)) || 0
                                    });
                                    frm.data = dialog.fields_dict.items.df.data;
                                    dialog.fields_dict.items.grid.refresh();
                                }, 500);
                            // });
                    }
                    dialog.show();
                    dialog.$wrapper.find('.modal-dialog').css("max-width", "80%");
                }
            }
        });

    } else {
        frappe.msgprint('Please Select Supplier / Job No and Purchase type');
    }
}
    





///////////////////////////////////////////Bathrobe Purchase Receipt /////////////////////
const fetch_po_stitching_bathrobe_purchase_receipt = (frm) => {
    if (frm.doc.supplier && frm.doc.receipt_type && frm.doc.job_number) {
        if(frm.doc.receipt_type == "Bathrobe Purchase Receipt"){
           var po_type = "Stitching Bathrobe  Service" 
        }
        if(frm.doc.receipt_type == "Stitching Purchase Receipt"){
            var po_type = "Stitching Service"
        }
  
        frm.data = [];
        let dialog = new frappe.ui.Dialog({ 
            title: __("Purchase Order"),
            fields: [
                {
                    fieldname: "items",
                    read_only: 1,
                    label: 'Purchase Order Items',
                    fieldtype: "Table",
                    cannot_add_rows: true,
                    data: frm.data,
                    get_data: () => {
                        return frm.data;
                    },
                    fields: [
                        {
                            fieldtype: 'Data',
                            fieldname: "po_name", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('PO No'),
                            columns:   2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "job_no", 
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Job No'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "color",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Color'),
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
                            fieldname: "uom",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Uom'),
                            columns: 1
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
                            fieldname: "decription",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Description'),
                            columns: 2
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Order Qty'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "rate",
                            in_list_view: 0,
                            read_only: 1,
                            label: __('Rate'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Check',
                            fieldname: "check",
                            label: __('Select'),
                            in_list_view: 1,
                            columns: 1,
                        },
                        {
                            fieldtype: 'Float',
                            fieldname: "total_received_qty",
                            in_list_view: 1,
                            read_only: 1,
                            label: __('Total Received Qty'),
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
                            fieldname: "cut_length", 
                            in_list_view: 0,
                            read_only: 0,
                            label: __('Cut Length'),
                            columns: 1
                        },
                        {
                            fieldtype: 'Data',
                            fieldname: "finish_weight", 
                            in_list_view: 0,
                            read_only: 0,
                            label: __('Finish Weight'),
                            columns: 1
                        },
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

                            // po_check_itemslist.push(row.dye_raw_mat_item_code);po_name
                           
                            frappe.model.set_value(cdt, cdn, 'purchase_order_item', row.item_row_name);
                            frappe.model.set_value(cdt, cdn, 'purchase_order', row.po_name);
                            frappe.model.set_value(cdt, cdn, 'job_no', row.job_no);

                            frappe.model.set_value(cdt, cdn, 'item_code', row.item_code);
                            frappe.model.set_value(cdt, cdn, 'item_name', row.item_name);
                            frappe.model.set_value(cdt, cdn, 'description', row.description);
                            frappe.model.set_value(cdt, cdn, 'uom', row.uom);                            
                            frappe.model.set_value(cdt, cdn, 'fancy', row.cut_length);
                            frappe.model.set_value(cdt, cdn, 'yarn_color', row.color);
                            frappe.model.set_value(cdt, cdn, 'qty', row.qty);
                            frappe.model.set_value(cdt, cdn, 'finish_weight_unit', row.finish_weight);
                            setTimeout(function() {
                                frappe.model.set_value(cdt, cdn, 'rate', row.rate);
                                frappe.model.set_value(cdt, cdn, 'price_list_rate', row.rate);
                            }, 1000); // Delay of 1000 milliseconds

                            
                        }
                    }



                    cur_frm.refresh_field('items');
                    dialog.hide();
                }
            }
        });

        frappe.call({
            async: false,
            method: "ht.utils.purchase_receipt.fetch_bathrobe_items",
            args: {
                job_no: cur_frm.doc.job_number,
                supplier: cur_frm.doc.supplier,
                purchase_type: po_type
            },
            callback: function (r) {
                if (r.message) {
                    for (let row of r.message) {
                        console.log("ROw",row);
                        // frappe.db.get_doc('Item', row.raw_mat_item)
                            // .then(itm_doc => {
                                setTimeout(() => {
                                    dialog.fields_dict.items.df.data.push({
                                        "po_name":row.purchase_order,
                                        "item_row_name": row.item_row_name,
                                        "po_date": row.po_date,
                                        "item_code": row.item_code,
                                        "item_name": row.item_name,
                                        "description":row.description,
                                        "finish_weight": row.finish_weight,
                                        "cut_length": row.cut_length,                             
                                        "color": row.color,
                                        "qty": row.qty,
                                        "rate":row.rate,
                                        "job_no": row.job_no,
                                        "uom": row.uom,
                                        "total_received_qty": row.received_qty,                                        
                                        "balance_qty": ((row.qty) - (row.received_qty)) || 0
                                    });
                                    frm.data = dialog.fields_dict.items.df.data;
                                    dialog.fields_dict.items.grid.refresh();
                                }, 500);
                            // });
                    }
                    dialog.show();
                    dialog.$wrapper.find('.modal-dialog').css("max-width", "70%");
                }
            }
        });

    } else {
        frappe.msgprint('Please Select Supplier / Job No and Purchase type');
    }
}










//setting register from values 
    // frm.set_query("register_from", function() {
    //     console.log("purchase yarn");
    //     return {
    //         query: "ht.api.filter_user",
    //         filters: {
    //             register_type: "from",
    //             receipt_type: frm.doc.receipt_type
    //         }
    //     }
    // });





    // frm.doc.items.forEach(function(row) {
    //     console.log("dfdf");

    //     if (row.item_code) {
    //         console.log("row.item_code");
    //         console.log(row.item_code);
    //         frappe.call({
    //             method: "ht.fetch_so.fetch_pr_yarn_field",
    //             args: {
    //                 doctype: "Purchase Order Item",
    //                 args:{
    //                     purchase_receipt_no : purchase_receipt_no
    //                 }
                    
    //             },
    //             callback: function(response) {
    //                 if (response.message) {
    //                     console.log("call back successfully");
    //                     // var po_item = response.message;
    //                     // frappe.model.set_value(row.doctype, row.name, 'yarn_brand', po_item.brand_);
    //                    // frappe.model.set_value(row.doctype, row.name, 'color', po_item.color);
    //                     frm.refresh_field('items');
    //                 }
    //             }
    //         });
    //     }
    // });





// function yarn_receipt(frm){
//     console.log("before");
//         frm.doc.items.forEach(function(row){
//             console.log("dfdf");

//             if (row.item_code){
//                 console.log("row.item_code");
//                 console.log(row.item_code);
//                 po_value = frappe.get_doc("Purchase Order Item", filters={"parent": row.purchase_order,"item_code":row.item_code})
//                 console.log(po_value);

//                 frappe.model.set_value(item.doctype,item.name,'yarn_brand', po_value.brand_);
    
//                 frm.refresh_field('items');
//                 frm.refresh();
//             }

//         });
// }

// frappe.ui.form.on("Purchase Receipt Item", {

// 	before_save:function(frm){

//         frm.doc.items.forEach(function(row){

//             if (row.item_code){
//                 console.log("row.item_code");
//                 console.log(row.item_code);
//                 po_value = frappe.get_doc("Purchase Order Item", filters={"parent": row.purchase_order,"item_code":row.item_code})

//                 frappe.model.set_value(item.doctype,item.name,'yarn_brand', po_value.brand_);
    
//                 frm.refresh_field('items');
//                 frm.refresh();
//             }

//         });

//     }
// });
