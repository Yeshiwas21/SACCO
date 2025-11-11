from django.contrib import admin
from .models import Saving, SavingTransaction

@admin.register(Saving)
class SavingAdmin(admin.ModelAdmin):
    list_display = [
        'saving_id', 'member', 'member_full_name', 'date', 'amount', 
        'saving_type', 'payment_method', 'bank_name', 'status'
    ]
    list_filter = ['saving_type', 'payment_method', 'status', 'date']
    search_fields = [
        'saving_id', 'member__member_id', 'member__first_name', 
        'member__last_name', 'reference_number'
    ]
    readonly_fields = ['saving_id', 'interest', 'created_at', 'updated_at']
    list_per_page = 20

@admin.register(SavingTransaction)
class SavingTransactionAdmin(admin.ModelAdmin):
    list_display = [
        'transaction_id', 'saving', 'transaction_date', 'amount', 
        'saving_type', 'payment_method'
    ]
    list_filter = ['saving_type', 'payment_method', 'transaction_date']
    search_fields = [
        'transaction_id', 'saving__saving_id', 'reference_number'
    ]
    readonly_fields = ['transaction_id', 'created_at']
    list_per_page = 20