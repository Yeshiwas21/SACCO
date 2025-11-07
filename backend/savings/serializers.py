from rest_framework import serializers
from .models import Saving
from members.models import Member

class SavingSerializer(serializers.ModelSerializer):
    # Use PrimaryKeyRelatedField with string pk
    member = serializers.PrimaryKeyRelatedField(
        queryset=Member.objects.all(),
        pk_field=serializers.CharField(),
        error_messages={
            'does_not_exist': 'Invalid Member ID — no member found with this ID.'
        }
    )

    class Meta:
        model = Saving
        fields = [
            "saving_id",
            "member",
            "date",
            "saving_type",
            "reference_number",
            "payment_method",
            "amount",
            "interest",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ['saving_id', 'created_at', 'updated_at']

    def validate_amount(self, value):
        if value is None:
            raise serializers.ValidationError("Amount is required.")
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        return value