import { atom } from 'jotai'

import { FileInfoType, OCRMark, PDFStructuredData } from './types'

export const fileAtom = atom<FileInfoType | null>(null)

export const pageAtom = atom<number>(1)
export const scaleAtom = atom<number>(1)
export const searchTextAtom = atom<string>('')

export const OCRMarkersAtom = atom<OCRMark[]>([])
export const enabledOCRMarkers = atom<OCRMark[]>([])

export const totalPagesAtom = atom<number>(0)

// Atom to store structured PDF data with text blocks and coordinates
export const pdfStructuredDataAtom = atom<PDFStructuredData | null>(null)
