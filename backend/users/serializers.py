from rest_framework import serializers
from .models import Users

# User Serializer
# ==========================================
# Serializes the Users model for API requests/responses.
# Handles password hashing and ensures sensitive fields like password are write-only.
class UserSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Users
        fields = ['id', 'email', 'first_name', 'last_name', 'phone', 'user_type', 'profile_image', 'password']

    # Create method
    def create(self, validated_data):
        """
        Creates a new user instance using hashed password.
        Uses Users.set_password() to ensure password is securely stored.
        """
        password = validated_data.pop('password', None)
        user = Users(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    # Update method
    def update(self, instance, validated_data):
        """
        Updates an existing user instance.
        Handles optional password update and other field changes.
        """
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
