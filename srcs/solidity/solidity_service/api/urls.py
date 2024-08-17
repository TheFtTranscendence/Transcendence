from django.urls import path
from .views import add_instance, add_game, add_tournament, add_tournament_game, get_games, get_next_tournament_player, get_last_tournament_ranking, get_all_tournaments_rankings

urlpatterns = [
    # Setter functions
    path('addinstance/', add_instance),
    path('addgame/<int:instanceIndex>', add_game),
    path('addtournament/<int:instanceIndex>', add_tournament),
    path('addtournamentgame/<int:instanceIndex>', add_tournament_game),

    # Getter functions
    path('getgames/<int:instanceIndex>', get_games),
    path('getnexttournamentplayers/<int:instanceIndex>', get_next_tournament_player),
    path('getlasttournamentranking/<int:instanceIndex>', get_last_tournament_ranking),
    path('getalltournamentsrankings/<int:instanceIndex>', get_all_tournaments_rankings),
]
