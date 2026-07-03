import React from 'react';

export const CustomToast = ({ title, message }) => (
  <div className="0">
    <h4 className="custom-toast-title">{title}</h4>
    <p className="custom-toast-message">{message}</p>
  </div>
);
