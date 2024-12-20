import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Slot for setting CSS variables
const colorString = 'f6f6f6-e0e1d6-1a090d-1f5673-356986';
const colors = colorString.split('-');

// Map colors to semantic variable names
const colorMap = {
  '--background-1': `#${colors[0]}`,
  '--background-2': `#${colors[1]}`,
  '--text': `#${colors[2]}`,
  '--accent-1': `#${colors[3]}`,
  '--accent-2': `#${colors[4]}`,
};

// Apply CSS variables to :root
const root = document.documentElement;
Object.entries(colorMap).forEach(([name, value]) => {
  root.style.setProperty(name, value);
});

// Render the React App
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
