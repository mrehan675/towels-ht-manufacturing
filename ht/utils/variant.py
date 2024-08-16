import frappe
import json
from console import console

@frappe.whitelist()
def setting_variant(parent_item):
    console("enter in setting").log()
    data = []
    # console("Parent Items").log()
    # console(parent_item).log()

    result = frappe.db.get_list('Item',
                                filters={
                                    'variant_of': parent_item,
                                    'item_group':"Finished Goods",
                                },
                                fields=['*'],
                                order_by='idx')
    # console("RESULT").log()
    # console(result).log()
    for row in result:
        data.append(row)

    return data
