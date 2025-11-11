import django_filters
from .models import Member

class MemberFilter(django_filters.FilterSet):
    first_name = django_filters.CharFilter(lookup_expr='icontains')
    middle_name = django_filters.CharFilter(lookup_expr='icontains')
    last_name = django_filters.CharFilter(lookup_expr='icontains')
    phone_number = django_filters.CharFilter(lookup_expr='icontains')
    national_id = django_filters.CharFilter(lookup_expr='icontains')
    membership_date = django_filters.DateFromToRangeFilter()
    created_at = django_filters.DateFromToRangeFilter()
    
    class Meta:
        model = Member
        fields = {
            'membership_status': ['exact'],
            'gender': ['exact'],
            'occupation': ['exact'],
            'city': ['exact'],
        }