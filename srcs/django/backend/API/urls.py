from django.urls import path
from .views import UserList, UserDetail

urlpatterns = [
	path('User', UserList.as_view()),
	path('User/<int:pk>', UserDetail.as_view()),
]