from django.urls import path
from .views import add_instance, add_game, add_tournament, add_tournament_game, get_games, get_next_tournament_player, get_last_tournament_ranking, get_all_tournaments_rankings

urlpatterns = [
    # Setter functions
    path('addinstance/', add_instance),
    path('addgame/<int:instanceIndex>/<str:gameType>', add_game),
    path('addtournament/<int:instanceIndex>/<str:gameType>', add_tournament),
    path('addtournamentgame/<int:instanceIndex>/<str:gameType>', add_tournament_game),

    # Getter functions
    path('getgames/<int:instanceIndex>/<str:gameType>', get_games),
    path('getnexttournamentplayers/<int:instanceIndex>/<str:gameType>', get_next_tournament_player),
    path('getlasttournamentranking/<int:instanceIndex>/<str:gameType>', get_last_tournament_ranking),
    path('getalltournamentsrankings/<int:instanceIndex>/<str:gameType>', get_all_tournaments_rankings),
]
