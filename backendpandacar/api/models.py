from django.db import models
from django.core.validators import RegexValidator,MinLengthValidator
import os
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, max_length=256)
    phone_number = models.CharField(
        unique=True, 
        max_length=20,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$', 
                                   message="Phone number format: +40112345, max 15 digits")]
    )
    date_of_birth = models.DateField() 
    password = models.CharField(
        max_length=100,
        validators=[
            MinLengthValidator(8),
            RegexValidator(
                regex=r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$',
                message="Minimum length >=8, at least one digit, one special char, one alphabetical char"
            )
        ]
    )
    favorite_cars = models.ManyToManyField('Car', blank=True, related_name='favorite_users')

    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number', 'date_of_birth']

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email} - {self.phone_number}"

class Car(models.Model):

    FUEL_TYPE_CHOICES = [
        ('Petrol', 'Petrol'),
        ('Diesel', 'Diesel'),
        ('Electric', 'Electric'),
        ('Hybrid', 'Hybrid&Petrol // Hybrid&Diesel'),
    ]


    photo_name = models.CharField(max_length=255)
    car_name = models.CharField(max_length=255)
    price_per_day = models.IntegerField()
    brand_name = models.CharField(max_length=255)
    number_of_seats = models.IntegerField()
    color = models.CharField(max_length=255)
    horse_power = models.IntegerField()
    engine_capacity = models.FloatField()
    fuel_type = models.CharField(max_length=10, choices=FUEL_TYPE_CHOICES)
    
    def get_photo_url(self):
        return f"{settings.MEDIA_URL}car_photos/{self.photo_name}"

    def __str__(self):
        return f"{self.car_name} ({self.brand_name}) - {self.fuel_type}, {self.horse_power} HP, {self.engine_capacity}L - ${self.price_per_day}/day"
    
class CarAvailability(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='availabilities')
    start_date = models.DateField()
    end_date = models.DateField()

    def is_available(self, date):
        date = timezone.make_aware(date) if timezone.is_naive(date) else date
        return self.start_date <= date <= self.end_date

    
    def __str__(self):
        return f"{self.car.car_name} available from {self.start_date} to {self.end_date}"

class UserFavoriteCar(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'car'], name='unique_favorite')
        ]

    def __str__(self):
        return f"{self.user} favorite {self.car}"

class UserCart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'car'], name='cart')
        ]

    def __str__(self):
        return f"{self.user} cart {self.car}"

class RecommendedCar(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'car'], name='unique_recomandation')
        ]