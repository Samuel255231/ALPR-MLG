from .models import Camion
from .serializers import CamionSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics


class CamionListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Camion.objects.all()
    serializer_class = CamionSerializer

class CamionDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = Camion.objects.all()
    serializer_class = CamionSerializer