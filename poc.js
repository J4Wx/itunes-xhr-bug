const express = require('express');
const path = require('path');

const port = process.env.PORT || 420;
const app = express();

app.get('/*', (req, res) => res.sendFile(path.resolve(__dirname, 'index.html')));

app.listen(port, () => console.log(`App Listening On Port ${port}`));