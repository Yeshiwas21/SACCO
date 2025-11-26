from django.db import models
from django.utils import timezone

class SystemSetting(models.Model):
    """Global system settings accessible across all modules."""

    # Basic Info (readonly)
    name = models.CharField(
        max_length=100,
        unique=True,
        default="Company Setting",
        editable=False
    )
    description = models.TextField(
        default="Main configuration for the organization",
        editable=False
    )

    # Organization / Contact Info
    organization_name = models.CharField(max_length=200, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    startup_date = models.DateField(blank=True, null=True)

    # Timestamps
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'core_settings'
        verbose_name = 'System Setting'
        verbose_name_plural = 'System Settings'
        ordering = ['-created_at']

    def __str__(self):
        return "Company Setting"

    def save(self, *args, **kwargs):
        """Ensure only one settings record exists and enforce fixed name/description."""
        if not self.pk and SystemSetting.objects.exists():
            raise ValueError("Only one SystemSetting instance is allowed.")

        # Enforce fixed values
        self.name = "Company Setting"
        self.description = "Main configuration for the organization"

        super().save(*args, **kwargs)

    @staticmethod
    def get_settings():
        """Return the singleton settings instance, creating one if needed."""
        instance = SystemSetting.objects.first()
        if not instance:
            instance = SystemSetting.objects.create(
                organization_name="Your Organization",
                city="Addis Ababa",
                startup_date=timezone.now().date(),
            )
        return instance
