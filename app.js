const express = require('express');
const bodyParser = require('body-parser'); // Used to access the data in the body.
const apiroute = require('./routes/api');
const app = express();

// Parsers for data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', apiroute); // Handles the request which has path /api.

app.get('/', function(req, res) {
    res.send('Welcome to the stateless microservice');
})

app.listen(8080);