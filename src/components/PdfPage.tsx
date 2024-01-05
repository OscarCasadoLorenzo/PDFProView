import pdfjs from 'pdfjs-dist';
import React, { useEffect, useRef } from 'react';
import './PdfPage.css';

type PdfPageProps = {
  page: any;
  scale?: number;
  text: string;
};

const PdfPage = React.memo((props: PdfPageProps) => {
  const { page, scale } = props;

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

    console.log(ocurrences);
    return ocurrences;
  }

  function printRectInCanvas(canvasContext: any) {
    canvasContext.fillStyle = 'blue';
    canvasContext.fillRect(50, 50, 100, 100); // Adjust the coordinates (x, y) and size (width, height)
  }

  useEffect(() => {
    highlightText(textLayerRef.current, props.text);
  }, [props.text, textLayerRef.current]);

  function highlightText(textLayer: any, text: string) {
    console.log({ textLayer });
    let collection: HTMLCollection = textLayer.children;
    console.log(textLayer.children);
    let spanArray: any = Array.from(collection);
    console.log(spanArray);
    //if (spanArray[0] !== undefined) spanArray[0].style.backgroundColor = 'red';
    spanArray.map((span: any) => {
      console.log(span.textContent);
      if (span.textContent.includes('Virtual'))
        span.classList.add('highlighted');
    });
  }

  useEffect(() => {
    if (!page) {
      return;
    }
    const viewport = page.getViewport({ scale });

    // Prepare canvas using PDF page dimensions
    const canvas: any = canvasRef.current;
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
      renderTask.promise.then(function () {
        // console.log("Page rendered"); // Adjust the coordinates (x, y) and size (width, height)
      });

      page.getTextContent().then((textContent: any) => {
        //console.log(textContent);
        //console.log(numberOfOccurrences(textContent));

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

        //console.log({ textToRender });

        // Draw a blue rectangle on the canvas
        //printRectInCanvas(context);
      });
    }
  }, [page, scale]);

  return (
    <div className='PdfPage'>
      <canvas id='canvas' ref={canvasRef} />
      <div id='textLayer' ref={textLayerRef} className='PdfPage__textLayer' />
    </div>
  );
});

export default PdfPage;
