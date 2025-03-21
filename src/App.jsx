import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './Pages/Home';
import FileDetection from './Pages/FileDetection';
import Setting from './Pages/Setting';
import TextDetect from './Pages/TextDetect';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/text" element={<TextDetect />} />
        <Route path="/file" element={<FileDetection />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </BrowserRouter>
  );
}