

frappe.ui.form.on('Stock Entry', {
    setup: function(frm) {

        set_filter_in_type(frm);
    },
    onload: function(frm){

        set_filter_in_type(frm);
        set_link_query(frm);
    },
    before_save:function(frm){
        cal_kgs_lbs(frm);
        
        if(frm.doc.dn_type == 'Stock Weaving'){
        fetch_job_no(frm)
        }

    }


});

frappe.ui.form.on('Stock Entry Detail',{

    a_qty:function(frm,cdt,cdn){
        var child = locals[cdt][cdn];

        if (frm.doc.dn_type == 'Stock Weaving') {
            cal_b_percent(child)
            fetch_greigh_loom(child)
            }
    },
    b_qty:function(frm,cdt,cdn){
        var child = locals[cdt][cdn];

        if (frm.doc.dn_type == 'Stock Weaving') {
            cal_b_percent(child)
            fetch_greigh_loom(child)
        }
    }
});

function cal_b_percent(child){

    try{        
              
        var a_qty = parseFloat(child.a_qty) || 0;
        var b_qty = parseFloat(child.b_qty) || 0;
        
        
        if (!a_qty==0 && !b_qty == 0 ){
     
        var total =  (b_qty)/ (a_qty+b_qty) * 100 ;
        console.log("total",total);

        frappe.model.set_value(child.doctype, child.name, "b_percent", total);
        }


    }
    catch(error){
        console.error("An error occurred:", error);
    }
     
}

//calculated field(Aqty+Bqty)*greigh Wt/unit(fromPO)/1000*2.2046*loom wastage(from Weaving PO)

async function fetch_greigh_loom(child) {
    
    console.log("main_item_code",child.subcontracted_item);
    const response = await frappe.db.get_list("Purchase Order Item", {
        fields: ["greigh_weigh_unit","loom_wastage","fancy"],  
        filters: { item_code:child.subcontracted_item}  
        });

        console.log("response",response);

    if (response){
        console.log("eeeeeeeee");

        const poItem = response[0];
        console.log("poItem",poItem);

        const greigh_weigh_unit = poItem.greigh_weigh_unit;
        const loom_wastage  = poItem.loom_wastage;
        const fancy = poItem.fancy;

        const lbs = (child.a_qty + child.b_qty) * (greigh_weigh_unit / 1000) * 2.2046 * loom_wastage;
        console.log("lbs",lbs);


        frappe.model.set_value(child.doctype,child.name,'lbs', lbs);
        frappe.model.set_value(child.doctype,child.name,'fancy', fancy);
        

    }

}
        


async function  fetch_job_no(frm){      

        const response = await frappe.db.get_list("Purchase Order", {
            fields: ["job_number"],  
            filters: { name:frm.doc.purchase_order}  
            });
            if (response){
                const poItem = response[0];
                               
                const job_no = poItem.job_number;
                frm.set_value('job_no',job_no);
            }
            
  

} 

function cal_kgs_lbs(frm){
    if (frm.doc.dn_type=='Stock Yarn Dying' ){

        frm.doc.items.forEach(function(item) {
            
        var lbs = item.qty * 100;
        
        frappe.model.set_value(item.doctype,item.name,'lbs', lbs);
        frappe.model.set_value(item.doctype,item.name,'kgs', lbs /2.2046);
    
    

        });
        frm.refresh_field('items');
        frm.refresh();

    }
}

function set_filter_in_type(frm){
   
		frm.set_query("dn_type", function() {
			return {
				filters: [
					["Order Type","type", "in", ["Stock Entry"]]
				]
			}
		});
	
}

function set_link_query(frm){
   

        frm.set_query("register_to", function() {
            return {
                query: "ht.api.filter_user",
                filters: {
                    register_type: "to",
                    receipt_type: frm.doc.dn_type
                }
            };
        });
        

    
        frm.set_query("register_from", function() {
            console.log("purchase yarn");
            return {
                query: "ht.api.filter_user",
                filters: {
                    register_type: "from",
                    receipt_type: frm.doc.dn_type
                }
            }
        });
    
}