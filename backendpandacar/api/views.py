from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import User,Car,CarAvailability
from .serializer import UserSerializer,CarSerializer,CarAvailabilitySerializer,CustomTokenObtainPairSerializer
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views for user/users below



#this is for login view
#this is written as a class because we use 
#TokenObtainPairView which is a class
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self,request,*args,**kwargs):
        response = super().post(request,*args,**kwargs)
        data = response.data

        # here we set the cookie with the access token
        response.set_cookie(
            key='access_token', #cookie name
            value=data['access'], #jwt token
            httponly=True, #javascript protection
            samesite='Lax', #CSRF attacks protection 
        ) 

        del response.data['access']

        response.data = {
            'message': 'Login successful',  
            'refresh': data['refresh']  
        }
        return response

#logout view
@api_view(['POST'])
@permission_classes([IsAuthenticated])
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

    return response


#create a get endpoint for all users
@api_view(['GET'])
@permission_classes([IsAuthenticated,IsAdminUser])
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
@permission_classes([IsAuthenticated,IsAdminUser])
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
@permission_classes([IsAuthenticated])
def get_cars(request):
    cars = Car.objects.all()
    serializer = CarSerializer(cars,many = True)
    return Response(serializer.data,status=status.HTTP_200_OK)


#create a post endpoint for creating a car
@api_view(['POST'])
@permission_classes([IsAuthenticated,IsAdminUser])
def create_car(request):
    serializer = CarSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


#create delete, put ,get endpoint for a single car
@api_view(['GET','PUT','DELETE'])
@permission_classes([IsAuthenticated,IsAdminUser])
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
@permission_classes([IsAuthenticated])
def get_cars_availability(request):
    cars_availabilities = CarAvailability.objects.all()
    serializer = CarAvailabilitySerializer(cars_availabilities,many = True)
    return Response(serializer.data,status=status.HTTP_200_OK)

#create a post endpoint for creating a car
@api_view(['POST'])
@permission_classes([IsAuthenticated,IsAdminUser])
def create_car_availability(request):
    serializer = CarAvailabilitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


#create delete, put ,get endpoint for a single car
@api_view(['GET','PUT','DELETE'])
@permission_classes([IsAuthenticated,IsAdminUser])
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
    
