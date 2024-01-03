import pdfjs from 'pdfjs-dist';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://d2v5g.csb.app/pdf.worker.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
