import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
const features = [
  'Reduce Image Size',
  'Increase Image Size',
  'PDF to JPEG',
  'JPEG to PDF',
  'Word to PDF',
  'PDF to Word'
];
const Home = () => {
  const navigate = useNavigate();
  const handleFeatureClick = (feature) => {
    switch (feature) {
      case 'Reduce Image Size':
        navigate('/reduce-image');
        break;
      case 'Increase Image Size':
        navigate('/increase-image');
        break;
      case 'PDF to JPEG':
        navigate('/pdf-to-jpeg');
        break;
      case 'JPEG to PDF':
        navigate('/jpeg-to-pdf');
        break;
      case 'Word to PDF':
        navigate('/word-to-pdf');
        break;
      case 'PDF to Word':
        navigate('/pdf-to-word');
        break;
      default:
        break;
    }
  };
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Select a Feature</h2>
      <div className="row">
        {features.map((feature) => (
          <FeatureCard key={feature} title={feature} onClick={() => handleFeatureClick(feature)} />
        ))}
      </div>
    </div>
  );
};
export default Home;
