import { atom } from 'jotai'

import { FileInfoType, OCRMark } from './types'

export const fileAtom = atom<FileInfoType | null>(null)

export const pageAtom = atom<number>(1)
export const scaleAtom = atom<number>(1)
export const searchTextAtom = atom<string>('')
export const enabledOCRMarkers = atom<OCRMark[]>([])

export const totalPagesAtom = atom<number>(0)
