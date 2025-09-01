import BoxArrowLeftIcon from '@/icons/BoxArrowLeft'
import EyeFillIcon from '@/icons/EyeFilledIcon'
import EyeIcon from '@/icons/EyeIcon'
import {
  Box,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Text
} from '@chakra-ui/react'
import { useAtom, useAtomValue } from 'jotai'
import React from 'react'
import { enabledOCRMarkers, OCRMarkersAtom } from '../../../../data/atoms'
import { OCRMark } from '../../../../data/types'

type MarkersProps = {
  windowRef: any
}
export const Markers: React.FC<MarkersProps> = ({ windowRef }) => {
  const [enabledOCRMarkersValue, setEnabledOCRMarkers] =
    useAtom(enabledOCRMarkers)
  const ocrMarkersFromAI = useAtomValue(OCRMarkersAtom)

  function removeEnabledMarkerById(markerToRemoveID: number) {
    return enabledOCRMarkersValue.filter(
      (marker) => marker.id !== markerToRemoveID
    )
  }

  function scrollToSelectedMark(selectedMarker: OCRMark) {
    console.log('Scrolling to marker on page:', selectedMarker.page)
    windowRef.current &&
      windowRef.current.scrollToItem(selectedMarker.page - 1, 'start')
  }

  function handleMarkerClick(isEnabled: boolean, selectedMarker: OCRMark) {
    let newEnabledMarkers: OCRMark[] = []
    isEnabled
      ? (newEnabledMarkers = removeEnabledMarkerById(selectedMarker.id))
      : (newEnabledMarkers = enabledOCRMarkersValue.concat(selectedMarker))
    setEnabledOCRMarkers(newEnabledMarkers)

    if (!isEnabled) {
      scrollToSelectedMark(selectedMarker)
    }
  }

  return (
    <Box>
      {ocrMarkersFromAI.length === 0 ? (
        <Text color="gray.500" fontSize="sm" textAlign="center" py={4}>
          Ask the AI to find information in the document to see markers here
        </Text>
      ) : (
        ocrMarkersFromAI.map((ocrMark: OCRMark) => {
          return (
            <Box key={ocrMark.id} mb={3}>
              <FormLabel>{ocrMark.description}</FormLabel>
              <InputGroup>
                <InputLeftAddon
                  onClick={() => {
                    handleMarkerClick(
                      enabledOCRMarkersValue.includes(ocrMark),
                      ocrMark
                    )
                  }}
                >
                  {enabledOCRMarkersValue.includes(ocrMark) ? (
                    <EyeFillIcon color={'primary.700'} />
                  ) : (
                    <EyeIcon color={'primary.700'} />
                  )}
                </InputLeftAddon>
                <Input disabled={true} value={ocrMark.text}></Input>
                <InputRightAddon
                  onClick={() => {
                    scrollToSelectedMark(ocrMark)
                  }}
                >
                  <BoxArrowLeftIcon />
                </InputRightAddon>
              </InputGroup>
            </Box>
          )
        })
      )}
    </Box>
  )
}
