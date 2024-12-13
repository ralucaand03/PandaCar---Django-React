import pandas as pd
from .models import UserFavoriteCar

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
    favorite_car_ids = [car.id for car in favorite_cars]
    all_car_data = pd.DataFrame([{
        'id': car.id,
        'car_name': car.car_name,
        'brand_name': car.brand_name,
        'fuel_type': car.fuel_type,
        'horse_power': car.horse_power,
        'price_per_day': car.price_per_day,
        'number_of_seats': car.number_of_seats
    } for car in all_cars])
    filtered_cars = all_car_data[~all_car_data['id'].isin(favorite_car_ids)]
    if filtered_cars.empty:
        return []
    favorite_car_data = pd.DataFrame([{
        'id': car.id,
        'car_name': car.car_name,
        'brand_name': car.brand_name,
        'fuel_type': car.fuel_type,
        'horse_power': car.horse_power,
        'price_per_day': car.price_per_day,
        'number_of_seats': car.number_of_seats
    } for car in favorite_cars])
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(all_car_data['car_name'] + ' ' + all_car_data['brand_name'])
    favorite_tfidf_matrix = tfidf_vectorizer.transform(favorite_car_data['car_name'] + ' ' + favorite_car_data['brand_name'])
    similarity_scores = cosine_similarity(favorite_tfidf_matrix, tfidf_matrix)
    avg_similarity_scores = similarity_scores.mean(axis=0)
    numerical_features = ['price_per_day', 'horse_power', 'number_of_seats']
    scaler = StandardScaler()
    all_car_numerical_data = all_car_data[numerical_features].values
    scaled_numerical_data = scaler.fit_transform(all_car_numerical_data)
    numerical_similarity_scores = cosine_similarity(scaled_numerical_data, scaled_numerical_data)
    combined_scores = (avg_similarity_scores + numerical_similarity_scores.mean(axis=0)) / 2
    available_top_n = min(top_n, len(filtered_cars))
    
    filtered_indices = filtered_cars.index  
    filtered_combined_scores = combined_scores[filtered_indices]  

    recommended_car_ids = np.argsort(filtered_combined_scores)[::-1][:available_top_n]

    
    print(f"Filtered indices: {filtered_indices}")
    print(f"Filtered combined scores: {filtered_combined_scores}")
    print(f"Recommended indices before filtering: {recommended_car_ids}")


    valid_indices = filtered_indices[recommended_car_ids]

    top_recommended_cars = filtered_cars.loc[valid_indices].id.tolist()

    print(f"Valid recommended indices: {valid_indices}")
    print(f"Recommended car IDs: {top_recommended_cars}")

    return top_recommended_cars


def generate_recommendations_others(top_n=8):
    """
    Generate car recommendations based on the cars that are most commonly favored by other users.
    The function returns the top N most recommended cars (excluding the current user's favorites).
    """
    try:
        
        popular_cars = UserFavoriteCar.objects.values('car') \
            .annotate(favorite_count=Count('car')) \
            .order_by('-favorite_count')  

        top_recommended_car_ids = [car['car'] for car in popular_cars[:top_n]]

        return top_recommended_car_ids

    except Exception as e:
        logger.error(f"Error in generating recommendations from others: {str(e)}")
        return []