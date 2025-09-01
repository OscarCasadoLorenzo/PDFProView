export type FileInfoType = {
  name: string
  url: string
}

export type OCRMark = {
  x: number
  y: number
  page: number
  id: number
  description: string
  text: string
}

export type PDFTextBlock = {
  text: string
  x: number
  y: number
  width: number
  height: number
  page: number
  fontSize?: number
  fontName?: string
}

export type PDFStructuredData = {
  textBlocks: PDFTextBlock[]
  pageCount: number
  extractedText: string
  metadata?: {
    filename: string
    totalPages: number
    extractionTimestamp: number
  }
}
