from . import __version__ as app_version
from .child_tab_func_change_PO import calculate_taxes_and_totals,validate,calculate_item_values


app_name = "ht"
app_title = "Ht"
app_publisher = "SRP"
app_description = "Hasham Towels"
app_icon = "octicon octicon-file-directory"
app_color = "orange"
app_email = "info@srp.ai"
app_license = "MIT"

# Includes in <head>
# ------------------


fixtures = [
    {"dt": "Order Type",
     "filters": [
            ["type", "!=", ""]
            
        ]
    },
    {"dt": "Register"},
    {"dt": "Category"},
    {
        "dt": "Budgeting",
        "filters": [
            ["creation", ">=", "2024-11-25 15:25:52.044115"]
            
        ]
    }
]


# include js, css files in header of desk.html
# app_include_css = "/assets/ht/css/ht.css"
# app_include_js = "/assets/ht/js/ht.js"

# include js, css files in header of web template
# web_include_css = "/assets/ht/css/ht.css"
# web_include_js = "/assets/ht/js/ht.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "ht/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}
page_js = {"print" : "public/js/pages/print.js"}


# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# include js in doctype views
#extend doc using custom script
doctype_js = {
	"Sales Order" : "public/js/custom_scripts/sales_order.js",
    "Purchase Order" : "public/js/custom_scripts/purchase_order.js",
	"Purchase Receipt" : "public/js/custom_scripts/purchase_receipt.js",
 	"Purchase Invoice" : "public/js/custom_scripts/purchase_invoice.js",
	"Stock Entry" : "public/js/custom_scripts/stock_entry.js",
	"Supplier" : "public/js/custom_scripts/supplier.js",
	"Item" : "public/js/custom_scripts/item.js",
	"Budgeting" : "public/js/custom_scripts/budgeting.js"


}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "ht.install.before_install"
# after_install = "ht.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "ht.uninstall.before_uninstall"
# after_uninstall = "ht.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "ht.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
#	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
#	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
#	"ToDo": "custom_app.overrides.CustomToDo"
# }

# override_doctype_class = {
# 	"Purchase Order": "ht.utils.overrides.purchase_order_class.CustomPurchaseOrder"
# }
override_doctype_class = {
    "Stock Entry": "ht.utils.stock_entry.CustomStockEntry"
}


# override_doctype_class = {
# 	"Stock Entry": "ht.utils.stock_entry.StockEntry"
# }

# Document Events
# ---------------
# Hook on document methods and events



doc_events = {
	# "*": {
	# 	"on_update": "method",
	# 	"on_cancel": "method",
	# 	"on_trash": "method"
	# }
	"Sales Order": {
		"validate": [
			"ht.ht_doctype_changes.update_raw_materials_table",
			"ht.ht_doctype_changes.set_parent_items_table"
		]
	},
	"Stock Ledger Entry": {
        # "after_save": "ht.utils.purchase_receipt.update_brand_on_save",
        # "after_submit": "ht.utils.purchase_receipt.update_brand_on_save",
        "after_insert": "ht.utils.purchase_receipt.update_brand_on_save"


    },
    # "Purchase Order": {
	# 	"on_submit": [
	# 		"ht.utils.purchase_order.set_placed_order_qty",
	# 	]
	# },
	"Purchase Receipt": {
        "before_save": "ht.utils.purchase_receipt.set_subcontracted_items"
    }
	
}

# Scheduled Tasks
# ---------------

# scheduler_events = {
#	"all": [
#		"ht.tasks.all"
#	],
#	"daily": [
#		"ht.tasks.daily"
#	],
#	"hourly": [
#		"ht.tasks.hourly"
#	],
#	"weekly": [
#		"ht.tasks.weekly"
#	]
#	"monthly": [
#		"ht.tasks.monthly"
#	]
# }

# Testing
# -------

# before_tests = "ht.install.before_tests"

# Overriding Methods
# ------------------------------
#
override_whitelisted_methods = {
	"erpnext.stock.get_item_details.apply_price_list": "ht.utils.purchase_receipt.custom_apply_price_list"
}
# override_whitelisted_methods = {
# 	"erpnext.stock.doctype.purchase_receipt.purchase_receipt.make_purchase_invoice": "ht.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
#	"Task": "ht.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Request Events
# ----------------
# before_request = ["ht.utils.before_request"]
# after_request = ["ht.utils.after_request"]

# Job Events
# ----------
# before_job = ["ht.utils.before_job"]
# after_job = ["ht.utils.after_job"]

# User Data Protection
# --------------------

user_data_fields = [
	{
		"doctype": "{doctype_1}",
		"filter_by": "{filter_by}",
		"redact_fields": ["{field_1}", "{field_2}"],
		"partial": 1,
	},
	{
		"doctype": "{doctype_2}",
		"filter_by": "{filter_by}",
		"partial": 1,
	},
	{
		"doctype": "{doctype_3}",
		"strict": False,
	},
	{
		"doctype": "{doctype_4}"
	}
]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
#	"ht.auth.validate"
# ]

