import pandas as pd
from .models import User, Car, CarAvailability, UserFavoriteCar,UserCart,RecommendedCar

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import numpy as np
from django.db.models import Count
import logging

logger = logging.getLogger(__name__)
def generate_recommendations(favorite_cars, all_cars, top_n):
    """
    Generate car recommendations for a user based on their favorite cars.
    The recommendations will exclude cars that are already in the user's favorites.
    The function will return the IDs of the top N recommended cars.
    """
    # Extract relevant data from the favorite cars and all cars
    favorite_car_ids = [car.id for car in favorite_cars]
    print("HERE1")
    # Prepare data for text-based similarity calculation
    all_car_data = pd.DataFrame([{
        'id': car.id,
        'car_name': car.car_name,
        'brand_name': car.brand_name,
        'fuel_type': car.fuel_type,
        'horse_power': car.horse_power,
        'price_per_day': car.price_per_day,
        'number_of_seats': car.number_of_seats
    } for car in all_cars])
    print("HERE2")
    # Remove cars that are already in the user's favorites
    filtered_cars = all_car_data[~all_car_data['id'].isin(favorite_car_ids)]
    print("HERE3")
    # If no cars are left after filtering, return an empty list
    if filtered_cars.empty:
        return []
    print("HERE4")
    # Prepare data for the favorite cars
    favorite_car_data = pd.DataFrame([{
        'id': car.id,
        'car_name': car.car_name,
        'brand_name': car.brand_name,
        'fuel_type': car.fuel_type,
        'horse_power': car.horse_power,
        'price_per_day': car.price_per_day,
        'number_of_seats': car.number_of_seats
    } for car in favorite_cars])
    print("HERE5")
    # 1. Text-based similarity using TfidfVectorizer
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(all_car_data['car_name'] + ' ' + all_car_data['brand_name'])
    print("HERE6")
    # 2. Cosine similarity between favorite cars and all cars
    # Create a combined vector of favorite cars
    favorite_tfidf_matrix = tfidf_vectorizer.transform(favorite_car_data['car_name'] + ' ' + favorite_car_data['brand_name'])
    print("HERE7")    
    # Compute cosine similarity between favorite cars and all cars
    similarity_scores = cosine_similarity(favorite_tfidf_matrix, tfidf_matrix)
    print("HERE8")
    # Aggregate similarity scores by averaging (one score per all cars)
    avg_similarity_scores = similarity_scores.mean(axis=0)
    print("HERE9")
    # 3. Numerical feature normalization (price, horsepower, seats)
    numerical_features = ['price_per_day', 'horse_power', 'number_of_seats']
    print("HERE10")
    scaler = StandardScaler()
    all_car_numerical_data = all_car_data[numerical_features].values
    scaled_numerical_data = scaler.fit_transform(all_car_numerical_data)
    print("HERE11")
    # Compute similarity for each car based on numerical features
    numerical_similarity_scores = cosine_similarity(scaled_numerical_data, scaled_numerical_data)
    print("HERE12")
    # 4. Combine text-based and numerical similarity
    # Weighted combination of text-based and numerical similarity
    combined_scores = (avg_similarity_scores + numerical_similarity_scores.mean(axis=0)) / 2
    print("HERE13")
    # 5. Sort the cars by the combined similarity score in descending order
    # First ensure we have enough cars
    available_top_n = min(top_n, len(filtered_cars))
    
    # Compute combined scores only for filtered cars
    filtered_indices = filtered_cars.index  # Get original indices from `all_car_data`
    filtered_combined_scores = combined_scores[filtered_indices]  # Filter scores for valid cars

    # Sort the filtered scores and get top N indices
    recommended_car_ids = np.argsort(filtered_combined_scores)[::-1][:available_top_n]

    
    # Debugging: Check filtered indices and scores
    print(f"Filtered indices: {filtered_indices}")
    print(f"Filtered combined scores: {filtered_combined_scores}")
    print(f"Recommended indices before filtering: {recommended_car_ids}")


    valid_indices = filtered_indices[recommended_car_ids]

    # Get the top N car IDs from the filtered cars
    top_recommended_cars = filtered_cars.loc[valid_indices].id.tolist()

    # Final Debugging Output
    print(f"Valid recommended indices: {valid_indices}")
    print(f"Recommended car IDs: {top_recommended_cars}")

    return top_recommended_cars


def generate_recommendations_others(top_n=8):
    """
    Generate car recommendations based on the cars that are most commonly favored by other users.
    The function returns the top N most recommended cars (excluding the current user's favorites).
    """
    try:
        # Step 1: Get the list of car IDs that are most frequently added to users' favorites
        # Count the occurrences of each car in the UserFavoriteCar table
        popular_cars = UserFavoriteCar.objects.values('car') \
            .annotate(favorite_count=Count('car')) \
            .order_by('-favorite_count')  # Sort by the most frequent

        # Step 2: Retrieve the top N most recommended cars
        top_recommended_car_ids = [car['car'] for car in popular_cars[:top_n]]

        # Step 3: Return the list of top N car IDs
        return top_recommended_car_ids

    except Exception as e:
        # Log the error if something goes wrong
        logger.error(f"Error in generating recommendations from others: {str(e)}")
        return []