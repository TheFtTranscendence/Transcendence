from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets, status

class HealthView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		return Response({'status': 'online'}, status=status.HTTP_200_OK)