from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, LoginView, RegisterView, TestTokenView
from rest_framework.authtoken.views import obtain_auth_token


router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
	path('login/', LoginView.as_view(), name='login'),
	path('register/', RegisterView.as_view(), name='register'),
	path('token/', obtain_auth_token, name='token'),
	path('test-token/', TestTokenView.as_view(), name='test-token'),
]
