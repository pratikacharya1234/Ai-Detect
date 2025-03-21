import React, { useState } from 'react';
import NavBar from '../Components/NavBar';

const FileDetection = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Please select a file');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('/api/detect-file', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('File upload failed');
            }

            const data = await response.json();
            setResult(data.result);
        } catch (error) {
            setError('Error processing file: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <NavBar />
            <div className="container">
                <header className="app-header">
                    <h1>File Analysis</h1>
                    <p className="subtitle">Upload a file to analyze its content</p>
                </header>

                <div className="input-section">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".txt,.doc,.docx,.pdf"
                        disabled={isLoading}
                    />
                    
                    <button 
                        onClick={handleSubmit}
                        disabled={!selectedFile || isLoading}
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze File'}
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                
                {result && (
                    <div className="result-section">
                        <h2>Analysis Result</h2>
                        <p>{result}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default FileDetection;
