from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from PIL import Image

# Custom User Manager
# ==========================================
# This class replaces Django’s default UserManager.
# The default one expects a 'username' field, but since
# we’re using 'email' as the unique login field, we need
# a custom manager that knows how to handle users
# without a username.
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user with an email instead of username."""
        if not email:
            raise ValueError("The Email field must be set")

        # Normalize the email (e.g. make domain lowercase)
        email = self.normalize_email(email)

        # Create user instance with extra fields (like user_type)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # securely hash the password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser with all permissions."""
        # Set required flags for superusers
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        # Validation checks for safety
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


# Custom User Model
# ==========================================
# This model extends Django’s AbstractUser but removes
# the username field completely. The email field is now
# used as the unique identifier for authentication.
class Users(AbstractUser):
    USER_TYPES = [
        ('admin', 'Admin'),
        ('accountant', 'Accountant'),
        ('loan_officer', 'Loan Officer'),
        ('member', 'Member'),
        ('auditor', 'Auditor'),
        ('manager', 'Manager'),
    ]

    # We remove username since we’ll log in with email instead
    username = None

    # Email now becomes the unique identifier
    email = models.EmailField(unique=True)

    # Additional fields specific to the system
    user_type = models.CharField(max_length=50, choices=USER_TYPES, default='member')
    profile_image = models.ImageField(upload_to='profile_pics', default='default.jpg')

    # Tell Django to use email instead of username for login
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # No additional required fields

    # Connect our custom manager so Django knows how to create users
    objects = CustomUserManager()

    def __str__(self):
        # Display email and user role for readability in admin panel
        return f"{self.email} ({self.get_user_type_display()})"

    def save(self, *args, **kwargs):
        # Save the user instance first
        super().save(*args, **kwargs)

        # Automatically resize the profile image to avoid large uploads
        img = Image.open(self.profile_image.path)
        if img.height > 300 or img.width > 300:
            output_size = (300, 300)
            img.thumbnail(output_size)
            img.save(self.profile_image.path)
