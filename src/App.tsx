import { useRef, useState } from 'react';
import './App.css';
import { PdfUrlViewer } from './components/PdfURLViewer';

function App() {
  //TODO: Scale & Page refactoring to JOTAI atoms
  const [scale, setScale] = useState(1);
  const [page, setPage] = useState<any>(1);
  const windowRef: any = useRef();
  const url = 'sample.pdf';

  const scrollToItem = () => {
    windowRef.current && windowRef.current.scrollToItem(page - 1, 'start');
  };

  return (
    <div className='App'>
      <h1>Pdf Viewer</h1>
      <div>
        <input value={page} onChange={(e) => setPage(e.target.value)} />
        <button type='button' onClick={scrollToItem}>
          goto
        </button>
        Zoom
        <button type='button' onClick={() => setScale((v) => v + 0.1)}>
          +
        </button>
        <button type='button' onClick={() => setScale((v) => v - 0.1)}>
          -
        </button>
      </div>
      <br />

      <PdfUrlViewer url={url} scale={scale} windowRef={windowRef} />
    </div>
  );
}

export default App;
