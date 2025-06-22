import React from 'react';
const FeatureCard = ({ title, onClick }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm" onClick={onClick} style={{ cursor: 'pointer' }}>
        <div className="card-body text-center">
          <h5 className="card-title">{title}</h5>
        </div>
      </div>
    </div>
  );
};
export default FeatureCard;
