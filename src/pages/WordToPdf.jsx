import React, { useState } from 'react';
const WordToPdf = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith('.doc') || file.name.endsWith('.docx'))) {
      setSelectedFile(file);
      setPdfUrl('');
    } else {
      alert('Please select a .doc or .docx file.');
      setSelectedFile(null);
      setPdfUrl('');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('word', selectedFile);
    try {
      const response = await fetch('http://localhost:5000/word-to-pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setPdfUrl(`http://localhost:5000/uploads/${data.filename}`);
      } else {
        alert(`Error: ${data.message}`);
        setPdfUrl('');
      }
    } catch (error) {
      alert('Error uploading file');
      console.error(error);
      setPdfUrl('');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mt-4">
      <h3>Word to PDF</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="file"
            accept=".doc,.docx"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        {selectedFile && (
          <div className="mb-3">
            <p><strong>Selected File:</strong> {selectedFile.name}</p>
          </div>
        )}
        <button className="btn btn-primary" type="submit" disabled={!selectedFile || loading}>
          {loading ? 'Converting...' : 'Convert to PDF'}
        </button>
      </form>
      {pdfUrl && (
        <div className="mt-3">
          <h5>Download PDF:</h5>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-success">
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};
export default WordToPdf;
