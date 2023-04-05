const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const config = require('./config');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

const apiRouter = require('./app/routes/api');

app.use('/api',apiRouter);

app.listen(config.port);
console.log(`Running on port ${config.port}`);
