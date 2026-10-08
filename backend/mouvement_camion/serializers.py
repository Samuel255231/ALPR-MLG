# mouvement/serializers.py
from rest_framework import serializers
from camion.models import Camion
from .models import MouvementCamion
from camion.serializers import CamionSerializer
class DeleteMouvementCamionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MouvementCamion
        fields = ["id","camion", "date","type"]
class ListMouvementCamionSerializer(serializers.ModelSerializer):
    immatriculation = serializers.CharField(source="camion.immatriculation", read_only=True)
    marque = serializers.CharField(source="camion.marque", read_only=True)
    modele = serializers.CharField(source="camion.modele", read_only=True)
    chauffeur = serializers.CharField(source="camion.chauffeur", read_only=True)
    etat = serializers.CharField(source="camion.etat", read_only=True)
    class Meta:
        model = MouvementCamion
        fields = ["id", "immatriculation", "marque", "modele", "chauffeur", "etat", "camion", "date","type"]
class MouvementCamionSerializer(serializers.ModelSerializer):
    immatriculation = serializers.CharField(write_only=True) 
    marque = serializers.CharField(write_only=True)
    modele = serializers.CharField(write_only=True)
    chauffeur = serializers.CharField(write_only=True)
    etat = serializers.CharField(write_only=True)
    camion = serializers.CharField(source="camion.immatriculation", read_only=True)

    class Meta:
        model = MouvementCamion
        fields = ["id", "immatriculation", "marque", "modele", "chauffeur", "etat", "camion", "date","type"]

    def create(self, validated_data):
        # Extraire les infos pour le camion
        immatriculation = validated_data.pop("immatriculation")
        marque = validated_data.pop("marque")
        modele = validated_data.pop("modele")
        chauffeur = validated_data.pop("chauffeur")
        etat = validated_data.pop("etat")

        # Créer ou récupérer le camion
        camion, _ = Camion.objects.get_or_create(
            immatriculation=immatriculation,
            defaults={
                "marque": marque,
                "modele": modele,
                "chauffeur": chauffeur,
                "etat": etat
            }
        )

        # Créer le mouvement
        mouvement = MouvementCamion.objects.create(camion=camion, **validated_data)
        return mouvement
