from django.contrib.auth.models import AbstractUser
from django.db import models
from PIL import Image

class Users(AbstractUser):
    USER_TYPES = [
        ('admin', 'Admin'),
        ('accountant', 'Accountant'),
        ('loan_officer', 'Loan Officer'),
        ('member', 'Member'),
        ('auditor', 'Auditor'),
        ('manager', 'Manager'),
    ]

    username = None  # remove username field
    email = models.EmailField(unique=True)  # email as unique identifier
    user_type = models.CharField(max_length=50, choices=USER_TYPES, default='member')
    profile_image = models.ImageField(upload_to='profile_pics', default='default.jpg')

    USERNAME_FIELD = 'email'  # set email as login field
    REQUIRED_FIELDS = []       # no other required fields besides email and password

    def __str__(self):
        return f"{self.email} ({self.get_user_type_display()})"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Resize profile image if too large
        img = Image.open(self.profile_image.path)
        if img.height > 300 or img.width > 300:
            output_size = (300, 300)
            img.thumbnail(output_size)
            img.save(self.profile_image.path)
