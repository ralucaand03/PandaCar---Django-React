from rest_framework import serializers
from .models import User,Car,CarAvailability,RecommendedCar
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings

class CarSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    class Meta:
        model = Car
        fields = '__all__'
    def get_photo_url(self, obj):
        return f"{settings.MEDIA_URL}car_photos/{obj.photo_name}"

class UserSerializer(serializers.ModelSerializer):
    # exclude password from output
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name', 'email', 'phone_number', 'date_of_birth', 'password', 'is_admin', 'is_staff', 'is_active']

    def create(self, validated_data):
        #password hashing for user
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password is not None:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        #update password
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    

class CarAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CarAvailability
        fields = '__all__'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['role'] = 'admin' if self.user.is_admin else 'user'

        return data
    
class RecommendedCarSerializer(serializers.ModelSerializer):
    car = CarSerializer()  # Nested serializer for Car model

    class Meta:
        model = RecommendedCar
        fields = ['id', 'user', 'car', 'created_at']