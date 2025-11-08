from rest_framework import serializers
from .models import Member
from django.core.exceptions import ValidationError
import re

class MemberSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Member
        fields = [
            'member_id',
            'first_name',
            'middle_name',
            'last_name',
            'full_name',
            'gender',
            'date_of_birth',
            'national_id',
            'phone_number',
            'email',
            'city',
            'subcity',
            'woreda',
            'house_no',
            'membership_date',
            'occupation',
            'emergency_contact_name',
            'emergency_contact_phone',
            'membership_status',
            'profile_photo',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['member_id', 'created_at', 'updated_at']
    
    def validate_national_id(self, value):
        """Validate national ID format if provided"""
        if value and not re.match(r'^[0-9]{9,20}$', value):
            raise ValidationError('National ID must contain only numbers and be 9-20 digits long')
        return value
    
    def validate_phone_number(self, value):
        """Validate Ethiopian phone number format"""
        if not Member.is_valid_ethiopian_phone(value):
            raise ValidationError('Please enter a valid Ethiopian phone number (e.g., 0979572520 or +251979572520)')
        return value
    
    def validate_emergency_contact_phone(self, value):
        """Validate Ethiopian phone number format for emergency contact"""
        if not Member.is_valid_ethiopian_phone(value):
            raise ValidationError('Please enter a valid Ethiopian phone number (e.g., 0979572520 or +251979572520)')
        return value
    
    def validate(self, data):
        """Additional validation"""
        instance = self.instance
        phone_number = data.get('phone_number')
        national_id = data.get('national_id')
        
        # Check if phone number already exists
        if phone_number:
            normalized_phone = Member.normalize_phone_number(phone_number)
            qs = Member.objects.filter(phone_number=normalized_phone)
            if instance:
                qs = qs.exclude(member_id=instance.member_id)
            if qs.exists():
                raise ValidationError({'phone_number': 'A member with this phone number already exists.'})
        
        # Check if national ID already exists (only if provided)
        if national_id:
            qs = Member.objects.filter(national_id=national_id)
            if instance:
                qs = qs.exclude(member_id=instance.member_id)
            if qs.exists():
                raise ValidationError({'national_id': 'A member with this national ID already exists.'})
        
        return data

class MemberCreateSerializer(MemberSerializer):
    """Serializer for creating members with automatic member ID generation"""
    
    class Meta(MemberSerializer.Meta):
        read_only_fields = ['member_id', 'created_at', 'updated_at']

class MemberExportSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Member
        fields = [
            'member_id',
            'first_name',
            'middle_name',
            'last_name',
            'full_name',
            'phone_number',
            'gender',
            'membership_status',
            'email',
            'national_id',
        ]