from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny  # Changed from IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
import csv
from datetime import datetime

from .models import Member
from .serializers import MemberSerializer, MemberCreateSerializer, MemberExportSerializer
from .filters import MemberFilter

class MemberViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  # Allow anyone to access temporarily
    queryset = Member.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = MemberFilter
    search_fields = ['first_name', 'last_name', 'phone_number', 'national_id', 'member_id']
    ordering_fields = ['first_name', 'last_name', 'membership_date', 'created_at']
    ordering = ['created_at']
    lookup_field = 'member_id'

    def get_serializer_class(self):
        if self.action == 'create':
            return MemberCreateSerializer
        return MemberSerializer

    @action(detail=False, methods=['get'])
    def test(self, request):
        """Test endpoint to check if API is working"""
        return Response({
            'message': 'Members API is working!',
            'total_members': Member.objects.count(),
            'status': 'success'
        })

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get member statistics"""
        total_members = Member.objects.count()
        active_members = Member.objects.filter(membership_status='Active').count()
        inactive_members = Member.objects.filter(membership_status='Inactive').count()
        suspended_members = Member.objects.filter(membership_status='Suspended').count()
        
        return Response({
            'total_members': total_members,
            'active_members': active_members,
            'inactive_members': inactive_members,
            'suspended_members': suspended_members,
        })

    @action(detail=False, methods=['get'])
    def export(self, request):
        """Export members to CSV"""
        filtered_queryset = self.filter_queryset(self.get_queryset())
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="members_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        
        writer = csv.writer(response)
        
        # Write header
        writer.writerow([
            'Member ID', 'Full Name', 'Phone', 'Gender', 'Status', 
            'Email', 'National ID', 'Date Joined', 'Occupation', 'Emergency Contact', 'Emergency Phone'
        ])
        
        # Write data
        for member in filtered_queryset:
            writer.writerow([
                member.member_id,
                member.full_name,
                member.phone_number,
                member.gender,
                member.membership_status,
                member.email or '',
                member.national_id,
                member.membership_date.strftime('%Y-%m-%d') if member.membership_date else '',
                member.occupation,
                member.emergency_contact_name,
                member.emergency_contact_phone
            ])
        
        return response

    @action(detail=True, methods=['post'])
    def change_status(self, request, member_id=None):
        """Change member status"""
        member = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Member.MEMBERSHIP_STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        member.membership_status = new_status
        member.save()
        
        return Response({'status': 'Status updated successfully'})