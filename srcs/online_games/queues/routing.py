from django.urls import path
from . import consumers

websocket_urlpatterns = [
	path('ws/queues/<str:game_name>/<int:game_size>/', consumers.GameQueueConsumer.as_asgi()),
]