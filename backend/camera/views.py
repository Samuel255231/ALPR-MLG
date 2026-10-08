from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Camera
from .serializers import CameraSerializer, ListCameraSerializer

class CameraViewSet(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Camera.objects.all()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CameraSerializer
        return ListCameraSerializer


class CameraDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = Camera.objects.all()

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return CameraSerializer
        return ListCameraSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = CameraSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        read_serializer = ListCameraSerializer(instance)
        return Response(read_serializer.data)


