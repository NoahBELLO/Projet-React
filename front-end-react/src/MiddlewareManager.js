import React, { useState } from 'react';

const MiddlewareManager = ({ setMiddlewares }) => {
  const [loadedFiles, setLoadedFiles] = useState([]);

  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    for (const file of files) {
      if (loadedFiles.includes(file.name)) {
        console.warn(`Le middleware "${file.name}" est déjà chargé.`);
        continue;
      }
      

      try {
        const rawCode = await readFileAsText(file);
        const transformedCode = rawCode.replace(/export\s+default/, 'module.exports =');
        //pour enlever le warning
        // eslint-disable-next-line no-new-func
        const func = new Function('module', 'exports', transformedCode);
        const module = { exports: {} };
        func(module, module.exports);

        const middlewareFunction = module.exports;

        if (typeof middlewareFunction !== 'function') {
          alert(`Le fichier ${file.name} ne contient pas une fonction middleware valide.`);
          continue;
        }

        setMiddlewares((prev) => [...prev, middlewareFunction]);
        setLoadedFiles((prev) => [...prev, file.name]);

        console.log(`Middleware "${file.name}" chargé avec succès.`);
      } catch (err) {
        alert(`Erreur lors du chargement de "${file.name}" : ${err.message}`);
        console.error('Erreur complète :', err);
      }
    }
  };


  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };



  const handleRemoveMiddleware = (index) => {
    setMiddlewares((prev) => prev.filter((_, i) => i !== index));
    setLoadedFiles((prev) => prev.filter((_, i) => i !== index));
  };


  const handleResetMiddlewares = () => {
    setMiddlewares([]);
    setLoadedFiles([]);
    console.log('Tous les middlewares ont été réinitialisés.');
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h2>Gestion des middlewares</h2>

      <div className='containerLabel'>
        <label htmlFor="fileInput">Charger un middleware :</label>
        <input
          type="file"
          accept=".js"
          multiple
          name='fileInput'
          id='fileInput'
          onChange={handleFilesChange}
        />
      </div>


      {loadedFiles.length > 0 ? (
        <>
          <h4>Middlewares chargés :</h4>
          <ul>
            {loadedFiles.map((fileName, index) => (
              <li key={index}>
                {fileName}
                <button className='link'
                  onClick={() => handleRemoveMiddleware(index)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>

          <button className='reinit' onClick={handleResetMiddlewares}>
            Réinitialiser tous
          </button>
        </>
      ) : (
        <p className='warning'>Aucun middleware chargé.</p>
      )}
    </div>
  );
};

export default MiddlewareManager;
