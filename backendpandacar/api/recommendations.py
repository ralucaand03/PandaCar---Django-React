import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import numpy as np
def generate_recommendations(favorite_cars, all_cars, top_n=8):
    """
    Generate car recommendations for a user based on their favorite cars.
    The recommendations will exclude cars that are already in the user's favorites.
    The function will return the IDs of the top N recommended cars.
    """

    # Collecting the IDs of the favorite cars to exclude them from the recommendations
    favorite_car_ids = favorite_cars.values_list('car_id', flat=True)

    # Filtering out the cars that are in the user's favorites
    available_cars = all_cars.exclude(id__in=favorite_car_ids)

    # Building a dictionary of cars and their similarity score
    car_scores = {}

    # Define a basic similarity function that considers matching attributes
    for car in available_cars:
        score = 0

        # Checking for similarity in various attributes (e.g., brand, fuel type, engine capacity)
        for favorite in favorite_cars:
            favorite_car = favorite.car

            # Brand similarity (score +1 for the same brand)
            if car.brand_name == favorite_car.brand_name:
                score += 1

            # Fuel type similarity (score +1 for the same fuel type)
            if car.fuel_type == favorite_car.fuel_type:
                score += 1

            # Engine capacity similarity (score +1 for similar engine size)
            if abs(car.engine_capacity - favorite_car.engine_capacity) < 0.5:
                score += 1

        # Store the calculated score for the car
        car_scores[car.id] = score

    # Sort the cars by their score in descending order and pick the top N
    recommended_car_ids = sorted(car_scores, key=car_scores.get, reverse=True)[:top_n]

    return recommended_car_ids
