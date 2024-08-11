from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
	def create_user(self, email, username, password=None, **extra_fields):
		email = self.normalize_email(email)
		user = self.model(email=email, username=username, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, username, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)

		if extra_fields.get('is_staff') is not True:
			raise ValueError(_('Superuser must have is_staff=True.'))
		if extra_fields.get('is_superuser') is not True:
			raise ValueError(_('Superuser must have is_superuser=True.'))

		return self.create_user(email, username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
	email = models.EmailField(_('email address'), unique=True)
	username = models.CharField(max_length=150, unique=True)
	smartcontract_id = models.IntegerField(blank=True, null=True)
	avatar = models.ImageField(upload_to='images/', blank=True, null=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)
	friends = models.ManyToManyField('self', symmetrical=False, related_name='friend_of', blank=True)

	objects = UserManager()

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = []

	def __str__(self):
		return self.email

	def get_full_name(self):
		return self.username

	def get_short_name(self):
		return self.username
