import React, { useState } from 'react';
const PdfToWord = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid PDF file.');
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Sending ${selectedFile.name} to backend for PDF to Word conversion...`);
  };
  return (
    <div className="container mt-4">
      <h3>PDF to Word</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="file"
            accept="application/pdf"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        {selectedFile && (
          <div className="mb-3">
            <p>
              <strong>Selected File:</strong> {selectedFile.name}
            </p>
          </div>
        )}
        <button className="btn btn-primary" type="submit" disabled={!selectedFile}>
          Convert to Word
        </button>
      </form>
    </div>
  );
};
export default PdfToWord;
