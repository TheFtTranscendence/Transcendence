from django.contrib.auth import authenticate, login, logout
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
import logging
import requests
from .serializers import UserSerializer
from .models import User

logger = logging.getLogger(__name__)

class TestTokenView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		return Response({'message': 'Token is valid'})

class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [IsAuthenticated]

	def list(self, request, *args, **kwargs):
		user = request.user
		
		if user.staff:
			queryset = self.get_queryset()
			serializer = self.get_serializer(queryset, many=True)
			return Response(serializer.data)
		
		serializer = self.get_serializer(user)
		return Response(serializer.data)

	def destroy(self, request, *args, **kwargs):
		user_id = kwargs.get('pk')
		current_user = request.user

		if user_id:
			user_to_delete = self.get_object()
			if user_to_delete != current_user and not current_user.is_staff:
				return Response({'message': 'You do not have permission to delete this user.'}, status=status.HTTP_400_BAD_REQUEST)
		else:
			user_to_delete = current_user

		if user_to_delete == current_user:
			Token.objects.filter(user=current_user).delete()

		self.perform_destroy(user_to_delete)
		
		if user_to_delete == current_user:
			return Response({'message': 'Your account has been deleted and you have been logged out'}, status=status.HTTP_204_NO_CONTENT)
		else :
			return Response({'message': f'User {user_to_delete.username} has been deleted'}, status=status.HTTP_204_NO_CONTENT)
		
	def partial_update(self, request, *args, **kwargs):
		user_id = kwargs.get('pk')
		current_user = request.user

		if user_id:
			user_to_update = self.get_object()
			if user_to_update != current_user and not current_user.is_staff:
				return Response({'message': 'You do not have permission to update this user.'}, status=status.HTTP_400_BAD_REQUEST)
		else:
			user_to_update = current_user

		password = request.data.get('password')
		confirm_password = request.data.get('confirm_password')

		if password:
			if confirm_password and password != confirm_password:
				return Response({'message': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
			
			user_to_update.set_password(password)
			user_to_update.save()

			# Clear the request data to prevent the password from being serialized
			request.data._mutable = True
			request.data.pop('password', None)
			request.data.pop('confirm_password', None)
			request.data._mutable = False

		new_username = request.data.get('username', None)


		if new_username and new_username != current_user.username:
			if User.objects.filter(username=new_username).exists():
				return Response({'message': 'Username is already in use'}, status=status.HTTP_400_BAD_REQUEST)
			friends = user_to_update.friend_list.all()

			for friend in friends:
				json_payload = {
					"user1": current_user.username,
					"user2": friend.username
				}
				try:
					response = requests.post("http://chat:8002/chats/create_chat/", json=json_payload)
					response.raise_for_status()
					data = response.json()
					logger.info(data)
				except requests.exceptions.RequestException as e:
					logger.info(f'API request failed: {e}')
					continue
				except ValueError:
					logger.info('Invalid JSON in response')
					continue

				chat_id = data.get("id")
				if data.get("user1") == user_to_update.username:
					json_payload = {
						"user1": new_username
					}
				else:
					json_payload = {
						"user2": new_username
					}
				try:
					response = requests.patch("http://chat:8002/chats/" + str(chat_id) + "/", json=json_payload)
					response.raise_for_status()
				except requests.exceptions.RequestException as e:
					logger.info(f'API request failed: {e}')
					continue

			user_to_update.username = new_username
			user_to_update.save()

		serializer = self.get_serializer(user_to_update, data=request.data, partial=True)
		serializer.is_valid(raise_exception=True)
		serializer.save()

		if user_to_update == current_user:
			return Response({'message': f'User {user_to_update.username} has been updated', 'user': serializer.data})
		else:
			return Response({'message': 'Your information has been updated', 'user': serializer.data})
		
	@action(detail=False, methods=['get'], url_path='me')
	def get_self_info(self, request):
		user = request.user
		serializer = self.get_serializer(user)
		return Response(serializer.data)
	
	@action(detail=False, methods=['get'], url_path='get_info/<str:username>')
	def get_user_info(self, request, username):
		user = User.objects.filter(username=username)
		serializer = self.get_serializer(user)

		fields_to_remove = ['email', 'blockchain_id', 'is_staff', 'is_superuser', 'friend_list', 'block_list']
		for field in fields_to_remove:
			serializer.data.pop(field, None)

		return Response(serializer.data)



class UserService:
	@staticmethod
	def create_user(username, password, email):
		if User.objects.filter(username=username).exists():
			raise ValueError("Username already exists")
		return User.objects.create_user(username=username, password=password, email=email)

	@staticmethod
	def get_blockchain_id():
		try:
			response = requests.post('http://solidity:8001/solidity/addinstance/')
			response.raise_for_status()
			data = response.json()
			return data.get('success')
		except requests.exceptions.RequestException as e:
			logger.exception("Error while fetching blockchain ID: %s", e)
			raise ValueError("Error fetching blockchain ID") from e

class LoginView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		data = request.data
		username = data.get('username')
		password = data.get('password')

		missing_fields = []
		if not username:
			missing_fields.append('username')
		if not password:
			missing_fields.append('password')
		if not username or not password:
			return Response({'message': 'All fields are required', 'missing_fields': missing_fields}, status=status.HTTP_400_BAD_REQUEST)

		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			token, created = Token.objects.get_or_create(user=user)
			return Response({'message': 'Login successful', 'token': token.key}, status=status.HTTP_200_OK)
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

		missing_fields = []
		if not email:
			missing_fields.append('email')
		if not username:
			missing_fields.append('username')
		if not password:
			missing_fields.append('password')
		if not confirm_password:
			missing_fields.append('confirm_password')
		if not email or not username or not password or not confirm_password:
			return Response({'message': 'All fields are required', 'missing_fields': missing_fields}, status=status.HTTP_400_BAD_REQUEST)

		if password != confirm_password:
			return Response({'message': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

		if User.objects.filter(email=email).exists():
			return Response({'message': 'Email is already in use'}, status=status.HTTP_400_BAD_REQUEST)

		if User.objects.filter(username=username).exists():
			return Response({'message': 'Username is already in use'}, status=status.HTTP_400_BAD_REQUEST)

		try:
			user = UserService.create_user(username, password, email)
			user.blockchain_id = UserService.get_blockchain_id()
			user.save()

			token, created = Token.objects.get_or_create(user=user)

			return Response({'message': 'Registration successful', 'token': token.key}, status=status.HTTP_201_CREATED)
		except ValueError as e:
			return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			logger.exception("Unexpected error during registration: %s", e)
			return Response({'message': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
