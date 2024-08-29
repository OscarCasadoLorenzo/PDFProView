import { ChakraProvider } from '@chakra-ui/react'
import pdfjs from 'pdfjs-dist'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import PDFProViewTheme from './theme/theme.ts'
pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.js'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={PDFProViewTheme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
)
