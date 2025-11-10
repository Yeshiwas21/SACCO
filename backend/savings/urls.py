from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'savings', views.SavingViewSet, basename='saving')
router.register(r'transactions', views.SavingTransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
]