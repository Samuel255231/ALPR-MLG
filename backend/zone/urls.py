from django.urls import path
from .views import ZoneListCreateView,ZoneDetailView

urlpatterns = [
    path('', ZoneListCreateView.as_view(), name='zone-list'),
    path('<int:pk>/', ZoneDetailView.as_view(), name='zone-detail')
]