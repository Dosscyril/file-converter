// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ReduceImage from './pages/ReduceImage';
import IncreaseImage from './pages/IncreaseImage';
import PdfToJpeg from './pages/PdfToJpeg';
import JpegToPdf from './pages/JpegToPdf';
import WordToPdf from './pages/WordToPdf';
import PdfToWord from './pages/PdfToWord';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reduce-image" element={<ReduceImage />} />
        <Route path="/increase-image" element={<IncreaseImage />} />
        <Route path="/pdf-to-jpeg" element={<PdfToJpeg />} />
        <Route path="/jpeg-to-pdf" element={<JpegToPdf />} />
        <Route path="/word-to-pdf" element={<WordToPdf />} />
        <Route path="/pdf-to-word" element={<PdfToWord />} />
      </Routes>
    </Router>
  );
}
export default App;
