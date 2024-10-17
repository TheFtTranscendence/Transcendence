from django.urls import path
from . import consumers

websocket_urlpatterns = [
	path('ws/games/<int:id>/', consumers.GameConsumer.as_asgi()),
]