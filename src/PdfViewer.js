import React, { useEffect, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import pdf from "./files/merged-pdf (1).pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import styles from "./pdfViewer.module.css";
import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const maxWidth = 800;

function PdfViewer() {
  const [numPages, setNumPages] = useState(0);
  const [pages, setPages] = useState([]);
  const [deletedPages, setDeletedPages] = useState([]);

  useEffect(() => {
    console.log(pdf?.numPages);
  }, [pdf]);

  const onDocumentLoadSuccess = (pdf) => {
    setNumPages(pdf?.numPages);
    setPages(Array.from({ length: pdf?.numPages }, (_, i) => i + 1));
  };

  const handleDeletePage = (pageNumber) => {
    setDeletedPages((prev) => [...prev, pageNumber]);
    setPages(pages.filter((page) => page !== pageNumber));
  };

  const handleSubmitPdf = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/delete_pages", {
        input_path: "C:/Users/amanp/Desktop/self study material/impulse compute/pdf-viewer-main/src/files/merged-pdf (1).pdf",
        pages_to_delete: deletedPages
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'modified.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error submitting PDF:", error);
    }
  };

  return (
    <div className={styles["pdf-viewer"]}>
      <div>PDF File Viewer</div>
      <button
        className={styles["submit-button"]}
        onClick={handleSubmitPdf}
      >
        Submit Pdf
      </button>
      <Document
        file={pdf}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
      >
        {pages.map((pageNumber) => (
          <div key={`page_${pageNumber}`} className={styles["pdf-page-container"]}>
            <button
              className={styles["delete-button"]}
              onClick={() => handleDeletePage(pageNumber)}
            >
              Delete Page
            </button>
            <Page
              pageNumber={pageNumber}
              width={maxWidth}
            />
          </div>
        ))}
      </Document>
    </div>
  );
}

export default PdfViewer;
