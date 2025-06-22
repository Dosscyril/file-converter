import React, { useState } from 'react';
import axios from 'axios';
const JpegToPdf = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => file.type.startsWith('image/'));
    setSelectedFiles(validImages);
    setPreviews(validImages.map(file => URL.createObjectURL(file)));
    setDownloadUrl('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert('Please select at least one JPEG image');
      return;
    }
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('images', file));
    try {
      setLoading(true);
      const res = await axios.post('http://127.0.0.1:5000/jpeg-to-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(res.data.message);
      setDownloadUrl(`http://127.0.0.1:5000/uploads/${res.data.filename}`);
    } catch (error) {
      alert('Conversion failed.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mt-4">
      <h3>JPEG to PDF</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="file"
            accept="image/jpeg"
            className="form-control"
            multiple
            onChange={handleFileChange}
          />
        </div>
        {previews.length > 0 && (
          <div className="mb-3">
            <strong>Selected Images:</strong>
            <div className="d-flex flex-wrap mt-2">
              {previews.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`preview-${index}`}
                  className="img-thumbnail m-1"
                  style={{ width: '150px', height: 'auto' }}
                />
              ))}
            </div>
          </div>
        )}
        <button className="btn btn-primary" type="submit" disabled={loading || selectedFiles.length === 0}>
          {loading ? 'Converting...' : 'Convert to PDF'}
        </button>
      </form>
      {downloadUrl && (
        <div className="mt-4 text-center">
          <a href={downloadUrl} download className="btn btn-outline-primary">
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};
export default JpegToPdf;
