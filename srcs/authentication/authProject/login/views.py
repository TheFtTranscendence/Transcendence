from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

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
			print(f'JSON decoding error: {str(e)}')
			return JsonResponse({'message': 'Invalid JSON'}, status=400)
		except Exception as e:
			print(f'Unexpected error: {str(e)}')
			return JsonResponse({'message': 'Internal server error'}, status=500)
	return JsonResponse({'message': 'Invalid request method'}, status=405)
