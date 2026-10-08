from django.db.models import Value, F
from django.db.models.functions import Concat
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .permissions import EstAdmin
from .serializers import (
    UserListSerializer,
    UserSerializer,
    CustomUserSerializer,
    ChangePasswordSerializer,
    ResetPasswordSerializer,
)


class UsersListView(generics.ListAPIView):
    permission_classes = [EstAdmin]
    queryset = User.objects.all().annotate(
        full_name=Concat(F('first_name'), Value(' '), F('last_name'))
    )
    serializer_class = UserListSerializer


class UserRegistrationView(APIView):
    """Création d'un compte : réservée à l'administrateur."""
    permission_classes = [EstAdmin]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserListSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.user
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': CustomUserSerializer(user).data,
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(
            instance=request.user, data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            refresh = RefreshToken.for_user(request.user)
            return Response({
                "detail": "Mot de passe modifié avec succès.",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserToggleActiveAPIView(APIView):
    """Active ou désactive un compte : réservé à l'administrateur."""
    permission_classes = [EstAdmin]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "Utilisateur non trouvé."}, status=status.HTTP_404_NOT_FOUND)

        # un admin ne peut pas désactiver son propre compte (il se bloquerait lui-même)
        if user.pk == request.user.pk:
            return Response(
                {"detail": "Vous ne pouvez pas désactiver votre propre compte."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = not user.is_active
        user.save()
        etat = "activé" if user.is_active else "désactivé"
        return Response({"detail": f"Compte {etat} avec succès.", "is_active": user.is_active})


class ResetPasswordView(APIView):
    """Réinitialise le mot de passe d'un compte : réservé à l'administrateur."""
    permission_classes = [EstAdmin]

    def put(self, request, *args, **kwargs):
        try:
            user = User.objects.get(id=request.data.get("user_id"))
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"detail": "Utilisateur introuvable."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ResetPasswordSerializer(instance=user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Mot de passe réinitialisé avec succès."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
