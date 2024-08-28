import { useAtom, useAtomValue } from 'jotai';
import pdfjs from 'pdfjs-dist';
import React, { useEffect, useRef } from 'react';
import { enabledOCRMarkers, scaleAtom, searchTextAtom } from '../data/atoms';
import { drawArrow } from '../utils/canvas-utils';
import './PdfPage.css';
type PdfPageProps = {
  page: any;
};



const PdfPage = React.memo((props: PdfPageProps) => {

  const { page } = props;

  const text = useAtomValue(searchTextAtom);
  const scale = useAtomValue(scaleAtom);

  const canvasRef: any = useRef();
  const textLayerRef: any = useRef();

  const [enabledOCRMarkersValue, setEnabledOCRMarkers] = useAtom(enabledOCRMarkers)

  function printOCRMarkers(context: any, actualPage:number){
    enabledOCRMarkersValue.filter(marker => marker.page === actualPage).forEach((enabledMarker) =>{
      drawArrow(context, enabledMarker.x-50, enabledMarker.y, enabledMarker.x, enabledMarker.y)
    })
  }

  useEffect(() => {
    const collection: HTMLCollection = textLayerRef.current.children;
    if (collection !== null && collection !== undefined) {
      let spanArray: any = Array.from(collection);
      spanArray.map((span: any) => {
        //TODO: Increase occurence counter inside this if
        if (
          text !== '' &&
          span.textContent.toLowerCase().includes(text.toLowerCase())
        )
          span.classList.add('highlighted');
        else span.classList.remove('highlighted');
      });
    }
  }, [textLayerRef, text]);

  useEffect(() => {
    if (!page) {
      return;
    }

    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      const renderTask = page.render(renderContext);
      renderTask.promise
        .then(function () {
          // console.log("Page rendered");
        })
        .catch(() => {
          //console.log(e);
        });

      page.getTextContent().then((textContent: any) => {
        if (!textLayerRef.current) {
          return;
        }

        // Pass the data to the method for rendering of text over the pdf canvas.
        pdfjs.renderTextLayer({
          textContent: textContent,
          container: textLayerRef.current,
          viewport: viewport,
          textDivs: [],
        });
        const actualPageNumber = page.pageIndex+1

        //Draw a blue rectangle on the canvas
        printOCRMarkers(context, actualPageNumber)
      });
    }
  }, [page, scale, enabledOCRMarkersValue]);


  return (
    <div className='PdfPage' id='pdfPage'>
      <canvas id='canvas' ref={canvasRef} />
      <div ref={textLayerRef} className='PdfPage__textLayer' />
    </div>
  );
});

export default PdfPage;
