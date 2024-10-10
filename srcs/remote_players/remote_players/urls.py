from django.contrib import admin
from django.urls import path, include
from .views import HealthView


urlpatterns = [
    path('admin/', admin.site.urls),
	path('', include('remote_access.urls')),
	path('health/', HealthView.as_view()),

]
