from django.contrib import admin
from .models import Member

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = [
        'member_id', 'full_name', 'phone_number', 'gender', 
        'membership_status', 'membership_date', 'created_at'
    ]
    list_filter = ['membership_status', 'gender', 'occupation', 'city', 'created_at']
    search_fields = ['first_name', 'last_name', 'phone_number', 'national_id', 'member_id']
    readonly_fields = ['created_at', 'updated_at', 'member_id']
    fieldsets = (
        ('Personal Information', {
            'fields': (
                'first_name', 'last_name', 'gender', 'date_of_birth', 
                'national_id', 'occupation'
            )
        }),
        ('Contact Information', {
            'fields': ('phone_number', 'email')
        }),
        ('Address Information', {
            'fields': ('city', 'subcity', 'woreda', 'house_no')
        }),
        ('Membership Information', {
            'fields': (
                'member_id', 'membership_date', 'membership_status', 
                'profile_photo'
            )
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact_name', 'emergency_contact_phone')
        }),
        ('System Information', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )