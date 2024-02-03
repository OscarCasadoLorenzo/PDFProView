import { PdfUrlViewer } from '@/features/pdfViewer/components/PdfUrlViewer';
import { Flex, Heading } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/react';
import PDFNavigatorComponent from '@features/pdfViewer/components/PDFNavigatorComponent';
import { useAtomValue } from 'jotai';
import { isEmpty } from 'lodash';
import { useRef } from 'react';
import './App.css';
import { fileAtom } from './features/pdfViewer/data/atoms';
import UploadFileComponent from './features/uploadFile/view/UploadFileComponent';
function App() {
  const windowRef: any = useRef();

  const file = useAtomValue(fileAtom);

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
