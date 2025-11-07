from django.db import models
from members.models import Member
from django.utils import timezone
from decimal import Decimal

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

    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Pending', 'Pending'),
        ('Closed', 'Closed'),
    ]

    # Primary identifier
    saving_id = models.CharField(max_length=20, primary_key=True, editable=False, unique=True)

    # Relationship
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="savings")
    # Saving info
    date = models.DateField(default=timezone.now)
    saving_type = models.CharField(max_length=50, choices=SAVING_TYPE_CHOICES)
    reference_number = models.CharField(max_length=50, unique=True)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    interest = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        db_table = "savings_saving"
        ordering = ['-date']

    def __str__(self):
        return f"{self.saving_id} - {self.member.full_name} ({self.saving_type}) ({self.amount})"

    def save(self, *args, **kwargs):
        # Auto-generate saving ID
        if not self.saving_id:
            last_saving = Saving.objects.order_by('-created_at').first()
            if last_saving:
                try:
                    last_number = int(last_saving.saving_id[3:])  # extract numeric part
                    new_number = last_number + 1
                except (ValueError, IndexError):
                    new_number = 1
            else:
                new_number = 1
            
            # Determine padding dynamically (e.g., at least 3 digits)
            padding = max(3, len(str(new_number)))
            self.saving_id = f"SAV{new_number:0{padding}d}"

        # Auto-calculate interest
        self.interest = self.calculate_interest()

        super().save(*args, **kwargs)


    def calculate_interest(self):
        """Auto-calculate interest based on saving type"""
        if self.saving_type == "Compulsory":
            rate = Decimal('0.05')
        elif self.saving_type == "Voluntary":
            rate = Decimal('0.03')
        else:
            rate = Decimal('0.02')
        return Decimal(self.amount) * rate
