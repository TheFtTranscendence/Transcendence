from rest_framework import serializers
from .models import User, Preferences

class PreferencesSerializer(serializers.ModelSerializer):
	class Meta:
		model = Preferences
		fields = ['pongy_skin', 'fighty_skin']
		
class UserSerializer(serializers.ModelSerializer):
	preferences = PreferencesSerializer()

	class Meta:
		model = User
		fields = ['id', 'email', 'username', 'blockchain_id', 'avatar', 'staff', 'superuser', 'friend_list', 'block_list', 'online', 'preferences']
		

