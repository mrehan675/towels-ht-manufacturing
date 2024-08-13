// Copyright (c) 2024, SRP and contributors
// For license information, please see license.txt
/* eslint-disable */

// frappe.query_reports["Budget Summary Report"] = {
// 	"filters": [

// 	]
// };

frappe.query_reports["Budget Summary Report"] = {
    "filters": [
        {
            "fieldname": "from_date",
            "label": __("From Date"),
            "fieldtype": "Date",
            "default": frappe.datetime.add_months(frappe.datetime.get_today(), -1),
            "reqd": 1
        },
        {
            "fieldname": "to_date",
            "label": __("To Date"),
            "fieldtype": "Date",
            "default": frappe.datetime.get_today(),
            "reqd": 1
        }
    ],

    "formatter": function (value, row, column, data, default_formatter) {
        if (column.fieldname === "total_yarn_required") {
            value = value || "";
            return value; // Return HTML content
        } else {
            return default_formatter(value, row, column, data);
        }
    }
};

