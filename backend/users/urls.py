from django.urls import path
from .views import LoginView, RegisterUserView, UserListView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterUserView.as_view(), name='user-register'),
    path('', UserListView.as_view(), name='user-list'),  # 👈 New route for fetching users

]
