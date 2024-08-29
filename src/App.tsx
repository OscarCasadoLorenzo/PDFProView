import { PdfUrlViewer } from '@/features/pdfViewer/components/PdfUrlViewer'
import { Flex, Heading, HStack } from '@chakra-ui/layout'
import { AbsoluteCenter, Box } from '@chakra-ui/react'
import PDFNavigatorComponent from '@features/pdfViewer/components/PDFNavigatorComponent'
import { useAtomValue } from 'jotai'
import { isEmpty } from 'lodash'
import { useRef } from 'react'
import './App.css'
import { fileAtom } from './data/atoms'
import { Markers } from './features/pdfViewer/components/ocr-markers/OCRMarkers'
import UploadFileComponent from './features/uploadFile/view/UploadFileComponent'
function App() {
  const windowRef: any = useRef()

  const file = useAtomValue(fileAtom)

  function obtainFilename(fileName: string) {
    const urlParts = fileName.split('/')
    return urlParts[urlParts.length - 1]
  }

  return (
    <Box className="App" bgColor="brand.background">
      {isEmpty(file) && (
        <AbsoluteCenter>
          <UploadFileComponent />
        </AbsoluteCenter>
      )}
      {!isEmpty(file) && (
        <>
          <HStack justifyContent={'center'} my={20}>
            <Box>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                mb="10px"
              >
                <Heading>{obtainFilename(file.name)}</Heading>
              </Flex>
              <PDFNavigatorComponent windowRef={windowRef} />
              <br />
              <PdfUrlViewer url={file.url} windowRef={windowRef} />
            </Box>

            <Markers windowRef={windowRef} />
          </HStack>
        </>
      )}
    </Box>
  )
}

export default App
