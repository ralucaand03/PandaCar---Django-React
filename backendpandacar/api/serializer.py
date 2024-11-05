from rest_framework import serializers
from .models import User,Car,CarAvailability

class UserSerializer(serializers.ModelSerializer):
    # Exclude password din output
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
    

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'

class CarAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CarAvailability
        fields = '__all__'