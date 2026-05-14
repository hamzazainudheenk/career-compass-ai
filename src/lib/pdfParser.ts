import * as pdfjsLib from 'pdfjs-dist';

// For Create React App / Vite compatibility with PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
).toString();

export const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        return extractTextFromPdf(file);
    } else {
        // For txt and others, simple text reading
        return await file.text();
    }
};

const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
        const arrayBuffer = await file.arrayBuffer();

        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = '';
        const numPages = pdf.numPages;

        // Iterate through all pages to extract text
        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageItems = textContent.items.map((item: any) => item.str);
            const pageText = pageItems.join(' ');
            fullText += pageText + '\n\n';
        }

        return fullText.trim();
    } catch (error: any) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("PDF Parsing Error: " + (error.message || "Unknown error"));
    }
};
