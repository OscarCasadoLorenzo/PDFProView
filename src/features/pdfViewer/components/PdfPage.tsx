import { useAtomValue, useSetAtom } from 'jotai'
import pdfjs from 'pdfjs-dist'
import React, { useCallback, useEffect, useRef } from 'react'
import {
  enabledOCRMarkers,
  fileAtom,
  pageAtom,
  pdfStructuredDataAtom,
  scaleAtom,
  searchTextAtom,
  totalPagesAtom
} from '../../../data/atoms'
import { PDFStructuredData, PDFTextBlock } from '../../../data/types'
import { drawArrow } from '../../../utils/canvas-utils'
import './PdfPage.css'
type PdfPageProps = {
  page: any
}

const PdfPage = React.memo((props: PdfPageProps) => {
  const { page } = props

  const text = useAtomValue(searchTextAtom)
  const scale = useAtomValue(scaleAtom)

  const canvasPDFRef: any = useRef()
  const canvasMarkersRef: any = useRef()
  const textLayerRef: any = useRef()

  const setPageNumber = useSetAtom(pageAtom)
  const enabledOCRMarkersValue = useAtomValue(enabledOCRMarkers)
  const setPdfStructuredData = useSetAtom(pdfStructuredDataAtom)
  const totalPages = useAtomValue(totalPagesAtom)
  const file = useAtomValue(fileAtom)

  function printOCRMarkers(context: any, actualPage: number) {
    enabledOCRMarkersValue
      .filter((marker) => marker.page === actualPage)
      .forEach((enabledMarker) => {
        drawArrow(
          context,
          enabledMarker.x - 50,
          enabledMarker.y,
          enabledMarker.x,
          enabledMarker.y
        )
      })
  }

  useEffect(() => {
    if (!page) {
      return
    }
    /** For avoid re-render each time the enabledMarkers are updated, we draw ALL the markers once when the page is rendered
            and we hide all of them with the css class 'hidden' and then we show only the enabled markers with the class 'visible'
            not affecting to the performance
        **/
    const canvas = canvasMarkersRef.current

    const viewport = page.getViewport({ scale })
    if (canvas) {
      canvas.height = viewport.height
      canvas.width = viewport.width
      const context = canvas.getContext('2d')

      const actualPageNumber = page.pageIndex + 1
      printOCRMarkers(context, actualPageNumber)
    }
  }, [page, enabledOCRMarkersValue, scale])

  useEffect(() => {
    const collection: HTMLCollection = textLayerRef.current.children
    if (collection !== null && collection !== undefined) {
      let spanArray: any = Array.from(collection)

      //Highlight all the spans that contains the text
      spanArray.map((span: any) => {
        //TODO: Increase occurence counter inside this if
        if (
          text !== '' &&
          span.textContent.toLowerCase().includes(text.toLowerCase())
        )
          span.classList.add('highlighted')
        else span.classList.remove('highlighted')
      })
    }
  }, [textLayerRef, text])

  useEffect(() => {
    // Extract structured data from rendered text layer spans
    if (!textLayerRef.current || !textLayerRef.current.children.length) {
      return
    }

    const spanArray: HTMLSpanElement[] = Array.from(
      textLayerRef.current.children
    ) as HTMLSpanElement[]
    console.log(
      'Extracting structured data from',
      spanArray.length,
      'text spans for page',
      page.pageIndex + 1
    )

    // Extract structured text data with coordinates from HTML spans
    const extractedTextBlocks: PDFTextBlock[] = spanArray
      .map((span: HTMLSpanElement) => {
        const text = span.innerText || span.textContent || ''

        // Extract coordinates from CSS styles
        const leftPx = span.style.left || '0px'
        const topPx = span.style.top || '0px'
        const fontSizePx = span.style.fontSize || '12px'
        const fontFamily = span.style.fontFamily || 'unknown'

        // Parse pixel values to numbers
        const x = parseFloat(leftPx.replace('px', '')) || 0
        const y = parseFloat(topPx.replace('px', '')) || 0
        const fontSize = parseFloat(fontSizePx.replace('px', '')) || 12

        // Calculate approximate width and height
        const width = text.length * fontSize * 0.6 // Rough estimation
        const height = fontSize

        return {
          text: text.trim(),
          x: x,
          y: y,
          width: width,
          height: height,
          page: page.pageIndex + 1,
          fontSize: fontSize,
          fontName: fontFamily
        }
      })
      .filter((block: PDFTextBlock) => block.text.length > 0) // Filter out empty text blocks

    // Store or update the structured PDF data
    setPdfStructuredData((prevData) => {
      const currentPageNumber = page.pageIndex + 1
      const existingBlocks = prevData?.textBlocks || []

      // Remove existing blocks for this page and add new ones
      const otherPagesBlocks = existingBlocks.filter(
        (block) => block.page !== currentPageNumber
      )
      const allTextBlocks = [...otherPagesBlocks, ...extractedTextBlocks]

      // Create combined text content for all pages
      const extractedText = allTextBlocks
        .sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x) // Sort by page, then y, then x
        .map((block) => block.text)
        .join(' ')

      const structuredData: PDFStructuredData = {
        textBlocks: allTextBlocks,
        pageCount: totalPages || 1,
        extractedText: extractedText,
        metadata: {
          filename: file?.name || 'current-pdf',
          totalPages: totalPages || 1,
          extractionTimestamp: Date.now()
        }
      }

      //console.log('Updated PDF Structured Data:', structuredData)
      return structuredData
    })
  }, [
    textLayerRef.current?.children.length,
    page,
    setPdfStructuredData,
    totalPages,
    file
  ])

  useEffect(() => {
    if (!page) {
      return
    }

    const viewport = page.getViewport({ scale })

    const canvas = canvasPDFRef.current
    if (canvas) {
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      const renderTask = page.render(renderContext)
      renderTask.promise
        .then(function () {
          // console.log("Page rendered");
        })
        .catch(() => {
          //console.log(e);
        })

      page.getTextContent().then((textContent: any) => {
        if (!textLayerRef.current) {
          return
        }

        console.log('a')

        // Pass the data to the method for rendering of text over the pdf canvas.
        pdfjs.renderTextLayer({
          textContent: textContent,
          container: textLayerRef.current,
          viewport: viewport,
          textDivs: []
        })
      })
    }
  }, [page, scale])

  const handleChangePage = useCallback(() => {
    setPageNumber(page.pageIndex + 1)
  }, [page])

  return (
    <div className="PdfPage" id="pdfPage" onMouseEnter={handleChangePage}>
      <canvas
        id="canvasMarkers"
        className="PdfPage_canvasMarkers"
        ref={canvasMarkersRef}
      />
      <canvas id="canvasPDF" ref={canvasPDFRef} />
      <div ref={textLayerRef} className="PdfPage__textLayer" />
    </div>
  )
})

export default PdfPage
