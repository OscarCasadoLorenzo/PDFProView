import { useAtomValue } from 'jotai';
import pdfjs from 'pdfjs-dist';
import React, { useEffect, useRef } from 'react';
import { scaleAtom, searchTextAtom } from '../data/atoms';
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

  function numberOfOccurrences(textContent: any) {
    let textOCR = '';
    //console.log(textContent.items);
    textContent.items.map((p: any) => {
      //console.log(p.str);
      textOCR = textOCR.concat(p.str);
    });
    // console.log(textOCR);

    //Lowercase
    textOCR = textOCR.toLowerCase();

    // Get number of ocurrences
    let ocurrences = textOCR.split('boring').length - 1;

    //console.log(ocurrences);
    return ocurrences;
  }

  function printRectInCanvas(canvasContext: any) {
    canvasContext.fillStyle = 'blue';
    canvasContext.fillRect(50, 50, 100, 100); // Adjust the coordinates (x, y) and size (width, height)
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
        .catch((e: any) => {
          //console.log(e);
        });

      page.getTextContent().then((textContent: any) => {
        if (!textLayerRef.current) {
          return;
        }

        // Pass the data to the method for rendering of text over the pdf canvas.
        var textToRender = pdfjs.renderTextLayer({
          textContent: textContent,
          container: textLayerRef.current,
          viewport: viewport,
          textDivs: [],
        });

        //Draw a blue rectangle on the canvas
        // printRectInCanvas(context);
      });
    }
  }, [page, scale]);

  return (
    <div className='PdfPage' id='pdfPage'>
      <canvas id='canvas' ref={canvasRef} />
      <div ref={textLayerRef} className='PdfPage__textLayer' />
    </div>
  );
});

export default PdfPage;
