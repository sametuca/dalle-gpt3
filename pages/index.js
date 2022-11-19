import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios";

export default function Home() {
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function translateEnToTrInputValue() {
    const axios = require("axios");

    const encodedParams = new URLSearchParams();
    encodedParams.append("q", query);
    encodedParams.append("target", "tr");
    encodedParams.append("source", "en");

    const options = {
      method: 'POST',
      url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/gzip',
        'X-RapidAPI-Key': '92cf1834c1mshf1c50c69a132d57p1a84c7jsn2906866ffae6',
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
      },
      data: encodedParams
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
      var responseData = response.data.translations[0].translatedText;
      getGenerateImage(responseData);
    }).catch(function (error) {
      console.error(error);
    });
  }

  function getGenerateImage(query) {
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
          <button className="btn btn-danger btn-lg w-100" onClick={translateEnToTrInputValue}>Generate</button>
        </p>
        {error ? (<div className={styles.error}>Something went wrong. Try again.</div>) : (<></>)}
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

