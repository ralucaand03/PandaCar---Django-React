from django.db import models
from django.core.validators import RegexValidator,MinLengthValidator
import os
from django.conf import settings
from django.utils import timezone


# Create your models here.
class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True,max_length=256)
    phone_number = models.CharField(unique=True,max_length=20,
                                    validators=[RegexValidator(r'^\+?1?\d{9,15}$', 
                                    message="phone nr format ex:+40112345, max 15 digits")])
    date_of_birth = models.DateField() #need some age validation
    password = models.CharField(max_length=100,
                                validators=[
                                    MinLengthValidator(8),
                                    RegexValidator(
                                         regex=r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$',
                                         message="min length >=8, mandatory at least one digit, one special char, one alphabetical char"

                                    )    
                                ])
    is_admin = models.BooleanField(default=False)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number', 'date_of_birth','password']

    def __str__(self) -> str:
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


    def get_photo_path(self):
        return os.path.join(settings.MEDIA_URL, 'car_photos', self.photo_name)
    
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

    