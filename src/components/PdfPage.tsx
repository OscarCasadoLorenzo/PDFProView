import pdfjs from 'pdfjs-dist';
import React, { useEffect, useRef } from 'react';
import './PdfPage.css';

type PdfPageProps = {
  page: any;
  scale?: number;
};

const PdfPage = React.memo((props: PdfPageProps) => {
  const { page, scale } = props;

  const canvasRef: any = useRef();

  const textLayerRef: any = useRef();

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
        // console.log("Page rendered");
      });

      page.getTextContent().then((textContent: any) => {
        // console.log(textContent);
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
      });
    }
  }, [page, scale]);

  return (
    <div className='PdfPage'>
      <canvas ref={canvasRef} />
      <div ref={textLayerRef} className='PdfPage__textLayer' />
    </div>
  );
});

export default PdfPage;
