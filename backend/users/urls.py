from django.urls import path
from .views import UsersListView,UserRegistrationView,CustomTokenObtainPairView,ChangePasswordView,UserToggleActiveAPIView,ResetPasswordView

urlpatterns = [
    path('',UsersListView.as_view()), 
    path('registration/',UserRegistrationView.as_view()), 
    path('login/',CustomTokenObtainPairView.as_view()),  
    path('change_password/',ChangePasswordView.as_view()), 
    path('<int:pk>/status_compte/', UserToggleActiveAPIView.as_view(), name='user-status'),
    path('reset_password/', ResetPasswordView.as_view(), name='user_reset_password'),

]
