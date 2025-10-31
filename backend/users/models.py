from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from PIL import Image

# Custom User Manager
# ==========================================
# Handles user creation and superuser creation for the custom Users model.
# Overrides default Django UserManager behavior because our Users model
# uses email instead of username as the unique identifier.
class CustomUserManager(BaseUserManager):
    
    # Create a regular user
    def create_user(self, email, password=None, **extra_fields):
        """
        Creates and saves a regular user with the given email and password.
        Raises a ValueError if email is not provided.
        """
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # hashes the password
        user.save(using=self._db)
        return user

    # Create a superuser
    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves a superuser with all permissions.
        Ensures is_staff, is_superuser, and is_active are True.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


# Custom User Model
# ==========================================
# Extends Django's AbstractUser but removes the username field.
# Uses email as the unique identifier and adds user_type and profile_image fields.
class Users(AbstractUser):
    
    USER_TYPES = [
        ('admin', 'Admin'),
        ('accountant', 'Accountant'),
        ('loan_officer', 'Loan Officer'),
        ('member', 'Member'),
        ('auditor', 'Auditor'),
        ('teller', 'Teller'),
    ]

    username = None  # remove default username field
    email = models.EmailField(unique=True)  # use email as unique identifier
    first_name = models.CharField(max_length=30)  # user's first name
    last_name = models.CharField(max_length=30)   # user's last name
    phone = models.CharField(max_length=15, blank=True, null=True)  # optional phone
    user_type = models.CharField(max_length=50, choices=USER_TYPES, default='member')
    profile_image = models.ImageField(upload_to='profile_pics', default='default.jpg')

    # Set email as the login field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']  # required for superuser creation

    # Attach custom user manager
    objects = CustomUserManager()

    # String representation
    def __str__(self):
        """
        Returns the email and user role for readability in admin panel.
        """
        return f"{self.email} ({self.get_user_type_display()})"

    # Save method override
    def save(self, *args, **kwargs):
        """
        Saves the user instance and resizes the profile image if it's too large.
        """
        super().save(*args, **kwargs)
        img = Image.open(self.profile_image.path)
        if img.height > 300 or img.width > 300:
            output_size = (300, 300)
            img.thumbnail(output_size)
            img.save(self.profile_image.path)
