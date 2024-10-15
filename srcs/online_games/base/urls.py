from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HealthView
from invites.views import GameInviteViewSet
from queues.views import QueueViewSet
from remote_games.views import GameViewSet

router = DefaultRouter()

router.register(r'invites', GameInviteViewSet)
router.register(r'queues', QueueViewSet)
router.register(r'games', GameViewSet)

urlpatterns = [
	path('health/', HealthView.as_view()),
	path('', include(router.urls)),
]
