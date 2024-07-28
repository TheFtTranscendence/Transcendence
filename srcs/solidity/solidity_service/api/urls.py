from django.urls import path
from .views import add_instance, add_game, add_tournament, add_tournament_game, get_games, get_next_tournament_player, get_tournament_ranking

urlpatterns = [
    # Setter functions
    path('addinstance/', add_instance),
    path('addgame/<int:instanceIndex>', add_game),
    path('addtournament/<int:instanceIndex>', add_tournament),
    path('addtournamentgame/<int:instanceIndex>', add_tournament_game),

    # Getter functions
    path('getgames/<int:instanceIndex>', get_games),
    path('getnexttournamentplayers/<int:instanceIndex>', get_next_tournament_player),
    path('gettournamentranking/<int:instanceIndex>/<int:tournamentIndex>', get_tournament_ranking),
]
