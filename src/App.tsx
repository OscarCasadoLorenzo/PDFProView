import { Button } from '@chakra-ui/button';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import { useRef, useState } from 'react';
import './App.css';
import PDFNavigatorComponent from './components/PDFNavigatorComponent';
import { PdfUrlViewer } from './components/PdfURLViewer';

function App() {
  //TODO: Scale & Page refactoring to JOTAI atoms
  const [scale, setScale] = useState(1);
  const [page, setPage] = useState<any>(1);
  const windowRef: any = useRef();
  const [text, setText] = useState('');
  const url = 'sample.pdf';

  function obtainFilename(url: string) {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  }

  return (
    <Box w='full' className='App'>
      <Flex justifyContent='space-between' alignItems='center'>
        <Heading>{obtainFilename(url)}</Heading>
        <Button>X</Button>
      </Flex>
      <PDFNavigatorComponent
        scale={scale}
        setScale={setScale}
        page={page}
        setPage={setPage}
        windowRef={windowRef}
        text={text}
        setText={setText}
      />

      <br />

      <PdfUrlViewer url={url} scale={scale} windowRef={windowRef} text={text} />
    </Box>
  );
}

export default App;
