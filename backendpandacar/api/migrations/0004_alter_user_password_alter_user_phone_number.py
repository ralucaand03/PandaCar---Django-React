# Generated by Django 5.1.2 on 2024-11-05 21:04

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_car_caravailability'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=100, validators=[django.core.validators.MinLengthValidator(8), django.core.validators.RegexValidator(message='Minimum length >=8, mandatory at least one digit, one special char, one alphabetical char', regex='^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')]),
        ),
        migrations.AlterField(
            model_name='user',
            name='phone_number',
            field=models.CharField(max_length=20, unique=True, validators=[django.core.validators.RegexValidator('^\\+?1?\\d{9,15}$', message='Phone number format: +40112345, max 15 digits')]),
        ),
    ]