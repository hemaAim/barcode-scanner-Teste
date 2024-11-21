"use client";

import React, { useState, useEffect } from "react";
import { BrowserBarcodeReader } from "@zxing/library";

type Product = {
  id: string;
  name: string;
  barcode: string;
};

const Home = () => {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [productName, setProductName] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new BrowserBarcodeReader(500); // Timeout de 500ms por tentativa
    const startScanner = async () => {
      try {
        const videoElement = document.getElementById("video") as HTMLVideoElement;

        // Configuração de mídia para a câmera
        const constraints = {
          video: {
            facingMode: "environment", // Câmera traseira
            width: { ideal: 1280 }, // Alta resolução
            height: { ideal: 720 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
        videoElement.play();

        // Decodificação do código de barras
        scanner.decodeFromVideoDevice(
          null,
          videoElement,
          (result, err) => {
            if (result) {
              setBarcode(result.getText());
              setError(null);
            } else if (err) {
              console.error("Erro ao ler o código de barras:", err.message);
              setError("Não foi possível ler o código de barras.");
            }
          }
        );
      } catch (e) {
        console.error("Erro ao inicializar o scanner:", e);
        setError("Erro ao acessar a câmera.");
      }
    };

    startScanner();

    return () => {
      scanner.reset();
    };
  }, []);

  const handleRegister = () => {
    if (!barcode || !productName) {
      alert(
        "Por favor, preencha o nome do produto e escaneie ou insira o código de barras."
      );
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: productName,
      barcode,
    };

    setProducts((prev) => [...prev, newProduct]);
    setProductName("");
    setBarcode(null);
    alert("Produto cadastrado com sucesso!");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = async () => {
          try {
            const scanner = new BrowserBarcodeReader();
            const result = await scanner.decodeFromImage(image);
            setBarcode(result.getText());
          } catch (err) {
            console.error("Erro ao decodificar a imagem:", err);
            setError("Não foi possível decodificar o código de barras.");
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Cadastro de Produtos
        </h1>

        {/* Scanner de Código de Barras */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-600 text-center">
            Scanner de Código de Barras
          </h2>
          <div className="flex justify-center mt-4">
            <video
              id="video"
              width="400"
              height="400"
              className="border"
              style={{ objectFit: "cover" }}
            ></video>
          </div>
          <p className="text-center mt-4 text-gray-500">
            Código de Barras Escaneado:{" "}
            <span className="font-medium text-gray-700">
              {barcode || "Aguardando..."}
            </span>
          </p>
          {error && (
            <p className="text-red-500 text-center mt-2">{error}</p>
          )}
        </div>

        {/* Fallback de Entrada Manual */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Digite o código de barras"
            value={barcode || ""}
            onChange={(e) => setBarcode(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md mb-4"
          />
        </div>

        {/* Fallback para Upload de Imagem */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Ou envie uma imagem:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Formulário para Cadastro */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Nome do Produto"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <button
            onClick={handleRegister}
            className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
          >
            Cadastrar Produto
          </button>
        </div>

        {/* Lista de Produtos Cadastrados */}
        <div>
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            Produtos Cadastrados
          </h2>
          {products.length === 0 ? (
            <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
          ) : (
            <ul className="space-y-4">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="p-4 border border-gray-300 rounded-md bg-gray-50"
                >
                  <div className="text-lg font-medium text-gray-700">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Código de Barras: {product.barcode}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
