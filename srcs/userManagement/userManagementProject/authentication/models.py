from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager, Group, Permission
from django.db import models
from django.utils import timezone

class customUserManager(UserManager):
	def _create_user(self, email, username, password, **extra_fields):
		if not email:
			raise ValueError('The Email field must be set')
		email = self.normalize_email(email)
		username = self.model.normalize_username(username)
		user = self.model(email=email, username=username, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_user(self, email, username=None, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', False)
		extra_fields.setdefault('is_superuser', False)
		return self._create_user(email, username, password, **extra_fields)

	def create_superuser(self, email, username=None, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
		if extra_fields.get('is_staff') is not True:
			raise ValueError('Superuser must have is_staff=True.')
		if extra_fields.get('is_superuser') is not True:
			raise ValueError('Superuser must have is_superuser=True.')
		return self._create_user(email, username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
	email = models.EmailField(unique=False)
	username = models.CharField(max_length=100, unique=True)

	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)

	# Smart Contract ID
	sc_id = models.IntegerField(unique=True, null=True, blank=True)

	avatar = models.ImageField(default='default.jpg', upload_to='')

	friends = models.ManyToManyField(
		'self',
		blank=True,
		verbose_name='friends'
	)

	objects = customUserManager()

	USERNAME_FIELD = 'username'
	EMAIL_FIELD = 'email'
	REQUIRED_FIELDS = ['email']

	class Meta:
		verbose_name = 'User'
		verbose_name_plural = 'Users'
