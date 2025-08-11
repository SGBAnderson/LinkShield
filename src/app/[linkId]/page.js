"use client";

import hash from "object-hash"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
// import { getLink, payLink } from "@/services/Web3Service";

export default function Home() {

  const params = useParams();

  const [mensage, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [fee, setFee] = useState("");
  const [link, setLink] = useState({ fee: "0" });

    // useEffect(() => {
    //     setMessage("Buscando dados do link...aguarde...");
    //     getLink(params.linkId)
    //         .then(link => {
    //             setMessage("");
    //             if (link.url)
    //                 window.location.href = link.url;
    //             else
    //                 setLink(link);
    //         })
    //         .catch(err => setMessage(err.message));
    // }, [])
    
    function onUrlChange(event) {
        setUrl(event.target.value); 
    }

    function onFeeChange(event) {
        setFee(event.target.value);
    }

    function btnAccessClick() {
      const linkId = hash(url).slice(0, 5)
      setMessage(url + "" + fee);
        // setMessage("Pagando pelo acesso...aguarde...");
        // payLink(params.linkId, link.fee)
        //     .then(() => {
        //         setMessage("Pagamento realizado...redirecionando...");
        //         return getLink(params.linkId)
        //     })
        //     .then(link => window.location.href = link.url)
        //     .catch(err => setMessage(err.message));
    }

  return (
    <div className="container px-4 py-5">
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
        <div className="col-6">
          <img src="/logo.jpg" alt="LinkShield Logo" className="d-block mx-lg-auto img-fluid" width="700"/>
        </div>
        <div className="col-6">
          <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">LinkShield</h1>
          <p className="lead">Proteja seus links e lucre com eles.</p>
          <hr />
          <p>Cole a sua URL abaixo, defina a taxa por clique e conecte sua carteira para proteger seu link com a tecnologia Blockchain.</p>
          <div className="form-floating mb-3">
            <input type="text" id="url" className="form-control" value={url || ""} onChange={onUrlChange}/>
            <label htmlFor="url">Link:</label>
          </div>
          <div className="row mb-3">
            <div className="col-6">
              <div className="form-floating">
                <input type="number" id="fee" className="form-control" value={fee || "0"} onChange={onFeeChange}/>
                <label htmlFor="fee">Taxa por clique (wei):</label>
              </div>
            </div>
            <div className="col-6">
              <button type="button" className="btn btn-primary w-100 h-100" onClick={btnAccessClick}>
                <img src="/metamask.svg" width={32} className="me-2" />
                Conectar e Criar Link
              </button>
            </div>
          </div>
          <div className="alert alert-info" role="alert">
            {mensage
            ? <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">{mensage}</span>
              </div> : <></>
            }
          </div>
      </div>
    </div>
    </div>
  )
}
