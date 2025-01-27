const express = require('express');
const path = require('path');
const pkg = require('./package.json');
const app = express();
const PORT = 8080;

const MAJOR_VERSION = `v${pkg.version.split('.')[0]}`;
const publicPath = `/${MAJOR_VERSION}/`;

app.use(publicPath, express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Serve the files on port.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!\n`);
});
