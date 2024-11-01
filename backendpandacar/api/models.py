from django.db import models
from django.core.validators import RegexValidator,MinLengthValidator

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
    

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name} - {self.email} - {self.phone_number}"

    