# [PDFProView](https://oscarcasadolorenzo.github.io/PDFProView/)

PDFProView is an open-source project that harnesses the power of React and the pdfjs-dist library to deliver a versatile and customizable PDF viewing experience. Whether you're building an application that requires seamless PDF integration or you're a developer looking for a robust PDF viewer, PDFProView has you covered.

## Features

- **React-Powered:** Utilizes the flexibility and efficiency of React to create a dynamic and responsive PDF viewer.

- **Customizable UI:** Tailor the user interface to fit your application's design and branding.

- **Versatile Navigation:** Navigate through PDF documents with ease using intuitive controls.

- **Zoom and Pan:** Zoom in and out of pages, and pan across the document for a closer inspection.

- **Page Navigation:** Quickly jump to specific pages or scroll through the document seamlessly.

- **Text recognition:** Perform text searches within PDF documents for quick and efficient information retrieval.

## Explanation

![Layers distribution](doc-images/layers-structure.png?raw=true 'Layers distribution')

This image displays the principal PDFProView containers z-index stacking. There are two
canvas and one div surrounded by #pdfPage to keep the impression to final user that they
are using a common PDF, but we have 3 different layers that allows us to implement some
functionalities encapsulated.

0. PdfPage
1. canvasMarkers
2. PdfPage\_\_textLayer
3. canvasPDF

![HTML Layers](doc-images/layers-html.png?raw=true 'HTML Layers')

## 1.Canvas markers

### Printable area to OCR markers

![Layer 1](doc-images/layer-1.png?raw=true 'Layer 1')

This layer consists in a canvas that brings the possibility
to add some marks (arrows) in certain coordinates (x, y,
pageNumber). The functionality born with the idea to
receive a JSON with OCR data from a external service
with the main info of the document (p.e. If the software
will be used by a Human Resources team that checks
hundreds CV's a month we could upload the PDF in the
OCR to recover name, English level or certifications
list and its coordinates to be checked visually in case of
database errors in the process to automate the manual
insertion of information).

This canvas re-renders every time enabledOCRMarkers
atoms is modified, removing the hole content and
printing all the arrows that correspond whit the selected
data on the interface.

![Input markers](doc-images/markers-input.png?raw=true 'Input markers')

## 2.Text layer container

### Invisible text surrounded by span's

![Layer 2](doc-images/layer-2.png?raw=true 'Layer 2')

The main purpose of this layer is to keep the visible text
at the next layer (3. PDF content canvas image) selectable.
Due the image is not selectable this layer should be exactly
placed over the next one to make this invisible text (zero
opacity) coincidence with the image below.

Moreover it is used by text recognition input too, highlighting
the transparent text on every coincidence.
⚠️ Actually this recognition is done through sentence blocks
(groups of words) that converges in the same <span>.
Probably this can be fixed modifying the PDFJS-dist library
used to extract the data from the file.

![Text rendering code](doc-images/text-extraction.png?raw=true 'Text rendering code')

## 3.PDF content image canvas

### Invisible selectable text surrounded by span's

![Layer 3](doc-images/layer-3.png?raw=true 'Layer 3')

This final layer is the most important one due the fact
all the visible images, graphs and text. It also is located
behind the other layers.

Is important to figure it out that without this layer the
user would not be able to see any information.

These 3 layers are inside the 'pdfPage' div container
that implements a lazy loading functionality to display
pages based on the user viewport, keeping the web
performance.

## Contributing

We welcome contributions to PDFProView! If you have suggestions, find bugs, or want to add new features, please check out our [Contributing Guidelines](https://github.com/OscarCasadoLorenzo/PDFProView/blob/develop/CONTRIBUTING.MD).

## License

PDFProView is released under the [MIT License](https://opensource.org/about/).

---

Thank you for choosing PDFProView! We hope it enhances your PDF viewing experience. Feel free to explore the code, contribute, and make it even better. Happy coding! 📄🚀
