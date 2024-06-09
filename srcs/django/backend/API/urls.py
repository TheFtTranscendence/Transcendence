from django.urls import path
from .views import UserList, UserDetail, login_view

urlpatterns = [
	path('User', UserList.as_view()),
	path('User/<int:pk>', UserDetail.as_view()),
	path('loginUser', login_view)
]