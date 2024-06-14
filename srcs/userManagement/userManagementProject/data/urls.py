from django.urls import path
from .views import userInfo_view

urlpatterns = [
	path('user_info/<str:username>/', userInfo_view),
	#later I will add things like match history and permissions
]