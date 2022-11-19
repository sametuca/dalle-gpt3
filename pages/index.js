import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios";
import { translate } from '@vitalets/google-translate-api';

export default function Home() {
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function getGenerateImage() {
    var translatePromise = new Promise(function(resolve, reject) {
      setLoading(true);
      translate(query, {to: 'en'}).then(res => {
        setQuery(res.text);
        resolve(res.text);
      }).catch(err => {
        reject(err);
        setLoading(false);
      });
    }
    );
    translatePromise.then(function(translatedText) {
      setLoading(true);
      axios
        .post(`/api/dalleService?k=${token}&q=${translatedText}`)
        .then((res) => {
          setResults(res.data.result);
          setLoading(false);
        }).catch(function(err) {
      console.log(err);
      setError(true);
      setLoading(false);
    });
  });
}

  return (

    <div className={styles.container}>
      <Head>
        <title>OPENAI Dalle-2</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          DALLE-2 <span className={styles.titleColor}>ile Resim Çizdir</span>
        </h1>
        <p className={styles.description}>
          <input
            id="token"
            className="form-control form-control-lg mb-2"
            type="text"
            onChange={(e) => setToken(e.target.value)}
            placeholder="Size ait olan Token">
          </input>
          <input
            id="query"
            type="text"
            className="form-control form-control-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bir tanım yapınız"
          />
          {"  "}
          <br></br>
          <button className="btn btn-danger btn-lg w-100" onClick={getGenerateImage}>Çizdir</button>
          <a href="" className="btn btn-dark btn-lg w-100 mt-2">Token Nasıl Alınır?</a>
          <div>
          <br></br>
          <a href="" className="text">sametuca-github</a>
          </div>
        </p>
        {error ? (<div className={styles.error}>Bir şeyler yanlış gitti. Tekrar deneyiniz</div>) : (<></>)}
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

