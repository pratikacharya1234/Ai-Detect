import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__, static_folder='dist')
CORS(app)

# Load model
model = joblib.load('src/text_detection_model.pkl')

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

# Serve the static files from the React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)