from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

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

	email = models.EmailField(_('email address'), unique=True)
	username = models.CharField(max_length=150, unique=True)
	blockchain_id = models.IntegerField(blank=True, null=True)

	# todo: add default
	avatar = models.ImageField(upload_to='images/', blank=True, null=True)
	
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
