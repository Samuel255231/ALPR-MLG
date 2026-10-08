from django.urls import path
from .views import CameraViewSet,CameraDetailView

urlpatterns = [
    path('', CameraViewSet.as_view()),  
        path('<int:pk>/', CameraDetailView.as_view(), name='camera-detail'),
 
]