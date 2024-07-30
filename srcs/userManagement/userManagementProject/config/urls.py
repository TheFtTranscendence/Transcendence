from django.urls import path
from .views import rename, change_password, add_friend, remove_friend, change_avatar

urlpatterns = [
	path('rename/<str:username>/', rename),
	path('change_password/<str:username>/', change_password),
	path('add_friend/<str:username_1>/<str:username_2>/', add_friend),
	path('remove_friend/<str:username_1>/<str:username_2>/', remove_friend),
	path('change_avatar/<str:username>/', change_avatar),
]