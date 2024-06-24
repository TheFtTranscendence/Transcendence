from django.contrib.auth import authenticate, login
from .models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def login_view(request):
	if request.method == 'POST':
		try:
			data = json.loads(request.body)
			username = data.get('username')
			password = data.get('password')

			missing_fields = []
			if not username:
				missing_fields.append('username')
			if not password:
				missing_fields.append('password')

			if missing_fields:
				return JsonResponse({'message': 'All fields are required', 'missing_fields': missing_fields}, status=400)
			
			user = authenticate(request, username=username, password=password)
			if user is not None:
				login(request, user)
				return JsonResponse({'message': 'Login successful'}, status=200)
			else:
				return JsonResponse({'message': 'Invalid credentials'}, status=400)
			
		except json.JSONDecodeError as e:
			logger.exception(f'JSON decoding error: {str(e)}')
			return JsonResponse({'message': 'Invalid JSON'}, status=400)
		except Exception as e:
			logger.exception(f'Unexpected error: {str(e)}')
			return JsonResponse({'message': 'Internal server error'}, status=500)
	return JsonResponse({'message': 'Invalid request method'}, status=405)


@csrf_exempt
def register_view(request):
	if request.method == 'POST':
		try:
			data = json.loads(request.body)
			username = data.get('username')
			password = data.get('password')
			email = data.get('email')
			first_name = data.get('first_name')
			last_name = data.get('last_name')

			missing_fields = []
			if not username:
				missing_fields.append('username')
			if not password:
				missing_fields.append('password')
			if not email:
				missing_fields.append('email')
			if not first_name:
				missing_fields.append('first_name')
			if not last_name:
				missing_fields.append('last_name')

			if missing_fields:
				return JsonResponse({'message': 'All fields are required', 'missing_fields': missing_fields}, status=400)

			if User.objects.filter(username=username).exists():
				return JsonResponse({'message': 'Username already exists'}, status=409)

			user = User.objects.create_user(username=username,
											password=password,
											email=email,
											first_name=first_name,
											last_name=last_name)
			return JsonResponse({'message': 'Registration successful'}, status=201)
		
		except json.JSONDecodeError as e:
			logger.exception(f'JSON decoding error: {str(e)}')
			return JsonResponse({'message': 'Invalid JSON'}, status=400)
		except Exception as e:
			logger.exception(f'Unexpected error: {str(e)}')
			return JsonResponse({'message': 'Internal server error'}, status=500)
	
	# This should never appear to the user
	return JsonResponse({'message': 'Invalid request method'}, status=405)

