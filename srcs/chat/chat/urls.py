from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
	path('admin/', admin.site.urls),
	path('', include('chatApp.urls')),
	path('test/', TemplateView.as_view(template_name='chatApp/index.html'), name='test_page'),
]
