from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User
from django.contrib.auth.password_validation import validate_password

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'email','telephone','first_name','last_name', 'role','last_login','is_active']
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'password', 'email','telephone','first_name','last_name','role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        # pas de mot de passe ici : cette sortie est renvoyée au navigateur à la connexion
        fields = ['id','username', 'email','telephone','first_name','last_name','role']
class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('old_password', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError({"old_password": "Old password is not correct"})
        return value

    def update(self, instance, validated_data):
        user = self.context['request'].user 
        if user.id == instance.id: 
            user.set_password(validated_data['password'])
            user.save()
            return user
        else:
            raise serializers.ValidationError("You can only change your own password.")
class ResetPasswordSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    def update(self, instance, validated_data):
        instance.set_password(validated_data["password"])
        instance.save()
        return instance