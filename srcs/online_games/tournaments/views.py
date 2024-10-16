from rest_framework.permissions import AllowAny
from rest_framework import viewsets, status
from .models import Tournament, TournamentGame
from .serializer import TournamentSerializer, TournamentGameSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
import logging

logger = logging.getLogger(__name__)

class TournamentViewSet(viewsets.ModelViewSet):
	queryset = Tournament.objects.all()
	serializer_class = TournamentSerializer
	permission_classes = [AllowAny]

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		return Response(serializer.data, status=status.HTTP_201_CREATED)

	@action(detail=True, methods=['patch'], url_path='abort')
	def abort_tournament(self, request, pk=None):
		try:
			tournament = self.get_object()
			tournament.change_status('aborted')
			return Response({'status': 'Tournament aborted'}, status=status.HTTP_200_OK)
		except Tournament.DoesNotExist:
			return Response({'detail': 'Tournament not found.'}, status=status.HTTP_404_NOT_FOUND)
		except ValueError as e:
			return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
		
	@action(detail=False, methods=['get'], url_path='my_tournament/(?P<user_id>[^/.]+)/(?P<game_name>[^/.]+)')
	def get_tournament_by_host_and_game(self, request, user_id=None, game_name=None):
		tournaments = Tournament.objects.filter(status='ongoing', host=int(user_id), game_name=game_name)

		if tournaments.exists():
			serializer = self.get_serializer(tournaments, many=True)
			return Response(serializer.data, status=status.HTTP_200_OK)
		else:
			return Response({'detail': False}, status=status.HTTP_404_NOT_FOUND)
		
	@action(detail=True, methods=['get'], url_path='winners')
	def get_tournament_winners(self, request, pk=None):
		try:
			tournament = self.get_object()
			winners = []
			for game in tournament.tournament_game.all():
				winners.append(game.users[game.scores.index(max(game.scores))])
				
			return Response({'winners': winners}, status=status.HTTP_200_OK)
		except Tournament.DoesNotExist:
			return Response({'detail': 'Tournament not found.'}, status=status.HTTP_404_NOT_FOUND)
		except ValueError as e:
			return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class TournamentGameViewSet(viewsets.ModelViewSet):
	queryset = TournamentGame.objects.all()
	serializer_class = TournamentGameSerializer
	permission_classes = [AllowAny]

	def create(self, request, tournament_id=None, *args, **kwargs):
		try:
			tournament = Tournament.objects.get(id=tournament_id)
		except Tournament.DoesNotExist:
			return Response({'detail': 'Tournament not found.'}, status=status.HTTP_404_NOT_FOUND)

		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		serializer.save(tournament=tournament)

		total_games_played = tournament.tournament_game.count()

		if total_games_played == tournament.number_of_players - 1:
			tournament.change_status('completed')
			return Response({'detail': 'game_ended', 'data': serializer.data}, status=status.HTTP_201_CREATED)
		else:
			return Response(serializer.data, status=status.HTTP_201_CREATED)
