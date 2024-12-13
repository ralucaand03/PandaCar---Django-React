from rest_framework.decorators import throttle_classes,api_view,permission_classes,authentication_classes
from rest_framework.response import Response
from rest_framework import status
from .models import User, Car, CarAvailability, UserFavoriteCar,UserCart,RecommendedCar
from .serializer import UserSerializer,CarSerializer,CarAvailabilitySerializer,RecommendedCarSerializer
from rest_framework.permissions import AllowAny,IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken
from backendpandacar.custom_classes import CustomAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from django.db.models import Case, When, Value, IntegerField
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .recommendations import generate_recommendations,generate_recommendations_others
import logging

logger = logging.getLogger(__name__)
#this is for login view
#this is written as a class because we use 
#TokenObtainPairView which is a class
class CustomTokenObtainPairView(TokenObtainPairView):

    throttle_scope = 'custom_login'
    throttle_classes = (ScopedRateThrottle,) 

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        data = response.data
        access_token = data.get('access')

        try:
            token = AccessToken(access_token)
            user_id = token.payload.get('user_id')  
            user = User.objects.get(id=user_id)

        except InvalidToken:
            user = None
        except User.DoesNotExist:
            user = None

        if user:
            role = 'admin' if user.is_admin else 'user'
        else:
            return Response({'detail': 'Invalid token or user not found'}, status=status.HTTP_400_BAD_REQUEST)

        response.set_cookie(
            key='access_token',
            value=data['access'],
            httponly=True,
            samesite='None',
            secure=True
        )

        response.set_cookie(
            key="refresh_token",
            value=data['refresh'],
            httponly=True,
            samesite='None',
            secure=True
        )

        del response.data['access']
        del response.data['refresh']

        response.data = {
            'message': 'Login successful',
            'role': role,  
        }

        return response

#logout view
@api_view(['POST'])
@authentication_classes([CustomAuthentication])
def logout_user(request):
    refresh_token = request.COOKIES.get('refresh_token')
    if not refresh_token:
        return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
       token = RefreshToken(refresh_token)
       token.blacklist() 
    except Exception as e:
            return Response({"error": "Invalid or expired refresh token"}, status=status.HTTP_400_BAD_REQUEST)
    
    #delete the access cookie
    response = Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
    response.delete_cookie('access_token', path='/', domain='127.0.0.1', samesite='None')
    response.delete_cookie('refresh_token', path='/', domain='127.0.0.1', samesite='None')
    return response


#create a get endpoint for all users
@api_view(['GET'])
@authentication_classes([CustomAuthentication])
@permission_classes([IsAdminUser])
def get_users(request):

    view = get_users.view_class
    view.throttle_scope = 'custom_users'

    users = User.objects.all()
    serializer = UserSerializer(users,many = True)
    return Response(serializer.data,status=status.HTTP_200_OK)


#create a post endpoint for a user
@api_view(['POST'])
@authentication_classes([CustomAuthentication])
@permission_classes([AllowAny])
def create_user(request):
    is_admin = request.data.get('is_admin', False)
    
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        if is_admin:
            user.is_admin = True
            user.is_staff = True
            user.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#create delete, put ,get endpoint for a single user
@api_view(['GET','PUT','DELETE'])
@authentication_classes([CustomAuthentication])
@permission_classes([IsAdminUser])
def user_detail(request,pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Create your views for car/cars below


#create a get endpoint for all cars
@api_view(['GET'])
@throttle_classes([ScopedRateThrottle])
@authentication_classes([CustomAuthentication])
def get_cars(request):

    view = get_cars.view_class
    view.throttle_scope = 'custom_cars'

    cars = Car.objects.all()
    serializer = CarSerializer(cars,many = True)
    return Response(serializer.data,status=status.HTTP_200_OK)


#create a post endpoint for creating a car
@api_view(['POST'])
@authentication_classes([CustomAuthentication])
@permission_classes([IsAdminUser])
def create_car(request):
    serializer = CarSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


#create delete, put ,get endpoint for a single car
@api_view(['GET','PUT','DELETE'])
@authentication_classes([CustomAuthentication])
def car_detail(request,pk):
    try:
        car = Car.objects.get(pk=pk)
    except Car.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CarSerializer(car)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = CarSerializer(car, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        car.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

# Create your views for car/cars availability below
#create a get endpoint for all availabilities
@api_view(['GET'])
@throttle_classes([ScopedRateThrottle])
@authentication_classes([CustomAuthentication])
def get_cars_availability(request):

    view = get_cars.view_class
    view.throttle_scope = 'custom_availability'

    cars_availabilities = CarAvailability.objects.all()
    serializer = CarAvailabilitySerializer(cars_availabilities,many = True)
    return Response(serializer.data,status=status.HTTP_200_OK)

#create a post endpoint for creating a car
@api_view(['POST'])
@authentication_classes([CustomAuthentication])
@permission_classes([IsAdminUser])
def create_car_availability(request):
    serializer = CarAvailabilitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


#create delete, put ,get endpoint for a single car
@api_view(['GET','PUT','DELETE'])
@authentication_classes([CustomAuthentication])
def car_detail_availability(request,pk):
    try:
        cars_availability = CarAvailability.objects.get(pk=pk)
    except CarAvailability.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CarAvailabilitySerializer(cars_availability)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = CarAvailabilitySerializer(cars_availability, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        cars_availability.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@authentication_classes([CustomAuthentication])
@permission_classes([IsAuthenticated])
def my_account_details(request):
    user = request.user  # Get the authenticated user from the request

    if user is None:
        return Response({'detail': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    # Serialize the user object and return it as a response
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)
          
#--------------------------------------------------------------create fav
@api_view(['POST'])
@throttle_classes([ScopedRateThrottle])
@authentication_classes([CustomAuthentication])
def add_to_favorites(request, car_id):

    view = add_to_favorites.view_class
    view.throttle_scope = 'custom_add_to_favorites'

    # Get the car object
    try:
        car = Car.objects.get(pk=car_id)
    except Car.DoesNotExist:
        return Response({"error": "Car not found"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    # Check if the car is already in the user's favorites
    if not UserFavoriteCar.objects.filter(user=user, car=car).exists():
        # Add the car to the user's favorites
        UserFavoriteCar.objects.create(user=user, car=car)
        return Response({"message": f"{car.car_name} added to your favorites!"}, status=status.HTTP_201_CREATED)
    
    return Response({"message": f"{car.car_name} is already in your favorites!"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@throttle_classes([ScopedRateThrottle])
@authentication_classes([CustomAuthentication])
def get_user_favorites(request):

    view = get_user_favorites.view_class
    view.throttle_scope = 'custom_get_to_favorites'

    user = request.user  # Get the current authenticated user

    try:
        # Fetch all the UserFavoriteCar entries for the user, which will give us their favorite cars
        favorite_cars = UserFavoriteCar.objects.filter(user=user)

        # Check if the user has any favorite cars
        if favorite_cars.exists():
            # Serialize the Car objects based on the UserFavoriteCar model
            cars = [favorite_car.car for favorite_car in favorite_cars]
            serializer = CarSerializer(cars, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No favorite cars found."}, status=status.HTTP_200_OK)
    
    except Exception as e:
        # Handle any exceptions that occur while fetching the data
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@authentication_classes([CustomAuthentication])
def remove_from_favorites(request, car_id):
    try:
        # Get the car object by ID
        car = Car.objects.get(pk=car_id)
    except Car.DoesNotExist:
        return Response({"error": "Car not found"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    # Check if the car is in the user's favorites
    favorite_entry = UserFavoriteCar.objects.filter(user=user, car=car)

    if favorite_entry.exists():
        # Remove the car from the user's favorites
        favorite_entry.delete()
        return Response({"message": f"{car.car_name} removed from your favorites!"}, status=status.HTTP_200_OK)
    
    return Response({"message": f"{car.car_name} is not in your favorites!"}, status=status.HTTP_200_OK)


#------------------------------------------------------------create cart
@api_view(['POST'])
@throttle_classes([ScopedRateThrottle])
@authentication_classes([CustomAuthentication])
def add_to_cart(request, car_id):

    view = add_to_cart.view_class
    view.throttle_scope = 'custom_add_to_cart'

    try:
        car = Car.objects.get(pk=car_id)
    except Car.DoesNotExist:
        return Response({"error": "Car not found"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    
    if not UserCart.objects.filter(user=user, car=car).exists():
        
        UserCart.objects.create(user=user, car=car)
        return Response({"message": f"{car.car_name} added to your cart!"}, status=status.HTTP_201_CREATED)
    
    return Response({"message": f"{car.car_name} is already in your cart!"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([CustomAuthentication])
def get_user_cart(request):

    view = get_user_cart.view_class
    view.throttle_scope = 'custom_get_cart'

    user = request.user  # Get the current authenticated user

    try:
       
        cart_cars = UserCart.objects.filter(user=user)
        if cart_cars.exists():
            
            cars = [cart_car.car for cart_car in cart_cars]
            serializer = CarSerializer(cars, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No cars found in cart."}, status=status.HTTP_200_OK)
    
    except Exception as e:
        
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@authentication_classes([CustomAuthentication])
def remove_from_cart(request, car_id):
    try:
        car = Car.objects.get(pk=car_id)
    except Car.DoesNotExist:
        return Response({"error": "Car not found"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    cart_entry = UserCart.objects.filter(user=user, car=car)

    if cart_entry.exists():
        # Remove the car from the user's cart
        cart_entry.delete()
        return Response({"message": f"{car.car_name} removed from your cart!"}, status=status.HTTP_200_OK)
    
    return Response({"message": f"{car.car_name} is not in your cart!"}, status=status.HTTP_200_OK)

#---------------------------------------------------------------
@api_view(['GET'])
@authentication_classes([CustomAuthentication])
def recommended_cars(request):
    """
    Endpoint to generate and store car recommendations based on the user's favorites,
    and return the car data serialized using CarSerializer.
    """
    user = request.user  # Get the current authenticated user

    # Remove existing recommendations for the user (optional)
    RecommendedCar.objects.filter(user=user).delete()

    try:
        # Get the user's favorite cars using the UserFavoriteCa
        print("Reached the point before fetching user favorites.")
        favorite_cars_ids = UserFavoriteCar.objects.filter(user=user)
        fav_cars = Car.objects.filter(id__in=favorite_cars_ids.values('car_id'))  # Use .values() to extract car IDs
        all_cars = Car.objects.all()
        fav_cars_count = fav_cars.count()  # Number of favorite cars
        all_cars_count = all_cars.count()  # Number of all cars
        
        if fav_cars_count == 0 or all_cars_count == fav_cars_count:
            # If no favorite cars, generate recommendations based on the most common cars
            recommended_car_ids = generate_recommendations_others()  # Call the alternative recommendation function
            if not recommended_car_ids:
                logger.warning(f"No recommendations could be generated for user {user.id}.")
                return Response(
                    {"message": "No recommendations could be generated."},
                    status=status.HTTP_200_OK,
                )

            # Fetch detailed car data for the recommended IDs
            cars =  Car.objects.filter(id__in=recommended_car_ids).annotate(
            order=Case(
                *[When(id=car_id, then=Value(index)) for index, car_id in enumerate(recommended_car_ids)],
                default=Value(len(recommended_car_ids)),  # In case an ID is not found, it's placed at the end
                output_field=IntegerField()
            )
            ).order_by('order')

            if not cars.exists():
                logger.warning(f"Cars with recommended IDs not found in the database for user {user.id}.")
                return Response(
                    {"message": "No cars found for the recommended IDs."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Store the recommended cars in the database
            for car in cars:
                # Save each recommended car for the user
                RecommendedCar.objects.get_or_create(user=user, car=car)

            # Serialize car data using CarSerializer
            serializer = CarSerializer(cars, many=True)

            # Return the serialized car data
            return Response(serializer.data, status=status.HTTP_200_OK)

       
        top_n = max(1, min(4, all_cars_count - fav_cars_count))

        
        print("Reached the point before fetching recommended.")
        print(top_n)
        recommended_car_ids = generate_recommendations(fav_cars, all_cars,top_n)

        if not recommended_car_ids:
            logger.warning(f"No recommendations could be generated for user {user.id}.")
            return Response(
                {"message": "No recommendations could be generated."},
                status=status.HTTP_200_OK,
            )
        print("Reached the point after fetching recommended.")
        # Fetch detailed car data for the recommended IDs
        cars =  Car.objects.filter(id__in=recommended_car_ids).annotate(
            order=Case(
                *[When(id=car_id, then=Value(index)) for index, car_id in enumerate(recommended_car_ids)],
                default=Value(len(recommended_car_ids)),  # In case an ID is not found, it's placed at the end
                output_field=IntegerField()
            )
            ).order_by('order')
        print("Reached the point after fetching cars.")
        if not cars.exists():
            logger.warning(f"Cars with recommended IDs not found in the database for user {user.id}.")
            return Response(
                {"message": "No cars found for the recommended IDs."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Store the recommended cars in the database
        for car in cars:
            # Save each recommended car for the user
            RecommendedCar.objects.get_or_create(user=user, car=car)


        # Serialize car data using CarSerializer
        serializer = CarSerializer(cars, many=True)

        # Return the serialized car data
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in generating recommendations for user {user.id}: {str(e)}")
        return Response(
            {"error": "An error occurred while generating recommendations."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
