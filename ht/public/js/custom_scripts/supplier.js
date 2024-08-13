

frappe.ui.form.on('Supplier', {
    onload: function(frm) {
        frm.set_query('parent_warehouse', function() {
            return {
                filters: {
                    'is_group': 1
                }
            };
        });
    },
    after_save:function(frm){
        
        if(frm.doc.supplier_name){
            console.log("enter in if supplier if");
            _make_warehouse_entry(frm)
        }

    }


});


function _make_warehouse_entry(frm) {
   
    console.log('make warehouse');
    
    frappe.call({
        method:"ht.utils.supplier.make_warehouse_entry",
        args: {
            supplier_name: frm.doc.supplier_name,
            parent_warehouse: frm.doc.parent_warehouse
        }
        ,
        callback: function(r) {
            console.log("enter in callback");
            console.log(r.message);
            //var doclist = frappe.model.sync(r.message);
            //frappe.set_route("Form", doclist[0].doctype, doclist[0].name);
        }
    });
}