from rest_framework import generics

from users.permissions import LectureConnectesEcritureAdmin
from .models import Zone
from .serializers import ZoneSerializer


class ZoneListCreateView(generics.ListCreateAPIView):
    permission_classes = [LectureConnectesEcritureAdmin]
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer


class ZoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [LectureConnectesEcritureAdmin]
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer
