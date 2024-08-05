from django.urls import path
from .views import chatPage

urlpatterns = [
	path('', chatPage),
]