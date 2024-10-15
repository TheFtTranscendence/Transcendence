from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-qgj(h@)41_o0%#8cow3#d#2q0f9hq@y=t&0g+1===nv(@awd%z'
DEBUG = True
ALLOWED_HOSTS = ['*']

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

ASGI_APPLICATION = 'base.asgi.application'
WSGI_APPLICATION = 'base.wsgi.application'
ROOT_URLCONF = 'base.urls'

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SECURE_SSL_REDIRECT = False
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

INSTALLED_APPS = [
	'daphne',

	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',

	'corsheaders',
	'rest_framework',
	'rest_framework.authtoken',
	'channels',

	'invites',
	'queues',
	'remote_games',
	# 'tournaments',
	'base'
]

MIDDLEWARE = [
	'corsheaders.middleware.CorsMiddleware',
	'django.middleware.security.SecurityMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'DIRS': [],
		'APP_DIRS': True,
		'OPTIONS': {
			'context_processors': [
				'django.template.context_processors.debug',
				'django.template.context_processors.request',
				'django.contrib.auth.context_processors.auth',
				'django.contrib.messages.context_processors.messages',
			],
		},
	},
]

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.postgresql',
		'NAME': os.environ.get('REMOTE_PLAYERS_DATA_DB'),
		'USER': os.environ.get('POSTGRES_USER'),
		'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
		'HOST': os.environ.get('POSTGRES_HOST'),
		'PORT': os.environ.get('POSTGRES_PORT'),
	}
}

AUTH_PASSWORD_VALIDATORS = [
	{	'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'	},
	{	'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'		    },
	{	'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'			},
	{	'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'			},
]

LOGGING = {
	'version': 1,
	'handlers': {
		'console': {
			'level': 'INFO',
			'class': 'logging.StreamHandler',
		},
	},
	'loggers': {
		'django': {
			'handlers': ['console'],
			'level': 'INFO',
			'propagate': True,
		},
		'base': {
			'handlers': ['console'],
			'level': 'INFO',
			'propagate': False,
		},
		'invites': {
			'handlers': ['console'],
			'level': 'INFO',
			'propagate': False,
		},
		'queues': {
			'handlers': ['console'],
			'level': 'INFO',
			'propagate': False,
		},
		'remote_games': {
			'handlers': ['console'],
			'level': 'INFO',
			'propagate': False,
		},
		'tournaments': {
			'handlers': ['console'],
			'level': 'INFO',
			'propagate': False,
		},
	},
}

REST_FRAMEWORK = {
	'DEFAULT_AUTHENTICATION_CLASSES': [
		'rest_framework.authentication.TokenAuthentication',
	],
	'DEFAULT_PERMISSION_CLASSES': [
		'rest_framework.permissions.AllowAny',
	],
}


CORS_ALLOW_METHODS = [
	"DELETE",
	"GET",
	"OPTIONS",
	"PATCH",
	"POST",
	"PUT",
]

CORS_ALLOW_HEADERS = [
	'accept',
	'accept-encoding',
	'authorization',
	'content-type',
	'dnt',
	'origin',
	'user-agent',
	'x-csrftoken',
	'x-requested-with',
]

CHANNEL_LAYERS = {
	"default": {
		"BACKEND": "channels.layers.InMemoryChannelLayer"
	}
}