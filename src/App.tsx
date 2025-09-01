import { ConversationPanel } from '@/features/conversation'
import { createConversationMessageHandler } from '@/features/conversation/utils/conversationHandler'
import { PdfUrlViewer } from '@/features/pdfViewer/components/PdfUrlViewer'
import { Flex, Heading, HStack } from '@chakra-ui/layout'
import { AbsoluteCenter, Box } from '@chakra-ui/react'
import PDFNavigatorComponent from '@features/pdfViewer/components/PDFNavigatorComponent'
import { useAtomValue, useSetAtom } from 'jotai'
import { isEmpty } from 'lodash'
import { useRef } from 'react'
import './App.css'
import { fileAtom, OCRMarkersAtom, pdfStructuredDataAtom } from './data/atoms'
import { OCRMark } from './data/types'
import { Markers } from './features/pdfViewer/components/ocr-markers/OCRMarkers'
import UploadFileComponent from './features/uploadFile/view/UploadFileComponent'
function App() {
  const windowRef: any = useRef()

  const file = useAtomValue(fileAtom)
  const pdfStructuredData = useAtomValue(pdfStructuredDataAtom)
  const setOCRMarkers = useSetAtom(OCRMarkersAtom)

  function obtainFilename(fileName: string) {
    const urlParts = fileName.split('/')
    return urlParts[urlParts.length - 1]
  }

  // Callback to handle OCR markers from OpenAI response
  const handleMarkersExtracted = (markers: OCRMark[]) => {
    console.log('Setting OCR markers from OpenAI:', markers)
    setOCRMarkers(markers)
  }

  // OpenAI-powered conversation handler with markers callback
  const handleSendMessage = createConversationMessageHandler(
    import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-api-key',
    handleMarkersExtracted
  )

  return (
    <Box className="App" bgColor="brand.background">
      {isEmpty(file) && (
        <AbsoluteCenter>
          <UploadFileComponent />
        </AbsoluteCenter>
      )}
      {!isEmpty(file) && (
        <>
          <HStack
            justifyContent={'center'}
            my={20}
            align="flex-start"
            spacing={6}
          >
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
            <Box minW="400px" maxW="500px">
              <ConversationPanel
                onSendMessage={handleSendMessage}
                pdfData={{
                  ...file,
                  structuredData: pdfStructuredData,
                  textContent: pdfStructuredData?.extractedText
                }}
                title="AI Document Assistant"
                placeholder="Ask me to find specific information in this document..."
                height="600px"
              />
            </Box>
          </HStack>
        </>
      )}
    </Box>
  )
}

export default App
