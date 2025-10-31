from rest_framework import serializers
from .models import Users


class UserSerializer(serializers.ModelSerializer):
    """
    Serializes the Users model for API responses and handles password hashing on creation.
    """
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Users
        fields = ['id', 'email', 'first_name', 'last_name', 'user_type', 'profile_image', 'password']

    def create(self, validated_data):
        # Use create_user from CustomUserManager to ensure password hashing
        password = validated_data.pop('password', None)
        user = Users(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
