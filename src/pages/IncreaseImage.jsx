import React, { useState } from 'react';
import axios from 'axios';
const IncreaseImage = () => {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadUrl('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select an image.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('http://127.0.0.1:5000/increase-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(res.data.message);
      setDownloadUrl(`http://127.0.0.1:5000/uploads/${res.data.filename}`);
    } catch (err) {
      alert('Upload failed.');
      console.error(err);
    }
  };
  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4 text-center">Increase Image Size</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          Upload & Enlarge
        </button>
      </form>
      {downloadUrl && (
        <div className="mt-4 text-center">
          <a href={downloadUrl} download className="btn btn-outline-primary">
            Download Enlarged Image
          </a>
        </div>
      )}
    </div>
  );
};
export default IncreaseImage;
