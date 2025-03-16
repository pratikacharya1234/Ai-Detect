import React, { useState, useEffect } from 'react';
import "./App.css";

const TextDetection = () => {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState('');
    const [aiAccuracy, setAiAccuracy] = useState(null);
    const [humanAccuracy, setHumanAccuracy] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [charCount, setCharCount] = useState(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setCharCount(inputText.length);
    }, [inputText]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!inputText.trim() || inputText.length < 20) {
            setError("Please enter at least 20 characters for accurate analysis");
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
                body: JSON.stringify({ text_input: inputText.trim() }),
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

    const handleClearText = () => {
        setInputText('');
        setResult('');
        setAiAccuracy(null);
        setHumanAccuracy(null);
        setError(null);
    };

    const handleCopyResults = () => {
        const resultText = `
AI Text Detection Results:
Prediction: ${result}
AI Generated Probability: ${aiAccuracy}%
Human Written Probability: ${humanAccuracy}%
        `.trim();
        
        navigator.clipboard.writeText(resultText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container">
            <header className="app-header">
                <h1>AI Text Detection</h1>
                <p className="subtitle">Analyze text to determine if it was written by AI or a human</p>
            </header>
            
            <div className="input-section">
                <div className="input-header">
                    <h2>Input Text</h2>
                    <span className="char-count">{charCount} characters</span>
                </div>
                
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows="10"
                    placeholder="Type or paste your text here..."
                    disabled={isLoading}
                    className={isLoading ? "disabled" : ""}
                />
                
                <div className="button-group">
                    <button 
                        className="clear-button"
                        onClick={handleClearText}
                        disabled={isLoading || !inputText.trim()}
                    >
                        Clear
                    </button>
                    
                    <button 
                        className="submit-button"
                        onClick={handleSubmit} 
                        disabled={isLoading || !inputText.trim()}
                    >
                        {isLoading ? (
                            <span>
                                <span className="spinner"></span> Analyzing...
                            </span>
                        ) : (
                            'Detect'
                        )}
                    </button>
                </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {result && (
                <div className="result-section">
                    <div className="result-header">
                        <h2>Result</h2>
                        <button 
                            className="copy-button"
                            onClick={handleCopyResults}
                        >
                            {copied ? "Copied!" : "Copy Results"}
                        </button>
                    </div>
                    
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
                    
                    <div className="result-explanation">
                        <h3>What does this mean?</h3>
                        <p>
                            {result === "AI-Generated" 
                                ? "The text shows patterns typically found in AI-generated content. Higher percentages indicate stronger AI characteristics."
                                : "The text shows patterns typically found in human-written content. Higher percentages indicate stronger human characteristics."}
                        </p>
                        <p className="disclaimer">Note: This is an automated assessment and may not be 100% accurate.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextDetection;