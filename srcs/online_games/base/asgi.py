import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

from invites import routing as invites_routing
from queues import routing as queues_routing
from remote_games import routing as games_routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'base.settings')

application = ProtocolTypeRouter({
	"http": get_asgi_application(),
	"websocket": AllowedHostsOriginValidator(
		AuthMiddlewareStack(
			URLRouter(
				invites_routing.websocket_urlpatterns +
				queues_routing.websocket_urlpatterns +
				games_routing.websocket_urlpatterns
			)
		)
	),
})