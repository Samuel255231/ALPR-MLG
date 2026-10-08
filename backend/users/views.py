# views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny,IsAuthenticated
from .serializers import UserListSerializer,UserSerializer,CustomUserSerializer,ChangePasswordSerializer,ResetPasswordSerializer
from rest_framework.views import APIView
from django.db.models.functions import Concat
from django.db.models import Value, F

class UsersListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all().annotate(
        full_name=Concat(F('first_name'), Value(' '), F('last_name'))
    )
    serializer_class = UserListSerializer

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  
            list_serializer = UserListSerializer(user) 
            return Response(list_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.user
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)
            refresh = str(refresh)
            user_data = CustomUserSerializer(user).data
            return Response({
                'refresh': refresh,
                'access': access,
                'user': user_data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(instance=request.user, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save() 
            refresh = RefreshToken.for_user(request.user)
            return Response({
                "detail": "Password updated successfully",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class UserToggleActiveAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "Utilisateur non trouvé."}, status=status.HTTP_404_NOT_FOUND)
        user.is_active = not user.is_active
        user.save()
        status_str = "activé" if user.is_active else "désactivé"
        return Response({"detail": f"Compte {status_str} avec succès.", "is_active": user.is_active}, status=status.HTTP_200_OK)
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def put(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "Utilisateur introuvable."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ResetPasswordSerializer(instance=user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Mot de passe réinitialisé avec succès."},
                status=status.HTTP_200_OK
            )
        else:
            # Ajout pour renvoyer les erreurs de validation
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )


