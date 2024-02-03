import pdfjs from 'pdfjs-dist';
import { useCallback, useEffect, useRef, useState } from 'react';
import PdfViewer from './PdfViewer';

type PdfUrlViewerProps = {
  url: string;
  windowRef?: any;
};

export const PdfUrlViewer: React.FC<PdfUrlViewerProps> = ({
  url,
  ...others
}: PdfUrlViewerProps) => {
  const pdfRef: any = useRef();

  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    var loadingTask = pdfjs.getDocument(url);
    loadingTask.promise.then(
      (pdf: any) => {
        pdfRef.current = pdf;

        setItemCount(pdf._pdfInfo.numPages);

        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function () {
          //console.log('Page loaded');
        });
      },
      (reason: any) => {
        // PDF loading error
        console.error(reason);
      }
    );
  }, [url]);

  const handleGetPdfPage = useCallback((index: number) => {
    return pdfRef.current.getPage(index + 1);
  }, []);

  return (
    <PdfViewer
      {...others}
      itemCount={itemCount}
      getPdfPage={handleGetPdfPage}
    />
  );
};
