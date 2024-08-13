from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .serializers import UserSerializer
from friends.serializers import FriendRequestSerializer
from .models import User
import logging
import json
import requests

logger = logging.getLogger(__name__)

class TestTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'Token is valid'})

class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [AllowAny]

class UserService:
	@staticmethod
	def create_user(username, password, email):
		if User.objects.filter(username=username).exists():
			raise ValueError("Username already exists")
		return User.objects.create_user(username=username, password=password, email=email)

	@staticmethod
	def get_smartcontract_id():
		try:
			response = requests.post('http://solidity:8001/solidity/addinstance/')
			response.raise_for_status()
			data = response.json()
			return data.get('success')
		except requests.exceptions.RequestException as e:
			logger.exception("Error while fetching smartcontract ID: %s", e)
			raise ValueError("Error fetching smartcontract ID") from e


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

