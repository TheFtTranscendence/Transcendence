from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter , URLRouter
import os
from django.core.asgi import get_asgi_application
from chatApp import routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat.settings')

application = ProtocolTypeRouter(
    {
        "http" : get_asgi_application() , 
        "websocket" : AuthMiddlewareStack(
            URLRouter(
                routing.websocket_urlpatterns
            )    
        )
    }
)

ASGI_APPLICATION = 'chat.asgi.application'