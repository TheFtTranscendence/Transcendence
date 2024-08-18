import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from remote_access import routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'remote_players.settings')

application = ProtocolTypeRouter({
	"http": get_asgi_application(),
	"websocket": AllowedHostsOriginValidator(
		AuthMiddlewareStack(
			URLRouter(
				routing.websocket_urlpatterns
			)
		)
	),
})
