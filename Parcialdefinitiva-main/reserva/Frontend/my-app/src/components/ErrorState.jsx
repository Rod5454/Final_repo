import React from 'react';
import '../App.css';

function ErrorState({ message }) {
  return <p className="error-message">Error: {message}</p>;
}

export default ErrorState;