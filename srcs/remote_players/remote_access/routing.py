from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/remote_access/(?P<game_id>\w+)/$', consumers.GameConsumer.as_asgi()),
    re_path(r'ws/queue/(?P<user_id>\w+)/(?P<game>\w+)/$', consumers.QueueConsumer.as_asgi()),
]
