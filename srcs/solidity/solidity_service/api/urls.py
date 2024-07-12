from django.urls import path
from .views import add_instance, get_instance_index, get_number_of_games, add_new_game, get_games

urlpatterns = [
    # Setter functions
    path('addinstance/', add_instance),
    path('addgame/<int:instanceIndex>', add_new_game),

    # Getter functions
    path('getinstance/', get_instance_index),
    path('getnumberofgames/<int:instanceIndex>', get_number_of_games),
    path('getgames/<int:instanceIndex>', get_games),
]
