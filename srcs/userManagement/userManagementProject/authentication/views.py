from django.contrib.auth import authenticate, login
from .models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging
import requests

logger = logging.getLogger(__name__)

@csrf_exempt
def login_view(request):
	if request.method == 'POST':
		try:
			# Get information from the json file
			data = json.loads(request.body)
			username = data.get('username')
			password = data.get('password')

			# Check if any fields are missing from the json file
			missing_fields = []
			if not username:
				missing_fields.append('username')
			if not password:
				missing_fields.append('password')
			if missing_fields:
				return JsonResponse({'message': 'All fields are required', 'missing_fields': missing_fields}, status=450)
			
			# Attempt to authenticate the user
			user = authenticate(request, username=username, password=password)
			logger.info(f'User {username} is attempting to login')
			if user is not None:
				login(request, user)
				logger.info(f'User {username} was able to login')
				return JsonResponse({'message': 'Login successful'}, status=200)
			else:
				logger.info(f'User {username} was not able to login')
				return JsonResponse({'message': 'Invalid credentials'}, status=400)
			
		except json.JSONDecodeError as e:
			logger.exception(f'JSON decoding error: {str(e)}')
			return JsonResponse({'message': 'Invalid JSON'}, status=401)
		except Exception as e:
			logger.exception(f'Unexpected error: {str(e)}')
			return JsonResponse({'message': 'Internal server error'}, status=500)
		
	logger.exception(f'Invalid request method! Correct method is \'POST\'')
	return JsonResponse({'message': 'Invalid request method'}, status=405)


@csrf_exempt
def register_view(request):
	if request.method == 'POST':
		try:
			# Get information from the json file
			data = json.loads(request.body)
			email = data.get('email')
			username = data.get('username')
			password = data.get('password')
			confirm_password = data.get('confirm_password')

			# Check if any fields are missing from the json file
			missing_fields = []
			if not email:
				missing_fields.append('email')
			if not username:
				missing_fields.append('username')
			if not password:
				missing_fields.append('password')
			if not confirm_password:
				missing_fields.append('confirm_password')
			if missing_fields:
				return JsonResponse({'message': 'All fields are required', 'missing_fields': missing_fields}, status=450)

			# Check if the passwords match
			if password != confirm_password:
				return JsonResponse({'message': 'Passwords are different'}, status=409)
			
			# Check if the username is valid
			if User.objects.filter(username=username).exists():
				return JsonResponse({'message': 'Username already exists'}, status=400)

			# Register the user
			user = User.objects.create_user(username=username,
											password=password,
											email=email)
			try:
				response = requests.post('http://solidity:8001/solidity/addinstance/')
				response.raise_for_status() # Raises exceptions for http errors
				
				data = response.json()
				number = data.get('success')
				user.sc_id = number
				logger.exception(f'HERE: {user.sc_id}')
				user.save()

			except requests.exceptions.HTTPError as e:
				logger.exception(f'Solidity: Unexpected HTTP error: {str(e)}')
				return JsonResponse({'message': str(e)}, status=e.response.status_code)
			except requests.exceptions.RequestException as e:
				logger.exception(f'Solidity: Unexpected request error: {str(e)}')
				return JsonResponse({'message': str(e)}, status=500)
			except Exception as e:
				logger.exception(f'Solidity: Unexpected error: {str(e)}')
				return JsonResponse({'message': 'Internal server error'}, status=500)
			
			logger.info(f'User {username} just registered')
			return JsonResponse({'message': 'Registration successful'}, status=201)
		
		except json.JSONDecodeError as e:
			logger.exception(f'JSON decoding error: {str(e)}')
			return JsonResponse({'message': 'Invalid JSON'}, status=401)
		except Exception as e:
			logger.exception(f'Unexpected error: {str(e)}')
			return JsonResponse({'message': 'Internal server error'}, status=500)
		
	logger.exception(f'Invalid request method! Correct method is \'POST\'')
	return JsonResponse({'message': 'Invalid request method'}, status=405)

