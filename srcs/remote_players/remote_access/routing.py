from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/remote_access/(?P<game_id>\w+)/$', consumers.GameConsumer.as_asgi()),
]
