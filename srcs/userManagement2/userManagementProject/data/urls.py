from django.urls import path
from .views import userInfo_view, all_users_info, get_friend_list, get_user_avatar

urlpatterns = [
	path('user_info/<str:username>/', userInfo_view),
	path('friends/<str:username>/', get_friend_list),
	path('users', all_users_info),
	path('avatar/<str:username>/', get_user_avatar)
]