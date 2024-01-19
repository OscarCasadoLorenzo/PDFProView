import { Flex, Heading } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/react';
import { useRef } from 'react';
import './App.css';
import PDFNavigatorComponent from './components/PDFNavigatorComponent';
import { PdfUrlViewer } from './components/PdfURLViewer';

function App() {
  const windowRef: any = useRef();
  const url = 'sample.pdf';

  function obtainFilename(url: string) {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  }

  return (
    <Box className='App' m='5% 10%'>
      <Flex justifyContent='space-between' alignItems='center' mb='10px'>
        <Heading>{obtainFilename(url)}</Heading>
      </Flex>
      <PDFNavigatorComponent windowRef={windowRef} />

      <br />

      <PdfUrlViewer url={url} windowRef={windowRef} />
    </Box>
  );
}

export default App;
