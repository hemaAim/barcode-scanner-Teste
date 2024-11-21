"use client"
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const Scanner: React.FC<{ onScan: (barcode: string) => void }> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startScanner = async () => {
      const codeReader = new BrowserMultiFormatReader();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Acesso à câmera não é suportado neste navegador.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current?.play();
            } catch (err) {
              console.error("Erro ao reproduzir o vídeo:", err);
              setError("Erro ao reproduzir o vídeo.");
            }
          };

          codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
            if (result) {
              onScan(result.getText());  // Passa o código de barras para o componente pai
            } else if (err && err.name !== "NotFoundException") {
              setError("Erro ao decodificar o código.");
            }
          });
        }
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
        setError("Não foi possível acessar a câmera. Verifique as permissões.");
      }
    };

    startScanner();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onScan]);

  return (
    <div>
      <video
        ref={videoRef}
        style={{
          width: "100%",
          maxHeight: "300px",
          border: "2px solid black",
          borderRadius: "10px",
        }}
        playsInline
        muted
        autoPlay
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Scanner;
