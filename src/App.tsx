import { Flex, Heading } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { isEmpty } from 'lodash';
import { useEffect, useRef } from 'react';
import './App.css';
import PDFNavigatorComponent from './components/PDFNavigatorComponent';
import { PdfUrlViewer } from './components/PdfURLViewer';
import { fileAtom } from './data/atoms';
import UploadFileComponent from './features/uploadFile/view/UploadFileComponent';

function App() {
  const windowRef: any = useRef();

  const file = useAtomValue(fileAtom);

  useEffect(() => {
    console.log({ file });
  }, [file]);

  function obtainFilename(fileName: string) {
    const urlParts = fileName.split('/');
    return urlParts[urlParts.length - 1];
  }

  return (
    <Box className='App' m='5% 10%'>
      {isEmpty(file) && <UploadFileComponent />}
      {!isEmpty(file) && (
        <>
          <Flex justifyContent='space-between' alignItems='center' mb='10px'>
            <Heading>{obtainFilename(file.name)}</Heading>
          </Flex>

          <PDFNavigatorComponent windowRef={windowRef} />
          <br />
          <PdfUrlViewer url={file.url} windowRef={windowRef} />
        </>
      )}
    </Box>
  );
}

export default App;
