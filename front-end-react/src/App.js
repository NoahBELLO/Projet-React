import React, { useState } from 'react';
import UrlManager from './UrlManager';
import './App.css';
import MiddlewareManager from './MiddlewareManager';

function App() {
  const [middlewares, setMiddlewares] = useState([]);
  const [result, setResult] = useState(null);


  const testMiddlewares = async () => {

    let req = {
      url: "http://217.154.21.85:8447/hello",
      options: {
        method: "GET",
        headers: {}
      },
      context: {}
    };

    // Appliquer les middlewares un par un
    for (const mw of middlewares) {
      await mw(req, null, () => { });
    }

    console.log("Requête après middlewares :", req);

    try {
      // Envoi réel de la requête
      const response = await fetch(req.url, {
        ...req.options,
        mode: "no-cors"
      });


      // Essaie de parser le résultat (texte ou JSON)
      const contentType = response.headers.get('content-type');
      const data = contentType?.includes('application/json')
        ? await response.json()
        : await response.text();

      console.log("Réponse du serveur :", data);

      setResult({
        url: req.url,
        headers: req.options.headers,
        context: req.context,
        response: data
      });

    } catch (err) {
      console.error("Erreur lors de la requête :", err.message);
      setResult({
        url: req.url,
        headers: req.options.headers,
        context: req.context,
        response: `Erreur : ${err.message}`
      });
    }
  };
  const launchLoadTest = async (count = 10) => {
    const stats = {
      total: 0,
      success: 0,
      failed: 0,
      durations: [],
      errors: [],
    };

    for (let i = 0; i < count; i++) {
      let req = {
        url: "http://217.154.21.85:8447/hello",
        options: {
          method: "GET",
          headers: {},
          mode: "no-cors"
        },
        context: {}
      };

      for (const mw of middlewares) {
        await mw(req, null, () => { });
      }

      const start = performance.now();

      try {
        await fetch(req.url, req.options);
        const end = performance.now();
        const duration = end - start;

        stats.success++;
        stats.durations.push(duration);
      } catch (err) {
        stats.failed++;
        stats.errors.push(err.message);
      }

      stats.total++;
    }

    // Calcul des stats
    const sum = stats.durations.reduce((a, b) => a + b, 0);
    const average = stats.durations.length ? (sum / stats.durations.length).toFixed(1) : "N/A";
    const min = Math.min(...stats.durations).toFixed(1);
    const max = Math.max(...stats.durations).toFixed(1);

    setResult({
      total: stats.total,
      success: stats.success,
      failed: stats.failed,
      average,
      min,
      max,
      errors: stats.errors
    });
  };


  return (
    <div className="App">
      <header className="App-header">
        <p>Test du MiddlewareManager</p>

        <p>{middlewares.length} middleware(s) chargé(s)</p>

        <MiddlewareManager setMiddlewares={setMiddlewares} />

        <button onClick={testMiddlewares} style={{ marginTop: '1rem' }}>
          Tester les middlewares
        </button>
        <button onClick={() => launchLoadTest(10)} style={{ marginTop: '1rem' }}>
          Lancer un test de charge (10 requêtes)
        </button>


        {result && (
  <div style={{ marginTop: '2rem', background: '#f0f0f0', padding: '1rem', borderRadius: '8px', color: '#000' }}>
    <h4>Résultat :</h4>
    <pre>{JSON.stringify(result, null, 2)}</pre>
  </div>
)}

      </header>

      <main className="form-section">
        <UrlManager />
      </main>
    </div>
  );
}

export default App;
