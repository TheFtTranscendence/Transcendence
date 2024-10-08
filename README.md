# Transcendence

## Summmary

Transendence is the final project of the 42 Common Core and compromizes of the following aspects:

- single page application with a pong-game, tournaments, authentication and chats
- must be launched with a single command using Docker
- Frontend with vanilla Javascrpit (for now)
- Backend with Django
- Database with PostgreSQL
- Blockchain storing tournament scores, written with Solidity on the Ethereum Blockchain

## Contributors
This is group project of a project of:

- [ddantas42](https://github.com/ddantas42)
- [lopjf](https://github.com/lopjf)
- [esali](https://github.com/emSali)
- [courinha](https://github.com/Courinha768)
- [tiago](https://github.com/tpereira22)

.env setup
- POSTGRES_DATA_PATH: A directory where the volume of the database will be stored and persist. (create a directory on your machine and add its path to this variable).
- POSTGRES_DB: The database name (anything will work)
- POSTGRES_USER: Your username (anything will work)
- POSTGRES_PASSWORD: Your password (anything will work)
- POSTGRES_HOST: The database docker service name. It should match the service name in docker-compose.yml. In our case it is 'db'.
- POSTGRES_PORT: Default postgres port is 5432. It needs to be set to 5432.
- PRIVATE_KEY: The owner wallet private key.

Commands:

- 'make' to start the containers.
- 'make clean' to stop and remove the images and containers.
- 'make deepclean' to delete all docker related containers, images, network from your system.

# User Management API

#### Introduction

One Paragraph of project description goes here

### Support Features

* Users can signup and login to their account
* Authenticated users can costumize their account
* Users can add friends with friend requests

### Users
This endpoints will allow as to manage the users, everything related to the **User** model, this end points are designed with the **Rest Framework**, it uses the user model available in **/authentication/models.py**.
Because this is a user model and **Django** already has a lot of things to work with users the User model also needs a **UserManager**.

**User Model**
```py
class User(AbstractBaseUser, PermissionsMixin):
	email = models.EmailField(_('email address'), unique=True)
	username = models.CharField(max_length=150, unique=True)
	smartcontract_id = models.IntegerField(blank=True, null=True)
	avatar = models.ImageField(upload_to='images/', blank=True, null=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)
	friends = models.ManyToManyField('self', symmetrical=False, related_name='friend_of', blank=True)
	online_status = models.BooleanField(default=False)

	objects = UserManager()
```
Here we can see all of the **User**'s fields, such as the email, the username, an Id that identifies the user in the blockchain, an avatar, two boleans to check if the user is staff and if it is a superuser, a list of friends and a boolean to check if the user is online.

**User Manager**
```py
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
```
This class allows us to create users and create superusers already using the function implemented in **Django** to do this things.

**Serializer**
Django serializers allow us to convert complex data types like querysets and model instances into Python data types that can be easily rendered into JSON, XML, or other content types.
```py
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'smartcontract_id', 'avatar', 'is_staff', 'is_superuser', 'friends', 'online_status']
        read_only_fields = ['id', 'is_staff', 'is_superuser']
```

**ViewSet**
Because we are using **Rest framwork** we can just create a **viewset** to handel this model's throw certain **endpoints**
```py
class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [AllowAny]
```

**Endpoints**
Since we have the viewsets we can now add this code to our **urls.py**
```py
router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
	path('', include(router.urls)),
]
```
too allow us the following actions



| Method | Endpoints | Action |
| --- | --- | --- |
| <span style="background-color: #6a6196; padding: 3px 8px; border-radius: 4px; color: white">GET</span> | /auth/users/ | To retrieve a list of all users |
| <span style="background-color: #557e2c; padding: 3px 8px; border-radius: 4px; color: white">POST</span> | /auth/users/ | To create a new user |
| <span style="background-color: #6a6196; padding: 3px 8px; border-radius: 4px; color: white">GET</span> | /auth/users/&lt;int:id>/ | To retrieve a specific user by its id |
| <span style="background-color: #9a672a; padding: 3px 8px; border-radius: 4px; color: white">PUT</span> | /auth/users/&lt;int:id>/ | To edit everything on a user |
| <span style="background-color: #FFA500; padding: 3px 8px; border-radius: 4px; color: white">PATCH</span> | /auth/users/&lt;int:id>/ | To edit the details of a single user |
| <span style="background-color: #FF4500; padding: 3px 8px; border-radius: 4px; color: white">DELETE</span> | /auth/users/&lt;int:id>/ | To delete a single user |

**Login and Register View**
To allow the user to login and register we created the following views.
```py
class LoginView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		data = request.data
		username = data.get('username')
		password = data.get('password')

		if not username or not password:
			return Response({'message': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
		else:
			return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		data = request.data
		email = data.get('email')
		username = data.get('username')
		password = data.get('password')
		confirm_password = data.get('confirm_password')

		if not email or not username or not password or not confirm_password:
			return Response({'message': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

		if password != confirm_password:
			return Response({'message': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

		try:
			user = UserService.create_user(username, password, email)
			user.smartcontract_id = UserService.get_smartcontract_id()
			user.save()

			serializer = UserSerializer(user)
			return Response({'message': 'Registration successful', 'user': serializer.data}, status=status.HTTP_201_CREATED)
		except ValueError as e:
			return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			logger.exception("Unexpected error during registration: %s", e)
			return Response({'message': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

and by adding to the **urls.py** the corresponding paths we can now login and register users
```py
urlpatterns = [
	path('login/', LoginView.as_view(), name='login'),
	path('register/', RegisterView.as_view(), name='register'),
]
```

| Method | Endpoints | Action |
| --- | --- | --- |
| <span style="background-color: #557e2c; padding: 3px 8px; border-radius: 4px; color: white">POST</span> | /auth/login/ | To login |
| <span style="background-color: #557e2c; padding: 3px 8px; border-radius: 4px; color: white">POST</span> | /auth/register/ | To register a new user |
