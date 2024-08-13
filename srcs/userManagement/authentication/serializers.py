from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'smartcontract_id', 'avatar', 'is_staff', 'is_superuser', 'friends', 'online_status']
        read_only_fields = ['id', 'is_staff', 'is_superuser']

