from django.urls import path
from . import consumers

websocket_urlpatterns = [
	path('ws/remote_access/', consumers.GameConsumer.as_asgi()),
	path('ws/queue/', consumers.QueueConsumer.as_asgi()),
]
