from django.contrib import admin
from .models import SystemSetting

@admin.register(SystemSetting)
class SystemSettingAdmin(admin.ModelAdmin):
    list_display = ('name', 'description','organization_name', 'city', 'phone', 'updated_at')
    readonly_fields = ('name', 'description', 'created_at', 'updated_at')