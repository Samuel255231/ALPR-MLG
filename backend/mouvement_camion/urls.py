from django.urls import path
from .views import MouvementCamionListView,MouvementCamionDetailView,MouvementCamionCreateView

urlpatterns = [
    path('', MouvementCamionListView.as_view()),
    path('<int:pk>/', MouvementCamionDetailView.as_view()),
    path('create/', MouvementCamionCreateView.as_view())
]