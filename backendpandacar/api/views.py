from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializer import UserSerializer
from datetime import date
from django.contrib.auth.hashers import make_password

# Create your views here.


#create a get endpoint
@api_view(['GET'])
def get_user(request):
    # return Response(UserSerializer({ "first_name": "John",
    #         "last_name": "Doe",
    #         "phone_number": "+40712345678",
    #         "email":"johndoe@example.com",
    #         "date_of_birth": date(1990, 1, 1),
    #         "password": make_password("Password@123")}).data)
    users = User.objects.all()
    serializer = UserSerializer(users,many = True)
    return Response(serializer.data)

#create a post endpoint
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
