from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone
import re

class Member(models.Model):
    MEMBERSHIP_STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Suspended', 'Suspended'),
    ]
    
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]
    
    OCCUPATION_CHOICES = [
        ('Member', 'Member'),
        ('Admin', 'Admin'),
        ('Officer', 'Officer'),
        ('Accountant', 'Accountant'),
    ]

    # Primary identifier - member_id as primary key
    member_id = models.CharField(
        primary_key=True,
        max_length=20,
        unique=True,
        editable=False
    )
    
    # Personal Information
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)  # Added middle name
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    date_of_birth = models.DateField()
    national_id = models.CharField(
        max_length=20, 
        unique=True,
        validators=[
            RegexValidator(
                regex='^[0-9]{9,20}$',
                message='National ID must contain only numbers and be 9-20 digits long'
            )
        ]
    )
    occupation = models.CharField(max_length=20, choices=OCCUPATION_CHOICES, default='Member')
    
    # Contact Information
    phone_number = models.CharField(max_length=17, unique=True)
    email = models.EmailField(blank=True, null=True)
    
    # Address Information
    city = models.CharField(max_length=100, default='Addis Ababa')
    subcity = models.CharField(max_length=100)
    woreda = models.CharField(max_length=100)
    house_no = models.CharField(max_length=50)
    
    # Membership Information
    membership_date = models.DateField(default=timezone.now)
    membership_status = models.CharField(max_length=20, choices=MEMBERSHIP_STATUS_CHOICES, default='Active')
    profile_photo = models.ImageField(upload_to='member_photos/', blank=True, null=True)
    
    # Emergency Contact
    emergency_contact_name = models.CharField(max_length=100)
    emergency_contact_phone = models.CharField(max_length=17)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'members_member'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['member_id']),
            models.Index(fields=['national_id']),
            models.Index(fields=['phone_number']),
            models.Index(fields=['membership_status']),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.middle_name + ' ' if self.middle_name else ''}{self.last_name} ({self.member_id})"
    
    @property
    def full_name(self):
        """Return full name including middle name if available"""
        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"
        return f"{self.first_name} {self.last_name}"
    
    @property
    def initials(self):
        """Return initials for avatar display"""
        first_initial = self.first_name[0] if self.first_name else ''
        middle_initial = self.middle_name[0] if self.middle_name else ''
        last_initial = self.last_name[0] if self.last_name else ''
        return f"{first_initial}{middle_initial}{last_initial}"
    
    @staticmethod
    def is_valid_ethiopian_phone(phone):
        """Check if phone number is valid Ethiopian format"""
        phone = str(phone).strip()
        patterns = [
            r'^\+2519\d{8}$',
            r'^2519\d{8}$',
            r'^09\d{8}$',
            r'^9\d{8}$',
        ]
        return any(re.match(pattern, phone) for pattern in patterns)
    
    def save(self, *args, **kwargs):
        # Generate member ID if not provided
        if not self.member_id:
            last_member = Member.objects.order_by('-created_at').first()
            if last_member:
                try:
                    last_number = int(last_member.member_id[1:])
                    new_number = last_number + 1
                except (ValueError, IndexError):
                    new_number = 1
            else:
                new_number = 1
            self.member_id = f"M{new_number:04d}"
        
        # Normalize phone numbers
        self.phone_number = self.normalize_phone_number(self.phone_number)
        self.emergency_contact_phone = self.normalize_phone_number(self.emergency_contact_phone)
        
        super().save(*args, **kwargs)
    
    @staticmethod
    def normalize_phone_number(phone):
        """Normalize phone number to +251 format"""
        phone = str(phone).strip()
        if phone.startswith('0'):
            return '+251' + phone[1:]
        elif phone.startswith('251'):
            return '+' + phone
        elif phone.startswith('9') and len(phone) == 9:
            return '+251' + phone
        else:
            return phone

    def get_searchable_name(self):
        """Return name formatted for search functionality"""
        return f"{self.first_name} {self.middle_name or ''} {self.last_name}".strip()