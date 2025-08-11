"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getLink, payLink, connectWallet } from "@/services/Web3Service";


interface LinkData {
    url: string;
    owner: string;
    fee: string;
}

export default function LinkShieldPage() {
    const params = useParams() as { linkId: string };
    const [message, setMessage] = useState<string>("Buscando dados do link... aguarde...");
    const [link, setLink] = useState<LinkData | null>(null);

    useEffect(() => {
        async function loadLink() {
            
            if (!params.linkId) {
                setMessage("ID do link não encontrado na URL.");
                return;
            }

            try {
                
                await connectWallet();
                const linkData = await getLink(params.linkId);

                if (linkData.url) {
                    setMessage("Acesso garantido. Redirecionando...");
                    window.location.href = linkData.url;
                } else {
                    setLink(linkData);
                    setMessage(`Para acessar este link, pague a taxa de ${linkData.fee} wei.`);
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
                setMessage(`Erro: ${errorMessage}`);
                console.error(err);
            }
        }
        loadLink();
    }, [params.linkId]);

    async function btnPayAndAccessClick() {
        setMessage("Processando pagamento... aguarde...");
        try {
            if (!link) {
                throw new Error("Dados do link não disponíveis.");
            }
            
            await payLink(params.linkId, link.fee);
            setMessage("Pagamento realizado! Redirecionando...");

            const updatedLink = await getLink(params.linkId);
            window.location.href = updatedLink.url;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setMessage(`Erro no pagamento: ${errorMessage}`);
            console.error(err);
        }
    }

    return (
        <div className="container px-4 py-5">
            <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                <div className="col-6">
                    <Image
                        src="/logo.jpg"
                        alt="LinkShield Logo"
                        className="d-block mx-lg-auto img-fluid"
                        width={700}
                        height={400}
                        priority
                    />
                </div>
                <div className="col-6">
                    <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">LinkShield</h1>
                    <p className="lead">Proteja seus links e lucre com eles.</p>
                    <hr />
                    {link && (
                        <>
                            <p>Este link está protegido. Para acessar o conteúdo, você deve pagar a taxa definida pelo proprietário.</p>
                            <div className="alert alert-warning" role="alert">
                                **Taxa de Acesso:** {link.fee} wei
                            </div>
                            <div className="alert alert-info" role="alert">
                                {message ? (
                                    <div className="d-flex align-items-center">
                                        {message.includes("aguarde") && (
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        )}
                                        <span>{message}</span>
                                    </div>
                                ) : null}
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary w-100 h-100"
                                onClick={btnPayAndAccessClick}
                                disabled={message.includes("aguarde")}
                            >
                                <Image
                                    src="/metamask.svg" 
                                    alt="MetaMask Icon"
                                    className="me-2"
                                    width={32} 
                                    height={32} 
                                />
                                Pagar e Acessar Link
                            </button>
                        </>
                    )}
                    {!link && message && (
                        <div className="alert alert-info" role="alert">
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}