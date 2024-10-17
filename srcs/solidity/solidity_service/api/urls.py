from django.urls import path
from .views import add_instance, add_game, add_tournament, get_pongy_games, get_fighty_games, get_pongy_tournaments, get_fighty_tournaments

urlpatterns = [
    # Setter functions
    path('addinstance/', add_instance),
    path('addgame/<int:instanceIndex>/<str:gameName>', add_game),
    path('addtournament/<int:instanceIndex>/<str:gameName>', add_tournament),

    # Getter functions
    path('getpongygames/<int:instanceIndex>', get_pongy_games),
    path('getfightygames/<int:instanceIndex>', get_fighty_games),
    path('getpongytournaments/<int:instanceIndex>', get_pongy_tournaments),
    path('getfightytournaments/<int:instanceIndex>', get_fighty_tournaments),
]
