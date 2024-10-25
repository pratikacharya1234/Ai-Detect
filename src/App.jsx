import React, { useState } from 'react';
import "./App.css";

const TextDetection = () => {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState('');
    const [aiAccuracy, setAiAccuracy] = useState(null);
    const [humanAccuracy, setHumanAccuracy] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          const response = await fetch('http://127.0.0.1:5000/api/detect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text_input: inputText }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setResult(data.prediction);
            setAiAccuracy(data.ai_accuracy); // Get AI accuracy
            setHumanAccuracy(data.human_accuracy); // Get Human accuracy
        } catch (error) {
            console.error('Error fetching data:', error);
            setResult('Error fetching prediction');
            setAiAccuracy(null);
            setHumanAccuracy(null);
        }
    };

    return (
        <div className="container">
          <h1>AI Detection</h1>
            <div className="input-section">
                <h2>Input Text</h2>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows="10"
                    placeholder="Type or paste your text here..."
                />
                <button onClick={handleSubmit}>Detect</button>
            </div>
            <div className="result-section">
                <h2>Result</h2>
                <p>Prediction: {result}</p>
                {aiAccuracy !== null && (
                    <p>AI Accuracy: {aiAccuracy}%</p>
                )}
                {humanAccuracy !== null && (
                    <p>Human Accuracy: {humanAccuracy}%</p>
                )}
            </div>
        </div>
    );
};

export default TextDetection;
