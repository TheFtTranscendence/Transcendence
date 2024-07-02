from django.shortcuts import render
# from django.contrib.auth.models import User
from authentication.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging

logger = logging.getLogger(__name__)

# Create your views here.
@csrf_exempt
def userInfo_view(request, username):
	if request.method == 'POST':
		try:
			user = User.objects.get(username=username)
			user_data = {
				'username': user.username,
            	'email': user.email,
            	'first_name': user.first_name,
            	'last_name': user.last_name,
			}
			return JsonResponse(user_data)

		except User.DoesNotExist:
			return JsonResponse({'message': 'Invalid user'}, status=400)
		except Exception as e:
			logger.exception(f'Unexpected error: {str(e)}')
			return JsonResponse({'message': 'Internal server error'}, status=500)
	return JsonResponse({'message': 'Invalid request method'}, status=405)
	
