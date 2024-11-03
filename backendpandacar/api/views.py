from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User,Car,CarAvailability
from .serializer import UserSerializer,CarSerializer,CarAvailabilitySerializer
from datetime import date
from django.contrib.auth.hashers import make_password

# Create your views for user/users below

#create a get endpoint for all users
@api_view(['GET'])
def get_users(request):
    # return Response(UserSerializer({ "first_name": "John",
    #         "last_name": "Doe",
    #         "phone_number": "+40712345678",
    #         "email":"johndoe@example.com",
    #         "date_of_birth": date(1990, 1, 1),
    #         "password": make_password("Password@123")}).data)
    users = User.objects.all()
    serializer = UserSerializer(users,many = True)
    return Response(serializer.data,status=status.HTTP_200_OK)

#create a post endpoint for a user
@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

#create delete, put ,get endpoint for a single user
@api_view(['GET','PUT','DELETE'])
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
def get_cars(request):
    cars = Car.objects.all()
    serializer = CarSerializer(cars,many = True)
    return Response(serializer.data,status=status.HTTP_200_OK)

#create a post endpoint for creating a car
@api_view(['POST'])
def create_car(request):
    serializer = CarSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

#create delete, put ,get endpoint for a single car
@api_view(['GET','PUT','DELETE'])
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
def get_cars_availability(request):
    cars_availabilities = CarAvailability.objects.all()
    serializer = CarAvailabilitySerializer(cars_availabilities,many = True)
    return Response(serializer.data,status=status.HTTP_200_OK)

#create a post endpoint for creating a car
@api_view(['POST'])
def create_car_availability(request):
    serializer = CarAvailabilitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

#create delete, put ,get endpoint for a single car
@api_view(['GET','PUT','DELETE'])
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