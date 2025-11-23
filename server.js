// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

// dossier public (index, css, client.js)
app.use(express.static(path.join(__dirname)));

// dossier des fichiers PDF (servi statiquement)
const FILES_DIR = path.join(__dirname, 'files');
app.use('/files', express.static(FILES_DIR));

// API : liste les fichiers PDF et les regroupe par module
app.get('/api/files', (req, res) => {
  fs.readdir(FILES_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: 'Impossible de lire le dossier files.' });
    // garder uniquement .pdf
    const pdfs = files.filter(f => /\.pdf$/i.test(f));
    // créer objets modules en se basant sur la convention de nommage :
    // TD_NOM.pdf pour TD, sinon NOM.pdf pour cours
    const modulesMap = {};
    pdfs.forEach(file => {
      const isTD = file.startsWith('TD_') || file.startsWith('td_');
      const base = isTD ? file.replace(/^TD_/i, '') : file;
      const nameWithoutExt = base.replace(/\.pdf$/i, '');
      // nom lisible : remplacer _ par espace
      const niceName = nameWithoutExt.replace(/_/g, ' ');
      if (!modulesMap[niceName]) modulesMap[niceName] = { name: niceName, cours: null, td: null };
      if (isTD) modulesMap[niceName].td = file;
      else modulesMap[niceName].cours = file;
    });

    const modules = Object.values(modulesMap);
    res.json({ modules });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
