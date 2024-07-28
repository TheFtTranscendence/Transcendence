from django.urls import path
from .views import add_instance, get_number_of_games, add_new_game, get_games

urlpatterns = [
    # Setter functions
    path('addinstance/', add_instance),
    path('addgame/<int:instanceIndex>', add_new_game),
    path('addtournament/<int:instanceIndex>', add_new_tournament),
    path('addtournamentgame/<int:instanceIndex>', add_new_tournament_game),

    # Getter functions
    # path('getnumberofgames/<int:instanceIndex>', get_number_of_games),
    path('getgames/<int:instanceIndex>', get_games),
    # path('getNextPlayersTournament/<int:instanceIndex>', get_next_tournament_player),
]
