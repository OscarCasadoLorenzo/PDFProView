import EyeFillIcon from '@/icons/EyeFilledIcon'
import EyeIcon from '@/icons/EyeIcon'
import { Box, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import React from 'react'
import { enabledOCRMarkers } from '../../data/atoms'
import OCRMarkers from '../../data/ocr-sample'
import { OCRMark } from '../../data/types'

type MarkersProps = {
}
export  const Markers: React.FC<MarkersProps> = ({})=>{

 const [enabledOCRMarkersValue, setEnabledOCRMarkers] = useAtom(enabledOCRMarkers)

 function removeEnabledMarkerById(markerToRemoveID:number){
  return enabledOCRMarkersValue.filter(marker => marker.id !== markerToRemoveID)
 }

 function handleMarkerClick(isEnabled:boolean, selectedMarker:OCRMark){
  let newEnabledMarkers:OCRMark[] = []
  isEnabled ? newEnabledMarkers = removeEnabledMarkerById(selectedMarker.id) : newEnabledMarkers = enabledOCRMarkersValue.concat(selectedMarker)
  setEnabledOCRMarkers(newEnabledMarkers)
 }

 return <Box>{OCRMarkers.map((OCRMark)=>{
  return (
   <Box>
     <FormLabel>{OCRMark.description}</FormLabel>
   <InputGroup>
   <InputLeftAddon>{enabledOCRMarkersValue.includes(OCRMark) ? <EyeFillIcon onClick={ () => {handleMarkerClick(enabledOCRMarkersValue.includes(OCRMark), OCRMark)}}/> : <EyeIcon onClick={ () => {handleMarkerClick(enabledOCRMarkersValue.includes(OCRMark), OCRMark)}}/>}</InputLeftAddon>
   <Input disabled={true} value={OCRMark.text}></Input>
   </InputGroup>
   </Box>
  )
 })}</Box>
}
  
