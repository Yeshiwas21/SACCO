from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import uuid
from members.models import Member

class Saving(models.Model):
    SAVING_TYPE_CHOICES = [
        ('Compulsory', 'Compulsory'),
        ('Voluntary', 'Voluntary'),
        ('Regular', 'Regular'),
        ('Fixed Deposit', 'Fixed Deposit'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('Cash', 'Cash'),
        ('Bank Transfer', 'Bank Transfer'),
        ('Mobile Money', 'Mobile Money'),
        ('Cheque', 'Cheque'),
    ]
    
    BANK_CHOICES = [
        ('Commercial Bank of Ethiopia', 'Commercial Bank of Ethiopia'),
        ('Awash Bank', 'Awash Bank'),
        ('Dashen Bank', 'Dashen Bank'),
        ('Abyssinia Bank', 'Abyssinia Bank'),
        ('NIB Bank', 'NIB Bank'),
        ('Hibret Bank', 'Hibret Bank'),
        ('Wegagen Bank', 'Wegagen Bank'),
        ('Bank of Abyssinia', 'Bank of Abyssinia'),
        ('Oromia Bank', 'Oromia Bank'),
        ('Cooperative Bank of Oromia', 'Cooperative Bank of Oromia'),
        ('Other', 'Other'),
    ]
    
    MOBILE_MONEY_CHOICES = [
        ('M-Birr', 'M-Birr'),
        ('CBE Birr', 'CBE Birr'),
        ('HelloCash', 'HelloCash'),
        ('Amole', 'Amole'),
        ('Other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Pending', 'Pending'),
        ('Closed', 'Closed'),
    ]

    # Primary key
    saving_id = models.CharField(
        primary_key=True,
        max_length=20,
        unique=True,
        editable=False
    )
    
    # Foreign key to Member
    member = models.ForeignKey(
        Member, 
        on_delete=models.CASCADE,
        related_name='savings',
        to_field='member_id'
    )
    
    # Saving information
    date = models.DateField(default=timezone.now)
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    saving_type = models.CharField(max_length=20, choices=SAVING_TYPE_CHOICES, default='Compulsory')
    reference_number = models.CharField(max_length=50, unique=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='Cash')
    
    # Bank/Mobile Money details
    bank_name = models.CharField(max_length=50, choices=BANK_CHOICES, blank=True, null=True)
    mobile_money_provider = models.CharField(max_length=50, choices=MOBILE_MONEY_CHOICES, blank=True, null=True)
    transaction_code = models.CharField(max_length=100, blank=True, null=True)
    
    interest = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'savings_saving'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['saving_id']),
            models.Index(fields=['member']),
            models.Index(fields=['reference_number']),
            models.Index(fields=['saving_type']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.saving_id} - {self.member.member_id} - {self.amount}"
    
    def save(self, *args, **kwargs):
        # Generate saving ID if not provided
        if not self.saving_id:
            last_saving = Saving.objects.order_by('-created_at').first()
            if last_saving:
                try:
                    last_number = int(last_saving.saving_id[3:])
                    new_number = last_number + 1
                except (ValueError, IndexError):
                    new_number = 1
            else:
                new_number = 1
            self.saving_id = f"SAV{new_number:03d}"
        
        # Generate reference number if not provided
        if not self.reference_number:
            self.reference_number = f"REF{int(timezone.now().timestamp())}"
        
        # Calculate interest based on saving type
        self.calculate_interest()
        
        # Validate payment details
        self.validate_payment_details()
        
        super().save(*args, **kwargs)
    
    def calculate_interest(self):
        """Calculate interest based on saving type and amount"""
        if self.saving_type == 'Compulsory':
            interest_rate = Decimal('0.03')  # 3% for compulsory
        elif self.saving_type == 'Voluntary':
            interest_rate = Decimal('0.05')  # 5% for voluntary
        else:
            interest_rate = Decimal('0.02')  # 2% for other types
        
        self.interest = self.amount * interest_rate
    
    def validate_payment_details(self):
        """Validate payment method specific details"""
        if self.payment_method == 'Bank Transfer':
            if not self.bank_name:
                raise ValueError("Bank name is required for bank transfers")
            if not self.transaction_code:
                raise ValueError("Transaction code is required for bank transfers")
        
        elif self.payment_method == 'Mobile Money':
            if not self.mobile_money_provider:
                raise ValueError("Mobile money provider is required for mobile money payments")
            if not self.transaction_code:
                raise ValueError("Transaction code is required for mobile money payments")
    
    @property
    def total_amount(self):
        """Return total amount including interest"""
        return self.amount + self.interest
    
    @property
    def member_full_name(self):
        """Return member's full name"""
        return self.member.full_name
    
    @property
    def member_contact(self):
        """Return member's contact information"""
        return self.member.phone_number
    
    @property
    def payment_details(self):
        """Return formatted payment details"""
        if self.payment_method == 'Bank Transfer' and self.bank_name:
            return f"{self.payment_method} - {self.bank_name}"
        elif self.payment_method == 'Mobile Money' and self.mobile_money_provider:
            return f"{self.payment_method} - {self.mobile_money_provider}"
        else:
            return self.payment_method
    
    @classmethod
    def get_member_savings(cls, member_id):
        """Get all savings for a specific member"""
        return cls.objects.filter(member_id=member_id).select_related('member')
    
    @classmethod
    def get_member_totals(cls, member_id):
        """Get total savings for a member by saving type"""
        savings = cls.objects.filter(member_id=member_id, status='Active')
        
        totals = {
            'compulsory_total': Decimal('0.00'),
            'voluntary_total': Decimal('0.00'),
            'regular_total': Decimal('0.00'),
            'fixed_deposit_total': Decimal('0.00'),
            'total_balance': Decimal('0.00')
        }
        
        for saving in savings:
            if saving.saving_type == 'Compulsory':
                totals['compulsory_total'] += saving.amount
            elif saving.saving_type == 'Voluntary':
                totals['voluntary_total'] += saving.amount
            elif saving.saving_type == 'Regular':
                totals['regular_total'] += saving.amount
            elif saving.saving_type == 'Fixed Deposit':
                totals['fixed_deposit_total'] += saving.amount
            
            totals['total_balance'] += saving.amount
        
        # Convert to float for JSON serialization
        return {
            'compulsory_total': float(totals['compulsory_total']),
            'voluntary_total': float(totals['voluntary_total']),
            'regular_total': float(totals['regular_total']),
            'fixed_deposit_total': float(totals['fixed_deposit_total']),
            'total_balance': float(totals['total_balance'])
        }

class SavingTransaction(models.Model):
    """Model to track individual saving transactions"""
    transaction_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    saving = models.ForeignKey(Saving, on_delete=models.CASCADE, related_name='transactions')
    
    # Transaction details
    transaction_date = models.DateField(default=timezone.now)
    payment_method = models.CharField(max_length=20, choices=Saving.PAYMENT_METHOD_CHOICES)
    reference_number = models.CharField(max_length=50)
    saving_type = models.CharField(max_length=20, choices=Saving.SAVING_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    interest = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    debit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'savings_transaction'
        ordering = ['-transaction_date', '-created_at']
        indexes = [
            models.Index(fields=['saving']),
            models.Index(fields=['transaction_date']),
            models.Index(fields=['reference_number']),
        ]
    
    def __str__(self):
        return f"{self.transaction_date} - {self.saving.saving_id} - {self.amount}"
    
    def save(self, *args, **kwargs):
        # Set reference number from saving if not provided
        if not self.reference_number:
            self.reference_number = self.saving.reference_number
        
        # Set saving type from saving if not provided
        if not self.saving_type:
            self.saving_type = self.saving.saving_type
            
        super().save(*args, **kwargs)
    
    @classmethod
    def get_saving_transactions(cls, saving_id):
        """Get all transactions for a specific saving"""
        return cls.objects.filter(saving_id=saving_id).select_related('saving')