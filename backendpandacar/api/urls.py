from django.urls import path
from .views import get_users,create_user,user_detail,get_cars,create_car,car_detail,get_cars_availability,create_car_availability,car_detail_availability
from rest_framework_simplejwt.views import TokenObtainPairView,TokenBlacklistView

urlpatterns = [
    path('users/',get_users,name = 'get_users'),
    path('users/create',create_user,name = 'create_user'),
    path('users/<int:pk>',user_detail,name = 'user_detail'),
    path('cars/',get_cars,name='get_cars'),
    path('cars/create',create_car,name='create_car'),
    path('cars/<int:pk>',car_detail,name = 'car_detail'),
    path('availabilities/',get_cars_availability,name='get_cars_availability'),
    path('availabilities/create',create_car_availability,name='create_car_availability'),
    path('availabilities/<int:pk>',car_detail_availability,name = 'car_detail_availability'),
    path('login/',TokenObtainPairView.as_view(), name='token_obtain_pair'),  #post method
    path('logout/',TokenBlacklistView.as_view(), name='token_blacklist')     #post method
]