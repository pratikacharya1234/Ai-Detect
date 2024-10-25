import joblib

try:
    model = joblib.load('text_detection_model.pkl')
    print("Model loaded successfully!")
except Exception as e:  # Catch all exceptions to get more information
    print("Failed to load model:", str(e))
