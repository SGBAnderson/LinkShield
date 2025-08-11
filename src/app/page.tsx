"use client";

import hash from "object-hash";
import { useState } from "react";
import Image from "next/image";
import { addLink, connectWallet } from "@/services/Web3Service";

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [fee, setFee] = useState<string>("0");

  function onUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUrl(event.target.value);
  }

  function onFeeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFee(event.target.value);
  }

  async function btnCreateLinkClick() {
    setMessage("Conectando à carteira e criando o link... aguarde!");
    try {
      await connectWallet();

      if (!url) {
        throw new Error("Por favor, insira uma URL.");
      }

      const linkId = hash(url).slice(0, 5);
      await addLink(url, linkId, fee);

      setMessage(`Link criado com sucesso! Seu ID é: ${linkId}. Compartilhe o link: http://localhost:3000/${linkId}`);
      setUrl("");
      setFee("0");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setMessage(`Erro: ${errorMessage}`);
      console.error(err);
    }
  }

  return (
    <div className="container px-4 py-5">
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
        <div className="col-6">
          <Image src="/logo.jpg" alt="LinkShield Logo" className="d-block mx-lg-auto img-fluid" width={700} height={700} priority />
        </div>
        <div className="col-6">
          <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">LinkShield</h1>
          <p className="lead">Proteja seus links e lucre com eles.</p>
          <hr />
          <p>Cole a sua URL abaixo, defina a taxa por clique e conecte sua carteira para proteger seu link com a tecnologia Blockchain.</p>
          <div className="form-floating mb-3">
            <input type="text" id="url" className="form-control" value={url} onChange={onUrlChange} />
            <label htmlFor="url">Link:</label>
          </div>
          <div className="row mb-3">
            <div className="col-6">
              <div className="form-floating">
                <input type="number" id="fee" className="form-control" value={fee} onChange={onFeeChange} />
                <label htmlFor="fee">Taxa por clique (wei):</label>
              </div>
            </div>
            <div className="col-6">
              <button type="button" className="btn btn-primary w-100 h-100" onClick={btnCreateLinkClick}>
                <Image src="/metamask.svg" alt="MetaMask Icon" width={32} height={32} className="me-2" />
                Conectar e Criar Link
              </button>
            </div>
          </div>
          <div className="alert alert-info" role="alert">
            {message ? (
              <div className="d-flex align-items-center">
                {message.includes("aguarde") && (
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                )}
                <span>{message}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}