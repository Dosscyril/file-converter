import React, { useState } from 'react';
import axios from 'axios';
const ReduceImage = () => {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState('');
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadLink('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select an image first!');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('http://127.0.0.1:5000/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(res.data.message);
      setDownloadLink(`http://127.0.0.1:5000/uploads/${file.name}`);
    } catch (err) {
      alert('Upload failed, bro.');
      console.error(err);
    }
  };
  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4 text-center">Reduce Image Size</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-3">
          Upload & Compress
        </button>
      </form>
      {downloadLink && (
        <div className="text-center">
          <a href={downloadLink} className="btn btn-success" download>
            Download Compressed Image
          </a>
        </div>
      )}
    </div>
  );
};
export default ReduceImage;
