from rest_framework import generics, status
from rest_framework.response import Response
from .models import MouvementCamion
from .serializers import MouvementCamionSerializer,ListMouvementCamionSerializer,DeleteMouvementCamionSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


class MouvementCamionCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = MouvementCamion.objects.all()
    serializer_class = MouvementCamionSerializer 
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mouvement = serializer.save()
        output_serializer = ListMouvementCamionSerializer(mouvement)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
class MouvementCamionListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = MouvementCamion.objects.all()
    serializer_class = ListMouvementCamionSerializer
class MouvementCamionDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = MouvementCamion.objects.all()
    serializer_class = DeleteMouvementCamionSerializer