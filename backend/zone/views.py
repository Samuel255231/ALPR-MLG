from .models import Zone
from .serializers import ZoneSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics


class ZoneListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

class ZoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer