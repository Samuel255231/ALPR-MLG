from rest_framework import serializers
from .models import Mouvement
from camera.serializers import ListCameraSerializer

class MouvementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mouvement
        fields = "__all__"
class ListMouvementSerializer(serializers.ModelSerializer):
    camera = ListCameraSerializer()
    class Meta:
        model = Mouvement
        fields =["id","quantite","timestamp","camera"]
