frappe.ui.form.on("Purchase Invoice", {
	setup: function(frm) {
        console.log("enter iun inovice type");
		frm.set_query("invoice_type", function() {
			return {
				filters: [
					["Order Type","type", "in", ["Purchase Invoice"]]
				]
			}
		});
	}
});