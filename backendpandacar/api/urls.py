from django.urls import path
from .views import logout_user,get_users,create_user,user_detail,get_cars,create_car,car_detail,get_cars_availability,create_car_availability,car_detail_availability
from .views import add_to_favorites, remove_from_favorites, get_user_favorites, add_to_cart,remove_from_cart,get_user_cart,my_account_details,recommended_cars,CustomTokenObtainPairView

urlpatterns = [
    path('users/',get_users,name = 'get_users'),
    path('users/create',create_user,name = 'create_user'),
    path('users/<int:pk>',user_detail,name = 'user_detail'),
    path('myaccount/',my_account_details,name = 'my_account_details'),
    path('cars/',get_cars,name='get_cars'),
    path('cars/create',create_car,name='create_car'),
    path('cars/<int:pk>',car_detail,name = 'car_detail'),
    path('availabilities/',get_cars_availability,name='get_cars_availability'),
    path('availabilities/create',create_car_availability,name='create_car_availability'),
    path('availabilities/<int:pk>',car_detail_availability,name = 'car_detail_availability'),
    path('favorites/', get_user_favorites, name='get_user_favorites'), 
    path('favorites/add/<int:car_id>/', add_to_favorites, name='add_to_favorites'),
    path('favorites/remove/<int:car_id>/', remove_from_favorites, name='remove_from_favorites'),
    path('cart/', get_user_cart, name='get_user_cart'), 
    path('cart/add/<int:car_id>/', add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:car_id>/', remove_from_cart, name='remove_from_cart'),
    path('recommended/', recommended_cars, name='recommended_cars'),

    path('login/',CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('logout/',logout_user, name='logout_user')
    
]