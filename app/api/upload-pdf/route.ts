import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";

// Define a type for our chunked response
type ChunkedResponse = {
  fileName: string;
  textChunk: string;
  totalChunks: number;
  currentChunk: number;
  chunkSize: number;
};

export async function POST(req: NextRequest) {
  const formData: FormData = await req.formData();
  const uploadedFiles = formData.getAll("filepond");
  const CHUNK_SIZE = 100000; // 100KB chunks
  const pageNumber = parseInt(formData.get("page")?.toString() || "1");

  let fileName = "";
  let parsedText = "";

  if (uploadedFiles && uploadedFiles.length > 0) {
    const uploadedFile = uploadedFiles[1];

    if (uploadedFile instanceof File) {
      fileName = uuidv4();
      const tempFilePath = `/tmp/${fileName}.pdf`;

      const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
      await fs.writeFile(tempFilePath, new Uint8Array(fileBuffer));

      parsedText = await new Promise((resolve, reject) => {
        const pdfParser = new (PDFParser as any)(null, 1);

        pdfParser.on("pdfParser_dataError", (errData: any) => {
          reject(errData.parserError);
        });

        pdfParser.on("pdfParser_dataReady", () => {
          resolve((pdfParser as any).getRawTextContent());
        });

        pdfParser.loadPDF(tempFilePath);
      });

      await fs.unlink(tempFilePath);

      const textChunks = [];
      for (let i = 0; i < parsedText.length; i += CHUNK_SIZE) {
        textChunks.push(parsedText.slice(i, i + CHUNK_SIZE));
      }

      const response: ChunkedResponse = {
        fileName,
        textChunk: textChunks[pageNumber - 1] || "",
        totalChunks: textChunks.length,
        currentChunk: pageNumber,
        chunkSize: CHUNK_SIZE,
      };
      return NextResponse.json(response);
    }
  }

  return NextResponse.json({
    error: "No files found or invalid file format",
  });
}

// Client-side example of how to handle the chunked response
/*
async function fetchAllChunks(fileId) {
  let currentChunk = 1;
  let allText = '';
  let totalChunks = 1;

  do {
    const formData = new FormData();
    formData.append('page', currentChunk.toString());
    
    const response = await fetch('/api/parse-pdf', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    allText += data.textChunk;
    totalChunks = data.totalChunks;
    currentChunk++;
    
  } while (currentChunk <= totalChunks);

  return allText;
}
*/
