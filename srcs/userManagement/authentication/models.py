from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
import requests
from rest_framework.response import Response
import logging
import os

logger = logging.getLogger(__name__)

class UserManager(BaseUserManager):
	def create_user(self, email, username, password=None, **extra_fields):
		if not email:
			raise ValueError(_('The Email field must be set'))
		if not username:
			raise ValueError(_('The Username field must be set'))
		
		email = self.normalize_email(email)
		
		preferences = Preferences.objects.create()

		user = self.model(email=email, username=username, preferences=preferences, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, username, password=None, **extra_fields):
		extra_fields.setdefault('staff', True)
		extra_fields.setdefault('superuser', True)

		if extra_fields.get('staff') is not True:
			raise ValueError(_('Superuser must have staff=True.'))
		if extra_fields.get('superuser') is not True:
			raise ValueError(_('Superuser must have superuser=True.'))

		return self.create_user(email, username, password, **extra_fields)

	
class Preferences(models.Model):
	pongy_skin = models.IntegerField(default=1)
	fighty_skin = models.IntegerField(default=1)

class User(AbstractBaseUser, PermissionsMixin):

	class	AlreadyFriends(Exception):
		pass

	class	AlreadyBlocked(Exception):
		pass

	def get_friends_data(self):
		friends = self.friend_list.all()
		friends_data = {}

		print(friends)
		for friend in friends:
			friend_name = friend.username
			json_payload = {
				"user1": self.username,
				"user2": friend_name
			}

			try:
				response = requests.post(f"http://chat:8002/chats/create_chat/", json=json_payload)
				response.raise_for_status()
				data = response.json()
			except requests.exceptions.RequestException as e:
				logger.info(f'API request failed: {e}')
				continue  

			except ValueError:
				logger.info('Invalid JSON in response')
				continue

			if data.get("user1") == self.username:
				unread_msgs = data.get("user1_unread_messages", 0)
			else:
				unread_msgs = data.get("user2_unread_messages", 0)

			friends_data[friend.username] = {
				"id": friend.id,
				"chat_id": data.get("id"),
				"unread_msgs": unread_msgs,
				"status": friend.online,
				"socket": None  # Placeholder for future socket info
			}

		return friends_data

	email = models.EmailField(_('email address'), unique=True)
	username = models.CharField(max_length=150, unique=True)
	blockchain_id = models.IntegerField(blank=True, null=True)

	avatar = models.ImageField(upload_to='', default='default.jpg', blank=True, null=True)
	
	friend_list = models.ManyToManyField('self', symmetrical=False, related_name='friend_of', blank=True)
	block_list = models.ManyToManyField('self', symmetrical=False, related_name='blocked_by', blank=True)

	staff = models.BooleanField(default=False)
	superuser = models.BooleanField(default=False)
	online = models.BooleanField(default=False)

	preferences = models.OneToOneField(Preferences, on_delete=models.CASCADE)

	objects = UserManager()

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = []

	def __str__(self):
		return self.username
