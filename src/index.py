from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

model = joblib.load('text_detection_model.pkl')

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(debug=True)
