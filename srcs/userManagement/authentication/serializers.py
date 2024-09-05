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
		
	def get_friend_list(self, obj):
		return obj.get_friends_data()
