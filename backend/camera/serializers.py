from rest_framework import serializers
from .models import Camera
from zone.serializers import ZoneSerializer

class CameraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camera
        fields = ['id', 'code', 'rtsp_url', 'description','type','zone','status']
class ListCameraSerializer(serializers.ModelSerializer):
    zone=ZoneSerializer()
    class Meta:
        model = Camera
        fields = ['id', 'code', 'rtsp_url', 'description','type','zone','status']
