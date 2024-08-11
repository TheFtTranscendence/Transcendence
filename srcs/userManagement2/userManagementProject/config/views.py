from django.shortcuts import render
from authentication.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging
from django.contrib.auth import authenticate

logger = logging.getLogger(__name__)

@csrf_exempt
def rename(request, username):
	if request.method == 'PUT':
		try:
			# Get information from the json file
			data = json.loads(request.body)
			new_username = data.get('new_username')
			
			# Check if any fields are missing from the json file
			if not new_username:
				return JsonResponse("New username not provided.", status=400)
			
			# Check if the username doens't exist already
			if User.objects.filter(username=new_username).exists():
				return JsonResponse({'message': 'Username already exists'}, status=409)
			
			# Fetch user from his username
			user = User.objects.get(username=username)

			# Change user's username for the new username
			user.username = new_username
			user.save()
			
			logger.info(f'User {username} changed his username to {new_username}')
			return JsonResponse({"message": "Username updated successfully."}, status=200)
			
		except User.DoesNotExist:
			logger.exception(f'Attempt to rename user {username} but user doesn\'t exist')
			return JsonResponse({"error": "User not found."}, status=404)
		except json.JSONDecodeError as e:
			logger.exception(f'JSON decoding error: {str(e)}')
			return JsonResponse({'message': 'Invalid JSON'}, status=401)
		except Exception as e:
			logger.exception(f'Unexpected error: {str(e)}')
			return JsonResponse({'message': 'Internal server error'}, status=500)
		
	logger.debug(f'Invalid request method! Correct method is \'PUT\'')
	return JsonResponse({'message': 'Invalid request method'}, status=405)
	
@csrf_exempt
def change_password(request, username):
	if request.method == 'PUT':
		try:
			# Get information from the json file
			data = json.loads(request.body)
			old_password = data.get('old_password')
			new_password = data.get('new_password')
			confirm_new_password = data.get('confirm_new_password')

			# Check if any fields are missing from the json file
			missing_fields = []
			if not old_password:
				missing_fields.append('old_password')
			elif not new_password:
				missing_fields.append('new_password')
			elif not confirm_new_password:
				missing_fields.append('confirm_new_password')
			if missing_fields:
				return JsonResponse({'message': 'All fields are required', 'missing_fields': missing_fields}, status=450)
			
			# Check if passwords match
			if new_password != confirm_new_password:
				return JsonResponse({'message': 'Passwords are different'}, status=409)
			
			# Fetch user from his username
			user = User.objects.get(username=username)

			# Check if the old password is correct
			user = authenticate(request, username=username, password=old_password)
			if user is None:
				return JsonResponse({'message': 'Old password is incorrect'}, status=400)
			
			# Apply the new password
			user.set_password(new_password)
			user.save()

			logger.info(f'User {username} sucessfully changed his password')
			return JsonResponse({"message": "Password updated successfully."}, status=200)
			
		except User.DoesNotExist:
			logger.exception(f'Attempt to change user {username} password but user doesn\'t exist')
			return JsonResponse({"error": "User not found."}, status=404)
		except json.JSONDecodeError as e:
			logger.exception(f'JSON decoding error: {str(e)}')
			return JsonResponse({'message': 'Invalid JSON'}, status=401)
		except Exception as e:
			logger.exception(f'Unexpected error: {str(e)}')
			return JsonResponse({'message': 'Internal server error'}, status=500)

	logger.debug(f'Invalid request method! Correct method is \'PUT\'')
	return JsonResponse({'message': 'Invalid request method'}, status=405)

@csrf_exempt
def add_friend(request, username_1, username_2):
	if request.method == 'PUT':
		try:
			# Fetch both users from their usernames
			user_1 = User.objects.get(username=username_1)
			user_2 = User.objects.get(username=username_2)

			# Make sure they arent friends already
			if user_1.friends.filter(username=username_2).exists():
				return JsonResponse({"error": "Users are already friends."}, status=404)

			# Add them to the others friend list
			user_1.friends.add(user_2)
			user_2.friends.add(user_1)

			return JsonResponse({"message": "Friend added successfully."}, status=200)
		
		except User.DoesNotExist:
			logger.exception(f'Attempt to add user {username_1} and {username_2} as friends but user doesn\'t exist')
			return JsonResponse({"error": "User not found."}, status=400)
		except Exception as e:
			logger.exception(f'Unexpected error: {str(e)}')
			return JsonResponse({'message': 'Internal server error'}, status=500)
		
	logger.debug(f'Invalid request method! Correct method is \'POST\'')		
	return JsonResponse({'message': 'Invalid request method'}, status=405)
	
@csrf_exempt	
def remove_friend(request, username_1, username_2):
	if request.method == 'PUT':
		try:
			# Fetch both users from their usernames
			user_1 = User.objects.get(username=username_1)
			user_2 = User.objects.get(username=username_2)

			# Make sure they are friends
			if not user_1.friends.filter(username=username_2).exists():
				return JsonResponse({"error": "Users aren't friends."}, status=404)

			# Add them to the others friend list
			user_1.friends.remove(user_2)
			user_2.friends.remove(user_1)

			return JsonResponse({"message": "Friend removed successfully."}, status=200)
		
		except User.DoesNotExist:
			logger.exception(f'Attempt to remove user {username_1} and {username_2} from friends but user doesn\'t exist')
			return JsonResponse({"error": "User not found."}, status=400)
		except Exception as e:
			logger.exception(f'Unexpected error: {str(e)}')
			return JsonResponse({'message': 'Internal server error'}, status=500)
		
	logger.debug(f'Invalid request method! Correct method is \'DELETE\'')
	return JsonResponse({'message': 'Invalid request method'}, status=405)
	
@csrf_exempt	
def change_avatar(request, username):
	if request.method == 'PUT':

		# Check if a file has been given
		if request.FILES['file']:

			try:
				# Fetch user from his username
				user = User.objects.get(username=username)

				# Fetch file
				file = request.FILES['file']

				# Change user's avatar
				user.avatar = file
				user.save()

				return JsonResponse({"message": "Image uploaded successfully."}, status=200)
			
			except User.DoesNotExist:
				logger.exception(f'Attempt to change user {username} avatar but user doesn\'t exist')
				return JsonResponse({"error": "User not found."}, status=400)
			except Exception as e:
				logger.exception(f'Unexpected error: {str(e)}')
				return JsonResponse({'message': 'Internal server error'}, status=500)
			
		logger.debug(f'Attempt to change user {username} avatar but no file provided')
		return JsonResponse({'message': 'No file provided'}, status=401)
		
	logger.debug(f'Invalid request method! Correct method is \'POST\'')
	return JsonResponse({'message': 'Invalid request method'}, status=405)
