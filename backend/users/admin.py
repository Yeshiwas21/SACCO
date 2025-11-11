from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Users

class CustomUserAdmin(UserAdmin):
    model = Users
    # Fields to display in admin list view
    list_display = ('email', 'first_name', 'last_name', 'phone', 'user_type', 'is_staff', 'is_active')
    # Fields to filter by
    list_filter = ('is_staff', 'is_active', 'user_type')
    
    # Fields in the add/edit form
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone', 'user_type', 'profile_image')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'is_active', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'phone', 'user_type', 'profile_image', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    ordering = ('email',)


admin.site.register(Users, CustomUserAdmin)
