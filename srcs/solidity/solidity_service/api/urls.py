from django.urls import path
from .views import get_games, add_new_game

urlpatterns = [
    path('getgames/', get_games),
    path('addgame/', add_new_game),
]
