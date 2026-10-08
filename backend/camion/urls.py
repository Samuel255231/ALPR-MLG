from django.urls import path
from .views import CamionListCreateView,CamionDetailView

urlpatterns = [
    path('', CamionListCreateView.as_view(), name='camion-list'),
    path('<int:pk>/', CamionDetailView.as_view(), name='camion-detail')
]