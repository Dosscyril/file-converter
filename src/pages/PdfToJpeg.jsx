import React, { useState } from 'react';
const PdfToJpeg = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [jpegUrls, setJpegUrls] = useState([]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFileName(file.name);
      setJpegUrls([]);
    } else {
      alert('Please select a valid PDF file.');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a PDF file.');
      return;
    }
    const formData = new FormData();
    formData.append('pdf', selectedFile);
    try {
      const res = await fetch('http://127.0.0.1:5000/pdf-to-jpeg', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        const urls = data.filenames.map((name) => `http://127.0.0.1:5000/uploads/${name}`);
        setJpegUrls(urls);
      } else {
        alert('Conversion failed: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error sending PDF to backend.');
    }
  };
  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <h3>PDF to JPEG</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="file"
            accept="application/pdf"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        {fileName && (
          <div className="mb-3">
            <p>
              <strong>Selected PDF:</strong> {fileName}
            </p>
          </div>
        )}
        <button className="btn btn-primary w-100" type="submit" disabled={!selectedFile}>
          Convert to JPEG
        </button>
      </form>
      {jpegUrls.length > 0 && (
        <div className="mt-4">
          <h5>Converted JPEG Pages:</h5>
          <ul className="list-unstyled">
            {jpegUrls.map((url, index) => (
              <li key={index} className="mb-2">
                <a href={url} download className="btn btn-outline-success">
                  Download Page {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default PdfToJpeg;
