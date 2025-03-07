import React, { useState } from 'react';
import "./App.css";

const TextDetection = () => {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState('');
    const [aiAccuracy, setAiAccuracy] = useState(null);
    const [humanAccuracy, setHumanAccuracy] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!inputText.trim()) {
            setError("Please enter some text to analyze");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            
            const response = await fetch('/api/detect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text_input: inputText }),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            setResult(data.prediction);
            setAiAccuracy(data.ai_accuracy);
            setHumanAccuracy(data.human_accuracy);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error analyzing text. Please try again.');
            setResult('');
            setAiAccuracy(null);
            setHumanAccuracy(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>AI Text Detection</h1>
            <div className="input-section">
                <h2>Input Text</h2>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows="10"
                    placeholder="Type or paste your text here..."
                    disabled={isLoading}
                />
                <button 
                    onClick={handleSubmit} 
                    disabled={isLoading || !inputText.trim()}
                >
                    {isLoading ? 'Analyzing...' : 'Detect'}
                </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {result && (
                <div className="result-section">
                    <h2>Result</h2>
                    <div className={`prediction ${result === "AI-Generated" ? "ai" : "human"}`}>
                        <p>Prediction: <strong>{result}</strong></p>
                    </div>
                    <div className="accuracy-bars">
                        {aiAccuracy !== null && (
                            <div className="accuracy-bar">
                                <div className="bar-label">AI Generated:</div>
                                <div className="bar-container">
                                    <div 
                                        className="bar ai-bar" 
                                        style={{ width: `${aiAccuracy}%` }}
                                    ></div>
                                    <span className="bar-value">{aiAccuracy}%</span>
                                </div>
                            </div>
                        )}
                        {humanAccuracy !== null && (
                            <div className="accuracy-bar">
                                <div className="bar-label">Human Written:</div>
                                <div className="bar-container">
                                    <div 
                                        className="bar human-bar" 
                                        style={{ width: `${humanAccuracy}%` }}
                                    ></div>
                                    <span className="bar-value">{humanAccuracy}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextDetection;