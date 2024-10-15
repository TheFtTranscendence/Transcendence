from rest_framework import serializers
from .models import User, Preferences
import logging


logger = logging.getLogger(__name__)

class PreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preferences
        fields = ['pongy_skin', 'fighty_skin']

class UserSerializer(serializers.ModelSerializer):
    preferences = PreferencesSerializer()
    friend_list = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'blockchain_id', 'avatar', 'staff', 'superuser', 'friend_list', 'block_list', 'online', 'preferences']

    def update(self, instance, validated_data):
        preferences_data = validated_data.pop('preferences', None)

        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        instance.blockchain_id = validated_data.get('blockchain_id', instance.blockchain_id)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.staff = validated_data.get('staff', instance.staff)
        instance.superuser = validated_data.get('superuser', instance.superuser)
        instance.online = validated_data.get('online', instance.online)
        instance.save()

        if preferences_data:
            preferences_instance = instance.preferences

            preferences_instance.pongy_skin = preferences_data.get('pongy_skin', preferences_instance.pongy_skin)
            preferences_instance.fighty_skin = preferences_data.get('fighty_skin', preferences_instance.fighty_skin)
            preferences_instance.save()

        return instance

    def get_friend_list(self, obj):
        return obj.get_friends_data()

