from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FriendRequestViewSet
from rest_framework.authtoken.views import obtain_auth_token


router = DefaultRouter()
router.register(r'FriendRequests', FriendRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
