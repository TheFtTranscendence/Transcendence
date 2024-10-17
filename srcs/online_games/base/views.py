from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status, viewsets
from django.db import connections
from django.db.utils import OperationalError

class HealthView(APIView):
	premission_classes = [AllowAny]
	http_method_names = ['get']

	def get(self, request):
		try:
			db_connection = connections['default']
			db_connection.cursor()
			return Response('online', status=status.HTTP_200_OK)
		except OperationalError:
			return Response('database unavailable', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
