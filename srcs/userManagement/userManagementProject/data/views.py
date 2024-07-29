from django.shortcuts import render
# from django.contrib.auth.models import User
from authentication.models import User
from django.http import JsonResponse
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
import json
import logging

logger = logging.getLogger(__name__)

# Create your views here.
@csrf_exempt
def userInfo_view(request, username):
	if request.method == 'GET':
		try:
			# Fetch user from his username
			user = User.objects.get(username=username)

			# Create a list with his info
			user_data = {
				'username': user.username,
				'email': user.email,
				'sc_id': user.sc_id,
			}

			return JsonResponse(user_data, status=200)

		except User.DoesNotExist:
			logger.exception(f'Attempt to fetch user {username} information but user doesn\'t exist')
			return JsonResponse({'message': 'Invalid user'}, status=400)
		except Exception as e:
			logger.exception(f'Unexpected error: {str(e)}')
			return JsonResponse({'message': 'Internal server error'}, status=500)
		
	logger.debug(f'Invalid request method! Correct method is \'GET\'')
	return JsonResponse({'message': 'Invalid request method'}, status=405)
	
@csrf_exempt
def all_users_info(request):
	if request.method == 'GET':
		try:
			# Request all users usernames
			users = User.objects.all().values_list('username', flat=True)

			# Transform that info into a list
			users_list = list(users)

			return JsonResponse({"users": users_list}, status=200)
		
		except Exception as e:
			logger.exception(f'Unexpected error: {str(e)}')
			return JsonResponse({'message': 'Internal server error'}, status=500)
		
	logger.debug(f'Invalid request method! Correct method is \'GET\'')
	return JsonResponse({'message': 'Invalid request method'}, status=405)

@csrf_exempt
def get_friend_list(request, username):
	if request.method == 'GET':
		try:

			# Fetch user from his username
			user = User.objects.get(username=username)

			# Get user's friend list and transform it into a python list
			friend_list = list(user.friends.values_list('username', flat=True))

			return JsonResponse({"friends": friend_list}, status=200)
		
		except User.DoesNotExist:
			logger.exception(f'Attempt to fetch user {username} friend list but user doesn\'t exist')
			return JsonResponse({'message': 'Invalid user'}, status=400)
		except Exception as e:
			logger.exception(f'Unexpected error: {str(e)}')
			return JsonResponse({'message': 'Internal server error'}, status=500)
		
	logger.debug(f'Invalid request method! Correct method is \'GET\'')
	return JsonResponse({'message': 'Invalid request method'}, status=405)
	
@csrf_exempt
def get_user_avatar(request, username):
	if request.method == 'GET':
		try:
			# Fetch user from his username
			user = User.objects.get(username=username)

			#TODO: Temporary, for now its just rendering the image but it should return it somehow
			return render(request, 'view_image.html', {'user': user})
		
		except User.DoesNotExist:
			logger.exception(f'Attempt to fetch user {username} avatar but user doesn\'t exist')
			return JsonResponse({'message': 'Invalid user'}, status=400)
		except Exception as e:
			logger.exception(f'Unexpected error: {str(e)}')
			return JsonResponse({'message': 'Internal server error'}, status=500)
		
	logger.debug(f'Invalid request method! Correct method is \'GET\'')
	return JsonResponse({'message': 'Invalid request method'}, status=405)
