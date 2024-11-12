from django.test import TestCase
from django.conf import settings
from .models import Car

class CarModelTest(TestCase):
    def test_get_photo_url_existing_car(self):
        car = Car.objects.create(
            photo_name="car1.jpg",
            car_name="Toyota Prius",
            price_per_day=50,
            brand_name="Toyota",
            number_of_seats=5,
            color="Blue",
            horse_power=120,
            engine_capacity=1.8,
            fuel_type="Hybrid"
        )

        expected_url = f"{settings.MEDIA_URL}car_photos/{car.photo_name}"
        print(expected_url)
        print()
        print(car.get_photo_url())
        self.assertEqual(car.get_photo_url(), expected_url)