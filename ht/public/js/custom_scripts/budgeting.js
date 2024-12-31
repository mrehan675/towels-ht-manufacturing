// // RAW MATERIAL
frappe.ui.form.on('Budgeting', {
    refresh: function(frm) {
        frm.fields_dict["rawmaterial_yarn_items"].grid.get_field("raw_mat_item").get_query = function(doc, cdt, cdn) {
            return {
                filters: {
                    item_group: "Raw Material"
                }
            };
        };
    }
});

//Accessories
frappe.ui.form.on('Budgeting', {
    refresh: function(frm) {
        frm.fields_dict["accessories_item"].grid.get_field("item_code").get_query = function(doc, cdt, cdn) {
            return {
                filters: {
                    item_group: "Accessories"
                }
            };
        };
    }
});


//Packing
frappe.ui.form.on('Budgeting', {
    refresh: function(frm) {
        frm.fields_dict["packing_items"].grid.get_field("item_code").get_query = function(doc, cdt, cdn) {
            return {
                filters: {
                    item_group: "Packing"
                }
            };
        };
    }
});

function set_so_values_to_budgeting(frm){
    frappe.prompt(
        {
            label: 'Sales Order',
            fieldname: 'sales_order',
            fieldtype: 'Data',
            default: frm.doc.sales_order, 
            reqd: 1,
            read_only:1
        },
        function(data) {
            frappe.call({
                method: 'ht.utils.budgeting.create_budgeting_entry',
                args: { sales_order_name: data.sales_order },
                callback: function(response) {
                    if (response.message) {
                        // Update the form with the returned data
                        const data = response.message;

                        console.log("DATA",data);

                        // Set main fields
                        frm.set_value('customer', data.customer);
                        frm.set_value('sales_order', data.sales_order);
                        frm.set_value('shipment_date', data.shipment_date);
                        frm.set_value('currency', data.currency);
                        frm.set_value('order_receiving_date', data.order_receiving_date);
                        frm.set_value('us_dollar', data.us_dollar);
                        frm.set_value('exchange_rate', data.exchange_rate);
                        frm.set_value('total_amount_pkr', data.total_amount_pkr);
                        frm.set_value('loom_type', data.loom_type);
                        frm.set_value('merchandiser_', data.merchandiser_);
                        frm.set_value('work_order', data.work_order);

                        // Clear and set child tables
                        frm.clear_table('budgeting_item');
                        frm.clear_table('rawmaterial_yarn_items');
                        frm.clear_table('parent_items_table');

                        data.budgeting_item.forEach(item => frm.add_child('budgeting_item', item));
                        data.rawmaterial_yarn_items.forEach(item => frm.add_child('rawmaterial_yarn_items', item));
                        data.parent_item_tab.forEach(item => frm.add_child('parent_items_table', item));

                        frm.refresh();
                    }
                }
            });
        },
        __('Select Sales Order'),
        __('Fetch')
    );

}

var itemQtyMap = {};  // Declare itemQtyMap in a global scope

frappe.ui.form.on('Budgeting', {
    get_from_sales_order:function(frm){
        console.log("salessssssss");
        set_so_values_to_budgeting(frm);
        
    },
    validate: function(frm, cdt, cdn) {
         let totalQty = 0;
         let totalAmount = 0;
        
        // Calculate b_qty for each row in the "items" child table
        frm.doc.budgeting_item.forEach(function(item) {
            
            var bPercentQty = (item.b_percent/100) * item.qty;
            var bKgs = (bPercentQty*item.net_weight)/2.20462;
            item.b_percent_qty = bPercentQty;
            item.total_qty_with_b_percent = item.qty + bPercentQty;
            item.b_kgs = (bPercentQty*item.net_weight)/2.20462;
            item.b_kgs_value = bKgs*item.b_kgs_rate;
            
            // calculate total_quantity and total_amount
            totalQty += item.qty
            totalAmount += item.amount
        });
        frm.refresh_field('items');
        
        // Set the Parent Item total quantity field in the parent form
        frm.set_value("total_qty", totalQty.toFixed(2));
        frm.refresh_field("total_qty");
        
        //set the Parent Item Total Amount from child table
        frm.set_value("total_amount", totalAmount);
        frm.refresh_field("total_amount");
        
        // ///////////////////////////RAW MATERIAL total lbs calculation
        //total quantity work
        let raw_total_yarn = 0;
        let raw_total_amount = 0;
        let total_net_lbs = 0;
    
        frm.doc.rawmaterial_yarn_items.forEach(function(item) {
            item.net_lbs = item.net_weight * item.qty;
            raw_total_yarn += item.consumption_lbs;
            raw_total_amount += item.raw_material_amount;
            total_net_lbs += item.net_lbs;
        });
        frm.refresh_field('rawmaterial_yarn_items');
        
        // console.log(raw_total_yarn)
        //set the Parent Raw Yarn Total & Total Raw Amount from Raw child table
        // Convert raw_total_yarn to an integer
        raw_total_yarn = parseInt(raw_total_yarn);
        frm.set_value("total_yarn_required", raw_total_yarn); // parent form field
        frm.set_value("total_raw_material_amount", raw_total_amount);
        frm.set_value("total_net_lbs", total_net_lbs);
        
        
        frm.refresh_field("total_yarn_required");
        frm.refresh_field("total_raw_material_amount");
        frm.refresh_field("total_net_lbs");
        
        ////////////////////////////////////Accessories Item Table Work Start from here//
         let access_t_qty = 0;
         let access_t_amount = 0;
        
        if (frm.doc.accessories_item) {
        frm.doc.accessories_item.forEach(function(item) {
            access_t_qty += item.qty;
            access_t_amount += item.amount;
        });
        }
        frm.refresh_field('accessories_item');
        //set the Parent Raw Yarn Total & Total Raw Amount from Raw child table
        frm.set_value("acc_total_qty", access_t_qty);
        frm.set_value("acc_total_amount", access_t_amount);
        
        frm.refresh_field("acc_total_qty");
        frm.refresh_field("acc_total_amount");
        
        ////////////////////////////////////Packaging Item Table Work Start from here//
        let pack_t_qty = 0;
        let pack_t_amount = 0;
        
        if (frm.doc.packing_items) {
        frm.doc.packing_items.forEach(function(item) {
            pack_t_qty += item.qty;
            pack_t_amount += item.amount;
        });
        }
        // frm.refresh_field('packing_items');
        //set the Parent Raw Yarn Total & Total Raw Amount from Raw child table
        frm.set_value("pack_total_qty", pack_t_qty);
        frm.set_value("pack_total_amount", pack_t_amount);
        
        frm.refresh_field("pack_total_qty");
        frm.refresh_field("pack_total_amount");
        
        
        
        ////////////////////////////////////////Expense Account table/////////////////
        let exp_total_qty = 0;
        let exp_total_amount = 0 ;
        
        if (frm.doc.expense_items){
        frm.doc.expense_items.forEach(function(item){
            exp_total_qty += item.est_qty;
            exp_total_amount += item.ext_amount;
            
        });
            
        }

        // Calculation of Total in this function
        totals(frm,cdt,cdn);
        cal_profit_loss_section(frm);
        calculate_date_difference(frm);
        // frm.set_value("total_qty",exp_total_qty);
        // frm.set_value("total_amount",exp_total_amount);
        
        
        /////////////////////////////////////Total cost work////////
        
        
        // if(!frm.doc.yarn){
        //     frm.doc.yarn = 0;
        // }
        // if(!frm.doc.weaving){
        //     frm.doc.weaving = 0;
        // }
        // if(!frm.doc.shearing){
        //     frm.doc.shearing = 0;
        // }
        // if(!frm.doc.dyeing){
        //     frm.doc.dyeing = 0;    
        // }
        // if(!frm.doc.stiching){
        //     frm.doc.stiching = 0;
        // }
        // if(!frm.doc.embroidery){
        //     frm.doc.embroidery = 0;
        // }
        // if(!frm.doc.printing){
        //     frm.doc.printing = 0;
        // }
        // if(!frm.doc.accessories){
        //     frm.doc.accessories = 0;
        // }
        // if(!frm.doc.packing){
        //     frm.doc.packing = 0;
        // }
        // if(!frm.doc.expense){
        //     frm.doc.expense = 0;
        // }
        
        
        // frm.set_value("total_cost_amount",frm.doc.yarn + frm.doc.weaving +  frm.doc.shearing + frm.doc.dyeing + frm.doc.stiching + frm.doc.embroidery + frm.doc.printing +  frm.doc.accessories + frm.doc.packing + frm.doc.expense);

    },
    refresh: function(frm) {
        frm.fields_dict["rawmaterial_yarn_items"].grid.get_field("parent_item").get_query = function(doc, cdt, cdn) {
            // Get a list of unique parent items from the "items" child table
            var uniqueParentItems = [];
            // Initialize itemQtyMap to store the total quantity
            // itemQtyMap = {};
            frm.doc.budgeting_item.forEach(function(item) {
                if (item.item_code) {
                    if (itemQtyMap[item.item_code] === undefined) {
                        itemQtyMap[item.item_code] = 0;
                    }
                    itemQtyMap[item.item_code] += item.qty;
                    uniqueParentItems.push(item.item_code);
                }
            });
            console.log(itemQtyMap);

            // Return a filter for the "parent_item" field in "rawmaterial_yarn_items" based on the unique parent items
            return {
                filters: [
                    ["Item", "name", "in", uniqueParentItems]
                ]
            };
        };
    },
    
    us_dollar(frm){
        frm.set_value("total_amount_pkr", frm.doc.us_dollar*frm.doc.exchange_rate);
        frm.refresh_field("total_amount_pkr");
    },
    
    exchange_rate(frm){
        frm.set_value("total_amount_pkr", frm.doc.us_dollar*frm.doc.exchange_rate);
        frm.refresh_field("total_amount_pkr");
    }
});

frappe.ui.form.on('Yarn Items', {
    parent_item: function(frm, cdt, cdn) {
        console.log("yarn item");
        var child = locals[cdt][cdn];
        var parentItem = child.parent_item;
        // console.log("parent_item");
        // console.log(parentItem);
        // console.log(itemQtyMap[parentItem]);

        // Set the quantity field in the rawmaterial_yarn_items table based on the selected parent item
        if (itemQtyMap[parentItem] !== undefined) {
            console.log("wn");
            frappe.model.set_value(cdt, cdn, "qty", itemQtyMap[parentItem]);
        }
    }
});


frappe.ui.form.on("Budgeting Item", {
    //prodcution section
   
    b_percent: function(frm,cdt, cdn){
        itemProductionCalcs(frm, cdt, cdn)
        
    },
    b_kgs_rate: function(frm,cdt, cdn){
        itemProductionCalcs(frm, cdt, cdn)
        
    },
    //rate field
    rate: function(frm, cdt, cdn){
         budget_amount(frm,cdt,cdn);
         updateItemTotalAmount(frm);
    },

    qty: function(frm, cdt, cdn){
        // for production calculations
        itemProductionCalcs(frm, cdt, cdn);
        
        // for weaving calculations
        itemWeavingCalculations(frm, cdt, cdn)
        
        // for stitching calculations
        itemStitchingCalculations(frm, cdt, cdn)
    },
    
    oh_rate: function(frm,cdt,cdn){
        itemWeavingCalculations(frm, cdt, cdn)
    },
    sh_rate: function(frm,cdt,cdn){
        itemWeavingCalculations(frm, cdt, cdn)
    },
    
    weaving_lbs: function(frm,cdt,cdn){
        itemWeavingCalculations(frm, cdt, cdn)
    },
    
    // dyeing
    dye_waste_percentage: function(frm,cdt,cdn){
        itemDyeingCalculations(frm, cdt, cdn);
    },
    
    dye_rate: function(frm, cdt, cdn){
        itemDyeingCalculations(frm, cdt, cdn);
    },
    
    weaving_lbs: function(frm, cdt, cdn){
        itemDyeingCalculations(frm, cdt, cdn);
    },
    
    
    // stitching
    stiching_rate: function(frm,cdt,cdn){
        itemStitchingCalculations(frm, cdt, cdn)
    },
    embroidery_rate: function(frm,cdt,cdn){
        itemStitchingCalculations(frm, cdt, cdn)
    },
    printing_rate: function(frm,cdt,cdn){
        itemStitchingCalculations(frm, cdt, cdn)
    },
    stitch_waste_qty: function(frm,cdt,cdn){
        itemStitchingCalculations(frm, cdt, cdn)
    }
    
});
// production section
var b_qty = function(frm, cdt, cdn) {
    console.log("enter in b_qty");
    var child = locals[cdt][cdn];
    var test = child.b * child.qty;
    console.log("test");
    console.log(test);
    frappe.model.set_value(cdt, cdn, "b_qty", (child.b/100) * child.qty);
    // frappe.model.se  t_value(cdt, cdn, “z”, child.p / cur_frm.doc.no_of_students);
};
var b_kgs_value = function(frm, cdt, cdn) {
    console.log("enter in b_qty");
    var child = locals[cdt][cdn];
    var test = child.b * child.qty;
    console.log("test");
    console.log(test);
    frappe.model.set_value(cdt, cdn, "b_kgs_value", child.b_kgs * child.b_kgs_rate);
    // frappe.model.se  t_value(cdt, cdn, “z”, child.p / cur_frm.doc.no_of_students);
};

// Calculate Amount in item table Rate * Qty
var budget_amount = function(frm, cdt, cdn) {
    console.log("enter in b_qty");
    var child = locals[cdt][cdn];
    var test = child.b * child.qty;
    console.log("test");
    console.log(test);
    frappe.model.set_value(cdt, cdn, "amount", child.rate * child.qty);
    // frappe.model.se  t_value(cdt, cdn, “z”, child.p / cur_frm.doc.no_of_students);
};
// weaving section
var lbs_rs = function(frm,cdt,cdn){
    var child = locals[cdt][cdn];
    //check sh_rate 
     if (!child.sh_rate) {
        child.sh_rate = 0;
    }
    //check oh_rate
     if (!child.oh_rate) {
        child.oh_rate = 0;
    }
    //sum oh_rate and sh_rate
    var oh_sh = child.oh_rate + child.sh_rate ;
    console.log(oh_sh);
    
    frappe.model.set_value(cdt, cdn, "lbs", child.qty * child.net_weight);
    frappe.model.set_value(cdt, cdn, "rs", child.qty  * oh_sh );
};
// dyeing section
var dye_lbs = function (frm,cdt,cdn){
    var child = locals[cdt][cdn];

    frappe.model.set_value(cdt, cdn,"dye_lbs",(child.lbs * child.dye_waste_percentage) + child.lbs);
};

var total_dyeing_amount = function (frm,cdt,cdn){
    var child = locals[cdt][cdn];

    frappe.model.set_value(cdt, cdn,"total_dyeing_amount", ((child.lbs * child.dye_waste_percentage) + child.lbs) * (child.dye_rate));
};

// stitching section
var final_stich_rate = function (frm,cdt,cdn){
    var child = locals[cdt][cdn];
    console.log("enter in final stich");
    console.log(child.stiching_rate);
    console.log("child");
    console.log(child);
    if (!child.stiching_rate){
        child.stiching_rate = 0;
    }
    if (!child.embroidery_rate){
        child.embroidery_rate = 0;
    }
    if (!child.printing_rate){
        child.printing_rate = 0;
    }

    frappe.model.set_value(cdt, cdn,"final_stich_rate", child.stiching_rate + child.embroidery_rate + child.printing_rate );
};

var final_stich_rate = function (frm,cdt,cdn){
    var child = locals[cdt][cdn];
  
    frappe.model.set_value(cdt, cdn,"final_stich_rate", child.stiching_rate + child.embroidery_rate + child.printing_rate );
};

var total_stitching_amount = function(frm,cdt,cdn){
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn,"total_stitching_amount", child.stiching_rate + child.qty);
    
};

/////////////////////////////////// Total Work For Item Tables/////////////////////////
//Total quantity work start from here
function updateTotalQuantity(frm) {
    let totalQuantity = 0;
    frm.doc.budgeting_item.forEach(function(row) {
        if (row.qty) {
            totalQuantity += row.qty;
        }
    });

    frm.set_value("total_quantity", totalQuantity);
    frm.refresh_field("total_quantity");
}

function updateItemTotalAmount(frm) {
    let items_total_amount = 0;
    frm.doc.budgeting_item.forEach(function(row) {
        if (row.qty) {
            items_total_amount += row.amount;
        }
    });

    console.log("items_total_amount",items_total_amount);
    frm.set_value("total_amount", items_total_amount);
    frm.refresh_field("total_amount");
}


/////////////////////////////////////RAW MATERIAL CALCULATION/////////////////////////////////////////////
frappe.ui.form.on("Yarn Items", {
    //prodcution section
    qty: function(frm,cdt, cdn){
        net_lbs(frm, cdt, cdn);
        
    },
    net_lbs: function(frm,cdt, cdn){
        total_yarn_required(frm, cdt, cdn);
        
    },
    loom_wastage: function(frm,cdt, cdn){
        total_yarn_required(frm, cdt, cdn);
        
    },
    total_yarn_required: function(frm,cdt, cdn){
        consumption_lbs(frm, cdt, cdn);
        
    },
    consumption_lbs: function(frm,cdt, cdn){
        raw_material_amount(frm, cdt, cdn);
        
    },
    consumption_: function(frm,cdt, cdn){
        consumption_lbs(frm, cdt, cdn);
        
    },
    rate_per_lbs: function(frm,cdt, cdn){
        raw_material_amount(frm, cdt, cdn);
        
    },
});

var net_lbs = function(frm,cdt,cdn){
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn,"net_lbs", child.qty * child.net_weight );
    
};
var total_yarn_required = function(frm,cdt,cdn){
    var child = locals[cdt][cdn];
     if (!child.net_lbs){
        child.net_lbs = 0;
    }
    frappe.model.set_value(cdt, cdn,"total_yarn_required", (child.net_lbs * child.loom_wastage/100 ) + child.net_lbs);
    
};

var consumption_lbs = function(frm,cdt,cdn){
    var child = locals[cdt][cdn];
    if (!child.total_yarn_required){
        child.total_yarn_required = 0;
    }
    frappe.model.set_value(cdt, cdn,"consumption_lbs", child.total_yarn_required * child.consumption_/100);
    
};

var raw_material_amount = function(frm,cdt,cdn){
    var child = locals[cdt][cdn];
    if (!child.consumption_lbs){
        child.consumption_lbs = 0;
    }
    console.log(child.rate_per_lbs)
    frappe.model.set_value(cdt, cdn,"raw_material_amount", child.rate_per_lbs * child.consumption_lbs);
    
};

///////////////////////////////////Accessories Item Table Work start////////////////////////
frappe.ui.form.on("Accessories Item", {
    //prodcution section
    qty: function(frm,cdt, cdn){
        acc_amount(frm, cdt, cdn);
        
    },
      accessories_rate: function(frm,cdt, cdn){
        acc_amount(frm, cdt, cdn);
        
    },
  
});

var acc_amount = function(frm,cdt,cdn){
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn,"amount", child.qty * child.accessories_rate );
    
};

////////////////////////////////////Packaging Item/////////////
frappe.ui.form.on("Packaging Details", {
    //prodcution section
    qty: function(frm,cdt, cdn){
        pack_amount(frm, cdt, cdn);
        
    },
      packing_rate: function(frm,cdt, cdn){
        pack_amount(frm, cdt, cdn);
        
    },
  
});

var pack_amount = function(frm,cdt,cdn){
    var child = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn,"amount", child.qty * child.packing_rate );
    
};
//////////////////////////////////////Expenses Table//////////////////
frappe.ui.form.on("Expenses Details", {

    // 
    // est_qty: function(frm,cdt, cdn){
    //     ext_amount(frm, cdt, cdn);
        
    // },
      est_rate: function(frm,cdt, cdn){
        ext_amount(frm, cdt, cdn);
        
    },
  
});

var ext_amount = function(frm,cdt,cdn){
    //custom field export sales 
    var export_sales = frm.doc.total_amount_pkr;
    var child = locals[cdt][cdn];
    if (child.est_qty && child.est_rate){
        console.log("first if");
        // console.log(export_sales);
        frappe.model.set_value(cdt, cdn,"ext_amount", child.est_qty * child.est_rate );

    }
    else if (child.est_rate){
        console.log("second if");
        // console.log(export_sales);

        frappe.model.set_value(cdt, cdn,"ext_amount", (child.est_rate/100)  * export_sales);
    }
    // else{
    // frappe.model.set_value(cdt, cdn,"ext_amount", child.ext_amount );
    // }
    
};

// Calculate b_kgs, b_percent_qty, total_qty_with_b_percent and b_kgs_value
var itemProductionCalcs = function(frm, cdt, cdn){
    var item = locals[cdt][cdn];
    var bPercentQty = (item.b_percent/100) * item.qty;
    var bKgs = (bPercentQty*item.net_weight)/2.20462;
    frappe.model.set_value(cdt, cdn, "b_percent_qty", bPercentQty)
    frappe.model.set_value(cdt, cdn, "total_qty_with_b_percent", item.qty + bPercentQty);
    frappe.model.set_value(cdt, cdn, "b_kgs", bKgs);
    frappe.model.set_value(cdt, cdn, "b_kgs_value", bKgs*item.b_kgs_rate);
}

// Calculate Weaving Calculations etc
var itemWeavingCalculations = function(frm, cdt, cdn){
    var item = locals[cdt][cdn];
    var weavingLBS = item.qty*item.net_weight;
    var weavingAmount = weavingLBS*(item.oh_rate+item.sh_rate);
    frappe.model.set_value(cdt, cdn, "weaving_lbs", weavingLBS);
    frappe.model.set_value(cdt, cdn, "weaving_amount", weavingAmount);
    
}


// Calculate Dyeing LBS etc
var itemDyeingCalculations = function(frm, cdt, cdn){
    var item = locals[cdt][cdn];
    var dyeLBS = item.weaving_lbs+item.weaving_lbs*item.dye_waste_percentage/100;
    var dyeTotalAmount = item.dye_rate*dyeLBS;
    frappe.model.set_value(cdt, cdn, "dye_lbs", dyeLBS);
    frappe.model.set_value(cdt, cdn, "total_dyeing_amount", dyeTotalAmount);
}


// Calculate Stiching final rate, final amount and total qty with wastage
var itemStitchingCalculations = function(frm, cdt, cdn){
    var item = locals[cdt][cdn];
    var finalStitchRate = item.stiching_rate + item.embroidery_rate + item.printing_rate;
    var item = locals[cdt][cdn];
    var totalQtyWithWaste = item.qty + item.stitch_waste_qty;
    
    frappe.model.set_value(cdt, cdn, "total_qty_with_waste", totalQtyWithWaste);
    frappe.model.set_value(cdt, cdn, "final_stich_rate", finalStitchRate);
    frappe.model.set_value(cdt, cdn, "total_stitching_amount", item.qty*finalStitchRate)
}
// CAl Total Raw Material Amount & Total Expense Amount
function totals(frm,cdt,cdn){
    //total quantity work
    
   // let total_expense_amount = 0;
   

    //Raw material Item Table (TOTAL FIELD CALCULATION)
    if (frm.doc.rawmaterial_yarn_items){
        var raw_material_amount = 0;
        frm.doc.rawmaterial_yarn_items.forEach(function(item) {

            raw_material_amount += item.raw_material_amount;
    
        });
        frm.refresh_field('rawmaterial_yarn_items');
    
        frm.set_value("total_raw_material_amount",raw_material_amount);
        frm.refresh_field('total_raw_material_amount');
        
    }
  


    //Other Expenses  Table (TOTAL FIELD CALCULATION)
    // frm.doc.expense_items.forEach( function(exp) {

    //     total_expense_amount += exp.ext_amount;

    // });
    // frm.refresh_field('expense_items');
    // frm.set_value("total_expense_amount",total_expense_amount);
    // frm.refresh_field('total_expense_amount');

    if (frm.doc.expense_items) {
        console.log("check");
        var total_expense_amount = 0;
    
        frm.doc.expense_items.forEach(function (exp) {
            total_expense_amount += exp.ext_amount;
        });
    
        frm.refresh_field('expense_items');
        frm.set_value("total_expense_amount", total_expense_amount);
        frm.refresh_field('total_expense_amount');
    } 
    


    // Parent Items Table Field Totals
    if (frm.doc.parent_items_table){
        var total_net_lbs = 0;
    frm.doc.parent_items_table.forEach( function(parent) {
        total_net_lbs += parent.net_lbs;
    });
    frm.refresh_field('parent_items_table');
    frm.set_value("total_net_lbs",total_net_lbs);
    frm.refresh_field('total_net_lbs');
        }

}



frappe.ui.form.on('Budgeting Sales Review', {
    qty(frm, cdt, cdn){
        var desc = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, 'amount', desc.qty*desc.rate);
    },
    
    rate(frm, cdt, cdn){
        var desc = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, 'amount', desc.qty*desc.rate);
    }
})



function cal_profit_loss_section(frm){
    console.log("frm.doc.total_amount",frm.doc.total_amount);

    frm.set_value('export_sales', frm.doc.total_amount_pkr);
    frm.set_value('local_sale', frm.doc.local_sales);
    frm.set_value('rebate_percent', frm.doc.rebate_value);
    frm.set_value('total_amounts', frm.doc.total_amount_pkr + frm.doc.local_sales + frm.doc.rebate_value); 
    // frm.set_value('total_amounts', '120'); 

    frm.set_value('total_costs', frm.doc.total_cost_amount);
    frm.set_value('profit_loss', frm.doc.total_amounts - frm.doc.total_cost_amount);
}

function calculate_date_difference(frm) {
    // Ensure both date fields are filled
    if (frm.doc.order_receiving_date && frm.doc.budget_prepare_date) {
        // Parse dates
        const startDate = frappe.datetime.str_to_obj(frm.doc.order_receiving_date);
        const endDate = frappe.datetime.str_to_obj(frm.doc.budget_prepare_date);

        // Calculate difference in days
        const differenceInDays = frappe.datetime.get_day_diff(endDate, startDate);

        // Set the difference in the target field
        frm.set_value('delay_days', differenceInDays);
    } else {
        frm.set_value('delay_days', 0); // Set to 0 if dates are missing
    }
}

// Attach the function to the validate event
// frappe.ui.form.on('Your Doctype Name', {
//     validate: function(frm) {
//         calculate_date_difference(frm);
//     }
// });
