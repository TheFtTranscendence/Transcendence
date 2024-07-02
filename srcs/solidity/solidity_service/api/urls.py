from django.urls import path
from .views import add_instance, get_instance_index, get_number_of_games, add_new_game

urlpatterns = [
    # Setter functions
    path('addinstance/', add_instance),
    path('addgame/', add_new_game),

    # Getter functions
    path('getinstance/', get_instance_index),
    path('getnumberofgames/', get_number_of_games),
]
