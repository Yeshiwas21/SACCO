from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Users

class CustomUserAdmin(UserAdmin):
    model = Users
    list_display = ('email', 'user_type', 'is_staff', 'is_active')
    list_filter = ('user_type', 'is_staff', 'is_active')
    search_fields = ('email',)
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password', 'user_type', 'profile_image')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'user_type', 'profile_image', 'is_staff', 'is_active')}
        ),
    )

admin.site.register(Users, CustomUserAdmin)
