from django.urls import path
from .views import SavingRegisterView, SavingListView

urlpatterns = [
    path('register/', SavingRegisterView.as_view(), name="saving-register"),
    path('', SavingListView.as_view(), name='saving-list')
]
