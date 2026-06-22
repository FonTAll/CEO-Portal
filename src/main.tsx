import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Force clear cache for user testing per request
localStorage.removeItem('saleRevenueCache');
localStorage.removeItem('costExpenseCache');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
