import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Assuming App.tsx is your main application component
import './index.css'; // Assuming you have a global CSS file for styling

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
