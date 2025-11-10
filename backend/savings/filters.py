import django_filters
from .models import Saving
from django.db.models import Q

class SavingFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search')
    saving_type = django_filters.ChoiceFilter(choices=Saving.SAVING_TYPE_CHOICES)
    payment_method = django_filters.ChoiceFilter(choices=Saving.PAYMENT_METHOD_CHOICES)
    status = django_filters.ChoiceFilter(choices=Saving.STATUS_CHOICES)
    bank_name = django_filters.ChoiceFilter(choices=Saving.BANK_CHOICES)
    mobile_money_provider = django_filters.ChoiceFilter(choices=Saving.MOBILE_MONEY_CHOICES)
    date_from = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    amount_min = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    amount_max = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')

    class Meta:
        model = Saving
        fields = [
            'search', 'saving_type', 'payment_method', 'status',
            'bank_name', 'mobile_money_provider', 'date_from', 'date_to',
            'amount_min', 'amount_max'
        ]

    def filter_search(self, queryset, name, value):
        """Search across multiple fields"""
        if value:
            return queryset.filter(
                Q(saving_id__icontains=value) |
                Q(member__member_id__icontains=value) |
                Q(member__first_name__icontains=value) |
                Q(member__middle_name__icontains=value) |
                Q(member__last_name__icontains=value) |
                Q(member__phone_number__icontains=value) |
                Q(reference_number__icontains=value)
            )
        return queryset