import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import pdfjs from 'pdfjs-dist'
import React, { useCallback, useEffect, useRef } from 'react'
import {
  enabledOCRMarkers,
  pageAtom,
  scaleAtom,
  searchTextAtom
} from '../../../data/atoms'
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
  const [enabledOCRMarkersValue, setEnabledOCRMarkers] =
    useAtom(enabledOCRMarkers)

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
