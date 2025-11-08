from rest_framework import serializers
from .models import Saving, SavingTransaction
from members.models import Member


class MemberSearchSerializer(serializers.ModelSerializer):
    """Serializer for member search results"""
    contact = serializers.CharField(source='phone_number')
    
    class Meta:
        model = Member
        fields = ['member_id', 'full_name', 'contact']

class SavingSerializer(serializers.ModelSerializer):
    """Serializer for Saving model"""
    member_full_name = serializers.ReadOnlyField()
    member_contact = serializers.ReadOnlyField()
    total_amount = serializers.ReadOnlyField()
    payment_details = serializers.ReadOnlyField()
    
    class Meta:
        model = Saving
        fields = [
            'saving_id',
            'member',
            'member_full_name',
            'member_contact',
            'date',
            'amount',
            'saving_type',
            'reference_number',
            'payment_method',
            'payment_details',
            'bank_name',
            'mobile_money_provider',
            'transaction_code',
            'interest',
            'total_amount',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'saving_id', 
            'interest', 
            'total_amount', 
            'created_at', 
            'updated_at', 
            'payment_details',
            'reference_number'  # Added this line
        ]
    
    def validate(self, data):
        """Validate saving data"""
        payment_method = data.get('payment_method')
        bank_name = data.get('bank_name')
        mobile_money_provider = data.get('mobile_money_provider')
        transaction_code = data.get('transaction_code')
        
        if payment_method == 'Bank Transfer':
            if not bank_name:
                raise serializers.ValidationError({
                    'bank_name': 'Bank name is required for bank transfers'
                })
            if not transaction_code:
                raise serializers.ValidationError({
                    'transaction_code': 'Transaction code is required for bank transfers'
                })
        
        elif payment_method == 'Mobile Money':
            if not mobile_money_provider:
                raise serializers.ValidationError({
                    'mobile_money_provider': 'Mobile money provider is required for mobile money payments'
                })
            if not transaction_code:
                raise serializers.ValidationError({
                    'transaction_code': 'Transaction code is required for mobile money payments'
                })
        
        return data

class SavingTransactionSerializer(serializers.ModelSerializer):
    """Serializer for SavingTransaction model"""
    
    class Meta:
        model = SavingTransaction
        fields = '__all__'