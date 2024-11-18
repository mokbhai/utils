"use client";

import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const ConvertPage: React.FC = () => {
  const [convertedImages, setConvertedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const files = Array.from(event.dataTransfer.files);
      const convertedImageUrls: string[] = [];

      for (const file of files) {
        try {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: "image/webp", 
          };

          const compressedFile = await imageCompression(file, options);
          const webpImageURL = URL.createObjectURL(compressedFile);
          convertedImageUrls.push(webpImageURL);
        } catch (error) {
          console.error("Error converting image:", error);
        }
      }

      setConvertedImages(convertedImageUrls);
    },
    []
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("converted_images");

    if (folder) {
      for (let i = 0; i < convertedImages.length; i++) {
        const url = convertedImages[i];
        const response = await fetch(url);
        const blob = await response.blob();
        folder.file(`image_${i + 1}.webp`, blob);
      }

      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "converted_images.zip");
      });
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>Image Converter</h1>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: isDragging ? "2px solid #0070f3" : "2px dashed #ccc",
          borderRadius: "10px",
          padding: "40px",
          textAlign: "center",
          marginBottom: "20px",
          transition: "border-color 0.3s ease",
          cursor: "pointer",
        }}
      >
        {isDragging
          ? "Release to drop the images"
          : "Drag and drop images here to convert to WebP"}
      </div>
      {convertedImages.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <h2 >Converted Images</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {convertedImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Converted ${index}`}
                style={{ maxWidth: "150px", borderRadius: "10px" }}
              />
            ))}
          </div>
          <button
            onClick={downloadAllAsZip}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              color: "#fff",
              backgroundColor: "#0070f3",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Download All as ZIP
          </button>
        </div>
      )}
    </div>
  );
};

export default ConvertPage;
