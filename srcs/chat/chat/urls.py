from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from .views import HealthView

urlpatterns = [
	path('admin/', admin.site.urls),
	path('', include('chatApp.urls')),
	path('health/', HealthView.as_view(), name='health')
]
