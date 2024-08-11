from django.contrib import admin
from .models import User
from django.contrib.auth.models import User as DefaultUser
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register your models here.
admin.site.register(User)
# admin.site.unregister(DefaultUser)