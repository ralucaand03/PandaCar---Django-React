from rest_framework.decorators import api_view,permission_classes,authentication_classes
from rest_framework.response import Response
from rest_framework import status
from .models import User, Car, CarAvailability, UserFavoriteCar,UserCart
from .serializer import UserSerializer,CarSerializer,CarAvailabilitySerializer,CustomTokenObtainPairSerializer
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny,IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken
from backendpandacar.custom_classes import CustomAuthentication
from rest_framework.permissions import IsAuthenticated

#this is for login view
#this is written as a class because we use 
#TokenObtainPairView which is a class
class CustomTokenObtainPairView(TokenObtainPairView):

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
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
       token = RefreshToken(refresh_token)
       token.blacklist() 
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    #delete the access cookie
    response = Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response


#create a get endpoint for all users
@api_view(['GET'])
@authentication_classes([CustomAuthentication])
@permission_classes([IsAdminUser])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users,many = True)
    return Response(serializer.data,status=status.HTTP_200_OK)


#create a post endpoint for a user
@api_view(['POST'])
@permission_classes([AllowAny])
def create_user(request):
    # Verificăm dacă în request se specifică atributul 'is_admin'
    is_admin = request.data.get('is_admin', False)
    
    # Creăm un nou obiect user cu datele primite
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        # Salvăm utilizatorul, dar setăm manual is_admin dacă e cazul
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
@authentication_classes([CustomAuthentication])
def get_cars(request):
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
@authentication_classes([CustomAuthentication])
def get_cars_availability(request):
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
    
#create fav
@api_view(['POST'])
@authentication_classes([CustomAuthentication])
def add_to_favorites(request, car_id):
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
@authentication_classes([CustomAuthentication])
def get_user_favorites(request):
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
      
#------------------------------------------------------------create cart
     
#------------------------------------------------------------create cart
@api_view(['POST'])
@authentication_classes([CustomAuthentication])
def add_to_cart(request, car_id):
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
