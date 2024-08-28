import EyeFillIcon from '@/icons/EyeFilledIcon'
import EyeIcon from '@/icons/EyeIcon'
import { Box, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import React from 'react'
import { enabledOCRMarkers } from '../../data/atoms'
import OCRMarkers from '../../data/ocr-sample'
import { OCRMark } from '../../data/types'

type MarkersProps = {
  windowRef: any
}
export  const Markers: React.FC<MarkersProps> = ({windowRef})=>{

 const [enabledOCRMarkersValue, setEnabledOCRMarkers] = useAtom(enabledOCRMarkers)

 function removeEnabledMarkerById(markerToRemoveID:number){
  return enabledOCRMarkersValue.filter(marker => marker.id !== markerToRemoveID)
 }

 function scrollToSelectedMark(selectedMarker:OCRMark){
    windowRef.current && windowRef.current.scrollToItem(selectedMarker.page-1, 'start');
 }

 function handleMarkerClick(isEnabled:boolean, selectedMarker:OCRMark){
  let newEnabledMarkers:OCRMark[] = []
  isEnabled ? newEnabledMarkers = removeEnabledMarkerById(selectedMarker.id) : newEnabledMarkers = enabledOCRMarkersValue.concat(selectedMarker)
  setEnabledOCRMarkers(newEnabledMarkers)

  if(!isEnabled){
    scrollToSelectedMark(selectedMarker)
  }
 }

 return <Box>{OCRMarkers.map((OCRMark)=>{
  return (
   <Box>
     <FormLabel>{OCRMark.description}</FormLabel>
   <InputGroup>
   <InputLeftAddon>{enabledOCRMarkersValue.includes(OCRMark) ? <EyeFillIcon color={'primary.700'} onClick={ () => {handleMarkerClick(enabledOCRMarkersValue.includes(OCRMark), OCRMark)}}/> : <EyeIcon color={'primary.700'} onClick={ () => {handleMarkerClick(enabledOCRMarkersValue.includes(OCRMark), OCRMark)}}/>}</InputLeftAddon>
   <Input disabled={true} value={OCRMark.text}></Input>
   </InputGroup>
   </Box>
  )
 })}</Box>
}
  
