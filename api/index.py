import warnings
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

# Filter out scikit-learn version warnings
warnings.filterwarnings('ignore', category=UserWarning)

app = Flask(__name__)
CORS(app)

def load_model():
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            return joblib.load('model/ai_detector_model.joblib')
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

model_path = os.path.join(os.path.dirname(__file__), 'text_detection_model.pkl')
model = joblib.load(model_path)

@app.route('/api/detect', methods=['POST'])
def detect():
    data = request.get_json()
    input_text = data['text_input']
    
    prediction = model.predict([input_text])[0]
    probabilities = model.predict_proba([input_text])[0]

    ai_probability = probabilities[1]
    human_probability = probabilities[0]

    if prediction == 1:
        result = "AI-Generated"
    else:
        result = "Human-Written"

    ai_accuracy = round(ai_probability * 100, 2)
    human_accuracy = round(human_probability * 100, 2)

    return jsonify({
        'prediction': result,
        'ai_accuracy': ai_accuracy,
        'human_accuracy': human_accuracy
    })



def handler(event, context):
    return app(event, context)

# For local development
if __name__ == '__main__':
    app.run(debug=True)