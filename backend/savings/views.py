from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
import pandas as pd
from .models import Saving, SavingTransaction
from members.models import Member
from .serializers import (
    SavingSerializer, 
    SavingTransactionSerializer, 
    MemberSearchSerializer
)
from .filters import SavingFilter
from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

class SavingViewSet(viewsets.ModelViewSet):
    """ViewSet for managing savings"""
    queryset = Saving.objects.all().select_related('member')
    serializer_class = SavingSerializer
    pagination_class = CustomPagination
    filterset_class = SavingFilter
    
    def get_queryset(self):
        """Override queryset to support search and filtering"""
        queryset = super().get_queryset()
        
        # Apply filters
        filter_set = SavingFilter(self.request.GET, queryset=queryset)
        return filter_set.qs
    
    def create(self, request, *args, **kwargs):
        """Create a new saving with better error handling"""
        try:
            print("=== DEBUG: INCOMING REQUEST DATA ===")
            print("Raw data:", request.data)
            print("Data type:", type(request.data))
            
            # Make a mutable copy of the data
            data = request.data.copy()
            
            # Ensure member is properly formatted
            if 'member' in data:
                data['member'] = str(data['member']).strip()
                
            # Ensure amount is properly formatted
            if 'amount' in data:
                try:
                    data['amount'] = float(data['amount'])
                except (ValueError, TypeError):
                    return Response(
                        {'amount': 'Please enter a valid amount.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            print("=== DEBUG: PROCESSED DATA ===")
            print("Processed data:", data)
            
            serializer = self.get_serializer(data=data)
            
            print("=== DEBUG: SERIALIZER VALIDATION ===")
            print("Is valid:", serializer.is_valid())
            
            if serializer.is_valid():
                print("=== DEBUG: DATA IS VALID ===")
                print("Validated data:", serializer.validated_data)
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                print("=== DEBUG: VALIDATION ERRORS ===")
                print("Errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            print("=== DEBUG: EXCEPTION ===")
            print("Error:", str(e))
            import traceback
            print("Traceback:", traceback.format_exc())
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def member_search(self, request):
        """Search members by ID, name, or phone number"""
        query = request.query_params.get('q', '').strip()
        
        if not query or len(query) < 2:
            return Response([])
        
        # Search members by ID, name, or phone number
        members = Member.objects.filter(
            Q(member_id__icontains=query) |
            Q(first_name__icontains=query) |
            Q(middle_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(phone_number__icontains=query)
        )[:10]
        
        serializer = MemberSearchSerializer(members, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def member_savings(self, request, pk=None):
        """Get all savings for a specific member"""
        member_id = pk
        savings = Saving.get_member_savings(member_id)
        
        # Apply pagination
        paginator = CustomPagination()
        paginated_savings = paginator.paginate_queryset(savings, request)
        serializer = SavingSerializer(paginated_savings, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def member_totals(self, request, pk=None):
        """Get total savings for a member by saving type"""
        member_id = pk
        totals = Saving.get_member_totals(member_id)
        return Response(totals)
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        """Export savings data to Excel"""
        try:
            # Get filtered queryset
            queryset = self.get_queryset()
            
            # Convert to DataFrame
            data = []
            for saving in queryset:
                data.append({
                    'Saving ID': saving.saving_id,
                    'Member ID': saving.member.member_id,
                    'Full Name': saving.member_full_name,
                    'Contact': saving.member_contact,
                    'Date': saving.date,
                    'Amount': float(saving.amount),
                    'Saving Type': saving.saving_type,
                    'Reference Number': saving.reference_number,
                    'Payment Method': saving.payment_method,
                    'Bank Name': saving.bank_name or '',
                    'Mobile Money Provider': saving.mobile_money_provider or '',
                    'Transaction Code': saving.transaction_code or '',
                    'Interest': float(saving.interest),
                    'Total Amount': float(saving.total_amount),
                    'Status': saving.status,
                    'Created At': saving.created_at,
                })
            
            df = pd.DataFrame(data)
            
            # Create Excel file
            response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = f'attachment; filename="savings-export-{pd.Timestamp.now().strftime("%Y-%m-%d")}.xlsx"'
            
            with pd.ExcelWriter(response, engine='openpyxl') as writer:
                df.to_excel(writer, sheet_name='Savings', index=False)
                
                # Auto-adjust column widths
                worksheet = writer.sheets['Savings']
                for column in worksheet.columns:
                    max_length = 0
                    column_letter = column[0].column_letter
                    for cell in column:
                        try:
                            if len(str(cell.value)) > max_length:
                                max_length = len(str(cell.value))
                        except:
                            pass
                    adjusted_width = (max_length + 2)
                    worksheet.column_dimensions[column_letter].width = adjusted_width
            
            return response
            
        except Exception as e:
            return Response(
                {'error': f'Export failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def filters(self, request):
        """Get available filter options"""
        return Response({
            'saving_types': [choice[0] for choice in Saving.SAVING_TYPE_CHOICES],
            'payment_methods': [choice[0] for choice in Saving.PAYMENT_METHOD_CHOICES],
            'statuses': [choice[0] for choice in Saving.STATUS_CHOICES],
            'banks': [choice[0] for choice in Saving.BANK_CHOICES],
            'mobile_providers': [choice[0] for choice in Saving.MOBILE_MONEY_CHOICES],
        })

class SavingTransactionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing saving transactions"""
    queryset = SavingTransaction.objects.all().select_related('saving')
    serializer_class = SavingTransactionSerializer
    
    @action(detail=False, methods=['get'])
    def saving_transactions(self, request):
        """Get all transactions for a specific saving"""
        saving_id = request.query_params.get('saving_id')
        transactions = SavingTransaction.get_saving_transactions(saving_id)
        serializer = SavingTransactionSerializer(transactions, many=True)
        return Response(serializer.data)