"use client";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { useState } from "react";
import { json } from "stream/consumers";

export default function FileUpload() {
  const [serverResponse, setServerResponse] = useState<string>("");
  return (
    <>
      <FilePond
        server={{
          process: "/api/upload-pdf",
          fetch: null,
          revert: null,
        }}
        onprocessfile={(error, file: any) => {
          if (error) {
            console.error("File processing error:", error);
          } else {
            const response = file.serverId;
            setServerResponse(JSON.parse(response).textChunk);
          }
        }}
      />
      {serverResponse && (
        <div>
          <button
            onClick={() => {
              const fetchContent = async () => {
                const response = await fetch("/api/pdf-based-generation", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    command:
                      "generate 10 mcq questions from the following text in format of {question: 'string', answer: 'string', options: ['string', 'string', 'string', 'string']}",
                    description: serverResponse?.replace(/\n/g, " "),
                  }),
                });
                const data = await response.json();
                console.log(data?.formattedJson);
              };
              fetchContent();
            }}
            style={{
              backgroundColor: "blue",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
              border: "none",
              margin: "10px",
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
            }}
          >
            Ask AI
          </button>
        </div>
      )}
    </>
  );
}
