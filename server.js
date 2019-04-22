const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(_dirname + '/dist'));

app.listen(proces.env.PORT || 3000);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
})

console.log('Console listening!');