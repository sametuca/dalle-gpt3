import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios";
import Link from 'next/link';

export default function Home() {
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function getDalle2() {
    if (token != "" && query != "") {
      setError(false);
      setLoading(true);
      axios
        .post(`/api/dalleService?k=${token}&q=${query}`)
        .then((res) => {
          setResults(res.data.result);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
        });
    } else {
      setError(true);
    }
  }

  const [type, setType] = useState("webp");

  function download(url) {
    axios
      .post(`/api/download`, { url: url, type: type })
      .then((res) => {
        const link = document.createElement("a");
        link.href = res.data.result;
        link.download = `${query}.${type.toLowerCase()}`;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create DALLE 2 App</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Create images with <span className={styles.titleColor}>DALLE 2</span>
        </h1>
        <p className={styles.description}>
          <input 
          id="token"
          className="form-control form-control-lg" 
          type="text" 
          onChange={(e) => setToken(e.target.value)}
          placeholder="Token">
          </input>
          <input
            id="query"
            type="text"
            className="form-control form-control-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Query"
          />
          {"  "}
          <br></br>
          <button className="btn btn-danger btn-lg w-100" onClick={getDalle2}>Generate</button>
        </p>
        {error ? ( <div className={styles.error}>Something went wrong. Try again.</div> ) : ( <></> )}
        {loading && <p>Loading...</p>}
        <div className={styles.grid}>
          {results.map((result) => {
            return (
              <div className={styles.card}>
                <img
                  className={styles.imgPreview}
                  src={result.generation.image_path}
                  onClick={() => download(result.generation.image_path)}
                />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}